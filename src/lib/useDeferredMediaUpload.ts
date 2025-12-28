import { computed, onBeforeUnmount, ref } from 'vue'
import type { ImageAsset } from '@/types/ImageAsset'

/* Types */
export type MediaKind = 'image' | 'video'

export type PendingMedia = {
  id: string
  kind: MediaKind
  previewUrl: string
  isCover: boolean
  uploading: boolean
  error?: string | null
  file?: File
  uploaded?: ImageAsset
  _objectUrl?: boolean
}

type UploadFn = (file: File, opts?: { log?: boolean; order?: number }) => Promise<ImageAsset>

/* Composable */
export function useDeferredMediaUpload(uploadFn: UploadFn, opts?: { videoLimit?: number }) {
  /* Konstanten */
  const VIDEO_LIMIT = opts?.videoLimit ?? 2

  /* State */
  const pendingMedia = ref<PendingMedia[]>([])
  const uploadError = ref<string | null>(null)
  const uploading = ref(false)

  /* Computeds */
  const coverItem = computed(() => pendingMedia.value.find((p) => p.isCover) ?? pendingMedia.value[0] ?? null)

  /* Pure Helpers */
  function uid() {
    return crypto.randomUUID?.() ?? String(Math.random()).slice(2)
  }

  function guessKindFromUrl(url: string): MediaKind {
    const u = (url ?? '').toLowerCase()
    if (u.match(/\.(mp4|mov|webm|m4v)(\?|#|$)/)) return 'video'
    return 'image'
  }

  /* Cleanup */
  function clearPending() {
    for (const p of pendingMedia.value) {
      if (p._objectUrl) URL.revokeObjectURL(p.previewUrl)
    }
    pendingMedia.value = []
    uploadError.value = null
  }
  onBeforeUnmount(clearPending)

  /* UI Handlers */
  function setCover(id: string) {
    for (const p of pendingMedia.value) p.isCover = p.id === id
  }

  function removePending(id: string) {
    const idx = pendingMedia.value.findIndex((p) => p.id === id)
    if (idx === -1) return

    const p = pendingMedia.value[idx]
    if (p._objectUrl) URL.revokeObjectURL(p.previewUrl)

    pendingMedia.value.splice(idx, 1)

    if (!pendingMedia.value.some((x) => x.isCover) && pendingMedia.value.length) {
      pendingMedia.value[0].isCover = true
    }
  }

  function addFiles(files: File[]) {
    const accepted = files.filter((f) => f.type?.startsWith('image/') || f.type?.startsWith('video/'))
    if (!accepted.length) return

    const existingVideoCount = pendingMedia.value.filter((p) => p.kind === 'video').length
    const incomingVideos = accepted.filter((f) => f.type?.startsWith('video/')).length
    const maxVideosWeCanAdd = Math.max(0, VIDEO_LIMIT - existingVideoCount)

    if (incomingVideos > maxVideosWeCanAdd) {
      uploadError.value = `Du kannst aktuell maximal ${VIDEO_LIMIT} Videos pro Marker hinzufügen.`
    }

    let videosAdded = 0
    for (const file of accepted) {
      const kind: MediaKind = file.type.startsWith('video/') ? 'video' : 'image'

      if (kind === 'video') {
        if (existingVideoCount + videosAdded >= VIDEO_LIMIT) continue
        videosAdded++
      }

      const previewUrl = URL.createObjectURL(file)
      pendingMedia.value.push({
        id: uid(),
        file,
        kind,
        previewUrl,
        _objectUrl: true,
        uploading: false,
        uploaded: undefined,
        error: null,
        isCover: pendingMedia.value.length === 0,
      })
    }
  }

  /* Init/Mapping */
  function seedFromAssets(assets: ImageAsset[]) {
    for (const a of (assets ?? []).slice().sort((x, y) => (x.order ?? 0) - (y.order ?? 0))) {
      const url = (a as any).url ?? (a as any).secureUrl ?? (a as any).src ?? ''
      pendingMedia.value.push({
        id: uid(),
        kind: guessKindFromUrl(url),
        previewUrl: url,
        _objectUrl: false,
        uploading: false,
        uploaded: { ...(a as any) },
        error: null,
        isCover: (a.order ?? 0) === 0,
      })
    }

    if (!pendingMedia.value.some((p) => p.isCover) && pendingMedia.value.length) {
      pendingMedia.value[0].isCover = true
    }
  }

  /* Upload/Transform */
  function buildOrderedAssets(): ImageAsset[] {
    const cover = pendingMedia.value.find((p) => p.isCover)
    const ordered = [...(cover ? [cover] : []), ...pendingMedia.value.filter((p) => p !== cover)]

    for (let i = 0; i < ordered.length; i++) {
      if (ordered[i].uploaded) ordered[i].uploaded!.order = i
    }

    return ordered.map((p) => p.uploaded).filter(Boolean) as ImageAsset[]
  }

  async function uploadAllIfNeeded() {
    uploadError.value = null

    if (pendingMedia.value.length === 0) return []

    uploading.value = true
    try {
      const cover = pendingMedia.value.find((p) => p.isCover)
      const ordered = [...(cover ? [cover] : []), ...pendingMedia.value.filter((p) => p !== cover)]

      for (let i = 0; i < ordered.length; i++) {
        const p = ordered[i]

        if (p.uploaded && !p.file) {
          p.uploaded.order = i
          continue
        }

        if (p.file && !p.uploaded) {
          p.uploading = true
          p.error = null
          try {
            const asset = await uploadFn(p.file, { log: true, order: i })
            p.uploaded = { ...asset, order: i }
          } catch (err: any) {
            p.error = err?.message ?? 'Upload fehlgeschlagen'
            uploadError.value = p.error
            throw new Error(uploadError.value)
          } finally {
            p.uploading = false
          }
        } else if (p.uploaded) {
          p.uploaded.order = i
        }
      }

      return buildOrderedAssets()
    } finally {
      uploading.value = false
    }
  }

  /* Public API */
  return {
    pendingMedia,
    uploadError,
    uploading,
    coverItem,
    addFiles,
    removePending,
    setCover,
    clearPending,
    seedFromAssets,
    uploadAllIfNeeded,
    buildOrderedAssets,
  }
}

// src/lib/image.ts
type ToWebpOptions = {
  maxWidth?: number
  maxHeight?: number
  quality?: number // 0..1
  keepIfBigger?: boolean
}

export async function fileToWebp(
  file: File,
  opts: ToWebpOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.82,
    keepIfBigger = true,
  } = opts

  // Wenn Browser kein WebP kann: Original zurück
  const supportsWebp = await canEncodeWebp()
  if (!supportsWebp) return file

  // Decode
  const bmp = await createImageBitmap(file)
  const { w, h } = fitContain(bmp.width, bmp.height, maxWidth, maxHeight)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  ctx.drawImage(bmp, 0, 0, w, h)

  const blob = await canvasToBlob(canvas, 'image/webp', quality)
  if (!blob) return file

  // Wenn WebP größer ist als Original: Original behalten
  if (keepIfBigger && blob.size >= file.size) return file

  const nameBase = file.name.replace(/\.[^/.]+$/, '')
  return new File([blob], `${nameBase}.webp`, { type: 'image/webp' })
}

function fitContain(srcW: number, srcH: number, maxW: number, maxH: number) {
  const scale = Math.min(maxW / srcW, maxH / srcH, 1)
  return { w: Math.round(srcW * scale), h: Math.round(srcH * scale) }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), type, quality)
  })
}

async function canEncodeWebp(): Promise<boolean> {
  const c = document.createElement('canvas')
  // toDataURL ist quick & dirty check
  return c.toDataURL('image/webp').startsWith('data:image/webp')
}

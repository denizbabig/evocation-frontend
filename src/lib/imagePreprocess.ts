// src/lib/imagePreprocess.ts
function replaceExt(name: string, ext: string) {
  return name.replace(/\.[a-z0-9]+$/i, '') + ext
}

export async function preprocessImageForUpload(
  file: File,
  opts?: {
    maxDim?: number
    quality?: number
    mimeType?: 'image/webp' | 'image/jpeg'
    skipIfSmallerThanBytes?: number
    keepIfBigger?: boolean
  }
): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  const {
    maxDim = 1600,
    quality = 0.82,
    mimeType = 'image/webp',
    skipIfSmallerThanBytes = 300_000,
    keepIfBigger = true,
  } = opts ?? {}

  // kleine Bilder nicht anfassen (spart CPU + behält 1:1)
  if (file.size <= skipIfSmallerThanBytes) return file

  let bmp: ImageBitmap
  try {
    bmp = await createImageBitmap(file)
  } catch {
    return file
  }

  const { width, height } = bmp
  const scale = Math.min(1, maxDim / Math.max(width, height))
  const targetW = Math.max(1, Math.round(width * scale))
  const targetH = Math.max(1, Math.round(height * scale))

  // Wenn eh schon klein genug -> nicht neu encoden
  if (scale === 1 && file.size <= 1_200_000) return file

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH

  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return file

  ctx.drawImage(bmp, 0, 0, targetW, targetH)

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, mimeType, quality)
  )
  if (!blob) return file

  // 👇 wichtig: wenn das Ergebnis größer ist, lieber original behalten
  if (keepIfBigger && blob.size >= file.size) return file

  const newName =
    mimeType === 'image/webp'
      ? replaceExt(file.name, '.webp')
      : replaceExt(file.name, '.jpg')

  console.log('[preprocess] in', file.type, file.size, file.name)
  console.log('[preprocess] out', mimeType, blob.size, newName, { targetW, targetH, scale })
  return new File([blob], newName, { type: mimeType, lastModified: Date.now() })
}

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { preprocessImageForUpload } from '@/lib/imagePreprocess'

describe('preprocessImageForUpload', () => {
  const originalCreateElement = document.createElement.bind(document)

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns original file if not an image/* mime type', async () => {
    const file = new File([new Uint8Array(500_000)], 'x.txt', { type: 'text/plain' })

    const bitmapMock = vi.fn()
    ;(globalThis as any).createImageBitmap = bitmapMock

    const out = await preprocessImageForUpload(file)
    expect(out).toBe(file)
    expect(bitmapMock).not.toHaveBeenCalled()
  })

  it('returns original file if file is small (<= skipIfSmallerThanBytes)', async () => {
    const file = new File([new Uint8Array(100_000)], 'img.png', { type: 'image/png' })

    const bitmapMock = vi.fn()
    ;(globalThis as any).createImageBitmap = bitmapMock

    const out = await preprocessImageForUpload(file, { skipIfSmallerThanBytes: 300_000 })
    expect(out).toBe(file)
    expect(bitmapMock).not.toHaveBeenCalled()
  })

  it('returns original file if createImageBitmap fails', async () => {
    const file = new File([new Uint8Array(400_000)], 'img.png', { type: 'image/png' })

    ;(globalThis as any).createImageBitmap = vi.fn().mockRejectedValue(new Error('boom'))

    const out = await preprocessImageForUpload(file)
    expect(out).toBe(file)
  })

  it('keeps original if encoded blob is bigger and keepIfBigger=true', async () => {
    const file = new File([new Uint8Array(400_000)], 'img.png', { type: 'image/png' })

    ;(globalThis as any).createImageBitmap = vi.fn().mockResolvedValue({ width: 4000, height: 3000 })

    // Canvas mock: blob wird größer als Original
    const fakeCanvas: any = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toBlob: (cb: (b: Blob | null) => void, mimeType: string) => {
        cb(new Blob([new Uint8Array(600_000)], { type: mimeType }))
      },
    }

    vi.spyOn(document, 'createElement').mockImplementation((tag: any) => {
      if (tag === 'canvas') return fakeCanvas
      return originalCreateElement(tag)
    })

    const out = await preprocessImageForUpload(file, { keepIfBigger: true })
    expect(out).toBe(file)
  })

  it('returns new File with .webp name if blob is smaller and mimeType=image/webp', async () => {
    const file = new File([new Uint8Array(500_000)], 'photo.png', { type: 'image/png' })

    ;(globalThis as any).createImageBitmap = vi.fn().mockResolvedValue({ width: 4000, height: 3000 })

    // Canvas mock: blob kleiner als Original
    const fakeCanvas: any = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toBlob: (cb: (b: Blob | null) => void, mimeType: string) => {
        cb(new Blob([new Uint8Array(200_000)], { type: mimeType }))
      },
    }

    vi.spyOn(document, 'createElement').mockImplementation((tag: any) => {
      if (tag === 'canvas') return fakeCanvas
      return originalCreateElement(tag)
    })

    const out = await preprocessImageForUpload(file, {
      mimeType: 'image/webp',
      keepIfBigger: true,
      skipIfSmallerThanBytes: 1, // damit es nicht früh returned
    })

    expect(out).not.toBe(file)
    expect(out.type).toBe('image/webp')
    expect(out.name).toBe('photo.webp')
    expect(out.size).toBe(200_000)
  })

  it('returns new File with .jpg name if mimeType=image/jpeg', async () => {
    const file = new File([new Uint8Array(500_000)], 'photo.webp', { type: 'image/webp' })

    ;(globalThis as any).createImageBitmap = vi.fn().mockResolvedValue({ width: 2000, height: 2000 })

    const fakeCanvas: any = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toBlob: (cb: (b: Blob | null) => void, mimeType: string) => {
        cb(new Blob([new Uint8Array(150_000)], { type: mimeType }))
      },
    }

    vi.spyOn(document, 'createElement').mockImplementation((tag: any) => {
      if (tag === 'canvas') return fakeCanvas
      return originalCreateElement(tag)
    })

    const out = await preprocessImageForUpload(file, {
      mimeType: 'image/jpeg',
      skipIfSmallerThanBytes: 1,
    })

    expect(out.type).toBe('image/jpeg')
    expect(out.name).toBe('photo.jpg')
  })
})

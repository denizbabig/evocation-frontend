import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PublicHttpError, publicFetch } from '@/lib/shareApi'

describe('publicFetch', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns JSON when content-type is application/json', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ a: 1 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    )
    vi.stubGlobal('fetch', fetchMock as any)

    const data = await publicFetch('/share/abc/map', { method: 'GET' })
    expect(data).toEqual({ a: 1 })

    const [url, options] = fetchMock.mock.calls[0]
    expect(String(url)).toContain('/api/share/abc/map')
    expect(options.credentials).toBe('omit')
  })

  it('returns text when content-type is not json', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('hello', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    )
    vi.stubGlobal('fetch', fetchMock as any)

    const data = await publicFetch('/x', { method: 'GET' })
    expect(data).toBe('hello')
  })

  it('returns null for 204', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock as any)

    const data = await publicFetch('/x', { method: 'DELETE' })
    expect(data).toBeNull()
  })

  it('throws PublicHttpError with status and body when response not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      headers: { get: () => 'text/plain' },
      text: vi.fn().mockResolvedValue('no access'),
    } as any)

    try {
      await publicFetch('/x')
      throw new Error('expected to throw')
    } catch (e: any) {
      expect(e.name).toBe('PublicHttpError')
      expect(e.status).toBe(403)
      expect(e.body).toBe('no access')
      expect(e.message).toContain('GET /x 403')
    }
  })
})

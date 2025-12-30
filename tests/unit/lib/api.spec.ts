import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  return {
    currentRoute: { value: { meta: { requiresAuth: true }, fullPath: '/markers', name: 'markers' } },
    replace: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn(),
    get: vi.fn().mockResolvedValue({ accessToken: 'tok123' }),
  }
})

vi.mock('@/router', () => ({
  default: {
    currentRoute: mocks.currentRoute,
    replace: mocks.replace,
  },
}))

vi.mock('@/lib/oktaAuth', () => ({
  oktaAuth: {
    tokenManager: {
      clear: mocks.clear,
      get: mocks.get,
    },
  },
}))

// axios mock: wir wollen nur interceptors testen, keine echten requests
vi.mock('axios', async () => {
  const actual: any = await vi.importActual('axios')
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => {
        const handlers: any = {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        }
        return { interceptors: handlers }
      }),
    },
  }
})

describe('api.ts interceptors', () => {
  beforeEach(() => {
    mocks.replace.mockClear()
    mocks.clear.mockClear()
    mocks.get.mockClear()
  })

  it('installs interceptors without crashing', async () => {
    const mod = await import('@/lib/api')
    expect(mod.api).toBeDefined()
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'

const route = vi.hoisted(() => ({ query: {} as Record<string, unknown> }))
const replace = vi.hoisted(() => vi.fn(async () => undefined))
const resolve = vi.hoisted(() =>
  vi.fn((path: string) => ({
    name: path.startsWith('/nowhere') ? 'not-found' : 'Stocks',
  })),
)
const access = vi.hoisted(() => ({
  openAccessDialog: vi.fn(),
  setCurrentView: vi.fn(),
}))
const flow = vi.hoisted(() => ({
  resumeGoogle: vi.fn(async () => undefined),
  failGoogle: vi.fn(),
}))

vi.mock('vue-router', async orig => ({
  ...(await orig<typeof import('vue-router')>()),
  useRoute: () => route,
  useRouter: () => ({ replace, resolve }),
}))
vi.mock('@/stores/accessStore', () => ({ useAccessStore: () => access }))
vi.mock('@/modules/access/composables/usePrivyOnboarding', () => ({
  usePrivyOnboarding: () => flow,
}))

import ViewAuthCallback from '@/views/ViewAuthCallback.vue'
import { RETURN_TO_KEY } from '@/modules/access/common/privyOnboarding'

let wrapper: VueWrapper | undefined
const land = async (query: Record<string, unknown>, returnTo?: string) => {
  route.query = query
  if (returnTo !== undefined) sessionStorage.setItem(RETURN_TO_KEY, returnTo)
  wrapper = mount(ViewAuthCallback)
  await flushPromises()
}
const WITH_CODE = { privy_oauth_code: 'code-1', privy_oauth_state: 'state-1' }

describe('ViewAuthCallback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })
  afterEach(() => wrapper?.unmount())

  it('finishes the Google login with the code and state from the URL', async () => {
    await land(WITH_CODE, '/stocks?tab=all')

    expect(flow.resumeGoogle).toHaveBeenCalledWith('code-1', 'state-1')
  })

  it('leaves the callback URL for the page the user started from', async () => {
    await land(WITH_CODE, '/stocks?tab=all')

    expect(replace).toHaveBeenCalledWith('/stocks?tab=all')
    expect(sessionStorage.getItem(RETURN_TO_KEY)).toBeNull()
  })

  it('opens the connect modal on its sign-up view', async () => {
    await land(WITH_CODE, '/stocks?tab=all')

    expect(access.openAccessDialog).toHaveBeenCalledTimes(1)
    expect(access.setCurrentView).toHaveBeenCalledWith('sign_up')
  })

  it('goes home when no page was remembered', async () => {
    await land(WITH_CODE)

    expect(replace).toHaveBeenCalledWith('/')
  })

  it.each(['https://evil.example/', '//evil.example', 'javascript:alert(1)'])(
    'goes home instead of following %s',
    async returnTo => {
      await land(WITH_CODE, returnTo)

      expect(replace).toHaveBeenCalledWith('/')
    },
  )

  it('goes home when the remembered page is not a route of the app', async () => {
    await land(WITH_CODE, '/nowhere/at/all')

    expect(replace).toHaveBeenCalledWith('/')
  })

  it('passes on only a short, plain reason from the callback URL', async () => {
    await land({ error: `Access-Denied <script>${'x'.repeat(500)}` }, '/stocks')

    const reason = flow.failGoogle.mock.calls[0][0] as string
    expect(reason).toMatch(/^[a-z0-9_]{1,40}$/)
    expect(reason.startsWith('access_denied')).toBe(true)
  })

  it('reports a failed Google login when the callback carries no code', async () => {
    await land({ error: 'access_denied' }, '/stocks')

    expect(flow.failGoogle).toHaveBeenCalledWith('access_denied')
    expect(flow.resumeGoogle).not.toHaveBeenCalled()
    expect(access.setCurrentView).toHaveBeenCalledWith('sign_up')
  })
})

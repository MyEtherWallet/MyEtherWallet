import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  walletConfigs: {
    mew: {
      downloadUrls: {
        ios: 'https://ios.example',
        android: 'https://android.example',
      },
    },
  },
}))
vi.mock('qrcode.vue', () => ({
  default: {
    props: ['value'],
    template: '<svg class="qr" :data-value="value" />',
  },
}))

const { default: AccessDownloadMobile } =
  await import('@/modules/access/components/AccessDownloadMobile.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper | undefined
const mountIt = () => {
  wrapper = mount(AccessDownloadMobile, {
    attachTo: document.body,
    global: { plugins: [i18n], stubs: { AppAvatar: true } },
  })
  return wrapper
}
afterEach(() => {
  wrapper?.unmount()
  vi.restoreAllMocks()
})

describe('AccessDownloadMobile', () => {
  it('defaults to iOS', () => {
    const w = mountIt()
    expect(w.get('.qr').attributes('data-value')).toBe('https://ios.example')
  })

  it('switches the QR to Android', async () => {
    const w = mountIt()
    await w.findAll('[role="radio"]')[1].trigger('click')
    expect(w.get('.qr').attributes('data-value')).toBe(
      'https://android.example',
    )
  })

  it('opens the store for each button', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const w = mountIt()
    await w.get('[data-testid="store-android"]').trigger('click')
    expect(open).toHaveBeenCalledWith(
      'https://android.example',
      '_blank',
      'noopener,noreferrer',
    )
  })
})

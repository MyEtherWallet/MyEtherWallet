import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppleLogo from '@/assets/images/access/apple.svg'
import AndroidLogo from '@/assets/images/access/android.svg'

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
    global: {
      plugins: [i18n],
      stubs: {
        AppAvatar: {
          template: '<div><slot name="icon" /><slot name="badge" /></div>',
        },
      },
    },
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

  it('swaps the platform glyph in the QR centre with the toggle', async () => {
    const w = mountIt()
    const glyph = () =>
      w.get('[data-testid="qr-platform-glyph"]').attributes('style') ?? ''
    expect(glyph()).toContain(AppleLogo)
    await w.findAll('[role="radio"]')[1].trigger('click')
    expect(glyph()).toContain(AndroidLogo)
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

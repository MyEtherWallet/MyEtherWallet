import { describe, it, expect, vi, afterEach } from 'vitest'
import { ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const clickedWalletConnect = ref<
  | { walletName: string; walletIcon?: string; wagmiWalletData?: string }
  | undefined
>(undefined)
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ clickedWalletConnect }),
}))
vi.mock('pinia', async orig => ({
  ...(await orig<typeof import('pinia')>()),
  storeToRefs: (store: unknown) => store,
}))
// AppAvatar's import graph reaches walletConfigs (hardware-wallet SDKs).
vi.mock('@/components/avatar/AppAvatar.vue', () => ({
  default: { template: '<span />' },
}))
vi.mock('@/components/AppBtnCopy.vue', () => ({
  default: { template: '<button />' },
}))
vi.mock('qrcode.vue', () => ({
  default: {
    props: ['value'],
    template: '<svg class="qr" :data-value="value" />',
  },
}))

const { default: ModuleAccessWalletConnect } =
  await import('@/modules/access/ModuleAccessWalletConnect.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper | undefined
const mountIt = () => {
  wrapper = mount(ModuleAccessWalletConnect, {
    global: {
      plugins: [i18n],
    },
  })
  return wrapper
}
afterEach(() => wrapper?.unmount())

describe('ModuleAccessWalletConnect', () => {
  it('shows a spinner until the WalletConnect URI arrives', () => {
    clickedWalletConnect.value = { walletName: 'MEW Mobile' }
    const w = mountIt()
    expect(w.find('.qr').exists()).toBe(false)
    expect(w.find('[data-testid="wc-qr-loading"]').exists()).toBe(true)
  })

  it('renders the URI as a QR once it is available', () => {
    clickedWalletConnect.value = {
      walletName: 'MEW Mobile',
      wagmiWalletData: 'wc:abc@2',
    }
    const w = mountIt()
    expect(w.get('.qr').attributes('data-value')).toBe('wc:abc@2')
    expect(w.find('[data-testid="wc-qr-loading"]').exists()).toBe(false)
  })

  it('links the footer to the help center in a new tab', () => {
    clickedWalletConnect.value = { walletName: 'MEW Mobile' }
    const w = mountIt()
    const link = w.get('[data-testid="help-center"]')
    expect(link.attributes('href')).toContain('help.myetherwallet.com')
    expect(link.attributes('target')).toBe('_blank')
  })
})

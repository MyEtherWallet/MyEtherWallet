import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import i18n from '@/i18n'
import TradeWaitingApprovalModal from '@/modules/trade/components/TradeWaitingApprovalModal.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useProviderStore, type Provider } from '@/stores/providerStore'

const AppDialogStub = {
  props: { isOpen: { type: Boolean, default: false } },
  template:
    '<div v-if="isOpen"><slot name="title" /><slot name="content" /></div>',
}

let pinia: Pinia

const mountModal = () =>
  mount(TradeWaitingApprovalModal, {
    props: { isOpen: true },
    global: {
      plugins: [i18n, pinia],
      stubs: { AppDialog: AppDialogStub, AppBlockie: true },
    },
  })

describe('TradeWaitingApprovalModal', () => {
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders the waiting copy from the design', () => {
    const modal = mountModal()
    expect(modal.text()).toContain('Waiting approval...')
    expect(modal.text()).toContain('Approve in your wallet to continue')
    expect(modal.text()).toContain("Can't see the prompt?")
  })

  it('overlays the connected wallet icon from the EIP-6963 provider list', () => {
    const walletStore = useWalletStore()
    walletStore.walletName = 'MetaMask'
    const providerStore = useProviderStore()
    providerStore.addProvider({
      info: {
        uuid: '1',
        name: 'MetaMask',
        icon: 'data:image/svg+xml;base64,abc',
        rdns: 'io.metamask',
      },
    } as Provider)

    const modal = mountModal()
    const overlay = modal.find('img[src="data:image/svg+xml;base64,abc"]')
    expect(overlay.exists()).toBe(true)
  })

  it('falls back to the address blockie when no wallet icon is found', () => {
    const walletStore = useWalletStore()
    walletStore.walletAddress = '0x717ba71d4ea77d1b7c49a913c28c0bd538eecd41'

    const modal = mountModal()
    expect(modal.findComponent({ name: 'AppBlockie' }).exists()).toBe(true)
  })

  it('renders no avatar overlay without a wallet', () => {
    const modal = mountModal()
    expect(modal.find('img[class*="rounded-full"]').exists()).toBe(false)
    expect(modal.findComponent({ name: 'AppBlockie' }).exists()).toBe(false)
  })
})

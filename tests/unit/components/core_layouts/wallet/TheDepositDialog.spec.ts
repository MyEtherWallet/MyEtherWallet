import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const ADDRESS = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'

const { setQRCode, trackDepositEvent } = vi.hoisted(() => ({
  setQRCode: vi.fn(),
  trackDepositEvent: vi.fn(),
}))

// walletStore / chainsStore pull the Ledger HW module; mock them as minimal
// setup stores so storeToRefs unwraps correctly.
vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useWalletStore: defineStore('wallet', () => ({
      isWalletConnected: ref(true),
      walletAddress: ref<string | null>(ADDRESS),
    })),
  }
})
vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useChainsStore: defineStore('chains', () => ({
      isLoaded: ref(true),
      allChains: ref([]),
      selectedChain: ref({
        name: 'ETHEREUM',
        nameLong: 'Ethereum',
        icon: 'https://example.com/eth.svg',
        blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
      }),
    })),
  }
})
vi.mock('@/composables/useQR', async () => {
  const { ref } = await import('vue')
  return {
    useQR: () => ({
      qrCode: ref<HTMLDivElement | null>(null),
      isLoadingQRCode: ref(false),
      setQRCode,
    }),
  }
})
vi.mock('@/analytics', () => ({
  analytics: { trackDepositEvent },
  DepositEvent: { SHOWN: 'shown' },
}))
// blockies needs a canvas.
vi.mock('@/utils/blockies', () => ({
  default: () => ({ toDataURL: () => 'data:image/png;base64,stub' }),
}))

import TheDepositDialog from '@/components/core_layouts/wallet/TheDepositDialog.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      common: {
        deposit_title: 'Your {chain} address',
        deposit_description: 'You can deposit any tokens supported by {chain}.',
      },
      view_in_block_explorer: 'View in block explorer',
    },
  },
})

// AppModal teleports; render its header + default slots inline.
const AppModalStub = {
  name: 'AppModal',
  props: ['modelValue', 'title'],
  template: '<div :data-open="modelValue"><slot name="header" /><slot /></div>',
}

const factory = () =>
  mount(TheDepositDialog, {
    props: { openDialog: true },
    global: { plugins: [i18n], stubs: { AppModal: AppModalStub } },
  })

describe('TheDepositDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setQRCode.mockClear()
    trackDepositEvent.mockClear()
  })

  it('renders the chain title and description', () => {
    const w = factory()
    expect(w.findComponent({ name: 'AppModal' }).props('title')).toBe(
      'Your Ethereum address',
    )
    expect(w.text()).toContain('Your Ethereum address')
    expect(w.text()).toContain(
      'You can deposit any tokens supported by Ethereum.',
    )
  })

  it('shows the chain mark and the account blockie', () => {
    const avatars = factory().findAllComponents(AppAvatar)
    const network = avatars.find(a => a.props('type') === 'network')
    const account = avatars.find(a => a.props('type') === 'account')
    expect(network?.props('url')).toBe('https://example.com/eth.svg')
    expect(account?.props('address')).toBe(ADDRESS)
  })

  it('shows the address, copies it and links it to the explorer', () => {
    const w = factory()
    expect(w.text()).toContain(ADDRESS)
    expect(w.findComponent(AppBtnCopy).props('copyValue')).toBe(ADDRESS)
    const link = w.get('a[aria-label="View in block explorer"]')
    expect(link.attributes('href')).toBe(
      `https://etherscan.io/address/${ADDRESS}`,
    )
    expect(link.attributes('target')).toBe('_blank')
  })

  it('draws the QR for the address and tracks the shown event once open', async () => {
    factory()
    await nextTick()
    expect(setQRCode).toHaveBeenCalledWith(ADDRESS, 200, 200)
    expect(trackDepositEvent).toHaveBeenCalledWith('shown')
  })
})

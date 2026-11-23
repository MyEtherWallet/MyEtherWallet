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

// AppModal teleports; render a custom header (if any) + the body inline.
const AppModalStub = {
  name: 'AppModal',
  props: ['modelValue', 'title', 'subtitle'],
  template:
    '<div :data-open="modelValue"><header data-test="custom-header"><slot name="header" /></header><slot /></div>',
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

  it('puts the chain title and description in the standard modal header', () => {
    const w = factory()
    const modal = w.findComponent({ name: 'AppModal' })
    expect(modal.props('title')).toBe('Your Ethereum address')
    expect(modal.props('subtitle')).toBe(
      'You can deposit any tokens supported by Ethereum.',
    )
    // No custom header and no second copy of the title in the body.
    expect(w.get('[data-test="custom-header"]').element.children).toHaveLength(
      0,
    )
    expect(w.text()).not.toContain('Your Ethereum address')
  })

  it('centres the chain mark on the QR, which sits flush without a frame', () => {
    const w = factory()
    const qr = w.get('[data-test="deposit-qr"]')
    const network = qr
      .findAllComponents(AppAvatar)
      .find(a => a.props('type') === 'network')
    expect(network?.props('url')).toBe('https://example.com/eth.svg')
    expect(network?.element.parentElement?.className).toContain('rounded-full')
    // Light mode: no shadow, border or outer padding around the QR.
    const lightClasses = qr.classes().filter(c => !c.startsWith('dark:'))
    expect(lightClasses.some(c => /^(shadow|border|p-|px-|py-)/.test(c))).toBe(
      false,
    )
  })

  it('shows the account blockie', () => {
    const account = factory()
      .findAllComponents(AppAvatar)
      .find(a => a.props('type') === 'account')
    expect(account?.props('address')).toBe(ADDRESS)
  })

  it('shows the address, copies it and links it to the explorer', () => {
    const w = factory()
    expect(w.text()).toContain(ADDRESS)
    const copy = w.findComponent(AppBtnCopy)
    expect(copy.props('copyValue')).toBe(ADDRESS)
    // Same Button Icon size (M: 40px box, 24px glyph) as the explorer link.
    expect(copy.props('size')).toBe('m')
    expect(copy.props('iconSize')).toBe('m')
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

<template>
  <teleport to="#app">
    <!-- Full-screen dim backdrop. Teleported into #app so global z-index applies and
         no header stacking context can trap it: it covers the page, side drawers
         (z-100) and the entire header (z-10). Only the trigger clone and the popup,
         teleported into the same layer at higher z, sit above it. -->
    <transition
      enter-from-class="opacity-0"
      enter-active-class="transition-opacity ease-out duration-200"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="openDialog"
        class="fixed inset-0 z-[2100] bg-black/40"
        @click="openDialog = false"
      />
    </transition>

    <!-- Trigger clone: bright above the backdrop, positioned exactly over the real
         trigger. Clicking it closes the popup. -->
    <address-trigger-pill
      v-if="openDialog && triggerCloneStyle"
      :hover="false"
      :style="triggerCloneStyle"
      @click="openDialog = false"
    />

    <!-- Popup -->
    <transition
      enter-from-class="opacity-0 scale-95"
      enter-active-class="transform ease-out duration-200 transition"
      enter-to-class="opacity-100 scale-100"
      leave-from-class="opacity-100 scale-100"
      leave-active-class="transform ease-in duration-150 transition"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="openDialog"
        ref="popupRef"
        :style="popupStyle"
        class="fixed z-[2102] w-[384px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-96px)] bg-white rounded-32 overflow-hidden shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.30)] transition-[height] duration-[400ms] ease-[cubic-bezier(0.25,0.1,0,1)]"
        :class="view === 'connect-address' ? 'h-[380px]' : 'h-[720px]'"
      >
        <!-- Slide track: fixed height, panels slide horizontally -->
        <div class="relative h-full overflow-hidden">
          <!-- Accounts panel -->
          <div
            ref="accountsPanelRef"
            :inert="view !== 'accounts'"
            class="absolute inset-0 w-full h-full"
            :style="{
              transform: view === 'accounts' ? 'translateX(0)' : `translateX(calc(-100% - ${GAP}px))`,
              opacity: view === 'accounts' ? 1 : 0,
              transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
            }"
          >
            <div class="flex flex-col h-full">
              <!-- Section 1: network pill + active-account card -->
              <div class="shrink-0 p-4">
                <div class="bg-surface-hover rounded-20 overflow-hidden">
                  <button
                    data-test="network-row"
                    class="flex items-center justify-between gap-2.5 w-full pl-3 pr-4 py-3 text-left rounded-[22px] transition-colors hover:bg-black/5"
                    @click="view = 'network'"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <img
                        v-if="chainsStore.selectedChain?.icon"
                        :src="chainsStore.selectedChain.icon"
                        alt=""
                        aria-hidden="true"
                        class="w-7 h-7 rounded-full object-contain flex-shrink-0"
                      />
                      <div v-else class="w-7 h-7 rounded-full bg-white flex-shrink-0" />
                      <span class="text-s-14 font-semibold text-black truncate">
                        {{ chainsStore.selectedChain?.nameLong }}
                      </span>
                    </div>
                    <chevron-right-icon class="w-5 h-5 text-info flex-shrink-0" />
                  </button>
                  <manage-accounts-card
                    v-if="activeAccount"
                    :account="activeAccount"
                    :balance="balanceFor(activeAccount)"
                    :balance-loading="balanceLoadingFor(activeAccount)"
                    :connecting="connecting"
                    @copy="copy(activeAccount.address)"
                    @refresh="refresh(activeAccount)"
                    @rename="onRenameRequest(activeAccount)"
                    @paper="onPaper(activeAccount)"
                    @explorer="openExplorer(activeAccount)"
                    @disconnect="onDisconnect"
                    @delete="onDelete(activeAccount)"
                    @connect="onConnect"
                  />
                  <!-- No connected address for the selected network: keep the popup
                       usable (pick another address below or switch network). -->
                  <div v-else data-test="no-active-address" class="px-4 py-6 text-center">
                    <p class="text-s-16 font-semibold text-black">
                      {{ $t('multi_address.no_address_title') }}
                    </p>
                    <p class="mt-1 text-s-14 text-[#575757]">
                      {{ $t('multi_address.no_address_subtitle') }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Section 2: all-accounts list -->
              <div class="relative flex-1 min-h-0">
                <div class="h-full overflow-y-auto px-2">
                  <div class="p-4">
                    <p class="text-s-14 text-[#575757]">
                      {{ $t('multi_address.your_addresses') }} ({{ totalCount }})
                    </p>
                  </div>
                  <template v-if="allAccounts.length">
                    <manage-accounts-row
                      v-for="acc in allAccounts"
                      :key="acc.id"
                      :account="acc"
                      :is-active="acc.id === activeAccount?.id"
                      :balance="balanceFor(acc)"
                      :balance-loading="balanceLoadingFor(acc)"
                      @select="onSelect(acc)"
                      @copy="copy(acc.address)"
                      @refresh="refresh(acc)"
                      @rename="onRenameRequest(acc)"
                      @paper="onPaper(acc)"
                      @explorer="openExplorer(acc)"
                      @disconnect="onDisconnect"
                      @delete="onDelete(acc)"
                    />
                  </template>
                  <p v-else class="text-center text-info py-6">{{ $t('multi_address.empty') }}</p>
                  <div class="pb-10" />
                </div>
                <div
                  class="pointer-events-none absolute bottom-0 left-0 right-0 h-8"
                  style="background: linear-gradient(180deg, rgba(245, 245, 245, 0.00) 0%, #F5F5F5 100%);"
                  aria-hidden="true"
                />
              </div>

              <!-- Section 3: detected footer + connect-another -->
              <div class="shrink-0 p-4">
                <div v-if="detectedAddress && !detectedIsSaved" class="mb-4 flex items-center gap-2 px-2">
                  <div class="flex-1 min-w-0">
                    <p class="text-s-12 text-[#575757] leading-[18px]">
                      {{ $t('multi_address.detected_wallet', { wallet: detectedWalletName }) }}
                    </p>
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="text-s-16 font-semibold text-black leading-[22px] truncate">
                        {{ truncateAddress(detectedAddress, 6, 4) }}
                      </span>
                      <img
                        v-if="detectedWalletIcon"
                        :src="detectedWalletIcon"
                        alt=""
                        aria-hidden="true"
                        class="size-[22px] rounded-full object-contain bg-[#f5f5f5] p-[3px] shrink-0"
                      />
                    </div>
                    <p v-if="detectedMessage" data-test="detected-message" class="text-s-12 text-error mt-1">
                      {{ detectedMessage }}
                    </p>
                  </div>
                  <button
                    data-test="save-detected"
                    class="h-10 px-3 border-[1.5px] border-primary rounded-[24px] text-primary text-s-14 font-semibold shrink-0"
                    @click="saveDetected"
                  >
                    {{ $t('multi_address.save_address') }}
                  </button>
                </div>

                <button
                  data-test="add-address"
                  class="w-full h-12 rounded-24 bg-[#e6e6e6] flex items-center justify-center text-s-16 font-semibold text-black"
                  @click="onAdd"
                >
                  {{ $t('multi_address.connect_another') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Network panel: fills the same fixed height; content scrolls internally via ManageAccountsNetworkView -->
          <div
            ref="networkPanelRef"
            :inert="view !== 'network'"
            class="absolute inset-0 w-full h-full"
            :style="{
              transform: view === 'network' ? 'translateX(0)' : `translateX(calc(100% + ${GAP}px))`,
              opacity: view === 'network' ? 1 : 0,
              transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
            }"
          >
            <manage-accounts-network-view
              @back="view = 'accounts'"
              @selected="view = 'accounts'"
            />
          </div>

          <!-- Connect-address panel: slides in like the network view when a saved
               address is being connected but isn't active in the extension. -->
          <div
            :inert="view !== 'connect-address'"
            class="absolute inset-0 w-full h-full"
            :style="{
              transform: view === 'connect-address' ? 'translateX(0)' : `translateX(calc(100% + ${GAP}px))`,
              opacity: view === 'connect-address' ? 1 : 0,
              transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
            }"
          >
            <manage-accounts-connect-address-view @back="view = 'accounts'" />
          </div>
        </div>
      </div>
    </transition>

    <!-- Modals live outside the popup's v-if so they survive the popup closing
         (Paper wallet and Rename both close the popup before opening). -->
    <the-paper-wallet v-model:is-open="openPaperWallet" :address="paperTarget?.address" />
    <manage-accounts-rename-modal
      v-model:is-open="renameOpen"
      :current-name="renameTarget?.addressName"
      :name-taken="isRenameNameTaken"
      @save="onRenameSave"
    />
  </teleport>
</template>
<script setup lang="ts">
import { ref, computed, watch, nextTick, type CSSProperties } from 'vue'
import { onClickOutside, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import AddressTriggerPill from '@/components/core_layouts/wallet/AddressTriggerPill.vue'
import ManageAccountsRow from '@/components/core_layouts/wallet/ManageAccountsRow.vue'
import ManageAccountsCard from '@/components/core_layouts/wallet/ManageAccountsCard.vue'
import ManageAccountsNetworkView from '@/components/core_layouts/wallet/ManageAccountsNetworkView.vue'
import ManageAccountsConnectAddressView from '@/components/core_layouts/wallet/ManageAccountsConnectAddressView.vue'
import ThePaperWallet from '@/components/core_layouts/wallet/ThePaperWallet.vue'
import ManageAccountsRenameModal from '@/components/core_layouts/wallet/ManageAccountsRenameModal.vue'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useAccountSwitch } from '@/composables/useAccountSwitch'
import { useAddAccount } from '@/composables/useAddAccount'
import {
  useAccountBalances,
  type AccountBalance,
} from '@/composables/useAccountBalances'
import { useWalletStore } from '@/stores/walletStore'
import { useProviderStore } from '@/stores/providerStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useAccessStore } from '@/stores/accessStore'
import { truncateAddress } from '@/utils/filters'
import { analytics } from '@/analytics'
import { MultiAddressEvent } from '@/analytics/events'
import {
  isNameUnique,
  type SavedAccount,
} from '@/stores/saved_accounts/savedAccountsLogic'
import type { Chain, ChainType } from '@/mew_api/types'

const GAP = 24

const { t } = useI18n()
const openDialog = defineModel<boolean>('openDialog', { default: false })

const props = defineProps<{ anchor?: HTMLElement | null }>()

const view = ref<'accounts' | 'network' | 'connect-address'>('accounts')

const accountsPanelRef = ref<HTMLElement | null>(null)
const networkPanelRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)

// getBoundingClientRect() is not reactive, so track the viewport size and let it
// invalidate these computeds — the clone and popup then re-anchor on resize
// instead of freezing at their open-time coordinates.
const { width: viewportWidth, height: viewportHeight } = useWindowSize()
// Bumped after the header layout changes (connect/disconnect toggles sibling
// elements like the notifications popup, shifting the trigger) so the clone and
// popup re-measure the anchor and stay aligned.
const posTick = ref(0)

// Responsive positioning: anchoring the popup to the trigger only works on wide
// screens. Below 640 the trigger sits too far left, so center the popup; below
// 480 let it grow to full width with small side gutters.
const isMobile = computed<boolean>(() => viewportWidth.value < 480)
const isNarrow = computed<boolean>(() => viewportWidth.value < 640)

const popupStyle = computed(() => {
  void viewportHeight.value
  void posTick.value
  const top = props.anchor
    ? props.anchor.getBoundingClientRect().bottom + 8
    : 76
  if (isMobile.value) {
    // Full width minus a small gutter on each side, so it never overflows.
    return { top: `${top}px`, left: '16px', right: '16px', width: 'auto' }
  }
  if (isNarrow.value) {
    // Centered horizontally, keeping the fixed popup width.
    const width = Math.min(384, viewportWidth.value - 32)
    const left = Math.max(16, (viewportWidth.value - width) / 2)
    return { top: `${top}px`, left: `${left}px` }
  }
  if (props.anchor) {
    const rect = props.anchor.getBoundingClientRect()
    return { top: `${top}px`, right: `${window.innerWidth - rect.right}px` }
  }
  return { top: '76px', right: '16px' }
})

const triggerCloneStyle = computed<CSSProperties | null>(() => {
  void viewportWidth.value
  void viewportHeight.value
  void posTick.value
  if (!props.anchor) return null
  const rect = props.anchor.getBoundingClientRect()
  return {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: 2101,
  }
})

watch(openDialog, val => {
  if (!val) view.value = 'accounts'
})

const watchOnlyStore = useWatchOnlyStore()
const activeAccount = computed<SavedAccount | null>(() => watchOnlyStore.activeAccount)
// Stable, insertion-ordered list (active is highlighted in place, never moved to the
// top) so selecting an address does NOT reorder the list.
const allAccounts = computed<SavedAccount[]>(() => watchOnlyStore.allAccounts)
const totalCount = computed(() => allAccounts.value.length)

const { switchTo, deleteAccount } = useAccountSwitch()
const { startAdd, connectSaved } = useAddAccount()
const { balances, isLoading, fetchFor, refreshOne, clear } = useAccountBalances()
const walletStore = useWalletStore()
const {
  walletAddress,
  detectedAddress,
  walletName,
  totalFiatPortfolioValueBN,
  tokens,
  isLoadingBalances,
} = storeToRefs(walletStore)

// The detected address comes from the currently-connected extension wallet, so
// label it with that wallet's name/icon.
const providerStore = useProviderStore()
const detectedWalletName = computed<string>(() => walletName.value || 'wallet')
const detectedWalletIcon = computed<string>(
  () =>
    providerStore.providers.find(
      p => p.info.name.toLowerCase() === (walletName.value ?? '').toLowerCase(),
    )?.info.icon ?? '',
)

// The detected address is only worth prompting to save when we don't already
// have it — and this must stay reactive, not just a one-time check when it's
// detected. Switching the extension account fires both this popup's auto-retry
// (which connects + saves the new address) and the header's accountsChanged
// listener (which flags it as "detected"); the save can win the race, so the
// address ends up saved yet still flagged. Re-derive visibility from the saved
// list and drop the prompt once the address is saved.
const detectedIsSaved = computed<boolean>(() => {
  const d = detectedAddress.value?.toLowerCase()
  if (!d) return false
  return allAccounts.value.some(a => a.address.toLowerCase() === d)
})
watch(detectedIsSaved, saved => {
  if (saved) walletStore.clearDetectedAddress()
})

// Re-measure the clone/popup after the header reflows on connect/disconnect.
watch(walletAddress, async () => {
  await nextTick()
  posTick.value += 1
})
const chainsStore = useChainsStore()

// Experiment: show the "connect address" prompt as an in-popup slide panel
// (mirrors the ModuleAccessConnectAddress modal) instead of the dialog modal.
const accessStore = useAccessStore()
const { connectAddressInfo } = storeToRefs(accessStore)
watch(connectAddressInfo, info => {
  if (info && openDialog.value) view.value = 'connect-address'
  else if (!info && view.value === 'connect-address') view.value = 'accounts'
})

const isActive = (acc: SavedAccount): boolean =>
  acc.id === activeAccount.value?.id

// An account only has a balance on the selected network when their chain types
// match (an EVM /balances endpoint 400s on a Bitcoin address and vice versa).
const isCompatible = (acc: SavedAccount): boolean =>
  acc.chainType === chainsStore.selectedChain?.type

// The active account IS the connected wallet, so reuse walletStore's live total
// (identical to the top-bar trigger) instead of the per-address /balances fetch,
// which can lag or return 0 for the freshly-connected address. Other accounts
// use their own per-address fetch, keyed by id.
const activeBalance = computed<AccountBalance>(() => ({
  usdValue: Number(totalFiatPortfolioValueBN.value),
  tokenCount: tokens.value.length,
}))

const balanceFor = (acc: SavedAccount): AccountBalance | undefined => {
  if (isActive(acc)) return activeBalance.value
  return isCompatible(acc) ? balances.value[acc.id] : undefined
}

// Active row/card follow walletStore's own loading flag (covers connect, switch
// and network change); other rows follow the per-address fetch.
const balanceLoadingFor = (acc: SavedAccount): boolean =>
  isActive(acc) ? isLoadingBalances.value : isLoading.value && isCompatible(acc)

const openPaperWallet = ref(false)
const paperTarget = ref<SavedAccount | null>(null)
const renameOpen = ref(false)
const renameTarget = ref<SavedAccount | null>(null)
const hasBackfilled = ref(false)
const detectedMessage = ref('')

const chainName = (): string => chainsStore.selectedChain?.name ?? 'ETHEREUM'

const loadBalances = (): void => {
  const entries = allAccounts.value.filter(isCompatible).map(a => ({
    id: a.id,
    chainName: chainName(),
    address: a.address,
    nativePrice: chainsStore.selectedChain?.price ?? 0,
  }))
  void fetchFor(entries)
}

// Re-fetch every row's balance for the newly-selected network while the popup is
// open. Cached balances are per-chain, so drop them first — that way the rows show
// the loading skeleton (not a stale value) until the new network's data arrives.
watch(
  () => chainsStore.selectedChain?.name,
  () => {
    if (!openDialog.value) return
    clear()
    loadBalances()
  },
)

watch(
  openDialog,
  isOpen => {
    if (!isOpen) return
    if (!hasBackfilled.value) {
      watchOnlyStore.backfill()
      hasBackfilled.value = true
    }
    void analytics.trackMultiAddressEvent(MultiAddressEvent.OPENED)
    loadBalances()
  },
  { immediate: true },
)

const onSelect = (acc: SavedAccount): void => {
  if (isActive(acc)) return
  void analytics.trackMultiAddressEvent(MultiAddressEvent.SWITCHED)
  // Show the skeleton immediately so the newly-selected card never flashes the
  // previously-active address's balance before walletStore refetches.
  walletStore.setIsLoadingBalances(true)
  // View the address (read-only) and update the active card; keep the popup open.
  void switchTo(acc)
}
const onDelete = (acc: SavedAccount): void => {
  void analytics.trackMultiAddressEvent(MultiAddressEvent.DELETED)
  void deleteAccount(acc)
}
const onDisconnect = (): void => {
  // Keep the popup open so the user stays in the manage-accounts context.
  walletStore.disconnectWallet()
}
// Rename opens a dedicated modal (Figma 7619-10566): close the popup, then open
// the modal for the chosen account. Saving applies the rename.
const onRenameRequest = (acc: SavedAccount): void => {
  renameTarget.value = acc
  openDialog.value = false
  renameOpen.value = true
}
const onRenameSave = (name: string): void => {
  const acc = renameTarget.value
  if (!acc) return
  const res = watchOnlyStore.renameAccount(acc.id, name)
  if (res.ok) void analytics.trackMultiAddressEvent(MultiAddressEvent.RENAMED)
}
// Surfaced by the modal on Save: true when another saved address already uses
// this name (the current account is excluded so a no-op rename is allowed).
const isRenameNameTaken = (name: string): boolean =>
  renameTarget.value
    ? !isNameUnique(watchOnlyStore.watchOnlyAddresses, name, renameTarget.value.id)
    : false
// Paper wallet opens a modal (same as the home wallet card) for the chosen
// account's address; close the popup first.
const onPaper = (acc: SavedAccount): void => {
  paperTarget.value = acc
  openDialog.value = false
  openPaperWallet.value = true
}
// Both the footer "Connect another" button and the watch-only card's "Connect
// address" button open the existing connect flow. Close the popup first so the
// wallet/extension access dialog isn't hidden behind it; on a successful connect
// walletStore.setAddress makes that address active, so re-opening the popup shows
// it already selected (activeId tracks the connected wallet address).
const onAdd = (): void => {
  void analytics.trackMultiAddressEvent(MultiAddressEvent.ADD_STARTED)
  openDialog.value = false
  startAdd()
}
// Card "Connect address": we already know the wallet for this saved address, so
// connect directly without surfacing the access chooser dialog. While the
// extension responds we show a loader on the button (the popup stays put); on a
// mismatch the connect-address prompt slides into the popup.
const connecting = ref(false)
const onConnect = async (): Promise<void> => {
  const acc = activeAccount.value
  if (!acc || connecting.value) return
  void analytics.trackMultiAddressEvent(MultiAddressEvent.ADD_STARTED)
  connecting.value = true
  try {
    await connectSaved(acc)
  } finally {
    connecting.value = false
  }
}
const refresh = (acc: SavedAccount): void => {
  // The active account's balance comes from walletStore (like the home card),
  // so refresh it the same way; other rows use the per-address fetch.
  if (isActive(acc)) {
    void walletStore.refreshBalances()
    return
  }
  void refreshOne({
    id: acc.id,
    chainName: chainName(),
    address: acc.address,
    nativePrice: chainsStore.selectedChain?.price ?? 0,
  })
}
const openExplorer = (acc: SavedAccount): void => {
  const url = chainsStore.selectedChain?.blockExplorerAddr?.replace('[[address]]', acc.address)
  if (url) window.open(url, '_blank')
  openDialog.value = false
}
const copy = (address: string): void => {
  void navigator.clipboard.writeText(address)
}
const saveDetected = (): void => {
  if (!detectedAddress.value) return
  const chain = chainsStore.selectedChain as Chain
  // Associate the saved address with the real connected wallet (e.g. "MetaMask")
  // so it displays correctly and can be reconnected directly by name.
  const res = watchOnlyStore.tryAddAddress(
    detectedAddress.value,
    chain,
    'INJECTED',
    chain.type as ChainType,
    walletName.value || 'Detected',
  )
  if (!res.added) {
    detectedMessage.value =
      res.reason === 'cap' ? t('multi_address.cap_reached') : t('multi_address.duplicate_address')
    return
  }
  detectedMessage.value = ''
  void analytics.trackMultiAddressEvent(MultiAddressEvent.DETECTED_SAVED)
  walletStore.clearDetectedAddress()
}

watch(detectedAddress, () => { detectedMessage.value = '' })

const anchorRef = computed(() => props.anchor ?? null)
// Ignore the trigger anchor and any teleported account menu (rendered at body
// level, outside popupRef) — otherwise clicking a menu item counts as an outside
// click and closes the popup regardless of the item's own handler.
onClickOutside(popupRef, () => { openDialog.value = false }, {
  ignore: [anchorRef, '.app-popup-menu-floating'],
})
</script>

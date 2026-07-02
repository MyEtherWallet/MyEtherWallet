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
    <button
      v-if="openDialog && triggerCloneStyle"
      :style="triggerCloneStyle"
      class="hoverNoBG p-1 xs:py-2 xs:px-3 rounded-[24px] xs:rounded-full shadow-button shadow-button-elevated bg-white flex items-center"
      @click="openDialog = false"
    >
      <app-blockie
        :address="cloneAddress"
        :size="6"
        class="mr-1 rounded-full"
      />
      <div v-if="walletStore.isWatchOnly" class="text-left ml-1">
        <p class="text-s-8 text-info mb-[2px] -mt-1">{{ $t('common.watch_only') }}</p>
        <div class="mr-2 font-medium text-info text-s-12 leading-p-100">
          {{ truncateAddress(cloneAddress, 6) }}
        </div>
      </div>
      <div v-else class="mr-2 ml-1 font-medium text-s-14 leading-p-100">
        {{ truncateAddress(cloneAddress, 6) }}
      </div>
      <chevron-down-icon class="w-3 h-3 xs:w-4 xs:h-4 ml-auto xs:mr-1" />
    </button>

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
        v-if="openDialog"
        ref="popupRef"
        :style="popupStyle"
        class="fixed z-[2102] w-[384px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-96px)] bg-white rounded-32 overflow-hidden shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.30)]"
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
                    :balance="balances[activeAccount.id]"
                    @copy="copy(activeAccount.address)"
                    @refresh="refresh(activeAccount)"
                    @rename="onRename(activeAccount, $event)"
                    @paper="openPaperWallet = true"
                    @explorer="openExplorer(activeAccount)"
                    @disconnect="onDisconnect"
                    @delete="onDelete(activeAccount)"
                    @connect="onConnect"
                  />
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
                      :balance="balances[acc.id]"
                      @select="onSelect(acc)"
                      @copy="copy(acc.address)"
                      @refresh="refresh(acc)"
                      @rename="onRename(acc, $event)"
                      @paper="openPaperWallet = true"
                      @explorer="openExplorer(acc)"
                      @disconnect="onDisconnect"
                      @delete="onDelete(acc)"
                    />
                  </template>
                  <p v-else class="text-center text-info py-6">{{ $t('multi_address.empty') }}</p>
                  <div class="pb-3" />
                </div>
                <div
                  class="pointer-events-none absolute bottom-0 left-0 right-0 h-8"
                  style="background: linear-gradient(180deg, rgba(245, 245, 245, 0.00) 0%, #F5F5F5 100%);"
                  aria-hidden="true"
                />
              </div>

              <!-- Section 3: detected footer + connect-another -->
              <div class="shrink-0 p-4">
                <div v-if="detectedAddress" class="mb-4 rounded-12 bg-grey-faded px-3 py-2">
                  <div class="flex items-center justify-between">
                    <div class="min-w-0">
                      <p class="text-s-12 text-info">{{ $t('multi_address.detected') }}</p>
                      <p class="font-mono text-s-14 truncate">{{ truncateAddress(detectedAddress, 6, 4) }}</p>
                    </div>
                    <button
                      data-test="save-detected"
                      class="text-primary text-s-14 border border-primary rounded-full px-3 py-1"
                      @click="saveDetected"
                    >
                      {{ $t('multi_address.save_address') }}
                    </button>
                  </div>
                  <p data-test="detected-prompt" class="text-s-12 text-info mt-1">
                    {{ $t('multi_address.extension_prompt') }}
                  </p>
                  <p v-if="detectedMessage" data-test="detected-message" class="text-s-12 text-error mt-1">
                    {{ detectedMessage }}
                  </p>
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

            <the-paper-wallet v-model:is-open="openPaperWallet" />
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
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup lang="ts">
import { ref, computed, watch, type CSSProperties } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppBlockie from '@/components/AppBlockie.vue'
import ManageAccountsRow from '@/components/core_layouts/wallet/ManageAccountsRow.vue'
import ManageAccountsCard from '@/components/core_layouts/wallet/ManageAccountsCard.vue'
import ManageAccountsNetworkView from '@/components/core_layouts/wallet/ManageAccountsNetworkView.vue'
import ThePaperWallet from '@/components/core_layouts/wallet/ThePaperWallet.vue'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useAccountSwitch } from '@/composables/useAccountSwitch'
import { useAddAccount } from '@/composables/useAddAccount'
import { useAccountBalances } from '@/composables/useAccountBalances'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { truncateAddress } from '@/utils/filters'
import { analytics } from '@/analytics'
import { MultiAddressEvent } from '@/analytics/events'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'
import type { Chain, ChainType } from '@/mew_api/types'

const GAP = 24

const { t } = useI18n()
const openDialog = defineModel<boolean>('openDialog', { default: false })

const props = defineProps<{ anchor?: HTMLElement | null }>()

const view = ref<'accounts' | 'network'>('accounts')

const accountsPanelRef = ref<HTMLElement | null>(null)
const networkPanelRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)

const popupStyle = computed(() => {
  if (props.anchor) {
    const rect = props.anchor.getBoundingClientRect()
    return {
      top: `${rect.bottom + 8}px`,
      right: `${window.innerWidth - rect.right}px`,
    }
  }
  return { top: '76px', right: '16px' }
})

const triggerCloneStyle = computed<CSSProperties | null>(() => {
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
const savedAccounts = computed<SavedAccount[]>(() => watchOnlyStore.savedAccounts)
const allAccounts = computed<SavedAccount[]>(() =>
  [activeAccount.value, ...savedAccounts.value].filter((a): a is SavedAccount => !!a),
)
const totalCount = computed(() => allAccounts.value.length)

const { switchTo, deleteAccount } = useAccountSwitch()
const { startAdd } = useAddAccount()
const { balances, fetchFor, refreshOne } = useAccountBalances()
const walletStore = useWalletStore()
const { detectedAddress } = storeToRefs(walletStore)
const cloneAddress = computed(() => walletStore.walletAddress ?? '')
const chainsStore = useChainsStore()

const openPaperWallet = ref(false)
const hasBackfilled = ref(false)
const detectedMessage = ref('')

const chainName = (): string => chainsStore.selectedChain?.name ?? 'ETHEREUM'

const loadBalances = (): void => {
  const entries = [activeAccount.value, ...savedAccounts.value]
    .filter((a): a is SavedAccount => !!a)
    .map(a => ({ id: a.id, chainName: chainName(), address: a.address }))
  void fetchFor(entries)
}

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
  void analytics.trackMultiAddressEvent(MultiAddressEvent.SWITCHED)
  void switchTo(acc)
  openDialog.value = false
}
const onDelete = (acc: SavedAccount): void => {
  void analytics.trackMultiAddressEvent(MultiAddressEvent.DELETED)
  void deleteAccount(acc)
}
const onDisconnect = (): void => {
  walletStore.disconnectWallet()
  openDialog.value = false
}
const onRename = (acc: SavedAccount, name: string): void => {
  const res = watchOnlyStore.renameAccount(acc.id, name)
  if (res.ok) void analytics.trackMultiAddressEvent(MultiAddressEvent.RENAMED)
}
const onAdd = (): void => {
  void analytics.trackMultiAddressEvent(MultiAddressEvent.ADD_STARTED)
  startAdd()
}
const onConnect = (): void => {
  void analytics.trackMultiAddressEvent(MultiAddressEvent.ADD_STARTED)
  startAdd()
  openDialog.value = false
}
const refresh = (acc: SavedAccount): void => {
  void refreshOne({ id: acc.id, chainName: chainName(), address: acc.address })
}
const openExplorer = (acc: SavedAccount): void => {
  const url = chainsStore.selectedChain?.blockExplorerAddr?.replace('[[address]]', acc.address)
  if (url) window.open(url, '_blank')
}
const copy = (address: string): void => {
  void navigator.clipboard.writeText(address)
}
const saveDetected = (): void => {
  if (!detectedAddress.value) return
  const chain = chainsStore.selectedChain as Chain
  const res = watchOnlyStore.tryAddAddress(
    detectedAddress.value, chain, 'INJECTED', chain.type as ChainType, 'Detected',
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
onClickOutside(popupRef, () => { openDialog.value = false }, { ignore: [anchorRef] })
</script>

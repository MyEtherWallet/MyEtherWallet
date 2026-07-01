<template>
  <teleport to="#app">
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
        class="fixed z-[2101] w-[360px] max-w-[calc(100vw-32px)] bg-white rounded-20 border border-[#E6E6E6] shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.30)]"
      >
        <!-- Height-animated slide track -->
        <div
          class="relative overflow-hidden"
          :style="{
            height: containerHeight > 0 ? `${containerHeight}px` : undefined,
            transition: 'height 400ms cubic-bezier(0.25, 0.1, 0, 1)',
          }"
        >
          <!-- Accounts panel -->
          <div
            ref="accountsPanelRef"
            :inert="view !== 'accounts'"
            class="absolute top-0 left-0 w-full"
            :style="{
              transform: view === 'accounts' ? 'translateX(0)' : `translateX(calc(-100% - ${GAP}px))`,
              opacity: view === 'accounts' ? 1 : 0,
              transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
            }"
          >
            <div class="p-5">
              <!-- Title -->
              <h3 class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black mb-4">
                {{ $t('multi_address.title') }}
              </h3>
              <!-- Network row (replaces TheCurrentNetwork pill) -->
              <button
                data-test="network-row"
                class="flex items-center justify-between w-full mb-4 px-3 py-2 rounded-12 hover:bg-grey-faded transition-colors"
                @click="view = 'network'"
              >
                <div class="flex items-center gap-2">
                  <img
                    v-if="chainsStore.selectedChain?.icon"
                    :src="chainsStore.selectedChain.icon"
                    alt=""
                    aria-hidden="true"
                    class="w-5 h-5 rounded-full object-contain"
                  />
                  <div v-else class="w-5 h-5 rounded-full bg-surface" />
                  <span class="text-s-14 text-black">{{ chainsStore.selectedChain?.nameLong }}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-info">
                  <path fill-rule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
              </button>

              <template v-if="activeAccount || savedAccounts.length">
                <div v-if="activeAccount" class="mb-4">
                  <p class="text-s-12 text-info mb-1">{{ $t('multi_address.active') }}</p>
                  <manage-accounts-row
                    :account="activeAccount"
                    :is-active="true"
                    :balance="balances[activeAccount.id]"
                    @copy="copy(activeAccount.address)"
                    @refresh="refresh(activeAccount)"
                    @rename="onRename(activeAccount, $event)"
                    @paper="openPaperWallet = true"
                    @explorer="openExplorer(activeAccount)"
                    @delete="onDelete(activeAccount)"
                  />
                </div>

                <div v-if="savedAccounts.length">
                  <p class="text-s-12 text-info mb-1">
                    {{ $t('multi_address.your_addresses') }} ({{ totalCount }})
                  </p>
                  <manage-accounts-row
                    v-for="acc in savedAccounts"
                    :key="acc.id"
                    :account="acc"
                    :is-active="false"
                    :balance="balances[acc.id]"
                    @select="onSelect(acc)"
                    @copy="copy(acc.address)"
                    @refresh="refresh(acc)"
                    @rename="onRename(acc, $event)"
                    @paper="openPaperWallet = true"
                    @explorer="openExplorer(acc)"
                    @delete="onDelete(acc)"
                  />
                </div>
              </template>

              <p v-else class="text-center text-info py-6">{{ $t('multi_address.empty') }}</p>

              <div v-if="detectedAddress" class="mt-4 rounded-12 bg-grey-faded px-3 py-2">
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
                class="mt-4 w-full rounded-full py-2 shadow-button"
                @click="onAdd"
              >
                {{ $t('multi_address.connect_another') }}
              </button>

              <div class="flex justify-end mt-4">
                <button class="text-s-14 text-error" @click="walletStore.disconnectWallet()">
                  {{ $t('multi_address.disconnect') }}
                </button>
              </div>
            </div>

            <the-paper-wallet v-model:is-open="openPaperWallet" />
          </div>

          <!-- Network panel -->
          <div
            ref="networkPanelRef"
            :inert="view !== 'network'"
            class="absolute top-0 left-0 w-full p-0"
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
import { ref, computed, watch, nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import ManageAccountsRow from '@/components/core_layouts/wallet/ManageAccountsRow.vue'
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
const containerHeight = ref(0)

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

const measureHeight = (): void => {
  const activeRef = view.value === 'accounts' ? accountsPanelRef.value : networkPanelRef.value
  if (activeRef) containerHeight.value = activeRef.scrollHeight
}

watch(openDialog, val => {
  if (val) nextTick(measureHeight)
  else view.value = 'accounts'
})
watch(view, () => nextTick(measureHeight))

const watchOnlyStore = useWatchOnlyStore()
const activeAccount = computed<SavedAccount | null>(() => watchOnlyStore.activeAccount)
const savedAccounts = computed<SavedAccount[]>(() => watchOnlyStore.savedAccounts)
const totalCount = computed(() => (activeAccount.value ? 1 : 0) + savedAccounts.value.length)

const { switchTo, deleteAccount } = useAccountSwitch()
const { startAdd } = useAddAccount()
const { balances, fetchFor, refreshOne } = useAccountBalances()
const walletStore = useWalletStore()
const { detectedAddress } = storeToRefs(walletStore)
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
const onRename = (acc: SavedAccount, name: string): void => {
  const res = watchOnlyStore.renameAccount(acc.id, name)
  if (res.ok) void analytics.trackMultiAddressEvent(MultiAddressEvent.RENAMED)
}
const onAdd = (): void => {
  void analytics.trackMultiAddressEvent(MultiAddressEvent.ADD_STARTED)
  startAdd()
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

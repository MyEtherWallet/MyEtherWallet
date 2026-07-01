<template>
  <app-dialog
    v-model:is-open="openDialog"
    :title="$t('multi_address.title')"
    has-content-gutter
    class="xs:w-[420px] sm:mx-auto"
  >
    <template #content>
      <div class="pb-5">
        <the-current-network class="mb-4" />

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
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppDialog from '@/components/AppDialog.vue'
import ManageAccountsRow from '@/components/core_layouts/wallet/ManageAccountsRow.vue'
import TheCurrentNetwork from '@/components/core_layouts/wallet/TheCurrentNetwork.vue'
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

const { t } = useI18n()
const openDialog = defineModel<boolean>('openDialog', { default: false })

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
    return // keep the surface; let the user pick a different address in the extension
  }
  detectedMessage.value = ''
  void analytics.trackMultiAddressEvent(MultiAddressEvent.DETECTED_SAVED)
  walletStore.clearDetectedAddress()
}

watch(detectedAddress, () => { detectedMessage.value = '' })
</script>

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
              @delete="onDelete(activeAccount)"
            />
          </div>

          <div v-if="savedAccounts.length">
            <p class="text-s-12 text-info mb-1">{{ $t('multi_address.saved') }}</p>
            <manage-accounts-row
              v-for="acc in savedAccounts"
              :key="acc.id"
              :account="acc"
              :is-active="false"
              :balance="balances[acc.id]"
              @select="onSelect(acc)"
              @copy="copy(acc.address)"
              @delete="onDelete(acc)"
            />
          </div>
        </template>

        <p v-else class="text-center text-info py-6">
          {{ $t('multi_address.empty') }}
        </p>

        <button
          data-test="add-address"
          class="mt-4 w-full rounded-full py-2 shadow-button"
          @click="onAdd"
        >
          {{ $t('multi_address.add') }}
        </button>

        <div class="flex justify-between mt-4">
          <button class="text-s-14" @click="openPaperWallet = true">
            {{ $t('multi_address.paper_wallet') }}
          </button>
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
import AppDialog from '@/components/AppDialog.vue'
import ManageAccountsRow from '@/components/core_layouts/wallet/ManageAccountsRow.vue'
import TheCurrentNetwork from '@/components/core_layouts/wallet/TheCurrentNetwork.vue'
import ThePaperWallet from '@/components/core_layouts/wallet/ThePaperWallet.vue'
import { useSavedAccountsStore } from '@/stores/savedAccountsStore'
import { useAccountSwitch } from '@/composables/useAccountSwitch'
import { useAddAccount } from '@/composables/useAddAccount'
import { useAccountBalances } from '@/composables/useAccountBalances'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { analytics } from '@/analytics'
import { MultiAddressEvent } from '@/analytics/events'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'

const openDialog = defineModel<boolean>('openDialog', { default: false })

const savedAccountsStore = useSavedAccountsStore()
const activeAccount = computed<SavedAccount | null>(() => savedAccountsStore.activeAccount)
const savedAccounts = computed<SavedAccount[]>(() => savedAccountsStore.savedAccounts)
const { switchTo, deleteAccount } = useAccountSwitch()
const { startAdd } = useAddAccount()
const { balances, fetchFor } = useAccountBalances()
const walletStore = useWalletStore()
const chainsStore = useChainsStore()

const openPaperWallet = ref(false)

const loadBalances = (): void => {
  const chainName = chainsStore.selectedChain?.name ?? 'ETHEREUM'
  const entries = [activeAccount.value, ...savedAccounts.value]
    .filter((a): a is SavedAccount => !!a)
    .map(a => ({ id: a.id, chainName, address: a.address }))
  void fetchFor(entries)
}

watch(openDialog, isOpen => {
  if (isOpen) {
    void analytics.trackMultiAddressEvent(MultiAddressEvent.OPENED)
    loadBalances()
  }
})

const onSelect = (acc: SavedAccount): void => {
  void analytics.trackMultiAddressEvent(MultiAddressEvent.SWITCHED)
  void switchTo(acc)
  openDialog.value = false
}

const onDelete = (acc: SavedAccount): void => {
  void analytics.trackMultiAddressEvent(MultiAddressEvent.DELETED)
  void deleteAccount(acc)
}

const onAdd = (): void => {
  void analytics.trackMultiAddressEvent(MultiAddressEvent.ADD_STARTED)
  startAdd()
}

const copy = (address: string): void => {
  void navigator.clipboard.writeText(address)
}
</script>

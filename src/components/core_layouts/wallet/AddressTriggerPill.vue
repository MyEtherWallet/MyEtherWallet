<template>
  <app-address-selector
    :address="walletAddress ?? ''"
    :name="watchOnlyStore.activeAccount?.addressName"
    :email="loginEmail"
    :balance="formattedTotalFiatPortfolioValue"
    :loading="isLoadingBalances"
    :connected="!isWatchOnly"
    :network-icon="chainsStore.selectedChain?.icon"
    :open="open"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import AppAddressSelector from '@/components/navbar/AppAddressSelector.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useChainsStore } from '@/stores/chainsStore'
import { usePrivyAccount } from '@/composables/usePrivyAccount'

// Header account trigger: feeds the active account from the stores into the
// design-library Address selector. `open` flips its chevron while the
// manage-accounts popup is showing.
withDefaults(defineProps<{ open?: boolean }>(), { open: false })

const walletStore = useWalletStore()
const {
  walletAddress,
  isWatchOnly,
  isLoadingBalances,
  formattedTotalFiatPortfolioValue,
} = storeToRefs(walletStore)

const watchOnlyStore = useWatchOnlyStore()
const chainsStore = useChainsStore()

// A Google / email account is known by its email, but only while its wallet
// is the connected one (the rule lives in usePrivyAccount).
const { email } = usePrivyAccount()
const loginEmail = computed(() => email.value ?? undefined)
</script>

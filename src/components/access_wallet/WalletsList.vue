<template>
  <div>
    <p class="title5 mb-5">All Wallet Options</p>
    <!-- Filter -->
    <div class="flex gap-4 mb-5 flex-wrap">
      <button
        v-for="filter in filterOptions"
        :key="filter.value"
        @click="clickFilter(filter.value)"
        class="bg-primary text-white text-center rounded-full py-1 px-4 min-w-[100px]"
      >
        {{ filter.name }}
      </button>
    </div>
    <!-- Search -->
    <div class="mb-5 max-w-[600px]">
      <SearchInput @search="searchWallet" />
    </div>
    <!-- Wallets-->
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      <div
        v-for="wallet in wallets"
        :key="wallet.id"
        class="flex flex-col items-center bg-white p-4 rounded-lg hoverOpacityHasBG cursor-pointer"
        @click="clickWallet(wallet)"
      >
        <AsyncImg
          :asyncImg="wallet.iconUrl"
          :alt="wallet.name"
          class="rounded-lg"
        />
        <p class="text-info pt-2">{{ wallet.name }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as rainndowWallets from '@rainbow-me/rainbowkit/wallets'
import AsyncImg from './components/AsyncImg.vue'
import {
  CreateWalletFn,
  Wallet,
} from '@rainbow-me/rainbowkit/types/wallets/wallet'
import SearchInput from './components/SearchInput.vue'

const WC_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID
/**
 * Iterates over all properties in the `allWallets` object, which is expected to have keys of type `string` and values of type `Wallet`.
 * Logs each key-value pair to the console.
 *
 * @param {Object.<string, Wallet>} allWallets - An object containing wallet information where each key is a string and each value is of type `Wallet`.
 */
const DEFAULT_IDS = ['enkrypt', 'mew']
const wallets: CreateWalletFn[] = []
const walletRecords = rainndowWallets as unknown as Record<
  string,
  CreateWalletFn
>
for (const key in walletRecords) {
  if (Object.hasOwnProperty.call(walletRecords, key)) {
    const _walletInstance = walletRecords[key]
    const _wallet = _walletInstance({ projectId: WC_PROJECT_ID }, null)
    if (DEFAULT_IDS.includes(_wallet.id)) {
      wallets.unshift(_wallet)
    } else {
      wallets.push(_wallet)
    }
  }
}
const clickWallet = (wallet: Wallet) => {
  console.log('clickWallet', wallet)
}

/** -------------------
 *  Filter
 * -------------------*/
interface Filter {
  name: string
  value: string
}
const filterOptions: Filter[] = [
  { name: 'All', value: 'all' },
  { name: 'Hardware', value: 'hardware' },
  { name: 'Mobile', value: 'mobile' },
]

const clickFilter = (value: string) => {
  console.log('clickFilter', value)
}

const searchWallet = (payload: string) => {
  console.log('searchWallet', payload)
}
</script>

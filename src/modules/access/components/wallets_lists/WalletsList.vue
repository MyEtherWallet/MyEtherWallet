<template>
  <div>
    <h1 class="title5 mb-5">All Wallet Options</h1>
    <!-- Filter -->
    <nav
      class="flex gap-4 mb-5 flex-wrap"
      role="navigation"
      aria-label="Wallet filters"
    >
      <button
        v-for="filter in filterOptions"
        :key="filter.value"
        @click="clickFilter(filter)"
        class="bg-primary text-white text-center rounded-full py-1 px-4 min-w-[100px]"
      >
        {{ filter.name }}
      </button>
    </nav>
    <!-- Search -->
    <div class="mb-5 max-w-[600px]">
      <SearchInput @search="searchWallet" />
    </div>
    <!-- Wallets-->
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      role="grid"
    >
      <div
        v-for="wallet in displayWallets"
        :key="wallet.id"
        class="flex flex-col items-center bg-white p-4 rounded-lg hoverOpacityHasBG cursor-pointer"
        @click="clickWallet(wallet)"
        @keyup.enter="clickWallet(wallet)"
        role="gridcell"
      >
        <AsyncImg
          :asyncImg="wallet.iconUrl"
          :alt="wallet.name"
          class="rounded-lg"
          aria-hidden="true"
        />
        <p class="text-info pt-2">{{ wallet.name }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as rainndowWallets from '@rainbow-me/rainbowkit/wallets'
import type { Wallet } from '@rainbow-me/rainbowkit'
import AsyncImg from './AsyncImg.vue'
import SearchInput from './SearchInput.vue'
import { ROUTES_HOME } from '@/router/routeNames'
import IconKeystore from '@/assets/icons/software_wallets/icon-keystore-file.svg'
import IconMnemonic from '@/assets/icons/software_wallets/icon-mnemonic.svg'
import IconPrivateKey from '@/assets/icons/software_wallets/icon-private-key-grey.png'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
/** -------------------
 *  Rainbow Wallets
 * -------------------*/
const WC_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const DEFAULT_IDS = ['enkrypt', 'mew']
const wallets: Wallet[] = []
interface RainbowWalletOptions {
  projectId: string
}
type CreateWalletFn = (config: { projectId: RainbowWalletOptions }) => Wallet
const walletRecords = rainndowWallets as unknown as Record<
  string,
  CreateWalletFn
>

for (const key in walletRecords) {
  if (Object.prototype.hasOwnProperty.call(walletRecords, key)) {
    const _walletInstance = walletRecords[key]
    const _wallet = _walletInstance({ projectId: WC_PROJECT_ID })
    if (DEFAULT_IDS.includes(_wallet.id)) {
      wallets.unshift(_wallet)
    } else {
      wallets.push(_wallet)
    }
  }
}
/** -------------------
 *  Core Wallets
 * -------------------*/
interface CoreWallet {
  id: string
  name: string
  iconUrl: string
  routeName?: string
}

const softwareWallets: CoreWallet[] = [
  {
    id: 'keystore',
    name: 'Keystore',
    iconUrl: IconKeystore,
    routeName: ROUTES_HOME.ACCESS_KEYSTORE.NAME,
  },
  {
    id: 'mnemonic',
    name: 'Mnemonic phrase',
    iconUrl: IconMnemonic,
    routeName: ROUTES_HOME.ACCESS_MNEMONIC.NAME,
  },
  {
    id: 'privatekey',
    name: 'Private Key',
    iconUrl: IconPrivateKey,
    routeName: ROUTES_HOME.ACCESS_PRIVATE_KEY.NAME,
  },
]

const displayWallets = [...softwareWallets, ...wallets]

/** -------------------
 *  Click Wallet
 * -------------------*/
const router = useRouter()
const clickWallet = (wallet: Wallet | CoreWallet) => {
  if ('routeName' in wallet && wallet.routeName) {
    router.push({ name: wallet.routeName })
  }
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

const activeFilter = ref<Filter>(filterOptions[0])

const clickFilter = (_value: Filter) => {
  console.log('clickFilter', _value)
  activeFilter.value = _value
}

const searchWallet = (payload: string) => {
  console.log('searchWallet', payload)
}
</script>

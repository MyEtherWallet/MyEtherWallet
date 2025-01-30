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
    <fwb-modal size="sm" v-if="openWalletConnectModal" @close="closeModal">
      <template #header>
        <div class="w-full">
          <div class="items-center text-xl">Scan with WalletConnect</div>
        </div>
      </template>
      <template #body>
        <div>
          <img :src="qrcode" alt="Wagmi QR Code" />
        </div>
      </template>
    </fwb-modal>
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
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { wagmiConfig } from '@/providers/ethereum/wagmiConfig'
import * as rainndowWallets from '@rainbow-me/rainbowkit/wallets'
import WagmiWallet from '@/providers/ethereum/wagmiWallet'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { FwbModal } from 'flowbite-vue'

import AsyncImg from './AsyncImg.vue'
import SearchInput from './SearchInput.vue'
import { ROUTES_HOME } from '@/router/routeNames'
import IconKeystore from '@/assets/icons/software_wallets/icon-keystore-file.svg'
import IconMnemonic from '@/assets/icons/software_wallets/icon-mnemonic.svg'
import IconPrivateKey from '@/assets/icons/software_wallets/icon-private-key-grey.png'

const wagmiWalletData = ref('')
const openWalletConnectModal = ref(false)
const qrcode = useQRCode(wagmiWalletData, { width: 304 })
const { connectors } = wagmiConfig

const DEFAULT_IDS = ['enkrypt', 'mew']
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const allRainbowWallets = Object.values(rainndowWallets)

const initializedWallets = allRainbowWallets.map(wallet =>
  wallet({ projectId, appName: 'MEW' }),
)
interface WalletType {
  id: string
  name: string
  iconUrl: string | (() => Promise<string>)
}

const newWalletList = computed(() => {
  const newConArr: WalletType[] = []
  initializedWallets.forEach(wallet => {
    if (DEFAULT_IDS.includes(wallet.id)) {
      newConArr.unshift({
        id: wallet.id,
        name: wallet.name,
        iconUrl: wallet.iconUrl,
      })
    } else {
      newConArr.push({
        id: wallet.id,
        name: wallet.name,
        iconUrl: wallet.iconUrl,
      })
    }
  })
  return newConArr
})

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

const displayWallets = [...softwareWallets, ...newWalletList.value]

/** -------------------
 *  Click Wallet
 * -------------------*/
const router = useRouter()
const clickWallet = (wallet: WalletType | CoreWallet) => {
  if ('routeName' in wallet && wallet.routeName) {
    router.push({ name: wallet.routeName })
  } else {
    const connector = connectors.find(
      c =>
        c.id === wallet.id || (c.rkDetails as { id: string })?.id === wallet.id,
    )
    connector?.emitter.on('message', msg => {
      if (msg.type === 'display_uri') {
        wagmiWalletData.value = msg.data as string // possibly a temp fix
        openWalletConnectModal.value = true
      }
    })
    const wagWallet = new WagmiWallet(connector!, '0x1')
    wagWallet.connect().then(res => {
      if (res) {
        wagmiWalletData.value = ''
        openWalletConnectModal.value = false
      }
    })
  }
}

const closeModal = () => {
  openWalletConnectModal.value = false
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

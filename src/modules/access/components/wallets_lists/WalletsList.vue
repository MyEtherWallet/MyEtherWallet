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
        class="flex flex-col items-center bg-white p-4 rounded-lg hoverOpacityHasBG cursor-pointer relative"
        @click="clickWallet(wallet)"
        @keyup.enter="clickWallet(wallet)"
        role="gridcell"
      >
        <div>
          <div
            v-if="wallet.notRecommended"
            class="absolute top-0 right-0 bg-yellow-warning text-black text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg"
          >
            Not Recommended
          </div>
        </div>
        <AsyncImg
          :alt="wallet.name"
          :is-loaded="!isLoadingIcons"
          :cached-img="cachedIcons.get(wallet.id)"
          class="rounded-lg"
          aria-hidden="true"
        />
        <p class="text-info pt-2">{{ wallet.name }}</p>
      </div>
    </div>
    <WalletConnectDialog
      v-if="clickedWallet"
      v-model:is-open="openWalletConnectModal"
      :qrcode-data="wagmiWalletData"
      :wallet-name="clickedWallet.name"
      :wallet-icon="cachedIcons.get(clickedWallet.id)"
    />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { wagmiConfig } from '@/providers/ethereum/wagmiConfig'
import * as rainndowWallets from '@rainbow-me/rainbowkit/wallets'
import WagmiWallet from '@/providers/ethereum/wagmiWallet'
import WalletConnectDialog from '../WalletConnectDialog.vue'
import AsyncImg from './AsyncImg.vue'
import SearchInput from './SearchInput.vue'
import { ROUTES_HOME, ROUTES_WALLET } from '@/router/routeNames'
import IconKeystore from '@/assets/icons/software_wallets/icon-keystore-file.svg'
import IconMnemonic from '@/assets/icons/software_wallets/icon-mnemonic.svg'
import IconPrivateKey from '@/assets/icons/software_wallets/icon-private-key-grey.png'
import { useWalletStore } from '@/stores/walletStore'

interface WalletType {
  id: string
  name: string
  iconUrl: string | (() => Promise<string>)
  notRecommended?: boolean
}

const wagmiWalletData = ref('')
const openWalletConnectModal = ref(false)
const { connectors } = wagmiConfig
const DEFAULT_IDS = ['enkrypt', 'mew']
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const allRainbowWallets = Object.values(rainndowWallets)

const initializedWallets = allRainbowWallets.map(wallet =>
  wallet({ projectId, appName: 'MEW' }),
)

const clickedWallet = ref<WalletType | undefined>()

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
  notRecommended?: boolean
}

const softwareWallets: CoreWallet[] = [
  {
    id: 'keystore',
    name: 'Keystore',
    iconUrl: IconKeystore,
    routeName: ROUTES_HOME.ACCESS_KEYSTORE.NAME,
    notRecommended: true,
  },
  {
    id: 'mnemonic',
    name: 'Mnemonic phrase',
    iconUrl: IconMnemonic,
    routeName: ROUTES_HOME.ACCESS_MNEMONIC.NAME,
    notRecommended: true,
  },
  {
    id: 'privatekey',
    name: 'Private Key',
    iconUrl: IconPrivateKey,
    routeName: ROUTES_HOME.ACCESS_PRIVATE_KEY.NAME,
    notRecommended: true,
  },
]

const displayWallets = [...softwareWallets, ...newWalletList.value]

/**-------------------
 * Cached Wallet Icons
 -------------------*/
const cachedIcons = ref(new Map<string, string>())
const isLoadingIcons = ref(true)

/** -------------------
 * Wallet Store
 -------------------*/
const walletStore = useWalletStore()
const { setWallet } = walletStore

/** -------------------
 *  Click Wallet
 * -------------------*/
const router = useRouter()
const clickWallet = (wallet: WalletType | CoreWallet) => {
  if ('routeName' in wallet && wallet.routeName) {
    router.push({ name: wallet.routeName })
  } else {
    clickedWallet.value = wallet
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
        try {
          wagmiWalletData.value = ''
          openWalletConnectModal.value = false
          setWallet(wagWallet)
          router.push({ name: ROUTES_WALLET.DASHBOARD.NAME })
        } catch (error) {
          console.error('WalletConnect connect failed:', error)
        }
      }
    })
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

onMounted(async () => {
  for (const wallet of displayWallets) {
    if (typeof wallet.iconUrl === 'string') {
      cachedIcons.value.set(wallet.id, wallet.iconUrl)
    } else {
      const url = await wallet.iconUrl()
      cachedIcons.value.set(wallet.id, url)
    }
  }
  isLoadingIcons.value = false
})
</script>

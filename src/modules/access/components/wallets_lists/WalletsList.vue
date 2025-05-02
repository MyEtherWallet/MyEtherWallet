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
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-col-6 2xl:grid-cols-7 gap-4 md:gap-6"
    >
      <btn-wallet
        v-for="wallet in displayWallets"
        :key="wallet.id"
        :wallet="wallet"
        :cached-icons="cachedIcons"
        @clickWallet="clickWallet"
      ></btn-wallet>
    </div>
    <WalletConnectDialog
      v-if="clickedWallet"
      v-model:is-open="openWalletConnectModal"
      :qrcode-data="wagmiWalletData"
      :wallet-name="clickedWallet.name"
      :wallet-icon="undefined"
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
import SearchInput from './SearchInput.vue'
import { ROUTES_WALLET } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import Configs from '@/configs'
import BtnWallet from './BtnWallet.vue'
import {
  type WalletConfig,
  type defaultWalletId,
  walletConfigs,
} from '@/modules/access/common/walletConfigs'

const wagmiWalletData = ref('')
const openWalletConnectModal = ref(false)
const { connectors } = wagmiConfig

const DEFAULT_IDS = ['enkrypt', 'mew']
const projectId = Configs.WALLET_CONNECT_PROJECT_ID

/** -------------------
 * Wallets
 * -------------------*/
const allRainbowWallets = Object.values(rainndowWallets)

const initializedWallets = allRainbowWallets.map(wallet =>
  wallet({ projectId, appName: 'MEW' }),
)

const clickedWallet = ref<WalletConfig | undefined>()

const newWalletList = computed<WalletConfig[]>(() => {
  const newConArr: WalletConfig[] = []
  initializedWallets.forEach(wallet => {
    if (!DEFAULT_IDS.includes(wallet.id)) {
      const _type = wallet.extension
        ? 'web3'
        : wallet.mobile
          ? 'mobile'
          : undefined
      newConArr.push({
        ...wallet,
        id: wallet.id,
        name: wallet.name,
        icon: wallet.iconUrl,
        type: _type,
      })
    }
  })
  return newConArr
})

const defaultWallets = computed<WalletConfig[]>(() => {
  const defaultWallets: WalletConfig[] = []
  const keys = Object.keys(walletConfigs) as Array<defaultWalletId>
  keys.forEach(key => {
    const wallet = walletConfigs[key]
    if (wallet.isWC) {
      const wcWallet = initializedWallets.find(w => w.id === wallet.id)
      defaultWallets.push({
        ...wcWallet,
        ...wallet,
      })
    } else {
      defaultWallets.push(wallet)
    }
  })

  return defaultWallets
})
const displayWallets = computed(() => {
  const wallets: WalletConfig[] = []
  wallets.push(...defaultWallets.value)
  wallets.push(...newWalletList.value)
  return wallets
})

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
const clickWallet = (wallet: WalletConfig) => {
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
  initializedWallets.forEach(async wallet => {
    if (!DEFAULT_IDS.includes(wallet.id)) {
      if (typeof wallet.iconUrl === 'string') {
        cachedIcons.value.set(wallet.id, wallet.iconUrl)
      } else {
        const url = await wallet.iconUrl()
        cachedIcons.value.set(wallet.id, url)
      }
    }
  })
  isLoadingIcons.value = false
})
</script>

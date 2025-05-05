<template>
  <div>
    <h3 class="text-s-17 font-bold leading-p-150 mb-4 sm:ml-4">
      {{ $t('access_wallet.all_wallets.title') }}
      <span v-if="!isMobile" class="font-normal">
        • {{ $t('access_wallet.all_wallets.description') }}</span
      >
    </h3>
    <div class="flex mb-4 sm:mb-6 sm:justify-between items-center">
      <!-- Search and Sort -->
      <div
        class="flex grow gap-4 justify-between items-center bg-surface rounded-full p-1 max-w-[510px]"
      >
        <app-search-input v-model="searchInput" class="grow sm:max-w-[315px]" />
        <app-select
          v-model:selected="activeSort"
          :options="sortOptions"
          :placeholder="`${$t('common.sort_by')}:`"
        />
      </div>
      <!-- Filter -->
      <nav
        class="flex gap-4 flex-wrap"
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
    </div>

    <!-- Wallets-->
    <div
      v-if="displayWallets.length > 0"
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6"
    >
      <btn-wallet
        v-for="wallet in displayWallets"
        :key="wallet.id"
        :wallet="wallet"
        :cached-icons="cachedIcons"
        @clickWallet="clickWallet"
      ></btn-wallet>
    </div>
    <div
      v-else
      class="text-center text-s-17 leading-p-150 pt-8 sm:pt-16 min-h-[210px] text-info"
    >
      {{ $t('access_wallet.not_found') }} {{ searchInput }}
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
import AppSearchInput from '@components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import { type AppSelectOption } from '@/types/components/appSelect'
import { ROUTES_WALLET } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import Configs from '@/configs'
import BtnWallet from './BtnWallet.vue'
import {
  type WalletConfig,
  type defaultWalletId,
  walletConfigs,
} from '@/modules/access/common/walletConfigs'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isMobile } = useAppBreakpoints()
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
    if (!DEFAULT_IDS.includes(wallet.id) && wallet.id !== 'ledger') {
      // TODO: handle desktop type
      const _type =
        wallet.extension ||
        (wallet.hasOwnProperty('installed') && !wallet.extension)
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
    } else if (wallet.id === 'ledger') {
      newConArr.push({
        ...wallet,
        id: 'ledger-mobile',
        name: 'Ledger Mobile',
        icon: wallet.iconUrl,
        type: 'mobile',
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
      defaultWallets.push(Object.assign({}, wallet, wcWallet))
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
  if (searchInput.value) {
    const search = searchInput.value.toLowerCase()
    const beginsWith = wallets.filter(wallet => {
      return wallet.name.toLowerCase().startsWith(search)
    })
    const other = wallets.filter(wallet => {
      return (
        wallet.name.toLowerCase().includes(search) &&
        !wallet.name.toLowerCase().startsWith(search)
      )
    })

    return [...beginsWith, ...other]
  }
  if (activeSort.value.value === SortBy.A_Z) {
    wallets.sort((a, b) => a.name.localeCompare(b.name))
  }
  if (activeSort.value.value === SortBy.Z_A) {
    wallets.sort((a, b) => b.name.localeCompare(a.name))
  }
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
 *  Filter & Search & Sort
 * -------------------*/
const searchInput = ref('')

enum SortBy {
  POPULAR = 'popular',
  A_Z = 'a-z',
  Z_A = 'z-a',
}
const sortOptions: AppSelectOption[] = [
  { label: t('access_wallet.sort.popular'), value: SortBy.POPULAR },
  { label: t('access_wallet.sort.name_a_z'), value: SortBy.A_Z },
  { label: t('access_wallet.sort.name_z_a'), value: SortBy.Z_A },
]
const activeSort = ref<AppSelectOption>(sortOptions[0])

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

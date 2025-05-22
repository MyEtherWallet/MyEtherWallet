<template>
  <div>
    <div class="flex justify-between items-center gap-4 mb-4">
      <h3 class="text-s-17 font-bold leading-p-150 sm:ml-4">
        {{ $t('access_wallet.all_wallets.title') }}
        <span class="hidden sm:inline-block font-normal">
          • {{ $t('access_wallet.all_wallets.description') }}</span
        >
      </h3>
      <app-btn-icon
        :label="$t('access_wallet.sort_and_filter')"
        class="md-header:hidden"
        @click="openFilterSortModal = true"
      >
        <Bars3Icon class="h-6 w-6" />
      </app-btn-icon>
    </div>
    <div class="flex mb-4 sm:mb-6 justify-between items-center gap-4">
      <!-- Search and Sort -->
      <div
        class="flex grow gap-4 justify-between items-center bg-surface rounded-full p-1 md-header:max-w-[510px]"
      >
        <app-search-input
          v-model="searchInput"
          class="grow md-header:max-w-[315px]"
        />
        <app-select
          v-if="isHeaderMaxAndUp"
          v-model:selected="activeSort"
          :options="sortOptions"
          :placeholder="$t('common.sort_by')"
        />
      </div>
      <!-- Filter -->
      <app-btn-group
        v-if="isHeaderMaxAndUp"
        v-model:selected="activeFilter"
        :btn-list="filterOptions"
        :is-loaded="true"
      >
        <template #btn-content="{ data }">
          {{ data.name }}
        </template>
      </app-btn-group>
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
        @clickWallet="clickWallet"
      ></btn-wallet>
    </div>
    <div
      v-else
      class="text-center text-s-17 leading-p-150 pt-8 sm:pt-16 min-h-[210px] text-info"
    >
      {{ $t('access_wallet.not_found') }} {{ searchInput }}
    </div>

    <wallet-connect-dialog
      v-if="clickedWallet"
      v-model:is-open="openWalletConnectModal"
      :qrcode-data="wagmiWalletData"
      :wallet-name="clickedWallet.name"
      :wallet-icon="clickedWallet.icon as string"
    />
    <mobile-sort-filter
      v-if="!isHeaderMaxAndUp"
      :filter-options="filterOptions"
      :sort-options="sortOptions"
      v-model:active-filter="activeFilter"
      v-model:active-sort="activeSort"
      v-model:is-open="openFilterSortModal"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import WalletConnectDialog from '../WalletConnectDialog.vue'
import AppSearchInput from '@components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import MobileSortFilter from './MobileSortFilter.vue'
import { type AppSelectOption } from '@/types/components/appSelect'
import BtnWallet from './BtnWallet.vue'
import AppBtnGroup from '@components/AppBtnGroup.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import {
  type WalletConfig,
  SortBy,
  type Filter,
  WalletConfigType,
} from '@/modules/access/common/walletConfigs'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useI18n } from 'vue-i18n'
import { Bars3Icon } from '@heroicons/vue/24/solid'
import { useWagmiConnect } from '@/composables/useConnectWallet'
import { useWalletList } from '@/composables/useWalletList'

const { t } = useI18n()
const { isHeaderMaxAndUp } = useAppBreakpoints()
const { wagmiWalletData, openWalletConnectModal, connect, clickedWallet } =
  useWagmiConnect()

const { defaultWallets, newWalletList } = useWalletList()

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
  if (activeFilter.value.value === WalletConfigType.HARDWARE) {
    return wallets.filter(a =>
      a.type.some(type => type === WalletConfigType.HARDWARE),
    )
  }

  if (activeFilter.value.value === WalletConfigType.MOBILE) {
    return wallets.filter(a =>
      a.type.some(type => type === WalletConfigType.MOBILE),
    )
  }
  if (activeFilter.value.value === WalletConfigType.SOFTWARE) {
    return wallets.filter(a =>
      a.type.some(
        type =>
          type === WalletConfigType.SOFTWARE ||
          type === WalletConfigType.EXTENSION ||
          type === WalletConfigType.DESKTOP,
      ),
    )
  }
  return wallets
})

/** -------------------
 *  Click Wallet
 * -------------------*/
const clickWallet = (wallet: WalletConfig) => {
  connect(wallet)
}

/** -------------------
 *  Filter & Search & Sort
 * -------------------*/
const searchInput = ref('')

const sortOptions: AppSelectOption[] = [
  { label: t('access_wallet.sort.popular'), value: SortBy.POPULAR },
  { label: t('access_wallet.sort.name_a_z'), value: SortBy.A_Z },
  { label: t('access_wallet.sort.name_z_a'), value: SortBy.Z_A },
]
const activeSort = ref<AppSelectOption>(sortOptions[0])

const filterOptions: Filter[] = [
  { name: t('access_wallet.filter.all'), value: 'all' },
  {
    name: t('access_wallet.filter.hardware'),
    value: WalletConfigType.HARDWARE,
  },
  { name: t('access_wallet.filter.mobile'), value: WalletConfigType.MOBILE },
  {
    name: t('access_wallet.filter.software'),
    value: WalletConfigType.SOFTWARE,
  },
]

const activeFilter = ref<Filter>(filterOptions[0])
const openFilterSortModal = ref(false)

watch(isHeaderMaxAndUp, val => {
  if (val && openFilterSortModal.value) {
    openFilterSortModal.value = false
  }
})
</script>

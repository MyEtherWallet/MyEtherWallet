<template>
  <div>
    <h2 class="text-s-28 font-semibold mb-2 md:ml-3">
      {{ $t('access_wallet.select_wallet') }}
    </h2>
    <div
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md-header:grid-cols-5 gap-4 sm:gap-5"
    >
      <!-- RECENTLY USED WALLETS -->
      <btn-wallet
        v-for="wallet in reversedRecentWallets"
        :key="wallet.id"
        :wallet="wallet"
        is-recent
        @clickWallet="clickDefaultWallet"
      ></btn-wallet>

      <btn-wallet
        v-for="wallet in defaultWallets"
        :key="wallet.id"
        :wallet="wallet"
        @clickWallet="clickDefaultWallet"
      ></btn-wallet>
      <btn-wallet
        v-for="wallet in detectedWalletsToConfigs"
        :key="wallet.id"
        :wallet="wallet"
        is-detected
        @clickWallet="clickDefaultWallet"
      ></btn-wallet>

      <dont-have-wallet />
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DontHaveWallet from './DontHaveWallet.vue'
import {
  type WalletConfig,
  walletConfigs,
  type defaultWalletId,
} from '@/modules/access/common/walletConfigs'
import BtnWallet from './BtnWallet.vue'
import { useConnectWallet } from '@/modules/access/composables/useConnectWallet'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { useProviderStore } from '@/stores/providerStore'
import { useWalletList } from '@/composables/useWalletList'
import { computed } from 'vue'
import { useAccessStore } from '@/stores/accessStore'

const { connect } = useConnectWallet()

const { newWalletList } = useWalletList()
const recentWalletsStore = useRecentWalletsStore()
const providerStore = useProviderStore()
const { recentWallets } = storeToRefs(recentWalletsStore)
const { providers } = storeToRefs(providerStore)
const accessStore = useAccessStore()
const { selectedChain } = storeToRefs(accessStore)

const reversedRecentWallets = computed(() => {
  return recentWallets.value
    .filter(wallet => {
      // Check if wallet exists in walletConfigs
      const config = walletConfigs[wallet.id as defaultWalletId]
      if (config?.canSupport && selectedChain.value) {
        // Use canSupport to filter
        return config.canSupport(selectedChain.value)
      }
      // If no canSupport (dynamic wallet like MetaMask), only show for EVM chains
      return selectedChain.value?.type === 'EVM'
    })
    .slice()
    .reverse()
})

const keys = Object.keys(walletConfigs) as Array<keyof typeof walletConfigs>

const isMockAvailable = newWalletList.value.find(nw => nw.id === 'mock')

const defaultWallets = computed(() => {
  const recentIds = reversedRecentWallets.value.map(r => r.name)
  return keys
    .filter(key => {
      if (recentIds.includes(walletConfigs[key].name)) return false
      if (isMockAvailable && walletConfigs[key].id === 'mock') return true
      return (
        walletConfigs[key].isDefault === true &&
        selectedChain.value &&
        walletConfigs[key].canSupport!(selectedChain.value)
      )
    })
    .map(key => {
      return walletConfigs[key]
    })
})

const detectedWalletsToConfigs: WalletConfig[] = newWalletList.value.filter(
  wallet => {
    const inProviders = providers.value.find(
      _provider => _provider.info.name === wallet.name,
    )
    const inRecent = recentWallets.value.find(
      recent => recent.name === wallet.name,
    )
    const inDefault = defaultWallets.value.find(
      recent => recent.name === wallet.name,
    )
    if (inProviders && !inRecent && !inDefault) {
      return wallet
    }
  },
)

const clickDefaultWallet = (wallet: WalletConfig) => {
  connect(wallet)
}
</script>

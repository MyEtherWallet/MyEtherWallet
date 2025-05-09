<template>
  <div>
    <h2 class="text5 font-semibold mb-4 md:ml-4">
      {{ $t('access_wallet.select_wallet') }}
    </h2>
    <div
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6"
    >
      <!-- RECENTLY USED WALLETS -->
      <btn-wallet
        v-for="wallet in recentWallets"
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

      <dont-have-wallet />
    </div>
    <wallet-connect-dialog
      v-if="clickedWallet"
      v-model:is-open="openWalletConnectModal"
      :qrcode-data="wagmiWalletData"
      :wallet-name="clickedWallet.name"
      :wallet-icon="clickedWallet.icon"
    />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import WalletConnectDialog from '../WalletConnectDialog.vue'
import DontHaveWallet from './DontHaveWallet.vue'
import {
  type WalletConfig,
  walletConfigs,
} from '@/modules/access/common/walletConfigs'
import BtnWallet from './BtnWallet.vue'
import { useWagmiConnect } from '@/composables/useWagmiConnect'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { useProviderStore } from '@/stores/providerStore'
import { useWalletList } from '@/composables/useWalletList'

const { wagmiWalletData, openWalletConnectModal, connect, clickedWallet } =
  useWagmiConnect()

const { newWalletList } = useWalletList()
const recentWalletsStore = useRecentWalletsStore()
const providerStore = useProviderStore()
const { recentWallets } = storeToRefs(recentWalletsStore)
const { providers } = storeToRefs(providerStore)

const keys = Object.keys(walletConfigs) as Array<keyof typeof walletConfigs>

const detectedWalletsToConfigs: WalletConfig[] = []
newWalletList.value.forEach(wallet => {
  providers.value.forEach(_provider => {
    if (wallet.name === _provider.info.name) {
      detectedWalletsToConfigs.push(wallet)
    }
  })
})

const defaultWallets = keys
  .filter(key => {
    return walletConfigs[key].isDefault === true
  })
  .map(key => {
    return walletConfigs[key]
  })
  .concat(...detectedWalletsToConfigs)

const clickDefaultWallet = (wallet: WalletConfig) => {
  connect(wallet)
}
</script>

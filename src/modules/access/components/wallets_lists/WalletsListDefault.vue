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
      :wallet-icon="clickedWallet.icon as string"
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

const { wagmiWalletData, openWalletConnectModal, connect, clickedWallet } =
  useWagmiConnect()

const recentWalletsStore = useRecentWalletsStore()
const { recentWallets } = storeToRefs(recentWalletsStore)

const keys = Object.keys(walletConfigs) as Array<keyof typeof walletConfigs>
const defaultWallets = keys
  .filter(key => {
    return walletConfigs[key].isDefault === true
  })
  .map(key => {
    return walletConfigs[key]
  })

const clickDefaultWallet = (wallet: WalletConfig) => {
  connect(wallet)
}
</script>

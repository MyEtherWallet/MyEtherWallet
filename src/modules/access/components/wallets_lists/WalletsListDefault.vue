<template>
  <div>
    <h2 class="text5 font-semibold mb-4 md:ml-4">
      {{ $t('access_wallet.select_wallet') }}
    </h2>
    <div
      :class="
        isOpenSideMenu
          ? 'lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6'
          : 'lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-7'
      "
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4 md:gap-6"
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
import { useConnectWallet } from '@/modules/access/composables/useConnectWallet'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { useProviderStore } from '@/stores/providerStore'
import { useWalletList } from '@/composables/useWalletList'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

const { wagmiWalletData, openWalletConnectModal, connect, clickedWallet } =
  useConnectWallet()

const { newWalletList } = useWalletList()
const recentWalletsStore = useRecentWalletsStore()
const providerStore = useProviderStore()
const { recentWallets } = storeToRefs(recentWalletsStore)
const { providers } = storeToRefs(providerStore)

const reversedRecentWallets = recentWallets.value.slice().reverse()

const keys = Object.keys(walletConfigs) as Array<keyof typeof walletConfigs>

const detectedWalletsToConfigs: WalletConfig[] = newWalletList.value.filter(
  wallet => {
    const inProviders = providers.value.find(
      _provider => _provider.info.name === wallet.name,
    )
    const inRecent = recentWallets.value.find(
      recent => recent.name === wallet.name,
    )
    if (inProviders && !inRecent) {
      return wallet
    }
  },
)

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

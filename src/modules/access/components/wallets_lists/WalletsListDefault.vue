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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import WalletConnectDialog from '../WalletConnectDialog.vue'
import DontHaveWallet from './DontHaveWallet.vue'
import {
  type WalletConfig,
  walletConfigs,
  WalletConfigType,
} from '@/modules/access/common/walletConfigs'
import BtnWallet from './BtnWallet.vue'
import { useWagmiConnect } from '@/composables/useWagmiConnect'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { useProviderStore } from '@/stores/providerStore'
import * as raindbowkitWallet from '@rainbow-me/rainbowkit/wallets'
import Configs from '@/configs'
const projectId = Configs.WALLET_CONNECT_PROJECT_ID

const { wagmiWalletData, openWalletConnectModal, connect, clickedWallet } =
  useWagmiConnect()

const recentWalletsStore = useRecentWalletsStore()
const providerStore = useProviderStore()
const { recentWallets } = storeToRefs(recentWalletsStore)
const { providers } = storeToRefs(providerStore)

const DEFAULT_IDS = ['enkrypt', 'mew']
const keys = Object.keys(walletConfigs) as Array<keyof typeof walletConfigs>
const allWallets = Object.values(raindbowkitWallet)
const initializedWallets = allWallets.map(wallet =>
  wallet({ projectId, appName: 'MEW' }),
)

const newWalletList = computed<WalletConfig[]>(() => {
  const newConArr: WalletConfig[] = []
  initializedWallets.forEach(wallet => {
    if (!DEFAULT_IDS.includes(wallet.id) && wallet.id !== 'ledger') {
      const _types: WalletConfigType[] = []
      if (
        wallet.extension ||
        (wallet.hasOwnProperty('installed') && !wallet.extension)
      ) {
        _types.push(WalletConfigType.EXTENSION)
      }
      if (wallet.mobile || wallet.qrCode) {
        _types.push(WalletConfigType.MOBILE)
      }
      if (wallet.desktop) {
        _types.push(WalletConfigType.DESKTOP)
      }

      newConArr.push({
        ...wallet,
        id: wallet.id,
        name: wallet.name,
        icon: wallet.iconUrl,
        type: _types,
      })
    } else if (wallet.id === 'ledger') {
      newConArr.push({
        ...wallet,
        id: 'ledger-mobile',
        name: 'Ledger Mobile',
        icon: wallet.iconUrl,
        type: [WalletConfigType.MOBILE],
      })
    }
  })
  return newConArr
})
const detectedWalletsToConfigs = []
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

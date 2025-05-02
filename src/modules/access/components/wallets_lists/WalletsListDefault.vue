<template>
  <div>
    <h2 class="text5 font-semibold mb-4 md:ml-4">
      {{ $t('access_wallet.select_wallet') }}
    </h2>
    <div
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-col-6 2xl:grid-cols-7 gap-4 md:gap-6"
    >
      <button
        v-for="wallet in defaultWallets"
        :key="wallet.id"
        class="flex flex-col gap-2 justify-stretch bg-white p-2 rounded-20 hoverNoBG cursor-pointer shadow-button"
        @click="clickDefaultWallet(wallet)"
      >
        <div class="flex-1 flex items-center justify-stretch gap-2">
          <img
            v-if="wallet.isOfficial"
            :src="OfficialBadge"
            alt="Official MyEtherWallet"
            width="20px"
            height="68px"
            class="w-[68px] h-5"
          />
          <img
            v-if="getBadge(wallet)"
            :src="getBadge(wallet)"
            alt=""
            width="20px"
            height="20px"
            class="w-5 h-5 ml-auto"
          />
        </div>
        <div
          class="mx-auto ounded-lg mx-auto w-[64px] h-[64px] md:w-[80px] md:h-[80px] md:my-5"
        >
          <AsyncImg
            v-if="!wallet.isDefault"
            :asyncImg="wallet.icon"
            :alt="wallet.name"
            class="rounded-lg mx-auto"
          />
          <img
            v-else
            :src="wallet.icon"
            :alt="wallet.name"
            width="160"
            height="160"
            class="w-[64px] h-[64px] md:w-[80px] md:h-[80px] flex-none rounded-lg mx-auto"
          />
        </div>

        <p class="mb-4 text-s-15 font-medium leading-p-150">
          {{ wallet.name }}
        </p>
      </button>
      <dont-have-wallet />
    </div>
  </div>
</template>
<script setup lang="ts">
import AsyncImg from './AsyncImg.vue'
import DontHaveWallet from './DontHaveWallet.vue'
import MobileBadge from '@/assets/images/access/wallet_types/mobileWallet.webp'
import HardwareBadge from '@/assets/images/access/wallet_types/hardwareWallet.webp'
import WebBadge from '@/assets/images/access/wallet_types/web3Wallet.webp'
import OfficialBadge from '@/assets/images/common/official_badge.webp'
import {
  type WalletConfig,
  walletConfigs,
} from '@/modules/access/common/walletConfigs'

const keys = Object.keys(walletConfigs) as Array<keyof typeof walletConfigs>

const defaultWallets = keys
  .filter(key => {
    return walletConfigs[key].isDefault === true
  })
  .map(key => {
    return walletConfigs[key]
  })

const clickDefaultWallet = (wallet: WalletConfig) => {
  console.log('clickDefaultWallet', wallet.id)
}

const getBadge = (wallet: WalletConfig) => {
  if (wallet.type === 'mobile') {
    return MobileBadge
  } else if (wallet.type === 'hardware') {
    return HardwareBadge
  } else if (wallet.type === 'web3') {
    return WebBadge
  }
  return undefined
}
</script>

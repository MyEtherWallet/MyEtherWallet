<template>
  <button
    class="flex flex-col gap-2 justify-stretch bg-white p-2 rounded-20 hoverNoBG cursor-pointer shadow-button"
    @click="clickDefaultWallet(wallet)"
  >
    <div class="w-full flex items-center justify-stretch gap-2 h-5">
      <img
        v-if="wallet.isOfficial"
        :src="OfficialBadge"
        alt="Official MyEtherWallet"
        height="20px"
        width="68px"
        class="w-[68px] h-5"
      />
      <h5
        v-if="isRecent"
        class="text-s-11 font-bold pl-[5px] leading-p-100 tracking-sp-00"
      >
        {{ $t('access_wallet.recent') }}
      </h5>
      <h5
        v-if="isDetected"
        class="text-s-11 font-bold pl-[5px] leading-p-100 tracking-sp-00"
      >
        {{ $t('access_wallet.detected') }}
      </h5>
      <div class="flex grow item-center justify-end">
        <div v-for="(type, index) in wallet.type" :key="index">
          <img
            v-if="getBadge(type)"
            :src="getBadge(type)"
            alt=""
            width="20"
            height="20"
            class="w-5 h-5 justify-self-end"
          />
        </div>
      </div>
    </div>
    <div
      class="mx-auto mx-auto w-[64px] h-[64px] md:w-[80px] md:h-[80px] md:my-5"
    >
      <AsyncImg
        :img="img"
        :is-loaded="isLoadedImg"
        :alt="wallet.name"
        class="rounded-lg mx-auto"
      />
    </div>

    <p class="mb-4 text-s-15 font-medium leading-p-150 text-center mx-auto">
      {{ wallet.name }}
    </p>
  </button>
</template>
<script setup lang="ts">
import AsyncImg from './AsyncImg.vue'
import MobileBadge from '@/assets/images/access/wallet_types/mobileWallet.webp'
import HardwareBadge from '@/assets/images/access/wallet_types/hardwareWallet.webp'
import ExtensionBadge from '@/assets/images/access/wallet_types/web3Wallet.webp'
import OfficialBadge from '@/assets/images/common/official_badge.webp'
import {
  type WalletConfig,
  WalletConfigType,
} from '@/modules/access/common/walletConfigs'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  wallet: WalletConfig
  isRecent?: boolean
  isDetected?: boolean
}>()

const emit = defineEmits<{
  (e: 'clickWallet', wallet: WalletConfig): void
}>()

const clickDefaultWallet = (wallet: WalletConfig) => {
  emit('clickWallet', wallet)
}

const getBadge = (type: WalletConfigType) => {
  if (type === WalletConfigType.MOBILE) {
    return MobileBadge
  }
  if (type === WalletConfigType.HARDWARE) {
    return HardwareBadge
  }
  if (type === WalletConfigType.EXTENSION) {
    return ExtensionBadge
  }
  return undefined
}
const checkIfIsString = (value: string | (() => Promise<string>)) => {
  return typeof value === 'string'
}

const isLoadedImg = ref(false)
const img = ref<string | undefined>(undefined)
const resolveImg = async (_img: () => Promise<string>) => {
  try {
    const image = await _img()
    img.value = image
    isLoadedImg.value = true
  } catch (error) {
    console.error('Error loading image: ', error)
    return ''
  }
}
onMounted(() => {
  if (checkIfIsString(props.wallet.icon)) {
    img.value = props.wallet.icon as string
    isLoadedImg.value = true
  } else {
    resolveImg(props.wallet.icon as () => Promise<string>)
  }
})
</script>

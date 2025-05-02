<template>
  <button
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
        :img="img"
        :is-loaded="isLoadedImg"
        :alt="wallet.name"
        class="rounded-lg mx-auto"
      />
    </div>

    <p class="mb-4 text-s-15 font-medium leading-p-150">
      {{ wallet.name }}
    </p>
  </button>
</template>
<script setup lang="ts">
import AsyncImg from './AsyncImg.vue'
import MobileBadge from '@/assets/images/access/wallet_types/mobileWallet.webp'
import HardwareBadge from '@/assets/images/access/wallet_types/hardwareWallet.webp'
import WebBadge from '@/assets/images/access/wallet_types/web3Wallet.webp'
import OfficialBadge from '@/assets/images/common/official_badge.webp'
import { type WalletConfig } from '@/modules/access/common/walletConfigs'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  wallet: WalletConfig
}>()

const emit = defineEmits<{
  (e: 'clickWallet', wallet: WalletConfig): void
}>()

const clickDefaultWallet = (wallet: WalletConfig) => {
  emit('clickWallet', wallet)
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

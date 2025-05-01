<template>
  <div>
    <div
      class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg-max:grid-cols-7 gap-4 md:gap-6"
    >
      <div
        v-for="wallet in wallets"
        :key="wallet.id"
        class="flex flex-col gap-2 items-center bg-white p-4 rounded-20 hoverOpacityHasBG cursor-pointer"
        @click="clickDefaultWallet(wallet)"
      >
        <AsyncImg
          :asyncImg="wallet.iconUrl"
          :alt="wallet.name"
          class="rounded-lg"
        />
        <p>{{ wallet.name }}</p>

        <div class="p-2 bg-primary text-white rounded-lg mt-auto">
          {{ wallet.bttnText }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import AsyncImg from './AsyncImg.vue'
import ImgMewWallet from '@assets/images/mewwallet/icon-mew-wallet.png'
import ImgEnkrypt from '@assets/images/enkrypt/icon-enkrypt.svg'
interface Wallet {
  id: string
  name: string
  iconUrl: string
  bttnText: string
}
const wallets: Wallet[] = [
  {
    id: 'mobile',
    name: 'MEW Mobile App',
    iconUrl: ImgMewWallet,
    bttnText: 'Connect',
  },
  {
    id: 'enkrypt',
    name: 'Enkrypt',
    iconUrl: ImgEnkrypt,
    bttnText: 'Connect',
  },
  {
    id: 'watch',
    name: 'Watch Only',
    iconUrl: ImgEnkrypt,
    bttnText: 'View',
  },
]

const clickDefaultWallet = (wallet: Wallet) => {
  console.log('clickDefaultWallet', wallet.id)
}
</script>

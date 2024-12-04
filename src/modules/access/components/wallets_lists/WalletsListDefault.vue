<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="wallet in wallets"
        :key="wallet.id"
        class="flex flex-col gap-2 items-center bg-white p-4 rounded-lg hoverOpacityHasBG cursor-pointer"
        @click="clickDefaultWallet(wallet)"
      >
        <AsyncImg
          :asyncImg="wallet.iconUrl"
          :alt="wallet.name"
          class="rounded-lg"
        />
        <p>{{ wallet.name }}</p>
        <p class="text-center mb-5">{{ wallet.desc }}</p>
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
  desc: string
  bttnText: string
}
const wallets: Wallet[] = [
  {
    id: 'mobile',
    name: 'MEW Mobile App',
    desc: 'Connect to your portfolio using the MEW mobile app.',
    iconUrl: ImgMewWallet,
    bttnText: 'Connect',
  },
  {
    id: 'enkrypt',
    name: 'Enkrypt',
    desc: 'Connect to your portfolio using our Enkrypt wallet.',
    iconUrl: ImgEnkrypt,
    bttnText: 'Connect',
  },
  {
    id: 'watch',
    name: 'Watch Only',
    desc: '',
    iconUrl: ImgEnkrypt,
    bttnText: 'View',
  },
]

const clickDefaultWallet = (wallet: Wallet) => {
  console.log('clickDefaultWallet', wallet.id)
}
</script>

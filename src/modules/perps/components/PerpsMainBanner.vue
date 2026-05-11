<template>
  <div
    class="bg-white rounded-20 overflow-hidden relative p-5 sm:py-14 lg:py-20 lg:px-10"
  >
    <!-- Mobile / tablet: logos in a centered row above the content -->
    <div class="flex items-center justify-center gap-2 mb-6 sm:mb-10 lg:hidden">
      <img :src="amazonLogo" alt="" class="w-7 h-7" />
      <img :src="amdLogo" alt="" class="w-7 h-7" />
      <img :src="coinbaseLogo" alt="" class="w-7 h-7" />
      <img :src="appleLogo" alt="" class="w-7 h-7" />
    </div>

    <!--
      Desktop: one container per side, each holding a vertical track of 3
      logos (top peek + bottom peek + one hidden offscreen). Containers span
      the full banner height (inset-y-0) so the track's translate distance
      equals one banner step; overflow-hidden clips logos at the banner's
      top/bottom edges (~32px overflow each side) while leaving them fully
      visible horizontally.
      - Left track at rest: logo A peeks above, logo B peeks below, logo C
        hidden below banner. On CTA hover the track translates UP one step:
        A exits past top, B replaces A's slot, C reveals at B's slot.
      - Right track mirrors: A and B visible, C hidden above. On CTA hover
        the track translates DOWN one step (opposite direction), shifting C
        into the top slot and A into the bottom slot.
    -->
    <div
      class="hidden lg:block absolute inset-y-0 left-20 w-32 overflow-hidden"
    >
      <div
        class="relative h-full transition-transform duration-500 ease-out"
        :style="{
          transform: isHoveringCta
            ? 'translateY(calc(-100% + 4rem))'
            : 'translateY(0)',
        }"
      >
        <img
          :src="appleLogo"
          alt=""
          class="absolute -top-8 left-0 w-32 h-32"
        />
        <img
          :src="coinbaseLogo"
          alt=""
          class="absolute -bottom-8 left-0 w-32 h-32"
        />
        <img
          :src="hoodLogo"
          alt=""
          class="absolute left-0 w-32 h-32"
          style="top: calc(200% - 10rem)"
        />
      </div>
    </div>
    <div
      class="hidden lg:block absolute inset-y-0 right-20 w-32 overflow-hidden"
    >
      <div
        class="relative h-full transition-transform duration-500 ease-out"
        :style="{
          transform: isHoveringCta
            ? 'translateY(calc(100% - 4rem))'
            : 'translateY(0)',
        }"
      >
        <img
          :src="amdLogo"
          alt=""
          class="absolute -bottom-8 left-0 w-32 h-32"
        />
        <img
          :src="amazonLogo"
          alt=""
          class="absolute -top-8 left-0 w-32 h-32"
        />
        <img
          :src="googleLogo"
          alt=""
          class="absolute left-0 w-32 h-32"
          style="top: calc(-100% + 2rem)"
        />
      </div>
    </div>

    <div class="relative text-center max-w-[560px] mx-auto">
      <p
        class="text-primary font-bold text-s-11 uppercase tracking-sp-06 mb-3"
      >
        – Sign in to your portfolio –
      </p>
      <h2
        class="font-bold text-s-24 sm:text-s-28 xl:text-s-32 mb-3 leading-p-110"
      >
        Trade Perpetual Futures
      </h2>
      <p class="text-info text-s-14 sm:text-s-16 mb-6">
        Up to 20x leverage, 24/7 on leading U.S. stocks, ETFs, and
        commodities. Powered by Ondo perps.
      </p>

      <div class="flex justify-center">
        <template v-if="!isWalletConnected || isWatchOnly">
          <app-base-button
            class="w-full lg:w-auto lg:px-10"
            @click="onConnectWallet"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            Connect Wallet
          </app-base-button>
        </template>
        <template v-else-if="isBitcoinChain">
          <!-- TODO: MEW-1741 — distinguish unisat (unsupported, prompt to download Enkrypt) vs enkrypt-with-EVM-already-connected (auto-switch) per spec -->
          <app-base-button
            class="w-full lg:w-auto lg:px-10"
            @click="onSwitchToEthereum"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            Switch to Ethereum
          </app-base-button>
        </template>
        <template v-else>
          <app-base-button
            class="w-full lg:w-auto lg:px-10"
            :is-loading="isAuthenticating"
            @click="login"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            Sign in
          </app-base-button>
        </template>
      </div>

      <p v-if="isBitcoinChain" class="text-info text-s-12 mt-3">
        Perpetuals are available on Ethereum. Switch network to continue.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppBaseButton from '@/components/AppBaseButton.vue'
import amazonLogo from '@/assets/icons/perps-banner/amazon.svg'
import amdLogo from '@/assets/icons/perps-banner/amd.svg'
import appleLogo from '@/assets/icons/perps-banner/apple.svg'
import coinbaseLogo from '@/assets/icons/perps-banner/coinbase.svg'
import googleLogo from '@/assets/icons/perps-banner/google.svg'
import hoodLogo from '@/assets/icons/perps-banner/hood.svg'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { usePerpsAuth } from '../composables/usePerpsAuth'

const walletStore = useWalletStore()
const { isWalletConnected, isWatchOnly } = storeToRefs(walletStore)
const chainsStore = useChainsStore()
const { isBitcoinChain } = storeToRefs(chainsStore)
const accessStore = useAccessStore()
const globalStore = useGlobalStore()
const toastStore = useToastStore()
const { login, isAuthenticating } = usePerpsAuth()

const isHoveringCta = ref(false)

const onConnectWallet = () => {
  accessStore.openAccessDialog()
}

const onSwitchToEthereum = () => {
  globalStore.setSelectedNetwork('ETHEREUM')
  toastStore.addToastMessage({
    text: 'Switched to Ethereum',
    textSecondary: 'Perpetuals are only available on Ethereum.',
    type: ToastType.Info,
  })
}
</script>

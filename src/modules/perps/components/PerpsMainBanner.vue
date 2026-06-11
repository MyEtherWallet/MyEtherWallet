<template>
  <div
    class="bg-white rounded-20 overflow-hidden relative p-5 sm:py-14 lg:py-20 lg:px-10"
  >
    <perps-signing-prompt
      :show="showSigningPrompt"
      :message="signingMessage"
      :is-hardware-wallet="isHardwareWalletSigning"
      :is-waiting-for-confirm="isWaitingForConfirm"
      @confirm="confirmSign"
      @cancel="cancelSign"
    />
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
        <img :src="appleLogo" alt="" class="absolute -top-8 left-0 w-32 h-32" />
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

    <div class="relative text-center mx-auto">
      <p class="text-primary font-bold text-s-11 uppercase tracking-sp-06 mb-3">
        – Sign in to your portfolio –
      </p>
      <h2
        class="font-bold text-s-28 lg:text-s-32 xl:text-s-40 mb-3 leading-p-110"
      >
        Trade Perpetual Futures
      </h2>
      <p class="text-info text-s-14 sm:text-s-16 mb-6 max-w-[445px] mx-auto">
        Up to 20x leverage, 24/7 on leading U.S. stocks, ETFs, and commodities.
        Powered by Ondo perps.
      </p>

      <div class="flex justify-center">
        <template v-if="!isOnEthereum && isUnisatWallet">
          <app-base-button
            class="w-full lg:w-auto lg:px-10 xs:max-w-[300px] lg:max-w-none"
            @click="onDownloadEnkrypt"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            Download Enkrypt
          </app-base-button>
        </template>
        <template v-else-if="!isOnEthereum">
          <app-base-button
            class="w-full lg:w-auto lg:px-10 xs:max-w-[300px] lg:max-w-none"
            @click="onSwitchToEthereum"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            Switch to Ethereum
          </app-base-button>
        </template>
        <template v-else-if="!isWalletConnected || isWatchOnly">
          <app-base-button
            class="w-full lg:w-auto lg:px-10"
            @click="onConnectWallet"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            Connect Wallet
          </app-base-button>
        </template>
        <template v-else>
          <app-base-button
            class="w-full lg:w-auto lg:px-10 xs:max-w-[300px] lg:max-w-none"
            :is-loading="isAuthenticating"
            @click="login(PerpsEventSource.MAIN_BANNER)"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            Sign in
          </app-base-button>
        </template>
      </div>

      <p
        v-if="!isOnEthereum && isUnisatWallet"
        class="text-info text-s-12 mt-3"
      >
        UniSat doesn't support Perpetuals. Install Enkrypt or connect a
        different wallet to continue.
      </p>
      <p v-else-if="!isOnEthereum" class="text-info text-s-13 mt-3">
        Perpetuals feature is only available on the Ethereum network
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import AppBaseButton from '@/components/AppBaseButton.vue'
import PerpsSigningPrompt from './PerpsSigningPrompt.vue'
import amazonLogo from '@/assets/icons/perps-banner/amazon.svg'
import amdLogo from '@/assets/icons/perps-banner/amd.svg'
import appleLogo from '@/assets/icons/perps-banner/apple.svg'
import coinbaseLogo from '@/assets/icons/perps-banner/coinbase.svg'
import googleLogo from '@/assets/icons/perps-banner/google.svg'
import hoodLogo from '@/assets/icons/perps-banner/hood.svg'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { usePerpsAuth } from '../composables/usePerpsAuth'
import { analytics, ConnectWalletEvent, PerpsEventSource } from '@/analytics'

const walletStore = useWalletStore()
const { isWalletConnected, isWatchOnly, walletName } = storeToRefs(walletStore)
const accessStore = useAccessStore()
const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)
const toastStore = useToastStore()
const {
  login,
  isAuthenticating,
  showSigningPrompt,
  signingMessage,
  isHardwareWalletSigning,
  isWaitingForConfirm,
  confirmSign,
  cancelSign,
} = usePerpsAuth()

const isOnEthereum = computed(() => selectedNetwork.value === 'ETHEREUM')

const isHoveringCta = ref(false)

const isUnisatWallet = computed(
  () => walletName.value?.toLowerCase() === 'unisat',
)

const onConnectWallet = () => {
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: PerpsEventSource.MAIN_BANNER,
  })
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

const onDownloadEnkrypt = () => {
  window.open('https://enkrypt.com', '_blank', 'noopener,noreferrer')
}
</script>

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
        {{ $t('perps.banner.sign-in-prompt') }}
      </p>
      <h2
        class="font-bold text-s-28 lg:text-s-32 xl:text-s-40 mb-3 leading-p-110"
      >
        {{ $t('perps.banner.title') }}
      </h2>
      <p class="text-info text-s-14 sm:text-s-16 mb-6 max-w-[445px] mx-auto">
        {{ $t('perps.banner.description') }}
      </p>

      <div class="flex justify-center">
        <!--
          Restricted regions collapse all four CTA branches into one disabled
          button. Nothing the other branches offer — download Enkrypt, switch to
          Ethereum, connect a wallet — makes perps available here, so every one
          of them would be a dead end. The label matches the design's mock.
          Wallets can still be connected from the header.
        -->
        <template v-if="isPerpsRestricted">
          <app-base-button
            class="w-full lg:w-auto lg:px-10 xs:max-w-[300px] lg:max-w-none"
            disabled
          >
            {{ $t('perps.banner.sign-in-button') }}
          </app-base-button>
        </template>
        <template v-else-if="!isOnEthereum && isUnisatWallet">
          <app-base-button
            class="w-full lg:w-auto lg:px-10 xs:max-w-[300px] lg:max-w-none"
            @click="onDownloadEnkrypt"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            {{ $t('perps.banner.download-enkrypt') }}
          </app-base-button>
        </template>
        <template v-else-if="!isOnEthereum">
          <app-base-button
            class="w-full lg:w-auto lg:px-10 xs:max-w-[300px] lg:max-w-none"
            @click="onSwitchToEthereum"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            {{ $t('perps.trade.switch-to-ethereum') }}
          </app-base-button>
        </template>
        <template v-else-if="!isWalletConnected || isWatchOnly">
          <app-base-button
            class="w-full lg:w-auto lg:px-10"
            @click="onConnectWallet"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            {{ $t('perps.banner.connect-wallet-button') }}
          </app-base-button>
        </template>
        <!--
          Signing in hits the perps service, so during an outage it is disabled
          rather than prompting for a signature the backend cannot redeem.
          PerpsStatusBanner above already says the service is down.

          Only this branch is gated: the connect-wallet branch above stays live
          during an outage, since connecting is a wallet-side action that never
          touches the perps service.
        -->
        <template v-else>
          <app-base-button
            class="w-full lg:w-auto lg:px-10 xs:max-w-[300px] lg:max-w-none"
            :is-loading="isAuthenticating"
            :disabled="isServiceUnavailable"
            @click="login(PerpsEventSource.MAIN_BANNER)"
            @mouseenter="isHoveringCta = true"
            @mouseleave="isHoveringCta = false"
          >
            {{ $t('perps.banner.sign-in-button') }}
          </app-base-button>
        </template>
      </div>

      <!--
        Takes precedence over the network/wallet notices below: the region block
        outranks them, since resolving either one still leaves perps unavailable.
      -->
      <p v-if="isPerpsRestricted" class="text-error text-s-14 mt-3">
        {{ $t('perps.restricted.banner-notice') }}
        <a
          :href="perpsHelpUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-black font-bold underline hoverOpacity"
          @click="onRestrictedLearnMore"
        >
          {{ $t('perps.restricted.learn-more') }}
        </a>
      </p>
      <p
        v-else-if="!isOnEthereum && isUnisatWallet"
        class="text-info text-s-12 mt-3"
      >
        {{ $t('perps.banner.unisat-not-supported') }}
      </p>
      <p v-else-if="!isOnEthereum" class="text-info text-s-13 mt-3">
        {{ $t('perps.banner.eth-only-notice') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
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
import { usePerpsRestriction } from '../composables/usePerpsRestriction'
import { usePerpsStatus } from '../composables/usePerpsStatus'
import {
  analytics,
  ConnectWalletEvent,
  PerpsEventSource,
  PerpsRestrictedEvent,
} from '@/analytics'

const { t } = useI18n()
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
const { isPerpsRestricted, perpsHelpUrl } = usePerpsRestriction()
const { isServiceUnavailable } = usePerpsStatus()

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
    text: t('perps.toast.switched-to-ethereum-title'),
    textSecondary: t('perps.toast.switched-to-ethereum-detail'),
    type: ToastType.Info,
  })
}

const onRestrictedLearnMore = () => {
  void analytics.trackPerpsRestrictedEvent(PerpsRestrictedEvent.LEARN_MORE, {
    source: PerpsEventSource.MAIN_BANNER,
  })
}

const onDownloadEnkrypt = () => {
  window.open('https://enkrypt.com', '_blank', 'noopener,noreferrer')
}
</script>

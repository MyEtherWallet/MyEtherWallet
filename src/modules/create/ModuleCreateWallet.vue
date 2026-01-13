<template>
  <app-dialog
    v-model:is-open="isOpenCreateDialog"
    :class="[
      'w-full max-h-[95vh]',
      currentView === 'mnemonic' || currentView === 'buy'
        ? 'max-w-[1024px] lg:h-auto'
        : 'max-w-[450px] lg:!max-w-[1024px] lg:h-[800px]',
    ]"
    bg="bg-appBackground"
    @close-dialog="closeCreate()"
  >
    <template #title>
      <div class="flex w-full flex-col md:flex-row px-4 xs:px-6">
        <div class="w-8 ml-[-12px]">
          <app-btn-icon
            v-if="currentView !== 'default'"
            icon="icon-arrow-left"
            label="back to connect options"
            class="!w-10 !h-10 mr-auto mt-4"
            @click="createStore.setCurrentView('default')"
          >
            <arrow-left-icon class="w-5 h-5" />
          </app-btn-icon>
        </div>
        <div
          :class="
            currentView === 'default'
              ? 'mt-4'
              : 'sm:justify-center sm:items-center'
          "
          class="flex flex-col justify-start w-full md:mt-4 lg:mt-6 lg:mb-2"
        >
          <h1 class="font-bold text-s-28 sm:text-s-32 mb-1 leading-p-120">
            {{ getTitle }}
          </h1>
          <p
            v-if="currentView === 'default'"
            class="text-s-14 sm:text-s-17 leading-p-150 mb-2 text-info"
          >
            MEW is available on mobile and on desktop in your browser.
            <a
              href="https://help.myetherwallet.com/en/articles/5979837-how-to-create-an-ethereum-wallet-with-mew"
              target="_blank"
              class="underline inline-flex items-center ml-1 hoverOpacity"
              >Creating a wallet guide
              <arrow-long-right-icon class="w-5 h-5 ml-1"
            /></a>
          </p>
        </div>
      </div>
    </template>
    <template #content>
      <div class="px-4 xs:px-6 pb-10">
        <!-- Default View -->
        <div v-if="currentView === 'default'" class="flex flex-col gap-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-6">
            <!-- Mobile-->
            <div
              class="rounded-3xl bg-[rgba(53,94,236,0.1)] pt-6 px-6 sm:px-8 border border-transparent hover:border-primary/20 transition-colors group"
            >
              <div class="flex gap-4 lg:gap-6 items-center mb-6">
                <img
                  :src="mewMobile"
                  class="h-[64px] w-[64px] md:h-[70px] md:w-[70px] rounded-16 shadow-[0px_1.5px_6px_0px_rgba(0,0,0,0.1)]"
                />
                <div>
                  <div class="flex items-start gap-2 mb-1">
                    <h2 class="text-xs-20 md:text-s-24 font-bold leading-tight">
                      MEW Mobile App
                    </h2>
                    <span
                      class="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 mt-1"
                      >Recommended</span
                    >
                  </div>
                  <div class="flex items-center gap-1 md:gap-3 opacity-70">
                    <img class="h-[14px] md:h-[16px]" :src="mewRating" />
                    <p class="text-s-12 md:text-s-14 font-medium">
                      13k+ ratings
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap lg:flex-nowrap items-stretch lg:gap-8">
                <div
                  class="order-2 lg:order-1 sm:-ml-4 bottomShadowIMGMask flex self-end overflow-visible"
                >
                  <img
                    :src="mewWalletScreen"
                    width="463"
                    height="638"
                    class="rounded-xl object-contain object-left-top hidden lg:block transition-transform group-hover:scale-[1.02] duration-500"
                  />
                  <img
                    :src="mewWalletScreenSm"
                    width="463"
                    height="638"
                    class="object-contain object-top lg:hidden"
                  />
                </div>
                <div
                  class="order-1 lg:order-2 flex grow lg:grow-0 items-center justify-center flex-col xl:w-[200px] bg-white p-4 sm:px-6 rounded-2xl shadow-sm mb-6 lg:mb-10 lg:mt-2 self-start"
                >
                  <p
                    class="text-info text-xs font-bold uppercase tracking-widest mb-4"
                  >
                    Scan to download
                  </p>
                  <qr-code-vue
                    value="https://download.mewwallet.com/?source=web-home/"
                    :size="140"
                    level="H"
                    background="rgba(53, 94, 236, 0.05)"
                    class="mb-6"
                  />
                  <div
                    class="flex flex-wrap lg:flex-col gap-2.5 items-center justify-center w-full"
                  >
                    <a
                      href="https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet&referrer=utm_source%3Dweb-home"
                      target="_blank"
                      class="cursor-pointer hoverOpacityHasBG w-full"
                    >
                      <img
                        :src="IMGGooglePlay"
                        contain
                        alt="Google Play Store download"
                        class="h-10 w-full object-contain"
                      />
                    </a>
                    <a
                      href="https://apps.apple.com/app/apple-store/id1464614025?pt=118781877&ct=web-home&mt=8"
                      target="_blank"
                      class="cursor-pointer hoverOpacityHasBG w-full"
                    >
                      <img
                        :src="IMGIOSstore"
                        alt="Apple App Store download"
                        class="h-10 w-full object-contain"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <!-- Enkrypt -->
            <div
              class="rounded-3xl bg-enkryptBg p-6 sm:p-8 flex flex-col border border-transparent hover:border-violet/20 transition-colors group"
            >
              <div class="flex gap-4 lg:gap-6 items-center mb-6">
                <img
                  :src="enkryptLogo"
                  contain=""
                  alt=""
                  width="80px"
                  height="80px"
                  class="h-[64px] w-[64px] md:h-[70px] md:w-[70px] rounded-16 shadow-[0px_1.5px_6px_0px_rgba(0,0,0,0.1)]"
                />
                <div>
                  <div class="flex items-start gap-2 mb-1">
                    <h2 class="text-xs-20 md:text-s-24 font-bold leading-tight">
                      Enkrypt Browser Wallet
                    </h2>
                    <span
                      class="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 mt-1"
                      >Recommended</span
                    >
                  </div>
                  <div class="flex items-center gap-1 md:gap-3 opacity-70">
                    <img
                      src="data:image/webp;base64,UklGRogDAABXRUJQVlA4WAoAAAAQAAAA/AAAKgAAQUxQSCIDAAABgHLbVt4oHp/oicfH4/F4PKNbjU916vHvJ6Ytee9e5kNGBAQ3khRJtVh75IGcm5onTP+Rm0tpwdecg/sx1mlw6yFS32tw60yzFoo14yrIefPv9ftYM8VaXlYHq/urvtFVX5XR9aBYj1clijXCvi6vaug9mmh9Eqz4jHqsNYh09+nfxhrfrQs8oci2iBBycKdY63slQkJFIrjHWpsQsuNECNmZP6x1eOuKtW4ihBwErnWhWB00oVhr+awM7gnZqZ8VR7c+PiuAosnIThNCDpwwrPP4Vi9CyM7Wsy6E5Ii4n2JtDtMTslN6FYEJpVhrrwLF6iG9Yp8e1NoYViddK7xXnyy71XdvUbq3zfdvrmv1BqtHWZPFOmGsbRBraAK7PTu7eERa/WclAVrXH2N9RQWp/CxB3vZOVJC3SrHeOvFC3qapEVYgyera6FVJFZG1vTfjWxslom2hWF9fOOCHDZo1Ntxhg2XF3/flbQ+tmLq7i/9cO8V6YCr/ICtwI7XeCdDo1kCxbtcnDRkSBeRG2hfViEqxerO1qqwbxRrsVofcSNkpT9qK0ToxrElrvdkqaq0VHIVwII76Cmsz7c7qW6RYk+mvjWKdd9zujIjp3TGshWLNI1mzNQJIaxzRWnqFGymd0rohxnTN/DmUNVKsmWJVlj4/1XayjrVm8wUtilWZnTSSddZ+t3svsHUaz+q1h0yKtUKTIxLMPSEHiWItLCuyrWLcRFjrtzkFypZiTRyrOgXGdhzrqrdak6NtKdaqTg6hjSKEHGSKtYxlXazJaTGh2seFFdUe/fEp9VuUdcscq7Wdr84710ORHat1mSaPsa5XI1foWjHJqTxrs2U0XJ53zgXRxmvrrZcDRJ8/Rh+EtVxbD6w1IaxVMWolQPtQTP8J0B6d6V9hzXbr05OthnZWTf/zcZWdMayrakzzhzU7XmXdcFbXs4RD3W6fo5ZuJNmMfb7aEsWYg2Szfhmt8cpajTNCVlp3rTUqL0RNsZkqaa8yRLFZtVcMkm1DZYq1aK8YJGXNrX/F4Co+z+WjGcK6vqxObTVF566yrmZrcSpPzzoBVlA4IEAAAABwBQCdASr9ACsAPpFIoUylpCMiIKgAsBIJaQoWoADui8sA11N7iLywDXU3uIvLANdTe4XAAP7/NV1EJgAAAAAA"
                      contain=""
                      alt=""
                      class="h-[14px] md:h-[16px]"
                    />
                    <p class="text-s-12 md:text-s-14 font-medium">
                      100,000+ users
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-1 -ml-4 sm:-ml-8 overflow-hidden">
                <img
                  :src="enkryptScreen"
                  contain=""
                  alt=""
                  class="rounded-xl object-contain object-left-bottom bottomShadowIMGMask transition-transform group-hover:scale-[1.02] duration-500"
                  height="274px"
                  width="446px"
                />
              </div>
              <!-- TODO: Add amplitude event -->
              <a
                href="https://www.enkrypt.com/download.html"
                target="_blank"
                class="inline-block mt-8 px-6 py-3 rounded-full hoverOpacityHasBG bg-violet w-fit"
                ><div class="flex items-center">
                  <p class="text-s-17 text-center text-white font-bold mr-2">
                    Get Enkrypt Browser Wallet
                  </p>
                  <arrow-long-right-icon class="w-6 h-6 text-white" />
                </div>
              </a>
            </div>
          </div>

          <!-- Other Methods Section (Cleaned up) -->
          <div>
            <h3 class="text-s-20 font-bold mb-6 px-1">
              Other creation methods
            </h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Hardware -->
              <div
                class="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-white border border-grey-outline hover:shadow-button transition-all cursor-pointer group"
                @click="setView('buy')"
              >
                <div class="sm:w-1/3">
                  <img
                    :src="hardware"
                    alt="hardware wallet"
                    class="rounded-2xl w-full object-contain transform transition-transform group-hover:scale-105"
                  />
                </div>
                <div class="sm:w-2/3 flex flex-col justify-between">
                  <div>
                    <h4 class="text-s-20 font-bold mb-2">Hardware Wallet</h4>
                    <p class="text-info text-s-14 leading-p-150 mb-4">
                      The highest standard of security. Order a device online
                      and use it with MEW.
                    </p>
                  </div>
                  <div
                    class="flex items-center text-primary font-bold text-s-16"
                  >
                    Buy a hardware wallet
                    <arrow-long-right-icon
                      class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>

              <!-- Software -->
              <div
                class="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-white border border-grey-outline hover:shadow-button transition-all cursor-pointer group"
                @click="setView('mnemonic')"
              >
                <div class="sm:w-1/3 shrink-0">
                  <img
                    :src="software"
                    alt="software wallet"
                    class="rounded-2xl w-full object-contain transform transition-transform group-hover:scale-105"
                  />
                </div>
                <div class="sm:w-2/3 flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <h4 class="text-s-20 font-bold leading-tight">
                        Software Wallet
                      </h4>
                      <span
                        class="bg-error/10 text-error text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 mt-1"
                        >Not Recommended</span
                      >
                    </div>
                    <p class="text-info text-s-14 leading-p-150 mb-4">
                      Create a wallet using a recovery phrase. Use only in
                      offline settings.
                    </p>
                  </div>
                  <div
                    class="flex items-center text-primary font-bold text-s-16"
                  >
                    Create a software wallet
                    <arrow-long-right-icon
                      class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="currentView === 'buy'"
          class="px-2 xs:px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div
            class="cursor-pointer flex border border-grey-outline rounded-24 p-8 bg-white justify-between hover:shadow-button transition-shadow group overflow-hidden relative"
            @click="openBuyWallet('ledger')"
          >
            <div class="flex flex-col justify-between relative z-10">
              <img :src="ledgerIcon" width="100" class="mb-4" />
              <div>
                <p
                  class="text-info text-s-14 font-medium mb-1 tracking-wide uppercase"
                >
                  Starting from
                </p>
                <span class="font-bold text-s-32">$59.00</span>
              </div>
            </div>
            <img
              :src="ledgerWallet"
              width="280"
              class="object-contain transform transition-transform group-hover:scale-105"
            />
          </div>
          <div
            class="cursor-pointer flex border border-grey-outline rounded-24 p-8 bg-white justify-between hover:shadow-button transition-shadow group overflow-hidden relative"
            @click="openBuyWallet('trezor')"
          >
            <div class="flex flex-col justify-between relative z-10">
              <img :src="trezorIcon" width="100" class="mb-4" />
              <div>
                <p
                  class="text-info text-s-14 font-medium mb-1 tracking-wide uppercase"
                >
                  Starting from
                </p>
                <span class="font-bold text-s-32">$79.00</span>
              </div>
            </div>
            <img
              :src="trezorWallet"
              width="280"
              class="object-contain transform transition-transform group-hover:scale-105"
            />
          </div>
        </div>
        <!-- Create Mnemonic -->
        <div v-if="currentView === 'mnemonic'">
          <module-create-mnemonic />
        </div>
      </div>
    </template>
  </app-dialog>
</template>
<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ArrowLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/24/outline'

import { useCreateStore } from '@/stores/createStore'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import mewRating from '@/assets/images/create/rating-mobile.webp'
import mewMobile from '@/assets/images/create/mewweb-logo.svg'
import mewWalletScreen from '@/assets/images/create/mewwallet-screen.webp'
import mewWalletScreenSm from '@/assets/images/create/mobile@3x.webp'
import QrCodeVue from 'qrcode.vue'
import IMGGooglePlay from '@/assets/images/create/app-store-google.svg'
import IMGIOSstore from '@/assets/images/create/app-store-ios.svg'
import enkryptScreen from '@/assets/images/create/enkrypt-screen.webp'
import enkryptLogo from '@/assets/images/create/enkrypt-logo.webp'
import hardware from '@/assets/images/create/hardware.webp'
import software from '@/assets/images/create/software.webp'
import { type CreateWalletView } from '../access/common/walletConfigs'
import ledgerIcon from '@/assets/images/create/buy/ledger-logo.svg'
import ledgerWallet from '@/assets/images/create/buy/buy-ledger.png'
import trezorIcon from '@/assets/images/create/buy/trezor-logo.svg'
import trezorWallet from '@/assets/images/create/buy/buy-trezor.png'
import ModuleCreateMnemonic from './ModuleCreateMnemonic.vue'

/**-------------------------------
 * Access Wallet Dialog
 -------------------------------*/
const createStore = useCreateStore()
const { isOpenCreateDialog, currentView } = storeToRefs(createStore)

const closeCreate = () => {
  createStore.setCurrentView('default')
}

const isOtherMethodsOpen = ref(false)

/**-------------------------------
 * UI Elements
 -------------------------------*/
const getTitle = computed(() => {
  if (currentView.value === 'default') return 'Create Wallet'
  if (currentView.value === 'buy') return 'Buy a Hardware Wallet'
  if (currentView.value === 'mnemonic') return 'Create a Mnemonic Wallet'
  return 'Create Wallet'
})

const setView = (view: CreateWalletView) => {
  isOtherMethodsOpen.value = false
  createStore.setCurrentView(view)
}

const openBuyWallet = (type: 'ledger' | 'trezor') => {
  const url =
    type === 'ledger'
      ? 'https://shop.ledger.com/?r=fa4b'
      : 'https://trezor.io/?offer_id=12&aff_id=2029'
  window.open(url, '_blank')
}
</script>

<style scoped>
.bottomShadowIMGMask {
  mask-image: linear-gradient(0deg, transparent 0, #000 30%);
}
</style>

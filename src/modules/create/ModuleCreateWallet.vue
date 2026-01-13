<template>
  <app-dialog
    v-model:is-open="isOpenCreateDialog"
    :class="[
      'w-full max-h-[95vh]',
      currentView === 'mnemonic'
        ? 'max-w-[800px] lg:h-auto'
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
      <div class="px-4 xs:px-6 pb-6">
        <!-- Default View -->
        <div
          v-if="currentView === 'default'"
          class="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-5"
        >
          <!-- Mobile-->
          <div class="rounded-3xl bg-[rgba(53,94,236,0.1)] pt-4 px-4 sm:p-6">
            <div class="flex gap-3 sm:gap-4 lg:gap-6 items-center mb-3 lg:mb-6">
              <img
                :src="mewMobile"
                class="h-[64px] w-[64px] md:h-[70px] md:w-[70px] rounded-16 shadow-[0px_1.5px_6px_0px_rgba(0,0,0,0.1)]"
              />
              <div>
                <h2 class="text-xs-20 md:text-s-24 font-semibold">
                  MEW Mobile App
                </h2>
                <div class="flex items-center gap-1 md:gap-3 opacity-70">
                  <img class="h-[14px] md:h-[16px]" :src="mewRating" />
                  <p class="text-s-12 md:text-s-14 mt-1">13k+ ratings</p>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap lg:flex-nowrap items-stretch lg:gap-0">
              <div
                class="order-2 lg:order-1 sm:-mt-2 sm:-ml-4 bottomShadowIMGMask flex self-end overflow-visible"
              >
                <img
                  :src="mewWalletScreen"
                  width="463"
                  height="638"
                  class="rounded-xl object-contain object-left-top sm:-mt-2 lg:mt-0 hidden lg:block"
                />
                <img
                  :src="mewWalletScreenSm"
                  width="463"
                  height="638"
                  class="object-contain object-top lg:hidden"
                />
              </div>
              <div
                class="order-1 lg:order-2 flex grow lg:grow-0 items-center justify-center flex-col xl:w-[184px] bg-white p-3 sm:px-6 rounded-2xl"
              >
                <p class="text-info text-sm">Scan to download</p>
                <qr-code-vue
                  value="https://download.mewwallet.com/?source=web-home/"
                  :size="135"
                  level="H"
                  background="rgba(53, 94, 236, 0.05)"
                  class="my-5"
                />
                <div
                  class="flex flex-wrap lg:flex-col gap-2 items-center justify-center"
                >
                  <!-- TODO: Add amplitude -->
                  <a
                    href="https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet&referrer=utm_source%3Dweb-home"
                    target="_blank"
                    class="cursor-pointer hoverOpacityHasBG"
                  >
                    <img
                      :src="IMGGooglePlay"
                      contain
                      alt="Google Play Store download"
                      class="h-10"
                    />
                  </a>
                  <a
                    href="https://apps.apple.com/app/apple-store/id1464614025?pt=118781877&ct=web-home&mt=8"
                    target="_blank"
                    class="cursor-pointer hoverOpacityHasBG"
                  >
                    <img
                      :src="IMGIOSstore"
                      alt="Apple App Store download"
                      class="h-10"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- Enkrypt -->
          <div class="rounded-3xl bg-enkryptBg p-4 sm:p-6">
            <div class="flex gap-3 sm:gap-4 lg:gap-6 items-center mb-3">
              <img
                :src="enkryptLogo"
                contain=""
                alt=""
                width="80px"
                height="80px"
                class="h-[64px] w-[64px] md:h-[70px] md:w-[70px] rounded-16 shadow-[0px_1.5px_6px_0px_rgba(0,0,0,0.1)]"
              />
              <div>
                <h4 class="text-xs-20 md:text-s-24 font-semibold">
                  Enkrypt Browser Wallet
                </h4>
                <div class="flex items-center gap-1 md:gap-3 opacity-70">
                  <img
                    src="data:image/webp;base64,UklGRogDAABXRUJQVlA4WAoAAAAQAAAA/AAAKgAAQUxQSCIDAAABgHLbVt4oHp/oicfH4/F4PKNbjU916vHvJ6Ytee9e5kNGBAQ3khRJtVh75IGcm5onTP+Rm0tpwdecg/sx1mlw6yFS32tw60yzFoo14yrIefPv9ftYM8VaXlYHq/urvtFVX5XR9aBYj1clijXCvi6vaug9mmh9Eqz4jHqsNYh09+nfxhrfrQs8oci2iBBycKdY63slQkJFIrjHWpsQsuNECNmZP6x1eOuKtW4ihBwErnWhWB00oVhr+awM7gnZqZ8VR7c+PiuAosnIThNCDpwwrPP4Vi9CyM7Wsy6E5Ii4n2JtDtMTslN6FYEJpVhrrwLF6iG9Yp8e1NoYViddK7xXnyy71XdvUbq3zfdvrmv1BqtHWZPFOmGsbRBraAK7PTu7eERa/WclAVrXH2N9RQWp/CxB3vZOVJC3SrHeOvFC3qapEVYgyera6FVJFZG1vTfjWxslom2hWF9fOOCHDZo1Ntxhg2XF3/flbQ+tmLq7i/9cO8V6YCr/ICtwI7XeCdDo1kCxbtcnDRkSBeRG2hfViEqxerO1qqwbxRrsVofcSNkpT9qK0ToxrElrvdkqaq0VHIVwII76Cmsz7c7qW6RYk+mvjWKdd9zujIjp3TGshWLNI1mzNQJIaxzRWnqFGymd0rohxnTN/DmUNVKsmWJVlj4/1XayjrVm8wUtilWZnTSSddZ+t3svsHUaz+q1h0yKtUKTIxLMPSEHiWItLCuyrWLcRFjrtzkFypZiTRyrOgXGdhzrqrdak6NtKdaqTg6hjSKEHGSKtYxlXazJaTGh2seFFdUe/fEp9VuUdcscq7Wdr84710ORHat1mSaPsa5XI1foWjHJqTxrs2U0XJ53zgXRxmvrrZcDRJ8/Rh+EtVxbD6w1IaxVMWolQPtQTP8J0B6d6V9hzXbr05OthnZWTf/zcZWdMayrakzzhzU7XmXdcFbXs4RD3W6fo5ZuJNmMfb7aEsWYg2Szfhmt8cpajTNCVlp3rTUqL0RNsZkqaa8yRLFZtVcMkm1DZYq1aK8YJGXNrX/F4Co+z+WjGcK6vqxObTVF566yrmZrcSpPzzoBVlA4IEAAAABwBQCdASr9ACsAPpFIoUylpCMiIKgAsBIJaQoWoADui8sA11N7iLywDXU3uIvLANdTe4XAAP7/NV1EJgAAAAAA"
                    contain=""
                    alt=""
                    class="h-[14px] md:h-[16px]"
                  />
                  <p class="text-s-12 md:text-s-14 mt-1">100,000+ users</p>
                </div>
              </div>
            </div>
            <div class="flex max-h-[274px] -ml-4 sm:-ml-6 overflow-hidden">
              <img
                :src="enkryptScreen"
                contain=""
                alt=""
                class="rounded-xl object-contain object-left-bottom bottomShadowIMGMask"
                height="274px"
                width="446px"
              />
            </div>
            <!-- TODO: Add amplitude event -->
            <a
              href="https://www.enkrypt.com/download.html"
              target="_blank"
              class="inline-block mt-5 lg:mt-9 px-4 py-2 rounded-full hoverOpacityHasBG bg-violet"
              ><div class="flex items-center">
                <p class="text-s-17 text-center text-white font-semibold mr-1">
                  Get Enkrypt Browser Wallet
                </p>
                <arrow-long-right-icon class="w-5 h-5 text-white" />
              </div>
            </a>
          </div>
          <!-- Other Methods -->
          <div
            class="basis-full text-s-17 font-medium leading-6 col-span-1 lg:col-span-2"
          >
            <app-btn-text
              class="-ml-3 flex justify-start items-center mb-3 text-info"
              @click="openOtherMethods"
            >
              Other methods
              <chevron-down-icon
                v-if="!isOtherMethodsOpen"
                class="w-5 h-5 ml-2"
              />
              <chevron-up-icon v-else class="w-5 h-5 ml-2" />
            </app-btn-text>
            <expand-transition>
              <div v-show="isOtherMethodsOpen">
                <div
                  class="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-3xl bg-[#ededee] p-4 sm:p-6"
                >
                  <div>
                    <img
                      :src="hardware"
                      alt="hardware wallet image"
                      class="rounded-16 max-w-[260px] object-contain"
                      width="608"
                      height="384"
                    />
                    <button
                      class="border border-black text-s-17 rounded-full px-4 py-[6px] border-2 font-medium my-6 hoverOpacity inline-block"
                      @click="setView('buy')"
                    >
                      <div class="flex items-center">
                        <p>Buy a hardware wallet</p>
                        <arrow-long-right-icon class="w-5 h-5 ml-1" />
                      </div>
                    </button>
                    <div class="flex items-center mb-1">
                      <check-circle-icon class="w-5 h-5 mr-1 text-blue" />
                      <p class="text-s-16">The highest standard of security.</p>
                    </div>
                    <p class="text-info text-s-14">
                      You can order a hardware wallet online, and use it with
                      MEW. If you need a wallet while you are waiting for your
                      order to arrive, consider getting our mobile app.
                    </p>
                  </div>
                  <div>
                    <img
                      :src="software"
                      alt="software wallet image"
                      class="rounded-16 max-w-[260px]"
                      width="608"
                      height="384"
                    />
                    <button
                      class="border border-black text-s-17 rounded-full px-4 py-[6px] border-2 font-medium my-6 hoverOpacity inline-block"
                      @click="setView('mnemonic')"
                    >
                      <div class="flex items-center">
                        <p>Create a software wallet</p>
                        <arrow-long-right-icon class="w-5 h-5 ml-1" />
                      </div>
                    </button>
                    <div class="flex items-center mb-1">
                      <exclamation-circle-icon
                        class="w-5 h-5 mr-1 text-error"
                      />
                      <p class="text-s-16">
                        Not a secure way to create a wallet.
                      </p>
                    </div>
                    <p class="text-info text-s-14">
                      Software methods like Keystore File and Mnemonic Phrase
                      should only be used in offline settings by experienced
                      users.
                    </p>
                  </div>
                  <div ref="bottomElement"></div>
                </div>
              </div>
            </expand-transition>
          </div>
        </div>
        <div
          v-if="currentView === 'buy'"
          class="p-10 grid grid-cols-1 md:grid-cols-2 gap-2"
        >
          <div
            class="cursor-pointer flex border border-2 rounded-[12px] border-black text-lg p-6 bg-white m-2 justify-between"
            @click="openBuyWallet('ledger')"
          >
            <div class="flex flex-col height-[100%] justify-around">
              <img :src="ledgerIcon" width="85px" class="mb-2" />
              <div>
                Starting from <br />
                <span class="font-bold text-s-24">$59.00</span>
              </div>
            </div>
            <img :src="ledgerWallet" width="250" />
          </div>
          <div
            class="cursor-pointer flex border border-2 rounded-[12px] border-black text-lg p-6 bg-white m-2 justify-between"
            @click="openBuyWallet('trezor')"
          >
            <div class="flex flex-col height-[100%] justify-around">
              <img :src="trezorIcon" width="85px" class="mb-2" />
              <div>
                Starting from <br />
                <span class="font-bold text-s-24">$79.00</span>
              </div>
            </div>
            <img :src="trezorWallet" width="250" />
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
import AppBtnText from '@/components/AppBtnText.vue'
import {
  ArrowLeftIcon,
  ArrowLongRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

import { useCreateStore } from '@/stores/createStore'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'

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

const bottomElement = ref<HTMLElement | null>(null)
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

const openOtherMethods = () => {
  isOtherMethodsOpen.value = !isOtherMethodsOpen.value
  if (bottomElement.value && isOtherMethodsOpen.value) {
    setTimeout(() => {
      bottomElement.value?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 100)
  }
}

const openBuyWallet = (type: 'ledger' | 'trezor') => {
  const url =
    type === 'ledger'
      ? 'https://shop.ledger.com/?r=fa4b'
      : 'https://trezor.io/?offer_id=12&aff_id=2029'
  window.open(url, '_blank')
}

// const helpLinkText = computed(() => {
//   switch (currentView.value) {
//     case 'keystore':
//       return 'How to connect your keystore wallet'
//     case 'private_key':
//       return 'How to connect with your private key'
//     case 'mnemonic':
//       return 'How to connect with your recovery phrase'
//     case 'ledger':
//       return 'How to connect your Ledger wallet'
//     case 'trezor':
//       return 'How to connect your Trezor wallet'
//     default:
//       return 'Need Help connecting your wallet?'
//   }
// })
</script>

<style scoped>
.bottomShadowIMGMask {
  mask-image: linear-gradient(0deg, transparent 0, #000 30%);
}
</style>

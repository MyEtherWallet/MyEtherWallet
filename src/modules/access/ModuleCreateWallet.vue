<template>
  <app-dialog
    v-model:is-open="isOpenCreateDialog"
    class="!max-w-[1024px] w-full"
    bg="bg-appBackground"
    @close-dialog="closeCreate()"
  >
    <template #title>
      <div class="flex w-full flex-col sm:flex-row">
        <div class="ml-4 w-8">
          <app-btn-icon
            v-if="currentView !== 'default'"
            icon="icon-arrow-left"
            label="back to connect options"
            class="!w-10 !h-10 mr-auto mt-4"
            @click="createStore.setCurrentView('default')"
          >
            <arrow-right-icon class="w-5 h-5 rotate-180" />
          </app-btn-icon>
        </div>
        <div
          :class="
            currentView === 'default'
              ? 'ml-4 mt-4  sm:ml-0'
              : 'sm:justify-center pl-4 xs:pl-6 sm:items-center'
          "
          class="flex flex-col justify-start w-full sm:mt-6 sm:mb-2"
        >
          <h1
            class="font-bold text-s-48 sm:text-s-48 mb-3 sm:mb-1 leading-p-120"
          >
            {{ getTitle }}
          </h1>
          <p v-if="currentView === 'default'" class="text-s-20 flex mb-6">
            MEW is available on mobile and on desktop in your browser.
            <a
              href="https://help.myetherwallet.com/en/articles/5979837-how-to-create-an-ethereum-wallet-with-mew"
              target="_blank"
              class="underline flex items-center ml-1"
              >Creating a wallet guide
              <arrow-right-icon class="w-5 h-5 underline ml-1"
            /></a>
          </p>
          <app-need-help
            v-if="currentView !== 'default'"
            :title="helpLinkText"
            help-link="https://help.myetherwallet.com/en/articles/5377855-how-to-access-your-wallet-with-mew-portfolio"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="px-4 xs:px-6 !overflow-y-scroll pb-6">
        <div
          v-if="currentView === 'default'"
          class="lg:grid-cols-2 grid grid-cols-1 content-stretch gap-5"
        >
          <!-- <div class="flex flex-row flex-wrap my-5 gap-y-5 gap-x-[54px]">
            <div>
              <h2 class="text-s-28 font-semibold mb-2 md:ml-3">
                {{ $t('common.select_network') }}
              </h2>
              <select-chain-for-app is-btn-group />
            </div>
          </div>
          <WalletsDefaultList class="mt-10 mb-12" />
          <WalletsList /> -->
          <div class="rounded-3xl bg-[rgba(53,94,236,0.1)] p-4 sm:p-6">
            <div class="flex gap-3 sm:gap-4 lg:gap-6 items-center mb-6">
              <img
                :src="mewMobile"
                class="h-[64px] w-[64px] md:h-[80px] md:w-[80px] rounded-[17px] md:rounded-[21px] shadow-[0px_1.5px_6px_0px_rgba(0,0,0,0.1)]"
              />
              <div>
                <h4 class="text-xl md:text-2xl font-semibold">
                  MEW Mobile App
                </h4>
                <div
                  class="sm:flex items-center sm:mt-2 gap-1 md:gap-3 opacity-70"
                >
                  <img class="h-[14px] md:h-[23px]" :src="mewRating" />
                  <p class="text-[12px] md:text-base mt-1">13k+ ratings</p>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap sm:flex-nowrap justify-start gap-3">
              <div
                class="order-2 sm:order-1 sm:-mt-2 lg:mt-0 sm:-ml-4 bottomShadowIMGMask flex"
              >
                <img
                  :src="mewWalletScreen"
                  width="463"
                  height="638"
                  class="rounded-xl object-contain object-left-top sm:-mt-2 lg:-mt-3 hidden sm:block"
                />
                <img
                  :src="mewWalletScreenSm"
                  width="463"
                  height="638"
                  class="object-contain object-top sm:hidden"
                />
              </div>
              <div
                class="order-1 sm:order-2 flex grow lg:grow-0 items-center flex-col xl:w-[184px] bg-white p-3 sm:p-6 rounded-2xl"
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
                  class="flex flex-wrap sm:flex-col gap-2 items-center justify-center"
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
                      alt="Google Play Store"
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
                      alt="Apple App Store"
                      class="h-10"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-3xl bg-enkryptBg p-4 sm:p-6">
            <div class="flex gap-3 sm:gap-4 lg:gap-6 items-center mb-6">
              <img
                :src="enkryptLogo"
                contain=""
                alt=""
                width="80px"
                height="80px"
                class="h-[64px] w-[64px] md:h-[80px] md:w-[80px] rounded-[17px] md:rounded-[26px] shadow-[0px_1.5px_6px_0px_rgba(0,0,0,0.1)]"
              />
              <div>
                <h4 class="text-xl md:text-2xl font-semibold">
                  Enkrypt Browser Wallet
                </h4>
                <div
                  class="sm:flex items-center sm:mt-2 gap-1 md:gap-3 opacity-70"
                >
                  <img
                    src="data:image/webp;base64,UklGRogDAABXRUJQVlA4WAoAAAAQAAAA/AAAKgAAQUxQSCIDAAABgHLbVt4oHp/oicfH4/F4PKNbjU916vHvJ6Ytee9e5kNGBAQ3khRJtVh75IGcm5onTP+Rm0tpwdecg/sx1mlw6yFS32tw60yzFoo14yrIefPv9ftYM8VaXlYHq/urvtFVX5XR9aBYj1clijXCvi6vaug9mmh9Eqz4jHqsNYh09+nfxhrfrQs8oci2iBBycKdY63slQkJFIrjHWpsQsuNECNmZP6x1eOuKtW4ihBwErnWhWB00oVhr+awM7gnZqZ8VR7c+PiuAosnIThNCDpwwrPP4Vi9CyM7Wsy6E5Ii4n2JtDtMTslN6FYEJpVhrrwLF6iG9Yp8e1NoYViddK7xXnyy71XdvUbq3zfdvrmv1BqtHWZPFOmGsbRBraAK7PTu7eERa/WclAVrXH2N9RQWp/CxB3vZOVJC3SrHeOvFC3qapEVYgyera6FVJFZG1vTfjWxslom2hWF9fOOCHDZo1Ntxhg2XF3/flbQ+tmLq7i/9cO8V6YCr/ICtwI7XeCdDo1kCxbtcnDRkSBeRG2hfViEqxerO1qqwbxRrsVofcSNkpT9qK0ToxrElrvdkqaq0VHIVwII76Cmsz7c7qW6RYk+mvjWKdd9zujIjp3TGshWLNI1mzNQJIaxzRWnqFGymd0rohxnTN/DmUNVKsmWJVlj4/1XayjrVm8wUtilWZnTSSddZ+t3svsHUaz+q1h0yKtUKTIxLMPSEHiWItLCuyrWLcRFjrtzkFypZiTRyrOgXGdhzrqrdak6NtKdaqTg6hjSKEHGSKtYxlXazJaTGh2seFFdUe/fEp9VuUdcscq7Wdr84710ORHat1mSaPsa5XI1foWjHJqTxrs2U0XJ53zgXRxmvrrZcDRJ8/Rh+EtVxbD6w1IaxVMWolQPtQTP8J0B6d6V9hzXbr05OthnZWTf/zcZWdMayrakzzhzU7XmXdcFbXs4RD3W6fo5ZuJNmMfb7aEsWYg2Szfhmt8cpajTNCVlp3rTUqL0RNsZkqaa8yRLFZtVcMkm1DZYq1aK8YJGXNrX/F4Co+z+WjGcK6vqxObTVF566yrmZrcSpPzzoBVlA4IEAAAABwBQCdASr9ACsAPpFIoUylpCMiIKgAsBIJaQoWoADui8sA11N7iLywDXU3uIvLANdTe4XAAP7/NV1EJgAAAAAA"
                    contain=""
                    alt=""
                    class="h-[14px] md:h-[23px]"
                  />
                  <p class="text-[12px] md:text-base mt-1">100,000+ users</p>
                </div>
              </div>
            </div>
            <div class="flex max-h-[274px] -ml-4 sm:-ml-3">
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
              class="inline-block mt-9 px-4 py-2 rounded-full hoverOpacityHasBG bg-violet"
              ><div class="flex items-center">
                <p class="text-s-17 text-center text-white font-bold mr-1">
                  Get Enkrypt Browser Wallet
                </p>
                <arrow-right-icon class="w-5 h-5 text-white" />
              </div>
            </a>
          </div>
        </div>
        <module-access-keystore v-else-if="currentView === 'keystore'" />
        <module-access-private-key v-else-if="currentView === 'private_key'" />
        <module-access-mnemonic v-else-if="currentView === 'mnemonic'" />
        <module-access-hardware-wallet
          v-else-if="currentView === 'ledger' || currentView === 'trezor'"
        />
        <module-access-wallet-connect
          v-else-if="currentView === 'wallet_connect'"
        />
      </div>
    </template>
  </app-dialog>
</template>
<script setup lang="ts">
// import WalletsDefaultList from '@/modules/access/components/wallets_lists/WalletsListDefault.vue'
// import WalletsList from '@/modules/access/components/wallets_lists/WalletsList.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
// import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AppDialog from '@/components/AppDialog.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

import { useCreateStore } from '@/stores/createStore'
import { storeToRefs } from 'pinia'
import ModuleAccessKeystore from './ModuleAccessKeystore.vue'
import ModuleAccessPrivateKey from './ModuleAccessPrivateKey.vue'
import ModuleAccessMnemonic from './ModuleAccessMnemonic.vue'
import ModuleAccessHardwareWallet from './ModuleAccessHardwareWallet.vue'
import ModuleAccessWalletConnect from './ModuleAccessWalletConnect.vue'
import { computed } from 'vue'

import mewRating from '@/assets/images/create/rating-mobile.webp'
import mewMobile from '@/assets/images/create/mewweb-logo.svg'
import mewWalletScreen from '@/assets/images/create/mewwallet-screen.webp'
import mewWalletScreenSm from '@/assets/images/create/mobile@3x.webp'
import QrCodeVue from 'qrcode.vue'
import IMGGooglePlay from '@/assets/images/create/app-store-google.svg'
import IMGIOSstore from '@/assets/images/create/app-store-ios.svg'
import enkryptScreen from '@/assets/images/create/enkrypt-screen.webp'
import enkryptLogo from '@/assets/images/create/enkrypt-logo.webp'

/**-------------------------------
 * Access Wallet Dialog
 -------------------------------*/
const createStore = useCreateStore()
const { isOpenCreateDialog, currentView, clickedWalletConnect } =
  storeToRefs(createStore)

const closeCreate = () => {
  createStore.setCurrentView('default')
}
/**-------------------------------
 * UI Elements
 -------------------------------*/
const getTitle = computed(() => {
  let method = ''
  switch (currentView.value) {
    case 'keystore':
      method = 'keystore'
      break
    case 'private_key':
      method = 'private key'
      break
    case 'mnemonic':
      method = 'mnemonic phrase'
      break
    case 'ledger':
      method = 'Ledger'
      break
    case 'trezor':
      method = 'Trezor'
      break
    case 'wallet_connect':
      method = clickedWalletConnect.value?.walletName || ''
      break
    default:
      method = ''
      break
  }
  return method ? `Create ${method}` : 'Create Wallet'
})

const helpLinkText = computed(() => {
  switch (currentView.value) {
    case 'keystore':
      return 'How to connect your keystore wallet'
    case 'private_key':
      return 'How to connect with your private key'
    case 'mnemonic':
      return 'How to connect with your recovery phrase'
    case 'ledger':
      return 'How to connect your Ledger wallet'
    case 'trezor':
      return 'How to connect your Trezor wallet'
    default:
      return 'Need Help connecting your wallet?'
  }
})
</script>

<style scoped>
.bottomShadowIMGMask {
  mask-image: linear-gradient(0deg, transparent 0, #000 30%);
}
</style>

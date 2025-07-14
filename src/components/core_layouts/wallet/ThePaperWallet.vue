<template>
  <teleport to="#app">
    <transition
      enter-active-class="transform ease-out duration-400 transition opacity-0 delay-100"
      enter-to-class="opacity-100"
      leave-active-class="opacity-0"
      leave-to-class="opacity-0"
      appear
    >
      <div
        v-if="isOpen"
        class="paper-wallet bg-black/40 print:bg-white cursor-pointer fixed inset-0 h-full flex items-center justify-center p-9 overscroll-none !overflow-y-scroll z-[102] fixed"
      >
        <div
          class="bg-white print:border-1 print:border-outline rounded-16 max-h-[95%] w-[95%] max-w-[600px] mx-auto bg-white rounded-32 sm:min-h-[512px] px-3 sm:px-5"
        >
          <div class="flex justify-between items-center my-6 ml-3 mr-5">
            <img
              src="@/assets/images/mew/logo-header.webp"
              :alt="$t('home')"
              width="94px"
              height="32px"
              class="w-[94px] max-h-[32px] flex-none object-contain"
            />

            <h1
              class="text-portfolio text-s-17 font-medium px-2 capitalize border-l-2 border-portfolio ml-2"
            >
              Paper Wallet
            </h1>
            <button
              class="sm:-mr-4 min-w-[32px] ml-auto"
              @click="setIsOpen(false)"
            >
              <app-btn-icon-close
                @click="setIsOpen(false)"
                class="print:hidden"
              />
            </button>
          </div>

          <div class="flex justify-between items-center mx-3 gap-6">
            <div>
              <p class="text-s-28 font-semibold mb-2">
                My {{ selectedChain?.nameLong }} address
              </p>
              <div class="flex items-center justify-start mb-3">
                <app-blockie
                  :address="walletAddress || ''"
                  class="flex-none rounded-full"
                  :size="9"
                />

                <div
                  class="ml-4 text-s-20 font-medium text-wrap break-all tracking-sp-06"
                >
                  {{ walletAddress }}
                </div>
              </div>
            </div>
            <div
              class="rounded-16 p-3 mr-2 shadow-button shadow-button-elevated print:shadow-none print:border-1 print:border-outline h-[174px] w-[174px] flex items-center justify-center"
            >
              <div v-show="!isLoadingQRCode" ref="qrCode"></div>
              <!-- Loading QR Placeholder -->
              <div
                v-show="isLoadingQRCode"
                class="h-[150px] w-[150px] animate-pulse bg-grey-10 rounded-xl"
              ></div>
            </div>
          </div>

          <p
            class="my-6 mx-auto text-s-14 text-p-130 text-info print:text-black text-center max-w-[400px]"
          >
            <span class="font-semibold uppercase">Tip:</span> Always look for
            the icon when sending to this wallet. And please keep your paper
            wallet at a Safe Place!
          </p>
          <hr class="h-px bg-grey-outline border-0 w-full my-6" />
          <!-- TODO:  add privatekey option-->
          <div class="flex justify-between items-center mx-6 mb-6">
            <img
              src="@/assets/images/peggy/peggy.webp"
              alt=""
              width="135px"
              height="330px"
              class="w-[135px] max-h-[100px] flex-none object-contain"
            />
            <div class="ml-auto">
              <p class="mb-3">
                <chat-bubble-bottom-center-text-icon
                  class="inline h-4 w-4 mr-2 text-primary"
                />support@myetherwallet.com
              </p>
              <p>
                <globe-alt-icon
                  class="inline h-4 w-4 mr-2 text-primary"
                />https://www.myetherwallet.com
              </p>
            </div>
          </div>
          <div
            class="flex justify-center items-center mx-6 mb-6 mt-10 print:hidden"
          >
            <app-base-button @click="print">Print</app-base-button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { defineModel, watch, nextTick } from 'vue'
import { useQR } from '@/composables/useQR'
import { storeToRefs } from 'pinia'
import {
  GlobeAltIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/vue/24/solid'

const walletStore = useWalletStore()
const { walletAddress } = storeToRefs(walletStore)
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
/**
 * @isOpen - v-model controls the state of the dialog.
 */
const isOpen = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

/**
 * @setIsOpen - function to set the dialog state
 * @param _value - boolean value to set the dialog state
 */
const setIsOpen = (_value: boolean = false) => {
  isOpen.value = _value
}

/** -------------------
 * QR Code Controls
 -------------------*/
const { qrCode, isLoadingQRCode, setQRCode } = useQR()

watch(
  () => [walletAddress.value, isOpen.value, qrCode.value],
  () => {
    if (isOpen.value) setQRCode(walletAddress.value || undefined)
  },
)
const print = async () => {
  const element = document.querySelector('.paper-wallet')
  if (!element) {
    console.error('Paper wallet element not found')
    return
  }

  const printWindow = window.open('', '_blank', 'width=800,height=600')
  if (!printWindow) {
    console.error('Failed to open print window')
    return
  }
  await nextTick()
  // Copy all stylesheets and style tags
  let styles = ''
  // Copy <style> tags
  document.querySelectorAll('style').forEach(style => {
    console.log('Copying style:', style)
    styles += style.outerHTML
  })
  // Copy <link rel="stylesheet"> tags
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    console.log('Copying link:', link)
    styles += link.outerHTML
  })

  printWindow.document.write(`
    <html>
      <head>
        <title>MyEtherWallet</title>
        ${styles}
      </head>
      <body>
        <div>${element.outerHTML}</div>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  // Wait for content to load before printing
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
}
</script>

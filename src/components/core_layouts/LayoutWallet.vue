<template>
  <div class="relative">
    <div
      :class="[
        hasShadow && !isOpenSideMenu
          ? 'shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32)]'
          : '!border-grey-10',
        'border-white',
        '  w-[60px] xs:w-[70px] bg-white fixed h-[calc(100vh-69px)] sm:h-[calc(100vh-77px)] right-0 top-[69px] sm:top-[77px] z-[50] border-l-1 overflow-y-scroll',
      ]"
    >
      <div>
        <div class="w-full flex flex-col items-center mb-1">
          <!-- Actions -->
          <div class="mt-1 px-1 w-full">
            <button
              @click="walletMenu.setIsOpenSideMenu(!isOpenSideMenu)"
              class="py-4 mb-1 xs:mb-2 rounded-12 hoverNoBG w-full flex items-center justify-center"
            >
              <ChevronDoubleLeftIcon v-if="!isOpenSideMenu" class="w-5 h-5" />
              <ChevronDoubleRightIcon v-else class="w-5 h-5" />
            </button>
            <!-- Swap button -->
            <button
              @click="openPanel('swap')"
              :class="[
                walletPanel === 'swap' && isOpenSideMenu
                  ? 'bg-mewBg'
                  : 'hoverNoBG',
                'pt-2 pb-2 mb-2 rounded-12  flex flex-col items-center justify-center w-full',
              ]"
            >
              <icon-swap :class="['mb-1 w-6 h-6 xs:w-7 xs:h-7 text-primary']" />
              <p
                :class="[
                  'text-s-9 xs:text-s-11 uppercase mt-[2px] font-bold tracking-sp-06',
                ]"
              >
                {{ $t('common.swap') }}
              </p>
            </button>
            <!-- Bridge button -->
            <button
              @click="openPanel('bridge')"
              :class="[
                walletPanel === 'bridge' && isOpenSideMenu
                  ? 'bg-mewBg'
                  : 'hoverNoBG',
                'pt-2 pb-2 mb-2 rounded-12 flex flex-col items-center justify-center w-full',
              ]"
            >
              <icon-bridge
                :class="['mb-1 w-6 h-6 xs:w-7 xs:h-7 text-primary']"
              />
              <p
                :class="[
                  'text-s-9 xs:text-s-11 text-center uppercase mt-[2px] font-bold tracking-sp-06',
                ]"
              >
                Bridge
              </p>
            </button>
            <!-- Deposit button -->
            <button
              v-if="isWalletConnected"
              :class="[
                'pt-2 pb-2 mb-2 rounded-12 flex flex-col items-center justify-center hoverNoBG w-full',
              ]"
              @click="openDepositDialog = true"
            >
              <QrCodeIcon
                :class="['mb-1 w-6 h-6 xs:w-7 xs:h-7 text-primary']"
              />
              <p
                :class="[
                  'text-s-9 xs:text-s-11 uppercase mt-[2px] font-bold tracking-sp-06',
                ]"
              >
                {{ $t('deposit') }}
              </p>
            </button>
            <!-- Send button -->
            <button
              @click="openPanel('send')"
              :class="[
                walletPanel === 'send' && isOpenSideMenu
                  ? 'bg-mewBg'
                  : 'hoverNoBG',
                'pt-2 pb-2 mb-2 rounded-12 flex flex-col items-center justify-center w-full',
              ]"
            >
              <icon-send
                :class="['mb-1 mt-1 w-5 h-5 xs:w-6 xs:h-6 text-primary']"
              />
              <p
                :class="[
                  'text-s-9 xs:text-s-11 text-center uppercase mt-[2px] font-bold tracking-sp-06',
                ]"
              >
                {{ $t('common.send') }}
              </p>
            </button>
            <!-- Buy button -->
            <button
              :class="[
                walletPanel === 'buy' && isOpenSideMenu
                  ? 'bg-mewBg'
                  : 'hoverNoBG',
                'pt-2 pb-2 mb-2 rounded-12 flex flex-col items-center justify-center w-full',
              ]"
              @click="openPanel('buy')"
            >
              <icon-buy :class="['mb-1 w-6 h-6 xs:w-7 xs:h-7 text-primary']" />
              <p
                :class="[
                  'text-s-9 xs:text-s-11 text-center uppercase mt-[2px] font-bold tracking-sp-06',
                ]"
              >
                {{ $t('buy') }}
              </p>
            </button>
            <!--sell button-->
            <button
              :to="{ name: ROUTES_MAIN.BUY.NAME }"
              :class="[
                walletPanel === 'sell' && isOpenSideMenu
                  ? 'bg-mewBg'
                  : 'hoverNoBG',
                'pt-2 pb-2 mb-2 rounded-12 flex flex-col items-center justify-center w-full',
              ]"
              @click="openPanel('sell')"
            >
              <icon-sell :class="['mb-1 w-6 h-6 xs:w-7 xs:h-7 text-primary']" />
              <p
                :class="[
                  'text-s-9 xs:text-s-11 uppercase mt-[2px] font-bold tracking-sp-06',
                ]"
              >
                {{ $t('sell') }}
              </p>
            </button>
          </div>
        </div>
      </div>
      <the-deposit-dialog v-model:open-dialog="openDepositDialog" />
    </div>
    <!-- Modules -->
    <transition
      enter-from-class="opacity-0 translate-x-full"
      enter-active-class="transform ease-out duration-300 transition "
      enter-to-class="-translate-x-0"
      leave-from-class="transform ease-out duration-300 -translate-x-0"
      leave-active-class=" translate-x-full"
      appear
    >
      <div
        v-if="isOpenSideMenu"
        :class="[
          hasShadow && !isOpenSideMenu
            ? 'shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32)]'
            : 'border-grey-10 border-l-1',
        ]"
        class="fixed z-[51] md:z-[49] bg-white right-0 md:right-[70px] h-screen md:h-[calc(100vh-77px)] top-0 md:top-[77px] md:max-w-[375px] px-4 pt-4 pb-6 sm:py-6 w-full overflow-y-scroll"
      >
        <app-btn-icon
          label="close side menu"
          class="md:hidden ml-3 rounded-12 hoverNoBG"
          @click="walletMenu.setIsOpenSideMenu(false)"
        >
          <ChevronDoubleRightIcon class="w-5 h-5" />
        </app-btn-icon>
        <transition name="fade" mode="out-in">
          <ModuleSend v-if="walletPanel === 'send'" key="send" />
          <ModuleSwap v-else-if="walletPanel === 'swap'" key="swap" />
          <ModuleSwap v-else-if="walletPanel === 'bridge'" key="bridge" />
          <div v-else key="coming-soon" class="mt-6 text-center font-medium">
            {{ comingSoon }}
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, computed } from 'vue'
import { useWalletStore } from '@/stores/walletStore'
import { useWalletMenuStore, type WalletPanel } from '@/stores/walletMenuStore'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import IconSend from '@/assets/icons/core_menu/icon-send.vue'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconBridge from '@/assets/icons/core_menu/icon-bridge.vue'
import IconSell from '@/assets/icons/core_menu/icon-sell.vue'
import ModuleSend from '@/modules/send/ModuleSend.vue'
import ModuleSwap from '@/modules/swap/ModuleSwap.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import {
  QrCodeIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/vue/24/outline'
import { ROUTES_MAIN } from '@/router/routeNames'
import TheDepositDialog from '@/components/core_layouts/wallet/TheDepositDialog.vue'
import { useRoute } from 'vue-router'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu, walletPanel, hasShadow } = storeToRefs(walletMenu)

const breakpoints = useAppBreakpoints()
const { isXLAndUp } = breakpoints
const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
const route = useRoute()

onMounted(() => {
  if (route.name !== ROUTES_MAIN.TOKEN_INFO.NAME) {
    if (isXLAndUp.value) {
      walletMenu.setIsOpenSideMenu(true)
    } else {
      walletMenu.setIsOpenSideMenu(false)
    }
  }
})

watch(isXLAndUp, newVal => {
  if (newVal) {
    walletMenu.setIsOpenSideMenu(true)
  } else {
    walletMenu.setIsOpenSideMenu(false)
  }
})

const openPanel = (panel: WalletPanel) => {
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
  walletMenu.setWalletPanel(panel)
}

const openDepositDialog = ref(false) //deposit dialog

const comingSoon = computed(() => {
  const map = new Map<string, string>([
    ['buy', 'Buy'],
    ['sell', 'Sell'],
  ])
  return map.get(walletPanel.value)
    ? `${map.get(walletPanel.value)} is coming soon`
    : 'Coming Soon'
})
</script>

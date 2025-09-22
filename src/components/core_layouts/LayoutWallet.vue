<template>
  <div class="relative">
    <app-btn-icon
      label="expand"
      @click="walletMenu.setIsOpenSideMenu(!isOpenSideMenu)"
      :class="[
        isOpenSideMenu
          ? 'top-5 sm:top-[95px] right-[400px]'
          : 'top-[70px] sm:top-[95px] right-[60px]',
        { hidden: !isXsAndUp && isOpenSideMenu },
        'absolute  z-[51]',
      ]"
    >
      <ChevronDoubleLeftIcon v-if="!isOpenSideMenu" class="w-5 h-5" />
      <ChevronDoubleRightIcon v-else class="w-5 h-5" />
    </app-btn-icon>
    <div
      :class="[
        isOpenSideMenu
          ? 'w-full !w-screen xs:min-w-[400px] xs:max-w-[400px] xs:w-[400px] top-0 xs:[69px] px-4 pb-4 pt-0 xs:p-4 h-screen sm:h-[calc(100vh-76px)] sm:top-[77px]'
          : 'min-w-[60px] w-[60px] top-[69px] p-[6px] h-[calc(100vh-69px)]  xs:max-w-[400px]',
        'z-[50] absolute xl:fixed sm:top-[77px]  right-0  transition-all duration-200 ease-out  sm:h-[calc(100vh-76px)] overflow-y-scroll bg-white shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32)]',
      ]"
    >
      <div>
        <app-btn-icon
          label="expand"
          @click="walletMenu.setIsOpenSideMenu(!isOpenSideMenu)"
          :class="[!isXsAndUp && isOpenSideMenu ? '' : 'hidden']"
        >
          <ChevronDoubleLeftIcon v-if="!isOpenSideMenu" class="w-5 h-5" />
          <ChevronDoubleRightIcon v-else class="w-5 h-5" />
        </app-btn-icon>
        <div class="w-full">
          <transition name="fade" mode="out-in">
            <app-wallet-card
              v-if="isWalletConnected && isOpenSideMenu"
              class="mb-4"
            />
          </transition>

          <!-- Actions -->
          <div
            :class="[
              { 'flex-col mt-1': !isOpenSideMenu },
              'mt-2 flex justify-between gap-2 min-w-full',
            ]"
          >
            <!-- Deposit button -->
            <button
              v-if="isWalletConnected"
              :class="[
                isOpenSideMenu ? 'py-2' : 'h-12 pt-[2px]',

                'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
              ]"
              @click="openDepositDialog = true"
            >
              <QrCodeIcon
                :class="[
                  isOpenSideMenu ? ' mb-1 w-6 h-6 ' : 'w-[18px] h-[18px]',
                  'text-primary',
                ]"
              />
              <p
                :class="[
                  isOpenSideMenu ? 'text-s-12' : 'text-s-8 mt-[2px]',
                  'capitalize',
                ]"
              >
                {{ $t('deposit') }}
              </p>
            </button>
            <!-- Buy button -->
            <button
              :class="[
                isOpenSideMenu ? 'py-2' : 'h-12 pt-[2px]',
                'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
              ]"
              @click="openPanel(0)"
            >
              <icon-buy
                :class="[
                  isOpenSideMenu ? ' mb-1 w-6 h-6 ' : 'w-[19px] h-[19px]',
                  'text-primary',
                ]"
              />
              <p
                :class="[
                  isOpenSideMenu ? 'text-s-12' : 'text-s-8 mt-[2px]',
                  'capitalize',
                ]"
              >
                {{ $t('buy') }}
              </p>
            </button>
            <!--sell button-->
            <button
              :to="{ name: ROUTES_MAIN.BUY.NAME }"
              :class="[
                isOpenSideMenu ? 'py-2' : 'h-12 pt-[2px]',
                'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
              ]"
              @click="openPanel(1)"
            >
              <icon-buy
                :class="[
                  isOpenSideMenu ? ' mb-1 w-6 h-6 ' : 'w-[19px] h-[19px]',
                  'text-primary',
                ]"
              />
              <p
                :class="[
                  isOpenSideMenu ? 'text-s-12' : 'text-s-8 mt-[2px]',
                  'capitalize',
                ]"
              >
                {{ $t('sell') }}
              </p>
            </button>
            <!-- Send button -->
            <button
              @click="openPanel(2)"
              :class="[
                isOpenSideMenu ? 'py-2' : 'h-12 pt-[2px]',

                'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
              ]"
            >
              <icon-send
                :class="[
                  isOpenSideMenu ? ' mb-1 w-6 h-6 ' : 'w-[19px] h-[19px]',
                  'text-primary',
                ]"
              />
              <p
                :class="[
                  isOpenSideMenu ? 'text-s-12' : 'text-s-8 mt-[1px]',
                  'capitalize',
                ]"
              >
                {{ $t('common.send') }}
              </p>
            </button>
            <!-- Swap button -->
            <button
              @click="openPanel(3)"
              :class="[
                isOpenSideMenu ? 'py-2' : 'h-12 pt-[2px]',
                'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
              ]"
            >
              <icon-swap
                :class="[
                  isOpenSideMenu ? ' mb-1 w-6 h-6 ' : 'w-[19px] h-[19px]',
                  'text-primary',
                ]"
              />
              <p
                :class="[
                  isOpenSideMenu ? 'text-s-12' : 'text-s-8 mt-[1px]',
                  'capitalize',
                ]"
              >
                {{ $t('common.swap') }}
              </p>
            </button>
          </div>
          <div v-if="isOpenSideMenu" class="xs:max-w-[400px]">
            <transition name="fade" mode="out-in">
              <!-- Modules -->
              <ModuleSend v-if="walletPanel === 2" key="send" />
              <ModuleSwap v-else-if="walletPanel === 3" key="swap" />
              <div
                v-else
                key="coming-soon"
                class="mt-6 text-center font-medium"
              >
                {{ comingSoon }}
              </div>
            </transition>
          </div>
        </div>
      </div>

      <the-deposit-dialog v-model:open-dialog="openDepositDialog" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, computed } from 'vue'
import AppWalletCard from '@/components/AppWalletCard.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import IconSend from '@/assets/icons/core_menu/icon-send.vue'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import ModuleSend from '@/modules/send/ModuleSend.vue'
import ModuleSwap from '@/modules/swap/ModuleSwap.vue'

import {
  QrCodeIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/vue/24/outline'
import { ROUTES_MAIN } from '@/router/routeNames'
import AppBtnIcon from '../AppBtnIcon.vue'
import TheDepositDialog from '@/components/core_layouts/wallet/TheDepositDialog.vue'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu, walletPanel } = storeToRefs(walletMenu)

const breakpoints = useAppBreakpoints()
const { isXLAndUp, isXsAndUp } = breakpoints
const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)

onMounted(() => {
  if (isXLAndUp.value) {
    walletMenu.setIsOpenSideMenu(true)
  } else {
    walletMenu.setIsOpenSideMenu(false)
  }
})

watch(isXLAndUp, newVal => {
  if (newVal) {
    walletMenu.setIsOpenSideMenu(true)
  } else {
    walletMenu.setIsOpenSideMenu(false)
  }
})

const openPanel = (panel: number) => {
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
  walletMenu.setWalletPanel(panel)
}

const openDepositDialog = ref(false) //deposit dialog

const comingSoon = computed(() => {
  const map = new Map<number, string>([
    [0, 'Buy'],
    [1, 'Sell'],
  ])
  return map.get(walletPanel.value)
    ? `${map.get(walletPanel.value)} is coming soon`
    : 'Coming Soon'
})
</script>

<template>
  <div
    :class="[
      isOpenSideMenu
        ? 'w-screen xs:min-w-[400px] xs:max-w-[400px] xs:w-[400px] fixed top-0 xs:absolute'
        : 'min-w-[60px] w-[60px] absolute ',
      ' z-[50] lg:sticky  lg:mt-[1px]  right-0  h-screen transition-all duration-200 ease-out',
    ]"
  >
    <div
      :class="[
        isOpenSideMenu ? 'p-4' : 'p-[6px]',
        'bg-white h-full  shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32);]  overflow-y-scroll',
      ]"
    >
      <app-btn-icon
        label="expand"
        @click="walletMenu.setIsOpenSideMenu(!isOpenSideMenu)"
        :class="
          isXsAndUp || !isOpenSideMenu ? 'absolute top-2 -left-8 z-10' : ''
        "
      >
        <ChevronDoubleLeftIcon v-if="!isOpenSideMenu" class="w-5 h-5" />
        <ChevronDoubleRightIcon v-else class="w-5 h-5" />
      </app-btn-icon>
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
          'mt-2 flex justify-between gap-2 min-w-12',
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
            {{ $t('swap') }}
          </p>
        </button>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="isOpenSideMenu" class="max-w-[400px]">
          <transition name="fade" mode="out-in">
            <!-- Modules -->
            <ModuleSend v-if="walletPanel === 2" key="send" />
            <div v-else key="coming-soon" class="mt-6 text-center font-medium">
              {{ comingSoon }}
            </div>
          </transition>
        </div>
      </transition>
    </div>
    <the-deposit-dialog v-model:open-dialog="openDepositDialog" />
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
const { isDesktopAndUp, isXsAndUp } = breakpoints
const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)

onMounted(() => {
  if (isDesktopAndUp.value) {
    walletMenu.setIsOpenSideMenu(true)
  } else {
    walletMenu.setIsOpenSideMenu(false)
  }
})

watch(isDesktopAndUp, newVal => {
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
    [3, 'Swap'],
  ])
  return map.get(walletPanel.value)
    ? `${map.get(walletPanel.value)} is coming soon`
    : 'Coming Soon'
})
</script>

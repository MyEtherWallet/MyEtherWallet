<template>
  <div
    :class="[
      isOpenSideMenu
        ? 'xs:min-w-[400px] max-w-[400px] xs:w-[400px]'
        : 'min-w-[60px]',
      'absolute lg:sticky z-20  mt-[1px] top-0 right-0  lg:h-screen transition-all duration-200 ease-out',
    ]"
  >
    <div
      :class="[
        isOpenSideMenu ? 'p-4' : 'p-[6px]',
        'bg-white min-h-[calc(100vh-69px)] sm:h-[calc(100vh-200px)]  shadow-[0pxx_3px_12px_-6px_rgba(0,0,0,0.32);]  overflow-y-scroll',
      ]"
    >
      <app-btn-icon
        label="expand"
        @click="setIsOpenSideMenu(!isOpenSideMenu)"
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
          'mt-2 flex justify-between gap-2',
        ]"
      >
        <!-- Deposit button -->
        <button
          v-if="isWalletConnected"
          :class="[
            isOpenSideMenu ? 'py-2' : 'h-12 pt-[2px]',

            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click="openDeposit"
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
        <router-link
          :to="{ name: ROUTES_MAIN.BUY.NAME }"
          :class="[
            isOpenSideMenu ? 'py-2' : 'h-12 pt-[2px]',
            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click.stop.prevent="closeDialog"
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
            {{ $t('buy-sell') }}
          </p>
        </router-link>
        <!-- Send button -->
        <button
          @click="openPanel(0)"
          :class="[
            isOpenSideMenu ? 'py-2' : 'h-12 pt-[2px]',

            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click.stop.prevent="closeDialog"
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
          @click="openPanel(1)"
          :class="[
            isOpenSideMenu ? 'py-2' : 'h-12 pt-[2px]',
            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click.stop.prevent="closeDialog"
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
        <div v-if="isOpenSideMenu">
          <transition name="fade" mode="out-in">
            <!-- Modules -->
            <ModuleSend v-if="walletPanel === 0" key="send" />
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'
import AppWalletCard from '@/components/AppWalletCard.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useWalletMenu } from '@/composables/useWalletMenu'
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

const walletMenu = useWalletMenu()
const { isOpenSideMenu, walletPanel, setIsOpenSideMenu, setWalletPanel } =
  walletMenu

const breakpoints = useAppBreakpoints()
const { isDesktopAndUp, isXsAndUp } = breakpoints
const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)

const openDialog = ref(false)
const closeDialog = () => {
  openDialog.value = false
}

const openDeposit = () => {
  openDialog.value = true
}

onMounted(() => {
  if (isDesktopAndUp.value) {
    setIsOpenSideMenu(true)
  } else {
    setIsOpenSideMenu(false)
  }
})

watch(isDesktopAndUp, newVal => {
  if (newVal) {
    setIsOpenSideMenu(true)
  } else {
    setIsOpenSideMenu(false)
  }
})

const openPanel = (panel: number) => {
  if (!isOpenSideMenu.value) {
    setIsOpenSideMenu(true)
  }
  setWalletPanel(panel)
}
</script>

<template>
  <div
    :class="[
      isOpenSideMenu ? 'w-[400px]' : 'w-[64px]',
      'absolute z-20 pt-[69px] sm:pt-[77px] top-0 right-0  h-screen transition-all duration-300 ease-out',
    ]"
  >
    <div
      :class="[
        isOpenSideMenu ? 'p-4' : 'p-2',
        'bg-white h-full min-h-[500px] shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32);]',
      ]"
    >
      <app-wallet-card v-if="isWalletConnected" class="px-4" />
      <!-- Actions -->
      <div
        :class="[
          { 'flex-col mt-1': !isOpenSideMenu },
          'mt-4 flex justify-between gap-2',
        ]"
      >
        <button
          v-if="isWalletConnected"
          :class="[
            { 'h-12': !isOpenSideMenu },
            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click="openDeposit"
        >
          <QrCodeIcon
            :class="[{ 'mb-1': isOpenSideMenu }, 'w-7 h-7 text-primary']"
          />
          <p v-if="isOpenSideMenu" class="text-s-12">{{ $t('deposit') }}</p>
        </button>
        <router-link
          :to="{ name: ROUTES_MAIN.BUY.NAME }"
          :class="[
            { 'h-12': !isOpenSideMenu },
            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click.stop.prevent="closeDialog"
        >
          <icon-buy
            :class="[{ 'mb-1': isOpenSideMenu }, 'w-7 h-7 text-primary']"
          />
          <p v-if="isOpenSideMenu" class="text-s-12">{{ $t('buy-sell') }}</p>
        </router-link>
        <div
          @click="activePanel = 0"
          :class="[
            { 'h-12': !isOpenSideMenu },
            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click.stop.prevent="closeDialog"
        >
          <icon-send
            :class="[{ 'mb-1': isOpenSideMenu }, 'w-7 h-7 text-primary']"
          />
          <p v-if="isOpenSideMenu" class="text-s-12">{{ $t('common.send') }}</p>
        </div>
        <div
          @click="activePanel = 1"
          :class="[
            { 'h-12': !isOpenSideMenu },
            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click.stop.prevent="closeDialog"
        >
          <icon-swap
            :class="[{ 'mb-1': isOpenSideMenu }, 'w-7 h-7 text-primary']"
          />
          <p v-if="isOpenSideMenu" class="text-s-12">{{ $t('swap') }}</p>
        </div>
      </div>
      <div v-if="isOpenSideMenu">
        <p class="font-semibold text-s-24 mt-5 mb-1 ml-3">{{ panelTitle }}</p>
        <transition name="fade" mode="out-in">
          <!-- Modules -->
          <ModuleSend v-if="activePanel === 0" key="send" />
        </transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import AppWalletCard from '@/components/AppWalletCard.vue'
// import TableTokens from './components/TableTokens.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useWalletMenu } from '@/composables/useWalletMenu'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import IconSend from '@/assets/icons/core_menu/icon-send.vue'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import ModuleSend from '@/modules/send/ModuleSend.vue'
import { QrCodeIcon } from '@heroicons/vue/24/outline'
import { ROUTES_MAIN } from '@/router/routeNames'

const walletMenu = useWalletMenu()
const { isOpenSideMenu, setIsOpenSideMenu } = walletMenu

const breakpoints = useAppBreakpoints()
const { isDesktopAndUp } = breakpoints
const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)

const activePanel = ref(0)

const openDialog = ref(false)
const closeDialog = () => {
  openDialog.value = false
}

const openDeposit = () => {
  openDialog.value = true
}

const panelTitle = computed(() => {
  switch (activePanel.value) {
    case 0:
      return 'Send'
    case 1:
      return 'Swap'
    default:
      return ''
  }
})

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
</script>

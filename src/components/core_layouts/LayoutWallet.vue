<template>
  <div
    :class="[
      isOpenSideMenu ? 'min-w-[400px] max-w-[400px] w-[400px]' : 'min-w-[60px]',
      'absolute lg:sticky z-20  mt-[1px] top-0 right-0  lg:h-screen transition-all duration-200 ease-out',
    ]"
  >
    <div
      :class="[
        isOpenSideMenu ? 'p-4' : 'p-2',
        'bg-white min-h-[calc(100vh-69px)] sm:h-[calc(100vh-200px)]  shadow-[0pxx_3px_12px_-6px_rgba(0,0,0,0.32);]  overflow-y-scroll',
      ]"
    >
      <app-btn-icon
        label="expand"
        @click="setIsOpenSideMenu(!isOpenSideMenu)"
        class="absolute top-2 -left-8 z-10"
      >
        <ChevronDoubleLeftIcon class="w-5 h-5" />
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
        <button
          v-if="isWalletConnected"
          :class="[
            isOpenSideMenu ? 'py-2' : 'h-12',

            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click="openDeposit"
        >
          <QrCodeIcon
            :class="[{ 'mb-1': isOpenSideMenu }, 'w-6 h-6 text-primary']"
          />
          <p v-if="isOpenSideMenu" class="text-s-12">{{ $t('deposit') }}</p>
        </button>
        <router-link
          :to="{ name: ROUTES_MAIN.BUY.NAME }"
          :class="[
            isOpenSideMenu ? 'py-2' : 'h-12',
            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click.stop.prevent="closeDialog"
        >
          <icon-buy
            :class="[{ 'mb-1': isOpenSideMenu }, 'w-6 h-6 text-primary']"
          />
          <p v-if="isOpenSideMenu" class="text-s-12">{{ $t('buy-sell') }}</p>
        </router-link>
        <div
          @click="openPanel(0)"
          :class="[
            isOpenSideMenu ? 'py-2' : 'h-12',

            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click.stop.prevent="closeDialog"
        >
          <icon-send
            :class="[{ 'mb-1': isOpenSideMenu }, 'w-6 h-6 text-primary']"
          />
          <p v-if="isOpenSideMenu" class="text-s-12">{{ $t('common.send') }}</p>
        </div>
        <div
          @click="openPanel(1)"
          :class="[
            isOpenSideMenu ? 'py-2' : 'h-12',
            'rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG shadow-button shadow-button-elevated w-full',
          ]"
          @click.stop.prevent="closeDialog"
        >
          <icon-swap
            :class="[{ 'mb-1': isOpenSideMenu }, 'w-6 h-6 text-primary']"
          />
          <p v-if="isOpenSideMenu" class="text-s-12 capitalize">
            {{ $t('swap') }}
          </p>
        </div>
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
import { QrCodeIcon, ChevronDoubleLeftIcon } from '@heroicons/vue/24/outline'
import { ROUTES_MAIN } from '@/router/routeNames'
import AppBtnIcon from '../AppBtnIcon.vue'

const walletMenu = useWalletMenu()
const { isOpenSideMenu, walletPanel, setIsOpenSideMenu, setWalletPanel } =
  walletMenu

const breakpoints = useAppBreakpoints()
const { isDesktopAndUp } = breakpoints
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

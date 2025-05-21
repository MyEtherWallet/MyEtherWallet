<template>
  <div
    class="flex items-center w-full h-16 fixed top-0 z-10 px-5 md-header:px-10 bg-white bg-opacity-70 shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32);] backdrop-blur-xl"
  >
    <div
      class="flex w-full max-w-[1392px] justify-between items-center mx-auto gap-3"
    >
      <!-- LOGO -->
      <div class="flex items-center gap-2">
        <router-link
          :to="{ name: ROUTES_MAIN.HOME.NAME }"
          class="cursor-pointer mr-10"
        >
          <img
            v-if="!isXS"
            src="@/assets/images/mew/logo-header.webp"
            :alt="t('home')"
            width="280"
            height="96"
            class="w-[140px] h-[48px] flex-none object-contain"
          />
          <img
            v-else
            src="@/assets/images/access/portfolio_icon.webp"
            :alt="t('home')"
            width="100"
            height="100"
            class="w-8 h-8"
          />
        </router-link>

        <div v-if="isDesktopAndUp" class="flex items-center gap-2">
          <router-link
            v-for="(item, index) in displayLinks"
            :key="index"
            :to="{ name: item.routeName }"
            class="text-s-17 hoverNoBG px-3 py-1 rounded-full font-medium"
            active-class="bg-surface "
            v-ripple
          >
            {{ item.title }}
          </router-link>
        </div>

        <app-select
          v-if="isDesktopAndUp"
          v-model:selected="selectedOption"
          :options="displayTools"
          :placeholder="$t('tools')"
          use-vue-router
        >
          <template #select-button="{ toggleSelect }">
            <button
              class="rounded-full hoverNoBG px-3 py-1 font-medium text-base xl:text-lg flex items-center"
              @click="toggleSelect"
              @onHover="toggleSelect"
            >
              {{ $t('tools') }}
              <chevron-down-icon class="w-4 h-4 ml-2" />
            </button>
          </template>
        </app-select>
      </div>
      <div class="flex items-center justify-end gap-2 ml-auto">
        <app-select-chain
          v-if="isWalletConnected && !isMobile && !isAccessPage"
          :has-label="false"
          class="max-w-[178px]"
        />
        <button v-if="!isWalletConnected && isAccessPage">Create Wallet</button>
        <the-address-menu v-if="!isMobile" />
        <app-btn-icon
          v-if="isDesktopAndUp"
          :label="$t('menu.open-notifications')"
          @click="btnClick"
        >
          <bell-icon class="w-6 h-6" />
        </app-btn-icon>
        <app-btn-icon
          v-if="isDesktopAndUp && isWalletConnected"
          :label="$t('menu.open-settings')"
          @click="btnClick"
        >
          <cog-icon class="w-6 h-6" />
        </app-btn-icon>
      </div>
      <the-wallet-menu
        v-if="!isDesktopAndUp"
        :core-menu-list="coreMenuList"
        :tools-menu-list="toolsMenuList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSelectChain from '@/components/AppSelectChain.vue'
import AppSelect from '@/components/AppSelect.vue'
import TheWalletMenu from './TheWalletMenu.vue'
import TheAddressMenu from './TheAddressMenu.vue'
import { BellIcon, CogIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ROUTES_MAIN, ROUTES_SEND } from '@/router/routeNames'
import { type AppMenuListItem, ICON_IDS } from '@/types/components/menuListItem'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useBreakpoints } from '@vueuse/core'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const store = useWalletStore()
const { isWalletConnected } = storeToRefs(store)

const coreMenuList: AppMenuListItem[] = [
  {
    title: t('home'),
    routeName: ROUTES_MAIN.HOME.NAME,
    iconID: ICON_IDS.PORTFOLIO,
  },
  {
    title: t('swap'),
    routeName: ROUTES_MAIN.SWAP.NAME,
    iconID: ICON_IDS.SWAP,
  },
  {
    title: t('buy-sell'),
    routeName: ROUTES_MAIN.BUY.NAME,
    iconID: ICON_IDS.BUY,
  },
  {
    title: t('earn'),
    routeName: ROUTES_MAIN.EARN.NAME,
    iconID: ICON_IDS.STAKE,
  },
  {
    title: t('send'),
    routeName: ROUTES_SEND.SEND.NAME,
    iconID: ICON_IDS.SEND,
  },
]

const toolsMenuList: AppMenuListItem[] = [
  {
    title: t('verify-message'),
    routeName: ROUTES_MAIN.VERIFY_MESSAGE.NAME,
  },
  {
    title: t('sign-message'),
    routeName: ROUTES_MAIN.SIGN_MESSAGE.NAME,
  },
  {
    title: t('deploy-contract'),
    routeName: ROUTES_MAIN.DEPLOY_CONTRACT.NAME,
  },
  {
    title: t('interact-contract'),
    routeName: ROUTES_MAIN.INTERACT_WITH_CONTRACT.NAME,
  },
]

const breakpoints = useBreakpoints({
  hideSend: 1100,
})

const hideSend = computed<boolean>(() => breakpoints.smaller('hideSend').value)
const displayLinks = computed(() => {
  return hideSend.value ? coreMenuList.slice(0, 4) : coreMenuList
})
const displayTools = computed<AppSelectOption[]>(() => {
  const tools = [...toolsMenuList]
  if (hideSend.value) {
    tools.unshift(coreMenuList[4])
  }
  return tools.map(item => ({
    label: item.title,
    value: item.routeName as string,
  }))
})

const { isDesktopAndUp, isMobile, isXS } = useAppBreakpoints()

const btnClick = (payload: MouseEvent) => {
  console.log('btnClick', payload)
}

const selectedOption = ref<AppSelectOption>({
  label: toolsMenuList[0].title,
  value: toolsMenuList[0].routeName as string,
})

const router = useRouter()
const isAccessPage = computed(() => {
  return router.currentRoute.value.path === '/'
})
</script>

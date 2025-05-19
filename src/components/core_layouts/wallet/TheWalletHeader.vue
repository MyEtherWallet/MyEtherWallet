<template>
  <div
    class="flex items-center w-full h-16 fixed top-0 z-10 px-5 md-header:px-10 bg-white bg-opacity-70 shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32);] backdrop-blur-xl"
  >
    <div
      class="flex w-full max-w-[1392px] justify-between items-center mx-auto gap-3"
    >
      <!-- LOGO -->
      <div class="flex items-center">
        <img
          :src="IMGMewLogo"
          contain
          :alt="$t('home')"
          class="cursor-pointer mr-5"
          width="113px"
          height="auto"
          loading="lazy"
        />
        <div v-if="isDesktopAndUp">
          <router-link
            v-for="(item, index) in displayLinks"
            :key="index"
            class="font-medium text-base xl:text-lg hoverNoBG px-3 py-1 rounded-full"
            :to="{ name: item.routeName }"
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
              @hover="toggleSelect"
            >
              {{ $t('tools') }}
              <chevron-down-icon class="w-4 h-4 ml-2" />
            </button>
          </template>
        </app-select>
      </div>
      <div class="flex items-center justify-end gap-2 ml-auto">
        <app-select-chain
          v-if="!isMobile"
          :has-label="false"
          class="max-w-[178px]"
        />
        <the-address-menu v-if="!isMobile" />
        <app-btn-icon
          v-if="isDesktopAndUp"
          :label="$t('menu.open-notifications')"
          @click="btnClick"
        >
          <bell-icon class="w-6 h-6 opacity-80" />
        </app-btn-icon>
        <app-btn-icon
          v-if="isDesktopAndUp"
          :label="$t('menu.open-settings')"
          @click="btnClick"
        >
          <cog-icon class="w-6 h-6 opacity-80" />
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
import IMGMewLogo from '@/assets/images/mew/logo.svg'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSelectChain from '@/components/AppSelectChain.vue'
import AppSelect from '@/components/AppSelect.vue'
import TheWalletMenu from './TheWalletMenu.vue'
import TheAddressMenu from './TheAddressMenu.vue'
import { BellIcon, CogIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ROUTES_WALLET, ROUTES_SEND } from '@/router/routeNames'
import { type AppMenuListItem, ICON_IDS } from '@/types/components/menuListItem'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useBreakpoints } from '@vueuse/core'

const { t } = useI18n()

const coreMenuList: AppMenuListItem[] = [
  {
    title: t('portfolio'),
    routeName: ROUTES_WALLET.DASHBOARD.NAME,
    iconID: ICON_IDS.PORTFOLIO,
  },
  {
    title: t('swap'),
    routeName: ROUTES_WALLET.SWAP.NAME,
    iconID: ICON_IDS.SWAP,
  },
  {
    title: t('buy'),
    routeName: ROUTES_WALLET.BUY.NAME,
    iconID: ICON_IDS.BUY,
  },
  {
    title: t('stake'),
    routeName: ROUTES_WALLET.STAKE.NAME,
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
    routeName: ROUTES_WALLET.VERIFY_MESSAGE.NAME,
  },
  {
    title: t('sign-message'),
    routeName: ROUTES_WALLET.SIGN_MESSAGE.NAME,
  },
  {
    title: t('deploy-contract'),
    routeName: ROUTES_WALLET.DEPLOY_CONTRACT.NAME,
  },
  {
    title: t('interact-contract'),
    routeName: ROUTES_WALLET.INTERACT_WITH_CONTRACT.NAME,
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

const { isDesktopAndUp, isMobile } = useAppBreakpoints()

const btnClick = (payload: MouseEvent) => {
  console.log('btnClick', payload)
}

const selectedOption = ref<AppSelectOption>({
  label: toolsMenuList[0].title,
  value: toolsMenuList[0].routeName,
})
</script>

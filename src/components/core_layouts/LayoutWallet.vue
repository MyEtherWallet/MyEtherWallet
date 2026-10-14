<template>
  <div class="relative">
    <app-action-bar
      ref="actionBar"
      :items="actionItems"
      :active-id="isOpenSideMenu ? walletPanel : null"
      :expanded="isOpenSideMenu"
      :class="[
        {
          'shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32)]':
            hasShadow && !isOpenSideMenu,
        },
        'fixed right-0 top-[69px] sm:top-[77px] z-[50] h-[calc(100vh-69px)] sm:h-[calc(100vh-77px)] overflow-y-auto no-scrollbar scrollbar-hide',
      ]"
      @select="onSelect"
      @toggle="walletMenu.setIsOpenSideMenu(!isOpenSideMenu)"
    />
    <the-deposit-dialog v-model:open-dialog="openDepositDialog" />
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
            : 'border-border-default border-l-1',
        ]"
        class="fixed z-[51] sm:z-[49] bg-white right-0 sm:right-20 h-screen sm:h-[calc(100vh-77px)] top-0 sm:top-[77px] sm:max-w-[375px] px-4 pt-4 pb-6 sm:py-6 w-full overflow-y-auto no-scrollbar scrollbar-hide flex flex-col"
      >
        <app-btn-icon
          :label="$t('common.close_side_menu')"
          class="md:hidden flex-none ml-3"
          @click="walletMenu.setIsOpenSideMenu(false)"
        >
          <AppIcon name="chevron-double-right" size="s" />
        </app-btn-icon>
        <div class="flex-1 min-h-0">
          <transition name="fade" mode="out-in">
            <ModuleTrade v-if="walletPanel === 'trade'" key="trade" />
            <ModuleSend v-else-if="walletPanel === 'send'" key="send" />
            <ModuleSwap v-else-if="walletPanel === 'swap'" key="swap" />
            <ModuleSwap v-else-if="walletPanel === 'bridge'" key="bridge" />
            <ModulePerpsTrade
              v-else-if="walletPanel === 'perps'"
              key="perps-trade"
            />
            <ModulePurchase
              v-else-if="walletPanel === 'purchase'"
              key="purchase"
            />
            <div v-else key="coming-soon" class="mt-6 text-center font-medium">
              {{ comingSoon }}
            </div>
          </transition>
        </div>
      </div>
    </transition>
    <!-- WeekendTradingTooltip is intentionally not mounted — the weekend
         trading tooltip is disabled. Re-render it here with
         `:anchor="tradeBtnRef"` to bring it back; the component and its
         `shouldShowTooltip` gate in weekendTradingAnnouncementStore are
         unchanged. The WeekendTradingDialog is unaffected. -->
    <marketing-tooltip :anchor="tradeBtnRef" />
    <rwa-reward-modal />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, computed, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useWalletStore } from '@/stores/walletStore'
import { useWalletMenuStore, type WalletPanel } from '@/stores/walletMenuStore'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import ModuleSend from '@/modules/send/ModuleSend.vue'
import ModuleSwap from '@/modules/swap/ModuleSwap.vue'
import ModuleTrade from '@/modules/trade/ModuleTrade.vue'
import ModulePerpsTrade from '@/modules/perps/ModulePerpsTrade.vue'
import ModulePurchase from '@/modules/purchase/ModulePurchase.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppActionBar from '@/components/action_bar/AppActionBar.vue'
import type { ActionBarItem } from '@/components/action_bar/types'
import {
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
import TheDepositDialog from '@/components/core_layouts/wallet/TheDepositDialog.vue'
import MarketingTooltip from '@/components/core_layouts/MarketingTooltip.vue'
import RwaRewardModal from '@/modules/rwa_rewards/RwaRewardModal.vue'
import { useRoute } from 'vue-router'
import { pageRouteName } from '@/router/routeHierarchy'
import { useI18n } from 'vue-i18n'
import { analytics, ClickMainMenuEvent } from '@/analytics'

import AppIcon from '@/components/icon/AppIcon.vue'
const { t } = useI18n()
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu, walletPanel, hasShadow } = storeToRefs(walletMenu)

const breakpoints = useAppBreakpoints()
const { isXLAndUp, isMDAndUp } = breakpoints
const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
const route = useRoute()
// The connect/create overlays nest under the info routes, so compare against the
// deepest PAGE record rather than route.name (which would be e.g. the access route).
const page = computed(() => pageRouteName(route))

onMounted(() => {
  if (
    page.value === TOKEN_INFO_ROUTE_NAMES.crypto ||
    page.value === TOKEN_INFO_ROUTE_NAMES.home ||
    page.value === STOCK_INFO_ROUTE_NAMES.stocks ||
    page.value === STOCK_INFO_ROUTE_NAMES.home ||
    page.value === STOCK_INFO_ROUTE_NAMES.crypto
  ) {
    if (isXLAndUp.value) {
      walletMenu.setIsOpenSideMenu(true)
    } else {
      walletMenu.setIsOpenSideMenu(false)
    }
  }
})
watch(isMDAndUp, newVal => {
  if (
    page.value === TOKEN_INFO_ROUTE_NAMES.crypto ||
    page.value === TOKEN_INFO_ROUTE_NAMES.home
  ) {
    if (newVal) {
      walletMenu.setIsOpenSideMenu(true)
    } else {
      walletMenu.setIsOpenSideMenu(false)
    }
  }
})

watch(isXLAndUp, newVal => {
  if (
    page.value === TOKEN_INFO_ROUTE_NAMES.crypto ||
    page.value === TOKEN_INFO_ROUTE_NAMES.home
  ) {
    if (newVal) {
      walletMenu.setIsOpenSideMenu(true)
    } else {
      walletMenu.setIsOpenSideMenu(false)
    }
  }
})

const openPanel = (panel: WalletPanel) => {
  walletMenu.openPanel(panel)
  analytics.trackClickMainMenuEvent(ClickMainMenuEvent, {
    button: panel,
  })
}

const openDepositDialog = ref(false) //deposit dialog

// Deposit opens a dialog, not a side-menu panel, so it is never active.
type ActionId = WalletPanel | 'deposit'
const actionItems = computed(() => {
  const items: ActionBarItem<ActionId>[] = [
    { id: 'trade', icon: 'chart-bar', label: t('common.trade') },
    { id: 'swap', icon: 'arrow-path-rounded-square', label: t('common.swap') },
    { id: 'perps', icon: 'perpetuals', label: t('common.perps') },
    { id: 'bridge', icon: 'arrow-uturn-right', label: t('common.bridge') },
    { id: 'deposit', icon: 'arrow-down-tray', label: t('deposit') },
    { id: 'send', icon: 'paper-airplane', label: t('common.send') },
    { id: 'purchase', icon: 'currency-dollar', label: t('common.buy_sell') },
  ]
  return isWalletConnected.value
    ? items
    : items.filter(item => item.id !== 'deposit')
})

const onSelect = (id: ActionId) => {
  if (id === 'deposit') openDepositDialog.value = true
  else openPanel(id)
}

// MarketingTooltip anchors on the Trade button inside the rail.
const actionBar = useTemplateRef<ComponentPublicInstance>('actionBar')
const tradeBtnRef = computed<HTMLElement | null>(
  () => actionBar.value?.$el.querySelector('[data-action-id="trade"]') ?? null,
)

const comingSoon = computed(() => t('common.coming_soon'))
</script>

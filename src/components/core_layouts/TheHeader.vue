<template>
  <div
    class="flex items-center w-full h-[68px] sm:h-[76px] fixed top-0 px-5 md-header:px-5 bg-white shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32)]"
    :class="isSearchOpen ? 'z-[201]' : 'z-10'"
  >
    <div class="flex w-full justify-between items-center mx-auto gap-3">
      <!-- LOGO -->
      <div class="flex items-center gap-2 relative z-[0]">
        <router-link
          :to="{ name: ROUTES_MAIN.HOME.NAME }"
          class="cursor-pointer mr-1 sm:mr-4 xl:mr-10"
        >
          <img
            v-if="!isMobile"
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
        <!--Mobile Menu button -->
        <the-app-side-menu
          v-if="showMobileMenu"
          :core-menu-list="coreMenuList"
          :tools-menu-list="toolsMenuList"
          :learn-menu-list="learnMenuList"
        />
        <!--Desktop Menu -->
        <div v-if="!showMobileMenu" class="flex items-center gap-1 xl:gap-2">
          <router-link
            v-for="(item, index) in displayLinks"
            :key="index"
            :to="{ name: item.routeName }"
            class="text-s-16 hoverNoBG px-3 py-1 rounded-full font-medium capitalize"
            active-class="bg-surface"
            v-ripple
          >
            {{ item.title }}
          </router-link>
        </div>
        <app-select
          v-if="!showMobileMenu"
          :options="learnMenuList"
          :placeholder="$t('learn')"
          use-link
          has-on-Hover
        >
          <template #select-button="{ toggleSelect }">
            <button
              class="rounded-full hoverNoBG px-3 py-1 font-medium text-s-16 flex items-center capitalize"
              @click="toggleSelect"
            >
              {{ $t('learn') }}
              <chevron-down-icon class="w-4 h-4 ml-2" />
            </button>
          </template>
        </app-select>
        <app-select
          v-if="!showMobileMenu"
          v-model:selected="selectedOption"
          :options="displayTools"
          :placeholder="$t('tools')"
          use-vue-router
          has-on-Hover
        >
          <template #select-button="{ toggleSelect }">
            <button
              class="rounded-full hoverNoBG px-3 py-1 font-medium text-s-16 flex items-center capitalize"
              @click="toggleSelect"
            >
              {{ $t('common.more') }}
              <chevron-down-icon class="w-4 h-4 ml-2" />
            </button>
          </template>
        </app-select>
      </div>
      <!-- RIGHT SIDE -->
      <div class="flex flex-1 items-center justify-end gap-2 ml-auto min-w-0">
        <!-- GLOBAL SEARCH -->
        <module-global-search />
        <!-- Wallet area, trapped in its own stacking context so internal z-index
             can't escape and paint over the search overlay -->
        <div class="relative z-[0] flex items-center gap-2">
          <!-- Create wallet button -->
          <router-link
            v-if="!isWalletConnected"
            :to="{ name: ROUTES_CREATE_WALLET.CREATE_WALLET.NAME }"
            class="hidden xs:flex shrink-0 px-3 xl:px-4 border-1 border-black h-8 xs:h-10 text-s-14 lg:text-s-16 rounded-full hoverOpacity text-center flex items-center justify-center"
            @click="
              analytics.trackCreateWalletEvent(CreateWalletEvent.CLICKED, {
                source: 'Header_Create',
              })
            "
          >
            {{ $t('common.create_wallet') }}
          </router-link>
          <!-- Connect wallet button -->
          <router-link
            v-if="!isWalletConnected"
            :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
            @click="
              analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
                source: 'Header_Connect',
              })
            "
            class="shrink-0 px-3 xl:px-4 bg-black text-white h-8 xs:h-10 text-s-14 lg:text-s-16 rounded-full hoverOpacity text-center flex items-center justify-center"
          >
            {{ $t('connect_wallet') }}
          </router-link>
          <the-current-network />
          <!-- Address Menu -->
          <the-address-menu v-if="isWalletConnected" />
          <the-settings-popup />
          <the-notifications-popup v-if="isWalletConnected" />
        </div>
      </div>
    </div>
    <!-- Single dim overlay covering the viewport, lives inside header's stacking context -->
    <div
      class="fixed inset-0 bg-black/40 z-[1] transition-opacity duration-500"
      :class="
        isSearchOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      "
      @click="closeSearch"
    />
  </div>
</template>

<script setup lang="ts">
import AppSelect from '@/components/AppSelect.vue'
import TheAppSideMenu from './TheAppSideMenu.vue'
import TheAddressMenu from './wallet/TheAddressMenu.vue'
import TheCurrentNetwork from './wallet/TheCurrentNetwork.vue'
import TheNotificationsPopup from './TheNotificationsPopup.vue'
import TheSettingsPopup from './TheSettingsPopup.vue'
import ModuleGlobalSearch from '@/modules/global_search/ModuleGlobalSearch.vue'
import { useGlobalSearch } from '@/modules/global_search/composables/useGlobalSearch'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ROUTES_MAIN,
  ROUTES_ACCESS,
  ROUTES_CREATE_WALLET,
} from '@/router/routeNames'
import { type AppMenuListItem, ICON_IDS } from '@/types/components/menuListItem'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useWalletStore } from '@/stores/walletStore'
import { useTradingRestriction } from '@/composables/useTradingRestriction'
import { storeToRefs } from 'pinia'
import { WalletType, type HexPrefixedString } from '@/providers/types'
import { useChainsStore } from '@/stores/chainsStore'
import { watch } from 'vue'
import type Web3InjectedWallet from '@/providers/ethereum/web3InjectedWallet'
import type { Provider } from '@/stores/providerStore'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import { analytics } from '@/analytics'
import { ConnectWalletEvent, CreateWalletEvent } from '@/analytics/events'

const { t } = useI18n()
const store = useWalletStore()
const chainStore = useChainsStore()
const { isWalletConnected, wallet } = storeToRefs(store)
const { setWallet, setWatchOnlyIfExist, disconnectWallet } = store
const { isEvmChain, isBitcoinChain } = storeToRefs(chainStore)
const { isMobile, isXLMinAndUp } = useAppBreakpoints()
const { isTradingRestrictedInRegion } = useTradingRestriction()
const { isOpen: isSearchOpen, close: closeSearch } = useGlobalSearch()

/** ------------------------------
 * Breakpoints determine menu visibility
 ------------------------------*/

const showMobileMenu = computed<boolean>(() => !isXLMinAndUp.value)

/** ------------------------------
 * Menu Items
 ------------------------------*/
const coreMenuList = computed<AppMenuListItem[]>(() => {
  const items: AppMenuListItem[] = [
    {
      title: t('home'),
      routeName: ROUTES_MAIN.HOME.NAME,
      iconID: ICON_IDS.PORTFOLIO,
    },
    {
      title: t('stocks'),
      routeName: ROUTES_MAIN.STOCKS.NAME,
      iconID: ICON_IDS.STOCKS,
    },
    {
      title: t('crypto'),
      routeName: ROUTES_MAIN.CRYPTO.NAME,
      iconID: ICON_IDS.CRYPTO,
    },
  ]
  if (!isTradingRestrictedInRegion.value) {
    items.push({
      title: t('perpetuals'),
      routeName: ROUTES_MAIN.PERPS.NAME,
      iconID: ICON_IDS.PERPS,
    })
  }
  items.push({
    title: t('earn'),
    routeName: ROUTES_MAIN.EARN.NAME,
    iconID: ICON_IDS.STAKE,
  })
  return items
})
const toolsMenuList = computed<AppMenuListItem[]>(() => {
  return [
    {
      title: t('verify-message'),
      routeName: ROUTES_MAIN.VERIFY_MESSAGE.NAME,
    },
    {
      title: t('sign-message'),
      routeName: ROUTES_MAIN.SIGN_MESSAGE.NAME,
    },
  ]
})
const learnMenuList: AppSelectOption[] = [
  {
    label: 'Help Center',
    value: 'https://help.myetherwallet.com/en/',
  },
  {
    label: 'Blog',
    value: 'https://www.myetherwallet.com/blog',
  },
]

const displayLinks = computed(() => {
  return coreMenuList.value
})

const displayTools = computed<AppSelectOption[]>(() => {
  const tools = [...toolsMenuList.value]
  return tools.map(item => ({
    label: item.title,
    value: item.routeName as string,
  }))
})

/**
 * @selectedOption
 * @description: The selected option for the tools menu
 */
const selectedOption = ref<AppSelectOption>({
  label: toolsMenuList.value[0].title,
  value: toolsMenuList.value[0].routeName as string,
})

onMounted(() => {
  setWatchOnlyIfExist()
})

watch(
  () => wallet.value,
  newVal => {
    if (newVal?.getWalletType() === WalletType.INJECTED) {
      if (isEvmChain.value) {
        const injectedInfo = wallet.value?.getProviderInstance?.() as Provider
        injectedInfo?.provider.on(
          'accountsChanged',
          async (accounts: unknown) => {
            if (accounts && (accounts as string[]).length === 0) {
              disconnectWallet()
              return
            }
            if (
              (accounts as string[])[0] !== (await wallet.value?.getAddress())
            ) {
              const _wallet = wallet.value as Web3InjectedWallet
              _wallet.updateAddress(
                (accounts as string[])[0] as HexPrefixedString,
              )
              setWallet(_wallet, '', WalletConfigType.EXTENSION)
            }
          },
        )
      } else if (isBitcoinChain.value) {
        const unisatInfo =
          wallet.value?.getProviderInstance?.() as typeof window.unisat
        unisatInfo?.on('accountsChanged', async (accounts: unknown) => {
          if (
            (accounts as string[])[0] !== (await wallet.value?.getAddress())
          ) {
            const _wallet = wallet.value as Web3InjectedWallet
            _wallet.updateAddress(
              (accounts as string[])[0] as HexPrefixedString,
            )

            setWallet(_wallet, '', WalletConfigType.EXTENSION)
          }
        })
      }
    }
  },
)
</script>

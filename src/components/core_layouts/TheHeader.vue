<template>
  <div
    class="flex items-center w-full h-[68px] sm:h-[76px] fixed top-0 px-5 md-header:px-5 bg-white shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32)]"
    :class="isHeaderOverlayOpen ? 'z-[201]' : 'z-10'"
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
          v-model:selected="selectedOption"
          v-model:open="isMoreOpen"
          :options="moreMenuOptions"
          :placeholder="$t('common.more')"
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
        <the-address-menu v-if="isWalletConnected || hasAnySavedAccount" />
        <!-- Trigger-sized skeleton while a saved wallet is being restored on reload -->
        <div
          v-else-if="isRestoringWallet"
          class="w-[160px] h-10 rounded-[20px] bg-grey-10 animate-pulse shrink-0"
          aria-hidden="true"
        />
        <!-- Wallet area, trapped in its own stacking context so internal z-index
             can't escape and paint over the search overlay -->
        <div class="relative z-[0] flex items-center gap-2">
          <!-- Create wallet button -->
          <router-link
            v-if="
              !isWalletConnected && !isRestoringWallet && !hasAnySavedAccount
            "
            :to="createRoute"
            class="hidden sm:flex shrink-0 px-3 xl:px-4 border-1 border-black h-8 xs:h-10 text-s-14 lg:text-s-16 rounded-full hoverOpacity text-center items-center justify-center"
            @click="
              analytics.trackCreateWalletEvent(CreateWalletEvent.CLICKED, {
                source: 'Header_Create',
              })
            "
          >
            {{
              isWalletCtaShort
                ? $t('common.create_wallet_short')
                : $t('common.create_wallet')
            }}
          </router-link>
          <!-- Connect wallet button -->
          <router-link
            v-if="
              !isWalletConnected && !isRestoringWallet && !hasAnySavedAccount
            "
            :to="accessRoute"
            @click="
              analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
                source: 'Header_Connect',
              })
            "
            class="shrink-0 px-3 xl:px-4 bg-black text-white h-8 xs:h-10 text-s-14 lg:text-s-16 rounded-full hoverOpacity text-center hidden xs:flex items-center justify-center"
          >
            {{
              isWalletCtaShort
                ? $t('common.connect_wallet_short')
                : $t('connect_wallet')
            }}
          </router-link>
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
import TheNotificationsPopup from './TheNotificationsPopup.vue'
import TheSettingsPopup from './TheSettingsPopup.vue'
import ModuleGlobalSearch from '@/modules/global_search/ModuleGlobalSearch.vue'
import { useGlobalSearch } from '@/modules/global_search/composables/useGlobalSearch'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useBreakpoints } from '@vueuse/core'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { ROUTES_MAIN } from '@/router/routeNames'
import { useWalletFlowRoute } from '@/composables/useWalletFlowRoute'
import { type AppMenuListItem, ICON_IDS } from '@/types/components/menuListItem'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useGlobalStore } from '@/stores/globalStore'
import { storeToRefs } from 'pinia'
import { useChainsStore } from '@/stores/chainsStore'
import { watch } from 'vue'
import { useDetectedAddress } from '@/composables/useDetectedAddress'
import { analytics } from '@/analytics'
import { ConnectWalletEvent, CreateWalletEvent } from '@/analytics/events'

const { t } = useI18n()
const store = useWalletStore()
const chainStore = useChainsStore()
const { isWalletConnected } = storeToRefs(store)
const { setWatchOnlyIfExist } = store
const { selectedChain } = storeToRefs(chainStore)
const { refreshDetectedAddress } = useDetectedAddress()
// Both CTAs open the flow over the CURRENT page (/stocks/access, not /portfolio/access),
// so cancelling returns the user here instead of rerouting them.
const { accessRoute, createRoute } = useWalletFlowRoute()
const watchOnlyStore = useWatchOnlyStore()
const { isMobile, isXLMinAndUp } = useAppBreakpoints()
// The perps nav entry is no longer gated on region — perps renders a blocked
// state instead of disappearing. The check is still kicked off here, on a
// component mounted at app start, so it is resolved by the time any perps
// surface reads it and none of them flash their restricted state.
useGlobalStore().fetchTradingRestriction()
const { isOpen: isSearchOpen, close: closeSearch } = useGlobalSearch()

/**
 * The header is `fixed z-10`, i.e. its own stacking context, so a dropdown's
 * internal z-index can't rise above the sibling trade drawer (z-[49..51]). When
 * any header overlay is open we lift the whole header to z-[201] — the same
 * trick already used for search — so the popover paints above the drawer
 * instead of being clipped behind it (MEW-2113).
 */
const isMoreOpen = ref(false)
const isHeaderOverlayOpen = computed<boolean>(
  () => isSearchOpen.value || isMoreOpen.value,
)

/** ------------------------------
 * Wallet-restore skeleton
 * On reload the wallet is restored asynchronously in onMounted. While a saved
 * address is being restored, show a trigger-sized skeleton instead of the
 * create/connect buttons to avoid the flicker + layout shift.
 ------------------------------*/
const hasStoredWallet = computed<boolean>(
  () =>
    (watchOnlyStore.watchOnlyAddresses[selectedChain.value?.type ?? 'EVM']
      ?.length ?? 0) > 0,
)
// Any saved account across chain types — keep the address menu mounted even when
// nothing is connected for the current network, so switching to a network with no
// address doesn't hide the trigger / tear the popup down.
const hasAnySavedAccount = computed<boolean>(() =>
  Object.values(watchOnlyStore.watchOnlyAddresses).some(
    bucket => (bucket?.length ?? 0) > 0,
  ),
)
const isRestoringWallet = ref(false)

/** ------------------------------
 * Breakpoints determine menu visibility
 ------------------------------*/

const showMobileMenu = computed<boolean>(() => !isXLMinAndUp.value)

/**
 * Header-specific collapse thresholds (not Tailwind breakpoints) that shrink the
 * network button and wallet CTAs as the viewport narrows, before the bar drops
 * to the mobile hamburger at `xl-min`/1140px.
 */
const headerCollapse = useBreakpoints({
  networkConnected: 1310,
  walletCta: 1500,
  network: 1555,
})
/**
 * Below 1500px the Create/Connect wallet CTAs drop the "wallet" word ("Create",
 * "Connect") to save space before the network button collapses.
 */
const isWalletCtaShort = computed<boolean>(
  () => headerCollapse.smaller('walletCta').value,
)

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
      title: t('common.portfolio'),
      routeName: ROUTES_MAIN.PORTFOLIO.NAME,
      iconID: ICON_IDS.PORTFOLIO,
    },
    {
      title: t('common.stocks'),
      routeName: ROUTES_MAIN.STOCKS.NAME,
      iconID: ICON_IDS.STOCKS,
    },
    {
      title: t('common.crypto'),
      routeName: ROUTES_MAIN.CRYPTO.NAME,
      iconID: ICON_IDS.CRYPTO,
    },
    {
      title: t('perpetuals'),
      routeName: ROUTES_MAIN.PERPS.NAME,
      iconID: ICON_IDS.PERPS,
    },
  ]
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
const learnMenuList = computed<AppSelectOption[]>(() => [
  {
    label: t('common.help_center'),
    value: 'https://help.myetherwallet.com/en/',
  },
  {
    label: t('common.blog'),
    value: 'https://www.myetherwallet.com/blog',
  },
])

const displayLinks = computed(() => coreMenuList.value)

const displayTools = computed<AppSelectOption[]>(() => {
  const tools = [...toolsMenuList.value]
  return tools.map(item => ({
    label: item.title,
    value: item.routeName as string,
  }))
})

/**
 * Options for the "More" dropdown: Learn's external links (kept at the top),
 * then the tools. Learn no longer has its own top-bar dropdown, so its links
 * are always folded in here.
 */
const moreMenuOptions = computed<AppSelectOption[]>(() => {
  return [
    ...learnMenuList.value.map(item => ({
      label: item.label,
      value: item.value,
      external: true,
    })),
    ...displayTools.value,
  ]
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
  // Expect a restore when storage has a saved address for the active chain type.
  if (hasStoredWallet.value && !isWalletConnected.value) {
    isRestoringWallet.value = true
  }
  setWatchOnlyIfExist()
  // Safety net: never leave the skeleton up indefinitely if the restore fails.
  setTimeout(() => {
    isRestoringWallet.value = false
  }, 5000)
})

// Stop restoring as soon as a wallet is connected; also reconcile the detected
// address (the extension may already be on a different, unsaved account).
watch(isWalletConnected, connected => {
  if (connected) {
    isRestoringWallet.value = false
    void refreshDetectedAddress()
  }
})

// MEW-1840: detect an extension address that differs from the connected one so
// the Manage Accounts popup can offer "Save address" — without auto-switching.
// Provider-agnostic (works for Enkrypt-BTC/Unisat/EVM): re-query the live
// address on the triggers below instead of relying on provider `accountsChanged`
// events, whose API diverges across wallets.
const onWindowFocus = (): void => {
  void refreshDetectedAddress()
}
const onVisibilityChange = (): void => {
  if (document.visibilityState === 'visible') void refreshDetectedAddress()
}
onMounted(() => {
  window.addEventListener('focus', onWindowFocus)
  document.addEventListener('visibilitychange', onVisibilityChange)
})
onBeforeUnmount(() => {
  window.removeEventListener('focus', onWindowFocus)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

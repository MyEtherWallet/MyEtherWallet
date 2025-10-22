<template>
  <div
    class="flex items-center w-full h-[68px] sm:h-[76px] fixed top-0 z-10 px-5 md-header:pl-10 md-header:pr-5 bg-white shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32);]"
  >
    <div class="flex w-full justify-between items-center mx-auto gap-3">
      <!-- LOGO -->
      <div class="flex items-center gap-2">
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
        />
        <!--Desktop Menu -->
        <div v-if="!showMobileMenu" class="flex items-center gap-1 xl:gap-2">
          <router-link
            v-for="(item, index) in displayLinks"
            :key="index"
            :to="{ name: item.routeName }"
            class="text-s-17 hoverNoBG px-3 py-1 rounded-full font-medium capitalize"
            active-class="bg-surface"
            v-ripple
          >
            {{ item.title }}
          </router-link>
        </div>
        <a
          v-if="!showMobileMenu"
          href="https://help.myetherwallet.com/en/"
          target="_blank"
          class="text-s-17 hoverNoBG px-3 py-1 rounded-full font-medium capitalize"
        >
          {{ $t('learn') }}
        </a>
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
              class="rounded-full hoverNoBG px-3 py-1 font-medium text-s-17 flex items-center capitalize"
              @click="toggleSelect"
            >
              {{ $t('common.more') }}
              <chevron-down-icon class="w-4 h-4 ml-2" />
            </button>
          </template>
        </app-select>
      </div>
      <!-- RIGHT SIDE -->
      <div class="flex items-center justify-end gap-2 ml-auto">
        <!-- Create wallet button -->
        <router-link
          v-if="!isWalletConnected && isAccessPage"
          :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
          class="px-4 bg-black text-white h-8 sm:h-10 rounded-full hoverOpacity text-center flex items-center justify-center"
        >
          {{ $t('common.create_wallet') }}
        </router-link>
        <router-link
          v-if="!isXS && !isWalletConnected && !isAccessPage"
          :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
          class="px-4 py-2 border-1 border-black text-black h-8 sm:h-10 rounded-full hoverNoBG text-center flex items-center justify-center"
        >
          {{ $t('common.create_wallet') }}
        </router-link>
        <!-- Connect wallet button -->
        <button
          v-if="!isWalletConnected && !isAccessPage"
          @click="connectWallet"
          class="px-4 bg-black text-white h-8 sm:h-10 rounded-full hoverOpacity text-center flex items-center justify-center"
        >
          {{ $t('connect_wallet') }}
        </button>
        <the-current-network v-if="isWalletConnected && !isAccessPage" />
        <!-- Address Menu -->
        <the-address-menu v-if="isWalletConnected && !isAccessPage" />
        <!-- Notifications Button -->
        <app-btn-icon
          v-if="!showMobileMenu && isWalletConnected"
          :label="$t('menu.open-notifications')"
          @click="btnClick"
        >
          <bell-icon class="w-6 h-6" />
        </app-btn-icon>
        <!-- Settings Button -->
        <app-btn-icon
          v-if="!showMobileMenu"
          :label="$t('menu.open-settings')"
          @click="btnClick"
        >
          <cog-icon class="w-6 h-6" />
        </app-btn-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSelect from '@/components/AppSelect.vue'
import TheAppSideMenu from './TheAppSideMenu.vue'
import TheAddressMenu from './wallet/TheAddressMenu.vue'
import TheCurrentNetwork from './wallet/TheCurrentNetwork.vue'
import { BellIcon, CogIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ROUTES_MAIN, ROUTES_ACCESS } from '@/router/routeNames'
import { type AppMenuListItem, ICON_IDS } from '@/types/components/menuListItem'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAccessStore } from '@/stores/accessStore'
import { WalletType, type HexPrefixedString } from '@/providers/types'
import { useChainsStore } from '@/stores/chainsStore'
import { watch } from 'vue'
import type Web3InjectedWallet from '@/providers/ethereum/web3InjectedWallet'
import type { Provider } from '@/stores/providerStore'

const { t } = useI18n()
const store = useWalletStore()
const chainStore = useChainsStore()
const { isWalletConnected, wallet } = storeToRefs(store)
const { setWallet } = store
const { isEvmChain, isBitcoinChain } = storeToRefs(chainStore)
const { isMobile, isXS, isXLMinAndUp } = useAppBreakpoints()

/** ------------------------------
 * Breakpoints determine menu visibility
 ------------------------------*/

const showMobileMenu = computed<boolean>(() => !isXLMinAndUp.value)

/** ------------------------------
 * Menu Items
 ------------------------------*/
const coreMenuList = computed<AppMenuListItem[]>(() => {
  return [
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
    {
      title: t('earn'),
      routeName: ROUTES_MAIN.EARN.NAME,
      iconID: ICON_IDS.STAKE,
    },
  ]
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
    {
      title: t('deploy-contract'),
      routeName: ROUTES_MAIN.DEPLOY_CONTRACT.NAME,
    },
    {
      title: t('interact-contract'),
      routeName: ROUTES_MAIN.INTERACT_WITH_CONTRACT.NAME,
    },
  ]
})

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

const btnClick = (payload: MouseEvent) => {
  console.log('btnClick', payload)
}

watch(
  () => wallet.value,
  newVal => {
    if (newVal?.getWalletType() === WalletType.INJECTED) {
      if (isEvmChain.value) {
        const injectedInfo = wallet.value?.getProviderInstance?.() as Provider
        injectedInfo?.provider.on(
          'accountsChanged',
          async (accounts: unknown) => {
            if (
              (accounts as string[])[0] !== (await wallet.value?.getAddress())
            ) {
              const _wallet = wallet.value as Web3InjectedWallet
              _wallet.updateAddress(
                (accounts as string[])[0] as HexPrefixedString,
              )

              setWallet(_wallet)
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

            setWallet(_wallet)
          }
        })
      }
    }
  },
)

/** ------------------------------
 * Determine if the user is on the access page
 * USed to show the create wallet button
 ------------------------------*/
const route = useRoute()
const isAccessPage = computed(() => {
  return (
    route.path === ROUTES_ACCESS.ACCESS.PATH ||
    route.matched.some(route => route.path === ROUTES_ACCESS.ACCESS.PATH)
  )
})

/** ------------------------------
 * Connect Wallet
 ------------------------------*/
const accessStore = useAccessStore()

const connectWallet = () => {
  accessStore.openAccessDialog()
}
</script>

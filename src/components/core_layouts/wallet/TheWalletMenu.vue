<template>
  <div>
    <transition
      enter-active-class="transform ease-out duration-500 transition opacity-0 "
      enter-to-class="opacity-100"
      leave-active-class="opacity-0"
      leave-to-class="opacity-0"
      appear
    >
      <div
        v-if="sidebarIsOpen && !isDesktop"
        class="cursor-pointer fixed inset-0 bg-black/30 z-[39] h-screen w-screen overscroll-none overflow-hidden"
        @click="emit('clickClose')"
        aria-hidden
      />
    </transition>
    <aside
      id="default-sidebar"
      :class="[
        'fixed top-0 left-0 z-40 w-[300px] h-screen transition-transform duration-500 -translate-x-full bg-side-menu]',
        { 'translate-x-0': sidebarIsOpen },
      ]"
      aria-label="Sidebar"
    >
      <div class="h-full px-3 py-4 overflow-y-auto bg-side-menu">
        <div class="flex items-center justify-between mb-4">
          <img
            :src="IMGMewLogo"
            contain
            alt="home"
            class="cursor-pointer"
            width="113px"
            height="auto"
            loading="lazy"
          />
          <AppBtnIconClose
            @click="emit('clickClose')"
            class="lg:hidden"
            is-white
          />
        </div>
        <!-- TODO -->
        <p class="py-2">ACTIVE NETWORK</p>
        <div>
          <p class="py-2">CARD</p>
        </div>
        <div class="relative">
          <transition-group name="fadelist">
            <!-- CORE MENU -->
            <div key="app-core-menu" class="py-2">
              <menu-list-item
                v-for="item in coreMenuList"
                :key="item"
                :list-item="item"
                :active-item-title="activeItem"
                @click="clickListItem(item)"
              />
            </div>
            <!-- DIVIDER -->
            <div
              key="app-menu-divider-1"
              class="border-b border-white/30"
            ></div>
            <!-- MESSAGES MENU -->
            <div key="app-messages-dropdown" class="py-2">
              <menu-list-item
                :list-item="messageTitle"
                :is-drop-down="true"
                :is-drop-down-open="showMesSubmenu"
                :active-item-title="activeItem"
                @click="showMesSubmenu = !showMesSubmenu"
              />
            </div>
            <div v-if="showMesSubmenu" key="app-messages-menu">
              <menu-list-item
                v-for="item in messageMenuList"
                :key="item"
                :list-item="item"
                :is-submenu="true"
                :active-item-title="activeItem"
                @click="clickListItem(item)"
              />
            </div>
            <!-- CONTRACT MENU  -->
            <div key="app-contract-dropdown" class="py-2">
              <menu-list-item
                :list-item="contractTitle"
                :is-drop-down="true"
                :is-drop-down-open="showContractSubmenu"
                :active-item-title="activeItem"
                @click="showContractSubmenu = !showContractSubmenu"
              />
            </div>
            <div v-if="showContractSubmenu" key="4" class="app-contract-menu">
              <menu-list-item
                v-for="item in contractMenuList"
                :key="item"
                :list-item="item"
                :is-submenu="true"
                :active-item-title="activeItem"
                @click="clickListItem(item)"
              />
            </div>
            <!--  DIVIDER -->
            <div
              key="app-menu-divider-2"
              class="border-b border-white/30"
            ></div>
            <!--  OTHER MENU (Settings, etc) -->
            <div key="app-other-menu" class="py-2">
              <menu-list-item
                v-for="item in toolsMenuList"
                :key="item"
                :list-item="item"
                :active-item-title="activeItem"
                @click="clickListItem(item)"
              />
            </div>
          </transition-group>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import IMGMewLogo from '@/assets/images/mew/logo-white.svg'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { ROUTES_WALLET } from '@/router/routeNames'
import type { AppMenuListItem } from '@/types/components/menuListItem'
import IconSend from '@assets/icons/core_menu/send.svg'
import { ref } from 'vue'
import MenuListItem from './MenuListItem.vue'

defineProps({
  sidebarIsOpen: {
    default: false,
    type: Boolean,
  },
})

const { isDesktop } = useAppBreakpoints()
const emit = defineEmits<{
  (e: 'clickClose'): void
}>()

/** ------------------------------
 * Core Menu
 ------------------------------*/
const coreMenuList: AppMenuListItem[] = [
  {
    title: 'portfolio',
    routeName: ROUTES_WALLET.DASHBOARD.NAME,
    icon: IconSend,
  },
  {
    title: 'swap',
    // routeName: ROUTES_WALLET.SWAP.NAME,
    icon: IconSend,
  },
  {
    title: 'send',
    routeName: ROUTES_WALLET.SEND.NAME,
    icon: IconSend,
    icon: IconSend,
  },
  {
    title: 'deposit',
    icon: IconSend,
  },
  {
    title: 'buy/sell',
    icon: IconSend,
  },
  {
    title: 'stake',
    // routeName: ROUTES_WALLET.STAKE.NAME,
    icon: IconSend,
  },
]
/** ------------------------------
 * Contract MENU
 ------------------------------*/
const showContractSubmenu = ref(false)

const contractTitle: ListItem = {
  title: 'contract',
  icon: IconSend,
}
const contractMenuList: ListItem[] = [
  {
    title: 'deploy contract',
    // routeName: ROUTES_WALLET.DEPLOY_CONTRACT.NAME,
  },
  {
    title: 'interact with contract',
    // routeName: ROUTES_WALLET.INTERACT_CONTRACT.NAME,
  },
]

/** ------------------------------
 * Messages
 ------------------------------*/
const showMesSubmenu = ref(false)

const messageTitle = {
  title: 'message',
  icon: IconSend,
  isActive: false,
}
const messageMenuList: ListItem[] = [
  {
    title: 'sign message',
    // routeName: ROUTES_WALLET.SIGN_MESSAGE.NAME,
  },
  {
    title: 'verify message',
    // routeName: ROUTES_WALLET.VERIFY_MESSAGE.NAME,
  },
]
/** ------------------------------
 * Tools MENU
 ------------------------------*/
const toolsMenuList: ListItem[] = [
  {
    title: 'settings',
    icon: IconSend,
    // routeName: ROUTES_WALLET.SETTINGS.NAME,
  },
]

/** ------------------------------
 * Menu Methods
 ------------------------------*/
const activeItem = ref<string>(coreMenuList[0].title)
console.log('activeItem', activeItem.value)
//TODO: Add click handler
const clickListItem = (item: AppMenuListItem) => {
  console.log('clickListItem', item)
  activeItem.value = item.title
}
</script>
<!--
<style lang="scss" scoped>
a {
  text-decoration: none;
  color: var(--v-greenPrimary-base) !important;
  font-weight: 500;
}

.mew-connect-text > div {
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
  color: var(--v-greenPrimary-base);
}

.party-popper-container {
  background-color: var(--v-whiteBg-base);
  box-shadow:
    0px 5px 30px rgba(166, 173, 201, 0.22),
    0px 5px 5px rgba(154, 160, 185, 0.05);
  border-radius: 100px;
}

.time-container {
  background-color: var(--v-blueMedium-base);
  border-radius: 4px;
}

.margin-one-off {
  margin-top: 2px;
}

.set-fixed-height {
  height: 52px;
}

.eth-banner {
  margin-left: -15px;
}

.ad-button-template {
  border-radius: 12px;
  height: 48px;
  min-width: 130px;
  padding: 0 15px;

  img {
    padding: 7px;
  }
}

.img-holder {
  background-color: white;
  border: 1px #99a1b3 solid;
  border-radius: 12px;
}
</style> -->

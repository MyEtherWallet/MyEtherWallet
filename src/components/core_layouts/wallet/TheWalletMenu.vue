<template>
  <div class="relative">
    <!-- OPEN Mobile Menu-->
    <app-btn-icon
      @click="sidebarIsOpen = !sidebarIsOpen"
      :label="$t('menu.open-menu')"
    >
      <Bars3Icon class="w-8 h-8" />
    </app-btn-icon>
    <!-- Background -->
    <teleport to="#app">
      <transition
        enter-from-class="opacity-0"
        enter-active-class="transform ease-out duration-300 transition"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-active-class="ease-in duration-100 transition"
        leave-to-class="opacity-0"
        appear
      >
        <div
          v-if="sidebarIsOpen"
          class="cursor-pointer fixed inset-0 bg-black/30 z-[39] h-screen w-screen overscroll-none overflow-hidden"
          @click="sidebarIsOpen = false"
          aria-hidden
        />
      </transition>
    </teleport>
    <!-- Side Menu -->
    <teleport to="#app">
      <transition
        enter-from-class="opacity-0 -translate-x-full"
        enter-active-class="transform ease-out duration-300 transition "
        enter-to-class="translate-x-0"
        leave-from-class="transform ease-out duration-300 translate-x-0"
        leave-active-class="transition -translate-x-full"
        appear
      >
        <aside
          v-if="sidebarIsOpen"
          id="default-sidebar"
          class="fixed top-0 left-0 z-40 w-[300px] h-screen bg-white"
          aria-label="Sidebar"
        >
          <div class="h-full px-3 py-4 overflow-y-auto bg-white">
            <div class="flex items-center justify-between mb-4">
              <img
                src="@/assets/images/mew/logo-header.webp"
                :alt="t('home')"
                width="280"
                height="96"
                class="w-[94px] h-[32px] flex-none object-contain"
              />
              <AppBtnIconClose @click="sidebarIsOpen = false" />
            </div>
            <select-chain-for-app
              v-if="isMobile && isWalletConnected"
              :has-label="false"
              class="mb-2"
            />
            <the-address-menu
              v-if="isMobile && isWalletConnected"
              class="mb-2"
            />
            <div class="relative">
              <transition-group name="fadelist">
                <!-- CORE MENU -->
                <div key="app-core-menu" class="pt-0">
                  <menu-list-item
                    v-for="item in coreMenuList"
                    :key="item.title"
                    :list-item="item"
                    @click="clickListItem(item)"
                  />
                </div>
                <!-- TOOLS MENU -->
                <menu-list-item
                  :list-item="toolsMenuItem"
                  :is-drop-down-open="showToolsSubmenu"
                  is-drop-down
                  key="app-tools-menu"
                  @click="showToolsSubmenu = !showToolsSubmenu"
                />
                <div v-if="showToolsSubmenu" key="app-tools-submenu">
                  <menu-list-item
                    v-for="item in toolsMenuList"
                    :key="item.title"
                    :list-item="item"
                    is-submenu
                    @click="clickListItem(item)"
                  />
                </div>
                <!--  DIVIDER -->
                <hr
                  class="h-px bg-grey-outline border-0 w-full my-3"
                  key="app-menu-divider-2"
                />
                <!--  OTHER MENU (Settings, etc) -->
                <menu-list-item
                  v-for="item in otherMenuList"
                  :key="item.title"
                  :list-item="item"
                  @click="clickListItem(item)"
                />
                <div
                  v-if="!isWalletConnected"
                  class="flex flex-col gap-3 pt-5 px-5 mt-1"
                >
                  <router-link
                    :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
                    class="px-4 bg-black text-white h-10 rounded-full hoverOpacity text-center flex items-center justify-center"
                  >
                    {{ $t('connect_wallet') }}
                  </router-link>
                  <router-link
                    :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
                    class="px-4 py-2 border-1 border-black text-black h-10 rounded-full hoverNoBG text-center flex items-center justify-center"
                  >
                    {{ $t('common.create_wallet') }}
                  </router-link>
                </div>
              </transition-group>
            </div>
          </div>
        </aside>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { type AppMenuListItem, ICON_IDS } from '@/types/components/menuListItem'
import { Bars3Icon } from '@heroicons/vue/24/solid'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import TheAddressMenu from './TheAddressMenu.vue'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import MenuListItem from './MenuListItem.vue'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { ROUTES_ACCESS } from '@/router/routeNames'

const { t } = useI18n()
const store = useWalletStore()
const { isWalletConnected } = storeToRefs(store)

const { isMobile } = useAppBreakpoints()

defineProps({
  coreMenuList: {
    type: Array as () => AppMenuListItem[],
    required: true,
  },
  toolsMenuList: {
    type: Array as () => AppMenuListItem[],
    required: true,
  },
})

const sidebarIsOpen = ref(false)
const showToolsSubmenu = ref(false)

const toolsMenuItem = computed<AppMenuListItem>(() => {
  return {
    title: t('tools'),
    iconID: ICON_IDS.TOOLS,
  }
})
const otherMenuList = computed<AppMenuListItem[]>(() => {
  return [
    {
      title: t('settings'),
      iconID: ICON_IDS.SETTINGS,
    },
    {
      title: t('notifications'),
      iconID: ICON_IDS.NOTIFICATIONS,
    },
  ]
})

/** ------------------------------
 * Menu Methods
 ------------------------------*/
//TODO: Add click handler
const clickListItem = (item: AppMenuListItem) => {
  console.log('clickListItem', item)
  sidebarIsOpen.value = false
}
</script>

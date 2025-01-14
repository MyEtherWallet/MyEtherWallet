<template>
  <div
    role="tablist"
    aria-label="Send Tabs"
    class="flex justify-start gap-3 -ml-4"
    @keydown="handleKeyDown"
  >
    <div v-for="tab in tabs" :key="tab.id" role="presentation">
      <router-link
        :to="{ name: tab.routeName }"
        class="text-xl px-4 py-2 rounded-full opacity-60 hoverNoBG font-semibold hover:opacity-100"
        exact-active-class="!opacity-100  underline underline-offset-[14px] decoration-primary decoration-[1.5px]"
        role="tab"
        :aria-selected="currentRouteName === tab.routeName"
        :aria-controls="tab.controlsPanel"
        :tabindex="currentRouteName === tab.routeName ? 0 : -1"
        :id="tab.id"
      >
        {{ tab.name }}
      </router-link>
    </div>
  </div>

  <div
    :id="activePanel.id"
    :aria-labelledby="activePanel.ariaLabelledBy"
    role="tabpanel"
    :aria-hidden="currentRouteName !== activePanel.routeName"
  >
    <div v-if="currentRouteName === activePanel.routeName" class="mt-10">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ROUTES_SEND } from '@/router/routeNames'

/** ----------------
 * TABS
 ------------------*/

enum TAB_ID {
  SEND = 'tab-send',
  SEND_NFT = 'tab-send-nft',
}
enum PANEL_ID {
  SEND = `tab-send-content`,
  SEND_NFT = `tab-send-nft-content`,
}
interface Tab_Route {
  name: string
  routeName: string
  controlsPanel: PANEL_ID
  id: TAB_ID
}

const tabs: Tab_Route[] = [
  {
    name: 'Send Tokens',
    routeName: ROUTES_SEND.SEND.NAME,
    controlsPanel: PANEL_ID.SEND,
    id: TAB_ID.SEND,
  },
  {
    name: 'Send NFT',
    routeName: ROUTES_SEND.SEND_NFT.NAME,
    controlsPanel: PANEL_ID.SEND_NFT,
    id: TAB_ID.SEND_NFT,
  },
]
const route = useRoute()

const currentRouteName = computed(() => route.name)

/** ----------------
 * TAB PANELS
 ------------------*/
interface Tab_Panel {
  id: PANEL_ID
  ariaLabelledBy: TAB_ID
  routeName: string
}

const PANELS: Tab_Panel[] = [
  {
    id: PANEL_ID.SEND,
    ariaLabelledBy: TAB_ID.SEND,
    routeName: ROUTES_SEND.SEND.NAME,
  },
  {
    id: PANEL_ID.SEND_NFT,
    ariaLabelledBy: TAB_ID.SEND_NFT,
    routeName: ROUTES_SEND.SEND_NFT.NAME,
  },
]

const activePanel = computed(() =>
  currentRouteName.value === ROUTES_SEND.SEND.NAME ? PANELS[0] : PANELS[1],
)

/** ----------------
 * Arrow Key Navigation
 ------------------*/
const router = useRouter()

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    if (currentRouteName.value === ROUTES_SEND.SEND.NAME) {
      router.push({ name: ROUTES_SEND.SEND_NFT.NAME })
      document.getElementById(TAB_ID.SEND_NFT)?.focus()
    }
    if (currentRouteName.value === ROUTES_SEND.SEND_NFT.NAME) {
      router.push({ name: ROUTES_SEND.SEND.NAME })
      document.getElementById(TAB_ID.SEND)?.focus()
    }
  }
}
</script>

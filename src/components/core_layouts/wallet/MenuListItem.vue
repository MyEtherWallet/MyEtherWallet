<template>
  <component
    :key="listItem.title"
    :class="[
      'text-small rounded-full py-2 px-4 flex w-full items-center transition-colors hoverNoBG',
      { 'bg-grey-5': isCurrentRoute },
      { 'pl-12': isSubmenu },
    ]"
    :is="listItem.routeName ? 'router-link' : 'button'"
    :to="{ name: listItem.routeName }"
    v-ripple
  >
    <div v-if="hasIcon" :class="['mr-3', { 'opacity-80': !isCurrentRoute }]">
      <icon-buy v-if="listItem.iconID === ICON_IDS.BUY" class="w-5 h-5" />
      <icon-send
        v-else-if="listItem.iconID === ICON_IDS.SEND"
        class="w-5 h-5"
      />
      <icon-swap
        v-else-if="listItem.iconID === ICON_IDS.SWAP"
        class="w-5 h-5"
      />
      <icon-stake
        v-else-if="listItem.iconID === ICON_IDS.STAKE"
        class="w-5 h-5"
      />
      <icon-portfolio
        v-else-if="listItem.iconID === ICON_IDS.PORTFOLIO"
        class="w-5 h-5"
      />
      <bell-icon
        v-else-if="listItem.iconID === ICON_IDS.NOTIFICATIONS"
        class="w-5 h-5"
      />
      <cog-icon
        v-else-if="listItem.iconID === ICON_IDS.SETTINGS"
        class="w-5 h-5"
      />
      <wrench-screwdriver-icon
        v-else-if="listItem.iconID === ICON_IDS.TOOLS"
        class="w-4 h-4"
      />
      <book-open-icon
        v-else-if="listItem.iconID === ICON_IDS.LEARN"
        class="w-4 h-4"
      />
    </div>
    <p class="capitalize">{{ listItem.title }}</p>
    <chevron-down-icon
      v-if="isDropDown"
      :class="[
        'ml-auto w-4 h-4 transition-transform',
        { 'rotate-180': isDropDownOpen },
      ]"
    />
  </component>
</template>

<script setup lang="ts">
import { type AppMenuListItem, ICON_IDS } from '@/types/components/menuListItem'
import { type PropType, computed } from 'vue'
import IconSend from '@/assets/icons/core_menu/icon-send.vue'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconStake from '@/assets/icons/core_menu/icon-stake.vue'
import IconPortfolio from '@/assets/icons/core_menu/icon-portfolio.vue'
import {
  BellIcon,
  CogIcon,
  ChevronDownIcon,
  WrenchScrewdriverIcon,
  BookOpenIcon,
} from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'

const props = defineProps({
  listItem: {
    default: () => {},
    type: Object as PropType<AppMenuListItem>,
    required: true,
  },
  isSubmenu: {
    type: Boolean,
  },
  isDropDown: {
    type: Boolean,
  },
  isDropDownOpen: {
    type: Boolean,
  },
})

const hasIcon = computed(() => {
  return props.listItem.iconID !== undefined
})
const router = useRouter()

const isCurrentRoute = computed(() => {
  return router.currentRoute.value.name === props.listItem.routeName
})
</script>

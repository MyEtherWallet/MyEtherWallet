<template>
  <component
    :key="listItem.title"
    :class="[
      'text-small rounded-full py-2 px-4 flex w-full items-center text-white opacity-70 hover:opacity-100',
      listItem.title === activeItemTitle
        ? 'bg-white/15 !opacity-100 '
        : 'hoverOnDarkBG',
      { 'pl-12': isSubmenu },
    ]"
    :is="listItem.routeName ? 'router-link' : 'div'"
    :to="{ name: listItem.routeName }"
    v-ripple
  >
    <img
      v-if="listItem.icon"
      :src="listItem.icon"
      contain
      alt=""
      width="24px"
      height="24px"
      loading="lazy"
      :class="['mr-2']"
    />
    <p class="capitalize">{{ listItem.title }}</p>
    <img
      v-if="isDropDown"
      :src="IconChevron"
      contain
      alt=""
      width="11px"
      height="11px"
      loading="lazy"
      :class="[
        'ml-auto invert transition-transform',
        { 'rotate-180': isDropDownOpen },
      ]"
    />
  </component>
</template>

<script setup lang="ts">
import type { AppMenuListItem } from '@/types/components/menuListItem'
import type { PropType } from 'vue'

import IconChevron from '@assets/icons/chevron-down.svg'
defineProps({
  listItem: {
    default: () => {},
    type: Object as PropType<AppMenuListItem>,
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
  activeItemTitle: {
    type: String,
    required: true,
  },
})
</script>

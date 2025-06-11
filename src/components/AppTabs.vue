<template>
  <div>
    <div
      role="tablist"
      :aria-label="label"
      class="flex justify-start bg-surface rounded-full p-1 xs:p-2 gap-1 max-w-fit"
      v-bind="$attrs"
      @keydown="handleKeyDown"
    >
      <component
        :is="useRouteLink ? 'router-link' : 'button'"
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :to="{ name: tab.routeName }"
        :class="[
          {
            'bg-white shadow-container hover:bg-white':
              activeTabIndex === index,
          },
          'xs:min-h-12 p-1 xs:p-2 rounded-full bg-transparent text-s-17 xs:text-s-20 font-medium hoverNoBG min-w-[100px]',
        ]"
        role="tab"
        :aria-selected="
          useRouteLink
            ? currentRouteName === tab.routeName
            : activeTabIndex === index
        "
        :aria-controls="tab.controlsPanel"
        :tabindex="
          useRouteLink
            ? currentRouteName === tab.routeName
              ? 0
              : -1
            : activeTabIndex
        "
        :id="tab.id"
        @click="setActiveTab(index)"
      >
        <slot name="tab-content">
          <span class="mx-3"> {{ tab.name }}</span>
        </slot>
      </component>
    </div>
    <div
      :id="currActivePanel.id"
      :aria-labelledby="currActivePanel.ariaLabelledBy"
      role="tabpanel"
    >
      <router-view v-if="useRouteLink" v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
      <div v-else>
        <Transition name="fade">
          <slot name="tab-panel" />
        </Transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type PropType } from 'vue'
import { type Tab, type Tab_Panel } from '@/types/components/appTabs'
import { useAppTabs } from '@/composables/useAppTabs'
const props = defineProps({
  /**
   * @tabs - An array of tab objects.
   */
  tabs: {
    type: Array as PropType<Tab[]>,
    default: () => [],
  },
  /**
   * @panel - An array of tab panel objects, used to define accessibility attributes.
   */
  panel: {
    type: Array as PropType<Tab_Panel[]>,
    default: () => [],
  },
  /**
   * @useRouteLink - If true, the tabs will use the router-link component to navigate to the tab's route.
   */
  useRouteLink: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
  useSheet: {
    type: Boolean,
    default: false,
  },
})

/**
 * @model - The v-model for the active tab index.
 * use <v-model:activeTabIndex> to bind the active tab index to a parent component.
 */
const activeTabIndex = defineModel('activeTabIndex', {
  type: Number,
  required: true,
  default: 0,
})

const { handleKeyDown, currentRouteName, currActivePanel } = useAppTabs(
  activeTabIndex,
  props.panel,
  props.tabs,
  props.useRouteLink,
)

const setActiveTab = (index: number) => {
  activeTabIndex.value = index
}
</script>

<template>
  <div>
    <div
      role="tablist"
      aria-label="Send Tabs"
      class="flex justify-start bg-grey-light rounded-full p-2 gap-1"
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
            'bg-white shadow-[0px_1.5px_6px_0px_rgba(0,0,0,0.1)] hover:bg-white':
              activeTabIndex === index,
          },
          'min-h-12 text-xl p-2 rounded-full bg-transparent text-xl font-medium hoverNoBG min-w-[110px]',
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
        @click="() => (model = index)"
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
import { computed, nextTick, onBeforeMount, type PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type Tab, type Tab_Panel } from '@/types/components/appTabs'

const props = defineProps({
  /**
   * @tabs - An array of tab objects.
   */
  tabs: {
    type: Array as PropType<Tab[]>,
    default: () => [],
  },
  /**
   * @panel - An array of tab panel objects, used to define accesibiblity attributes.
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
})

/**
 * @model - The v-model for the active tab index.
 * use <v-model:activeTabIndex> to bind the active tab index to a parent component.
 */
const model = defineModel('activeTabIndex', {
  type: Number,
  required: true,
  default: 0,
})
const route = useRoute()
const currentRouteName = computed(() => route.name)

const currActivePanel = computed(() => {
  return props.panel[model.value]
})

const router = useRouter()

/**
 * Handles keyboard navigation for tab switching.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered by user interaction.
 *
 * If the left arrow key is pressed:
 * - Decrements the model value if it's greater than 0.
 * - If `useRouteLink` prop is true, navigates to the previous tab's route and focuses on its element.
 *
 * If the right arrow key is pressed:
 * - Increments the model value if it's less than the total number of tabs minus one.
 * - If `useRouteLink` prop is true, navigates to the next tab's route and focuses on its element.
 */
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    if (model.value === 0) {
      return
    }
    model.value -= 1
    if (props.useRouteLink) {
      nextTick(() => {
        router.push({ name: props.tabs[model.value].routeName })
        document.getElementById(props.tabs[model.value].id)?.focus()
      })
    }
  } else if (event.key === 'ArrowRight') {
    if (model.value === props.tabs.length - 1) return
    model.value += 1
    if (props.useRouteLink) {
      nextTick(() => {
        router.push({ name: props.tabs[model.value].routeName })
        document.getElementById(props.tabs[model.value].id)?.focus()
      })
    }
  }
}

/**
 * Ensure corrent active tab is set if usign routerlink
 */
onBeforeMount(() => {
  if (props.useRouteLink) {
    const index = props.tabs.findIndex(
      tab => tab.routeName === currentRouteName.value,
    )
    if (index !== -1) {
      model.value = index
    }
  }
})
</script>

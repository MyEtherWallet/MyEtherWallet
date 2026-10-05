<script setup lang="ts" generic="TId extends string">
/**
 * TabBar (Figma: MEW Web App — Design Library › TabBar, node 2175:7168).
 * Row of AppTabItems over a full-width bottom rule. Arrow keys move focus
 * (Home/End jump); Enter/Space select via the native button click.
 *
 * @example
 * <AppTabBar v-model="tab" :items="[{ id: 'stocks', label: 'Stocks' }]" label="Assets" />
 */
import { computed, ref } from 'vue'
import AppTabItem from './AppTabItem.vue'
import type { TabBarItem, TabBarSurface } from './types'

const props = withDefaults(
  defineProps<{
    items: TabBarItem<TId>[]
    surface?: TabBarSurface
    /** Accessible name of the tablist. */
    label?: string
  }>(),
  { surface: 'alternative', label: undefined },
)

const model = defineModel<TId>({ required: true })

const listRef = ref<HTMLElement | null>(null)

const ruleClass = computed(() =>
  props.surface === 'default'
    ? 'border-border-strong'
    : 'border-border-default',
)

// Roving tabindex: only one tab is reachable with Tab
const focusableId = computed(() => {
  const enabled = props.items.filter(item => !item.disabled)
  return enabled.find(item => item.id === model.value)?.id ?? enabled[0]?.id
})

const select = (id: TId) => {
  if (id !== model.value) model.value = id
}

const onKeydown = (event: KeyboardEvent) => {
  if (!listRef.value) return
  const tabs = Array.from(
    listRef.value.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not([disabled])',
    ),
  )
  if (!tabs.length) return
  const current = tabs.indexOf(document.activeElement as HTMLButtonElement)
  const nextIndexByKey: Record<string, number> = {
    ArrowRight: (current + 1) % tabs.length,
    ArrowLeft: (current - 1 + tabs.length) % tabs.length,
    Home: 0,
    End: tabs.length - 1,
  }
  const next = nextIndexByKey[event.key]
  if (next === undefined) return
  event.preventDefault()
  tabs[next].focus()
}
</script>

<template>
  <div class="w-full border-b" :class="ruleClass" data-testid="tab-bar">
    <!-- -mb-px puts the item underline on top of the rule, as in Figma -->
    <div
      ref="listRef"
      role="tablist"
      :aria-label="label"
      class="-mb-px flex items-center gap-3"
      @keydown="onKeydown"
    >
      <AppTabItem
        v-for="item in items"
        :key="item.id"
        class="shrink-0"
        :label="item.label"
        :disabled="item.disabled"
        :selected="item.id === model"
        :tabindex="item.id === focusableId ? 0 : -1"
        @click="select(item.id)"
      />
    </div>
  </div>
</template>

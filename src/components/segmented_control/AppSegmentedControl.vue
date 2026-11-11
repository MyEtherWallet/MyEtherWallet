<script setup lang="ts" generic="TValue extends string">
/**
 * SegmentedControl (Figma: MEW Web App — Design Library › SegmentedControl,
 * 274:2749). "Group of segments that lets users switch between a small set of
 * related views or filters." A radiogroup: arrow keys (wrapping) and Home/End
 * move focus and select, like native radios. Default-slot content sits in the
 * track after the segments but outside the radiogroup (e.g. a "More" select).
 *
 * @example
 * <AppSegmentedControl v-model="range" :items="[{ value: '1d', label: '1D' }]" size="small" label="Chart range" />
 */
import { computed, ref } from 'vue'
import type { AvatarSize } from '@components/avatar/types'
import AppSegment from './AppSegment.vue'
import type { SegmentItem, SegmentSize } from './types'

const props = withDefaults(
  defineProps<{
    items: SegmentItem<TValue>[]
    size?: SegmentSize
    /** Accessible name of the radiogroup. */
    label?: string
    /** Stretch the track to its container; segments share the width. */
    fullWidth?: boolean
  }>(),
  { size: 'default', label: undefined, fullWidth: false },
)

const model = defineModel<TValue>({ required: true })

defineSlots<{
  default?: () => unknown
  label?: (props: { item: SegmentItem<TValue> }) => unknown
  avatar?: (props: { item: SegmentItem<TValue>; size: AvatarSize }) => unknown
}>()

const groupRef = ref<HTMLElement | null>(null)

// Roving tabindex: only the selected segment is reachable with Tab
const focusableValue = computed(() =>
  props.items.some(item => item.value === model.value)
    ? model.value
    : props.items[0]?.value,
)

const onKeydown = (event: KeyboardEvent) => {
  const count = props.items.length
  const current = Math.max(
    props.items.findIndex(item => item.value === model.value),
    0,
  )
  const next = {
    ArrowRight: (current + 1) % count,
    ArrowDown: (current + 1) % count,
    ArrowLeft: (current - 1 + count) % count,
    ArrowUp: (current - 1 + count) % count,
    Home: 0,
    End: count - 1,
  }[event.key]
  if (next === undefined || !count) return
  event.preventDefault()
  model.value = props.items[next].value
  groupRef.value?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus()
}
</script>

<template>
  <div
    data-testid="segmented-control"
    class="flex items-center gap-1.5 rounded-3xl bg-background-default p-1"
    :class="fullWidth ? 'w-full' : 'w-fit'"
  >
    <!-- fullWidth scrolls when segments outgrow the track; the -m-1/p-1 pair
         keeps the focus ring (2px offset + 2px) inside the scroll box. -->
    <div
      ref="groupRef"
      role="radiogroup"
      :aria-label="label"
      class="flex"
      :class="{
        'no-scrollbar -m-1 min-w-0 flex-1 overflow-x-auto rounded-3xl p-1':
          fullWidth,
      }"
      @keydown="onKeydown"
    >
      <AppSegment
        v-for="item in items"
        :key="item.value"
        :size="size"
        :selected="item.value === model"
        :trailing-icon="item.trailingIcon"
        :tabindex="item.value === focusableValue ? 0 : -1"
        :class="{ 'flex-1': fullWidth }"
        @click="model = item.value"
      >
        <template v-if="$slots.avatar" #avatar="{ size: avatarSize }">
          <slot name="avatar" :item="item" :size="avatarSize" />
        </template>
        <slot name="label" :item="item">{{ item.label }}</slot>
      </AppSegment>
    </div>
    <slot />
  </div>
</template>

<template>
  <div class="flex items-start gap-3 w-full">
    <div
      class="flex flex-col items-center shrink-0"
      :class="{ 'self-stretch': stretch }"
      :style="stretch || last ? undefined : { height: pathHeight }"
    >
      <div
        class="flex items-center justify-center shrink-0 w-6 h-6 rounded-full box-border"
        :class="circleClass"
      >
        <AppIcon
          name="check"
          variant="filled"
          size="xxs"
          v-if="variant === 'done' || variant === 'doneGrey'"
          :class="variant === 'done' ? 'text-white' : 'text-text-placeholder'"
        />
        <AppIcon
          name="x-mark"
          variant="filled"
          size="xxs"
          v-else-if="variant === 'failed'"
          class="text-white"
        />
        <span
          v-else
          class="text-label-sm"
          :class="variant === 'current' ? 'text-text-brand' : 'text-black'"
          >{{ number }}</span
        >
      </div>
      <div
        v-if="!last"
        class="w-0.5 flex-1 my-0.5 rounded-[3px]"
        :class="
          connectorBlue ? 'bg-background-brand' : 'bg-background-default-hover'
        "
      ></div>
    </div>
    <div class="flex-1 min-w-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
const props = withDefaults(
  defineProps<{
    variant: 'done' | 'doneGrey' | 'current' | 'plain' | 'failed'
    number?: number | string
    last?: boolean
    stretch?: boolean
    pathHeight?: string
    connectorBlue?: boolean
  }>(),
  { last: false, stretch: false, pathHeight: '48px', connectorBlue: false },
)

const circleClass = computed(() => {
  switch (props.variant) {
    case 'done':
      return 'bg-background-brand'
    case 'doneGrey':
      return 'bg-background-default-hover'
    case 'current':
      return 'border-2 border-border-brand'
    case 'failed':
      return 'bg-background-error'
    default:
      return 'bg-background-default-hover'
  }
})
</script>

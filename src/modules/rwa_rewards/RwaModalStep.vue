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
          v-if="variant === 'done' || variant === 'doneGrey'"
          name="check"
          variant="filled"
          size="xxs"
          :class="variant === 'done' ? 'text-white' : 'text-[#a5a5a5]'"
        />
        <AppIcon
          v-else-if="variant === 'failed'"
          name="x-mark"
          variant="filled"
          size="xxs"
          class="text-white"
        />
        <span
          v-else
          class="text-s-14 font-semibold leading-5 tracking-[-0.28px]"
          :class="variant === 'current' ? 'text-[#0b53bf]' : 'text-black'"
          >{{ number }}</span
        >
      </div>
      <div
        v-if="!last"
        class="w-0.5 flex-1 my-0.5 rounded-[3px]"
        :class="connectorBlue ? 'bg-[#0b53bf]' : 'bg-[#e6e6e6]'"
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
      return 'bg-[#0b53bf]'
    case 'doneGrey':
      return 'bg-[#e6e6e6]'
    case 'current':
      return 'border-2 border-[#0b53bf]'
    case 'failed':
      return 'bg-[#e40c58]'
    default:
      return 'bg-[#e6e6e6]'
  }
})
</script>

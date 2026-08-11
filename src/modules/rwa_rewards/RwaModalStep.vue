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
        <check-icon
          v-if="variant === 'done' || variant === 'doneGrey'"
          class="w-3.5 h-3.5"
          :class="variant === 'done' ? 'text-fg-on-fill' : 'text-fg-muted'"
        />
        <x-mark-icon
          v-else-if="variant === 'failed'"
          class="w-3.5 h-3.5 text-fg-on-fill"
        />
        <span
          v-else
          class="text-s-14 font-semibold leading-5 tracking-[-0.28px]"
          :class="variant === 'current' ? 'text-[#0b53bf]' : 'text-fg'"
          >{{ number }}</span
        >
      </div>
      <div
        v-if="!last"
        class="w-0.5 flex-1 my-0.5 rounded-[3px]"
        :class="connectorBlue ? 'bg-[#0b53bf]' : 'bg-line'"
      ></div>
    </div>
    <div class="flex-1 min-w-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/16/solid'

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
      return 'bg-line'
    case 'current':
      return 'border-2 border-[#0b53bf]'
    case 'failed':
      return 'bg-error'
    default:
      return 'bg-line'
  }
})
</script>

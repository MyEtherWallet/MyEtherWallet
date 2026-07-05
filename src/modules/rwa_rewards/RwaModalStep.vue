<template>
  <div class="flex items-start" style="gap: 12px; width: 100%">
    <div
      class="flex flex-col items-center shrink-0"
      :class="{ 'self-stretch': stretch }"
      :style="stretch ? {} : last ? {} : { height: pathHeight }"
    >
      <div
        class="flex items-center justify-center shrink-0"
        :style="circleStyle"
      >
        <svg
          v-if="variant === 'done' || variant === 'doneGrey'"
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 10.5l3.5 3.5L15 6.5"
            :stroke="variant === 'done' ? '#fff' : '#a5a5a5'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="variant === 'failed'"
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M6 6l8 8M14 6l-8 8"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span v-else :style="numberStyle">{{ number }}</span>
      </div>
      <div
        v-if="!last"
        :style="{
          width: '2px',
          flex: 1,
          marginTop: '2px',
          marginBottom: '2px',
          borderRadius: '3px',
          background: connectorBlue ? '#0b53bf' : '#e6e6e6',
        }"
      ></div>
    </div>
    <div style="flex: 1; min-width: 0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const circleStyle = computed(() => {
  const base = {
    width: '24px',
    height: '24px',
    borderRadius: '100px',
    boxSizing: 'border-box' as const,
  }
  switch (props.variant) {
    case 'done':
      return { ...base, background: '#0b53bf' }
    case 'doneGrey':
      return { ...base, background: '#e6e6e6' }
    case 'current':
      return { ...base, border: '2px solid #0b53bf' }
    case 'failed':
      return { ...base, background: '#e40c58' }
    default:
      return { ...base, background: '#e6e6e6' }
  }
})

const numberStyle = computed(() => ({
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '20px',
  letterSpacing: '-0.28px',
  color: props.variant === 'current' ? '#0b53bf' : '#000',
}))
</script>
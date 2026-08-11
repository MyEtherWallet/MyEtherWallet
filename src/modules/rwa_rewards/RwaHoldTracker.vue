<template>
  <div class="w-full">
    <p
      v-if="daysLeftLabel"
      class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-fg"
    >
      {{ daysLeftLabel }}
    </p>
    <div
      class="grid grid-cols-7 gap-1 w-full"
      :class="{ 'mt-2': daysLeftLabel }"
    >
      <div
        v-for="day in total"
        :key="day"
        class="flex items-center justify-center py-1.5 px-[7px] rounded-8 min-h-[30px] box-border"
        :class="chipClass(day)"
      >
        <check-icon
          v-if="chipState(day) === 'done' || chipState(day) === 'doneGrey'"
          class="w-3.5 h-3.5 text-fg-on-fill"
        />
        <x-mark-icon
          v-else-if="chipState(day) === 'failed'"
          class="w-3.5 h-3.5 text-fg-on-fill"
        />
        <span
          v-else
          class="text-s-12 font-semibold leading-[18px] tracking-[-0.24px]"
          :class="numberClass(day)"
          >{{ day }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/16/solid'

type ChipState = 'done' | 'current' | 'pending' | 'failed' | 'doneGrey'

const props = withDefaults(
  defineProps<{
    total?: number
    current: number
    daysLeftLabel?: string
    failedDay?: number
  }>(),
  { total: 14 },
)

const chipState = (day: number): ChipState => {
  if (props.failedDay != null) {
    if (day < props.failedDay) return 'doneGrey'
    if (day === props.failedDay) return 'failed'
    return 'pending'
  }
  if (day < props.current) return 'done'
  if (day === props.current) return 'current'
  return 'pending'
}

const chipClass = (day: number) => {
  switch (chipState(day)) {
    case 'done':
      return 'bg-[#0b53bf]'
    case 'current':
      return 'bg-white/70 border-2 border-[#0b53bf]'
    case 'failed':
      return 'bg-error'
    case 'doneGrey':
      return 'bg-fg-muted'
    default:
      return 'bg-line'
  }
}

const numberClass = (day: number) =>
  chipState(day) === 'current' ? 'text-[#0b53bf]' : 'text-fg-subtle'
</script>

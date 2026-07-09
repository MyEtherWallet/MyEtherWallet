<template>
  <div class="w-full">
    <p
      v-if="daysLeftLabel"
      class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-black"
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
        <svg
          v-if="chipState(day) === 'done' || chipState(day) === 'doneGrey'"
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 10.5l3.5 3.5L15 6.5"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="chipState(day) === 'failed'"
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
      return 'bg-[#e40c58]'
    case 'doneGrey':
      return 'bg-grey-subtle'
    default:
      return 'bg-[#e6e6e6]'
  }
}

const numberClass = (day: number) =>
  chipState(day) === 'current' ? 'text-[#0b53bf]' : 'text-[#575757]'
</script>

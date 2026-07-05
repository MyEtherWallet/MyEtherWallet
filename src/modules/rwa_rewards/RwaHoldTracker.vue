<template>
  <div style="width: 100%">
    <p
      v-if="daysLeftLabel"
      style="
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: -0.28px;
        color: #000;
      "
    >
      {{ daysLeftLabel }}
    </p>
    <div
      class="grid"
      :style="{
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        width: '100%',
        marginTop: daysLeftLabel ? '8px' : '0',
      }"
    >
      <div
        v-for="day in total"
        :key="day"
        class="flex items-center justify-center"
        :style="chipStyle(day)"
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
        <span v-else :style="numberStyle(day)">{{ day }}</span>
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

const chipStyle = (day: number) => {
  const base = {
    padding: '6px 7px',
    borderRadius: '8px',
    minHeight: '30px',
    boxSizing: 'border-box' as const,
  }
  switch (chipState(day)) {
    case 'done':
      return { ...base, background: '#0b53bf' }
    case 'current':
      return { ...base, background: '#ffffffb2', border: '2px solid #0b53bf' }
    case 'failed':
      return { ...base, background: '#e40c58' }
    case 'doneGrey':
      return { ...base, background: '#a5a5a5' }
    default:
      return { ...base, background: '#e6e6e6' }
  }
}

const numberStyle = (day: number) => ({
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: '18px',
  letterSpacing: '-0.24px',
  color: chipState(day) === 'current' ? '#0b53bf' : '#575757',
})
</script>
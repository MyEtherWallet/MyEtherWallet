<script setup lang="ts">
import { computed } from 'vue'
import type { AvatarSize } from '../types'

// _Initial (2818:1026). One centered character on the info-subtle background.
// Type ramp per size (DM Sans): label/xs → label/sm → label/base → heading/base.
const props = defineProps<{
  size: AvatarSize
  initial?: string
}>()

defineOptions({ inheritAttrs: false })

const FONT: Record<AvatarSize, string> = {
  xs: 'text-s-12 font-semibold tracking-[-0.24px]',
  s: 'text-s-12 font-semibold tracking-[-0.24px]',
  m: 'text-s-14 font-semibold tracking-[-0.28px]',
  l: 'text-s-16 font-semibold tracking-[-0.32px]',
  xl: 'text-s-20 font-bold tracking-[-0.4px]',
}

const fontClass = computed(() => FONT[props.size])
const char = computed(() => (props.initial ?? '').charAt(0))
</script>

<template>
  <div
    class="w-full h-full flex items-center justify-center bg-avatar-initial-bg text-t-default leading-none uppercase"
    :class="fontClass"
  >
    {{ char }}
  </div>
</template>

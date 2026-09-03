<script setup lang="ts">
import { computed } from 'vue'
import Blockies from '@/utils/blockies'
import { AVATAR_SIZES, type AvatarSize } from '../types'

// _Accounts (1874:473). Figma shows static patterns; in code it's an
// address-seeded blockie (reusing utils/blockies, the same source AppBlockie
// uses) on an 8×8 grid. `connected` adds the green ring (~2.5px outside).
const props = defineProps<{
  size: AvatarSize
  address?: string
  connected?: boolean
}>()

defineOptions({ inheritAttrs: false })

const blockie = computed(() =>
  Blockies({
    seed: props.address ? props.address.toLowerCase() : '',
    size: 8,
    scale: 16,
  }).toDataURL(),
)

// Ring sits ~box × 0.08 outside the pattern (M: 32 × 0.08 ≈ 2.56, Figma ≈ 2.48).
const ringStyle = computed(() => ({
  inset: `-${AVATAR_SIZES[props.size].box * 0.08}px`,
}))
</script>

<template>
  <div class="relative w-full h-full">
    <img
      :src="blockie"
      class="w-full h-full rounded-full"
      :alt="address ?? ''"
    />
    <span
      v-if="connected"
      class="absolute rounded-full border-2 border-success pointer-events-none"
      :style="ringStyle"
    />
  </div>
</template>

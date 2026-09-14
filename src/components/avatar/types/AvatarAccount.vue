<script setup lang="ts">
import { computed } from 'vue'
import Blockies from '@/utils/blockies'

// _Accounts (1874:473). Figma shows static patterns; in code it's an
// address-seeded blockie (reusing utils/blockies, the same source AppBlockie
// uses) on an 8×8 grid. The `connected` ring overhangs the box, so the parent
// (AppAvatar) draws it in its non-clipping outer layer — this child is just the
// (self-clipping) blockie that fills the box.
const props = defineProps<{
  address?: string
}>()

defineOptions({ inheritAttrs: false })

const blockie = computed(() =>
  Blockies({
    seed: props.address ? props.address.toLowerCase() : '',
    size: 8,
    scale: 16,
  }).toDataURL(),
)
</script>

<template>
  <img :src="blockie" class="w-full h-full rounded-full" :alt="address ?? ''" />
</template>

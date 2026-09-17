<script setup lang="ts">
import { computed } from 'vue'
import Blockies from '@/utils/blockies'

// _Accounts (1874:473). Figma shows static patterns; in code it's an
// address-seeded blockie (reusing utils/blockies, the same source AppBlockie
// uses) on an 8×8 grid. The `connected` ring overhangs the box, so the parent
// (AppAvatar) draws it in its non-clipping outer layer — this child is just the
// (self-clipping) blockie that fills the box. The image is decorative (alt=""):
// the account's name/address is rendered as text by the consumer, and reading a
// 42-char hex string aloud helps no one.
const props = defineProps<{
  address?: string
}>()

defineOptions({ inheritAttrs: false })

// Blockies falls back to a random seed when the seed is empty, so an addressless
// account would draw a different pattern every mount. Guard against it: only seed
// (and render) once we actually have an address; otherwise the template renders
// nothing and the parent AppAvatar's neutral fallback background shows through.
const blockie = computed(() =>
  props.address
    ? Blockies({
        seed: props.address.toLowerCase(),
        size: 8,
        scale: 16,
      }).toDataURL()
    : '',
)
</script>

<template>
  <img
    v-if="address"
    :src="blockie"
    class="w-full h-full rounded-full"
    alt=""
  />
</template>

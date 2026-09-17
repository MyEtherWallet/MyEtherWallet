<script setup lang="ts">
import type { AvatarSize } from '../types'

// _Icon (1376:2365). The glyph sits inset 4px in a 32px box at M (12.5% each
// side → 75% content); the ratio holds across sizes. The icon comes in via the
// default slot (any @heroicons/vue glyph). `background` is owned by the parent
// (AppAvatar suppresses its fallback bg when this is false); declared here only
// so it doesn't leak onto the DOM as an attribute.
defineProps<{
  size: AvatarSize
  background?: boolean
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <div
      class="w-3/4 h-3/4 flex items-center justify-center text-t-default [&_svg]:w-full [&_svg]:h-full"
    >
      <slot />
    </div>
  </div>
</template>

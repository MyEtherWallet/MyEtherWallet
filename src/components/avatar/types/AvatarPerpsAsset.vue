<script setup lang="ts">
import { computed } from 'vue'
import AvatarRemoteImage from '../AvatarRemoteImage.vue'
import { AVATAR_FALLBACK_TEXT_CLASS, type AvatarSize } from '../types'

// _Perps Asset Logo (166:795). 21 named assets + `any` — same remote-URL +
// symbol-fallback approach as Stocks / Crypto.
const props = defineProps<{
  size: AvatarSize
  url?: string | null
  symbol?: string
}>()

defineOptions({ inheritAttrs: false })

const fallbackTextClass = computed(() => AVATAR_FALLBACK_TEXT_CLASS[props.size])
</script>

<template>
  <AvatarRemoteImage
    :url="url"
    :fallback-text="symbol"
    :fallback-text-class="fallbackTextClass"
  />
</template>

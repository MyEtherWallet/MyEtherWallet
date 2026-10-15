<script setup lang="ts">
import { computed } from 'vue'
import AvatarRemoteImage from '../AvatarRemoteImage.vue'
import { AVATAR_FALLBACK_TEXT_CLASS, type AvatarSize } from '../types'

// _Crypto Asset Logo (166:1008). USDC, USDT, WBTC, ETH, WETH, `any` — logos
// resolve from an API URL with a symbol-initials fallback.
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

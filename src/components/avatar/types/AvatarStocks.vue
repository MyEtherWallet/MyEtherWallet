<script setup lang="ts">
import { computed } from 'vue'
import AvatarRemoteImage from '../AvatarRemoteImage.vue'
import { AVATAR_FALLBACK_TEXT_CLASS, type AvatarSize } from '../types'

// _Stocks (166:95). ~90 tickers + `any` — logos resolve from the stocks API at
// runtime, never bundled. Symbol initials are the fallback.
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

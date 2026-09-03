<script setup lang="ts">
import { computed } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import AvatarRemoteImage from '../AvatarRemoteImage.vue'
import { AVATAR_FALLBACK_TEXT_CLASS, type AvatarSize } from '../types'

// _Networks (166:756): ETH, BNB, ARB, SOL, AVAX, `any`. The logo is resolved
// from the chains store by chain *name* (the store keys by name, not id) — this
// keeps chain ids out of the component (CLAUDE.md pitfall #5). Pass `url` to
// override, or nothing for the neutral `any` fallback.
const props = defineProps<{
  size: AvatarSize
  /** Chain name as stored in useChainsStore (e.g. 'Ethereum'). */
  chain?: string
  url?: string | null
}>()

defineOptions({ inheritAttrs: false })

const chainsStore = useChainsStore()

const resolvedUrl = computed(
  () =>
    props.url ?? (props.chain ? chainsStore.getChainIcon(props.chain) : null),
)
const fallbackTextClass = computed(() => AVATAR_FALLBACK_TEXT_CLASS[props.size])
</script>

<template>
  <AvatarRemoteImage
    :url="resolvedUrl"
    :fallback-text="chain"
    :fallback-text-class="fallbackTextClass"
  />
</template>

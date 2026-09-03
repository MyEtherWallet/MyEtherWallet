<script setup lang="ts">
import { computed } from 'vue'
import AvatarRemoteImage from '../AvatarRemoteImage.vue'
import type { AvatarSize, WalletId } from '../types'

// _Wallets (166:15): ledger, rainbow, walletconnect, metamaskstarknetsnap,
// rabby, phantom, coinbase, solflare, zerion + `any` fallback.
//
// The brand-mark SVGs are NOT in the repo yet (src/assets/icons/wallets/). This
// map is wired but empty, so every id resolves to the neutral `any` fallback
// today. Follow-up: commit the optimized SVGs and fill this map. Figma MCP asset
// URLs expire (~7 days) — commit the bytes, don't reference a remote URL.
const WALLET_MARKS: Partial<Record<WalletId, string>> = {}

const props = defineProps<{
  size: AvatarSize
  walletId?: WalletId
}>()

defineOptions({ inheritAttrs: false })

const url = computed(() => WALLET_MARKS[props.walletId ?? 'any'] ?? null)
</script>

<template>
  <AvatarRemoteImage :url="url" />
</template>

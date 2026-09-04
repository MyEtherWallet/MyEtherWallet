<script setup lang="ts">
import { computed } from 'vue'
import AvatarRemoteImage from '../AvatarRemoteImage.vue'
import type { AvatarSize, WalletId } from '../types'
import ledger from '@/assets/icons/wallets/ledger.svg'
import rainbow from '@/assets/icons/wallets/rainbow.svg'
import walletconnect from '@/assets/icons/wallets/walletconnect.svg'
import metamaskstarknetsnap from '@/assets/icons/wallets/metamaskstarknetsnap.svg'
import rabby from '@/assets/icons/wallets/rabby.svg'
import phantom from '@/assets/icons/wallets/phantom.svg'
import coinbase from '@/assets/icons/wallets/coinbase.svg'
import solflare from '@/assets/icons/wallets/solflare.svg'
import zerion from '@/assets/icons/wallets/zerion.svg'
import walletAny from '@/assets/icons/wallets/any.png'

// _Wallets (166:15). Brand marks committed from Figma to src/assets/icons/wallets
// (SVG, except the neutral `any` fallback which is raster in the source).
const WALLET_MARKS: Record<WalletId, string> = {
  ledger,
  rainbow,
  walletconnect,
  metamaskstarknetsnap,
  rabby,
  phantom,
  coinbase,
  solflare,
  zerion,
  any: walletAny,
}

const props = defineProps<{
  size: AvatarSize
  walletId?: WalletId
}>()

defineOptions({ inheritAttrs: false })

const url = computed(() => WALLET_MARKS[props.walletId ?? 'any'])
</script>

<template>
  <AvatarRemoteImage :url="url" />
</template>

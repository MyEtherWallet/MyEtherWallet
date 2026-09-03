<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import AvatarWallet from './types/AvatarWallet.vue'
import AvatarStocks from './types/AvatarStocks.vue'
import AvatarNetwork from './types/AvatarNetwork.vue'
import AvatarPerpsAsset from './types/AvatarPerpsAsset.vue'
import AvatarCryptoAsset from './types/AvatarCryptoAsset.vue'
import AvatarIcon from './types/AvatarIcon.vue'
import AvatarAccount from './types/AvatarAccount.vue'
import AvatarInitial from './types/AvatarInitial.vue'
import {
  AVATAR_SIZES,
  badgePositionStyle,
  type AvatarBadgePosition,
  type AvatarSize,
  type AvatarType,
  type WalletId,
} from './types'

/**
 * Avatar (component set 1286:489). The single parent: owns the circular box,
 * the neutral fallback background, size resolution and badge placement. It
 * mounts the correct type child via a `<component :is>` map (no v-if chain) and
 * holds zero artwork logic — each child fills the 100%×100% inner box.
 */
const props = withDefaults(
  defineProps<{
    type: AvatarType
    size?: AvatarSize
    // Badge corners, 1:1 with Figma. Only one may be active (dev-warned).
    badgeTop?: boolean
    badgeBottom?: boolean
    badgeTopLeft?: boolean
    badgeBottomLeft?: boolean
    // Type-specific props, forwarded to the active child.
    walletId?: WalletId
    symbol?: string
    url?: string | null
    chain?: string
    initial?: string
    connected?: boolean
    address?: string
    background?: boolean
  }>(),
  {
    size: 'm',
    background: true,
  },
)

const TYPE_MAP = {
  wallet: AvatarWallet,
  stocks: AvatarStocks,
  network: AvatarNetwork,
  perpsAsset: AvatarPerpsAsset,
  cryptoAsset: AvatarCryptoAsset,
  icon: AvatarIcon,
  account: AvatarAccount,
  initial: AvatarInitial,
}

const typeComponent = computed(() => TYPE_MAP[props.type])

const boxStyle = computed(() => {
  const { box } = AVATAR_SIZES[props.size]
  return { width: `${box}px`, height: `${box}px` }
})

// Every type sits on the neutral fallback bg so transparent remote logos stay
// legible on any surface. The Icon type can opt out via `background: false`.
const showFallbackBg = computed(
  () => !(props.type === 'icon' && props.background === false),
)

const forwardProps = computed(() => ({
  size: props.size,
  walletId: props.walletId,
  symbol: props.symbol,
  url: props.url,
  chain: props.chain,
  initial: props.initial,
  connected: props.connected,
  address: props.address,
  background: props.background,
}))

const activePositions = computed(() => {
  const list: AvatarBadgePosition[] = []
  if (props.badgeTop) list.push('top')
  if (props.badgeBottom) list.push('bottom')
  if (props.badgeTopLeft) list.push('topLeft')
  if (props.badgeBottomLeft) list.push('bottomLeft')
  return list
})

const activePosition = computed(() => activePositions.value[0] ?? null)

const badgeStyle = computed(() =>
  activePosition.value
    ? badgePositionStyle(props.size, activePosition.value)
    : {},
)

// Account "connected" ring overhangs the box (Figma ~box × 0.08 outside), so it
// lives in the outer, non-clipping layer alongside badges.
const showConnectedRing = computed(
  () => props.type === 'account' && props.connected === true,
)
const connectedRingStyle = computed(() => ({
  inset: `-${AVATAR_SIZES[props.size].box * 0.08}px`,
}))

// Single-badge rule (Figma guideline): warn in dev, render the first.
watchEffect(() => {
  if (import.meta.env.DEV && activePositions.value.length > 1) {
    console.warn(
      `[AppAvatar] Only one badge may be active at a time; got ${activePositions.value.length} (${activePositions.value.join(', ')}). Rendering the first.`,
    )
  }
})
</script>

<template>
  <div class="relative inline-block align-middle" :style="boxStyle">
    <!-- Outer box must not clip: badges overhang. The inner layer clips artwork. -->
    <div
      class="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
      :class="{ 'bg-avatar-fallback': showFallbackBg }"
    >
      <component :is="typeComponent" v-bind="forwardProps">
        <slot name="icon" />
      </component>
    </div>

    <div v-if="activePosition" class="absolute" :style="badgeStyle">
      <slot name="badge" />
    </div>

    <span
      v-if="showConnectedRing"
      class="absolute rounded-full border-2 border-success pointer-events-none"
      :style="connectedRingStyle"
    />
  </div>
</template>

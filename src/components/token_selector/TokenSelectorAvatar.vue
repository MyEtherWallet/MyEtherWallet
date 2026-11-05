<script setup lang="ts">
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@/components/avatar/AppAvatarBadge.vue'
import type { AvatarSize } from '@/components/avatar/types'
import type { TokenSelectorItem } from './types'

// Token logo with its network badge bottom-right (Figma Avatar + _Avatar badge).
defineProps<{
  item: TokenSelectorItem
  size: AvatarSize
  networkIcon?: string | null
}>()
</script>

<template>
  <AppAvatar
    :type="item.isStock ? 'stocks' : 'cryptoAsset'"
    :size="size"
    :url="item.logo"
    :symbol="item.symbol"
    :badge-bottom="Boolean(item.chainIcon ?? networkIcon)"
  >
    <template #badge>
      <AppAvatarBadge type="network">
        <img
          :src="(item.chainIcon ?? networkIcon)!"
          alt=""
          class="size-full object-cover"
        />
      </AppAvatarBadge>
    </template>
  </AppAvatar>
</template>

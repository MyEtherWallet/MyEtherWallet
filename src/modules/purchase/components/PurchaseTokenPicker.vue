<template>
  <app-picker
    :title="displayTokenSymbol"
    :description="$t('purchase.on_network', { network: networkName })"
    :size="size"
    :surface="size === 'l' ? 'alternative' : 'default'"
  >
    <template #avatar="{ size: avatarSize }">
      <app-avatar
        type="cryptoAsset"
        :size="avatarSize"
        :url="tokenIconUrl"
        :symbol="displayTokenSymbol"
        :badge-bottom="size === 'l'"
      >
        <template #badge>
          <app-avatar-badge type="network">
            <img
              :src="chain.icon"
              :alt="networkName"
              class="w-full h-full object-cover"
            />
          </app-avatar-badge>
        </template>
      </app-avatar>
    </template>
  </app-picker>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import AppPicker from '@components/picker/AppPicker.vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@components/avatar/AppAvatarBadge.vue'
import { usePurchaseStore } from '@/stores/purchaseStore'
import type { Chain } from '@/mew_api/types'
import type { PurchaseAsset } from '@/types/buyToken'

// L = full-width token row (Buy); S = pill inside the amount card (Sell).
const props = withDefaults(
  defineProps<{
    chain: Chain
    token: PurchaseAsset | null
    size?: 'l' | 's'
  }>(),
  { size: 'l' },
)

const { coinImages } = storeToRefs(usePurchaseStore())

const networkName = computed(() => props.chain.nameLong || props.chain.name)

const displayTokenSymbol = computed<string>(
  () => props.token?.symbol ?? props.chain.currencyName ?? '',
)

const tokenIconUrl = computed<string | undefined>(() => {
  if (!props.token) return props.chain.icon
  if (props.token.symbol === props.chain.currencyName) return props.chain.icon
  const fromApi = coinImages.value.get(props.token.coingecko_id)
  return fromApi ?? props.token.market_data?.icon ?? props.chain.icon
})
</script>

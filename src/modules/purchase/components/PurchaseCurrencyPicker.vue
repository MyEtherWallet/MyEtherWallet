<template>
  <app-picker
    :title="currency"
    :description="getCurrencyName(currency)"
    :size="size"
    :surface="size === 'l' ? 'alternative' : 'default'"
  >
    <template #avatar="{ size: avatarSize }">
      <app-avatar
        type="cryptoAsset"
        :size="avatarSize"
        :url="iconUrl"
        :symbol="currency"
        fit="cover"
      />
    </template>
  </app-picker>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppPicker from '@components/picker/AppPicker.vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import { getFiatIcon } from '../helpers/purchaseIcons'
import { getCurrencyName } from '../helpers/currencyName'

// L = full-width "receive in" row (Sell); S = pill inside the amount card (Buy).
const props = withDefaults(
  defineProps<{
    currency: string
    size?: 'l' | 's'
  }>(),
  { size: 's' },
)

const iconUrl = computed(() => getFiatIcon(props.currency))
</script>

<script setup lang="ts">
import AppCell from '@/components/cell/AppCell.vue'
import TokenSelectorAvatar from './TokenSelectorAvatar.vue'
import type { TokenSelectorItem } from './types'

// One 68px token row: avatar + badge, symbol / name, right accessory.
defineProps<{
  item: TokenSelectorItem
  selected?: boolean
  networkIcon?: string | null
}>()

const emit = defineEmits<{ select: [item: TokenSelectorItem] }>()
</script>

<template>
  <AppCell
    data-testid="token-selector-row"
    inset
    :title="item.symbol"
    :description="item.name"
    :right-accessory="item.rightAccessory"
    :selected="selected"
    :disabled="item.disabled"
    @click="emit('select', item)"
  >
    <template #avatar="{ size }">
      <TokenSelectorAvatar
        :item="item"
        :size="size"
        :network-icon="networkIcon"
      />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
  </AppCell>
</template>

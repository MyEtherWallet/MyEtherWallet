<script setup lang="ts">
import AppCell from '@/components/cell/AppCell.vue'
import TokenSelectorAvatar from './TokenSelectorAvatar.vue'
import type { TokenSelectorItem } from './types'

// A run of 68px token rows: avatar + badge, symbol / name, right accessory.
defineProps<{
  items: TokenSelectorItem[]
  selectedId?: string
  networkIcon?: string | null
}>()

const emit = defineEmits<{ select: [item: TokenSelectorItem] }>()
</script>

<template>
  <!-- Figma draws the rows flush, without List's padded container -->
  <div role="list" class="flex flex-col gap-0.5">
    <div v-for="item in items" :key="item.id" role="listitem">
      <AppCell
        data-testid="token-selector-row"
        inset
        :title="item.symbol"
        :description="item.name"
        :right-accessory="item.rightAccessory"
        :selected="item.id === selectedId"
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
        <template v-if="$slots['item-suffix']" #suffix>
          <slot name="item-suffix" :item="item" />
        </template>
      </AppCell>
    </div>
  </div>
</template>

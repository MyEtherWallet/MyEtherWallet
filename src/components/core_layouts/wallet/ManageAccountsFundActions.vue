<template>
  <div class="grid grid-cols-2 gap-2 pt-2">
    <app-card
      v-for="action in ACTIONS"
      :key="action.key"
      surface="alternative"
      interactive
      :label="$t(`multi_address.fund.${action.key}_title`)"
      @click="action.choose()"
    >
      <div class="flex flex-col gap-3 p-4">
        <AppIcon :name="action.icon" size="m" class="text-text-brand" />
        <div class="flex flex-col gap-1">
          <p class="text-label-sm text-text-default">
            {{ $t(`multi_address.fund.${action.key}_title`) }}
          </p>
          <p class="text-text-xs text-text-subtle">
            {{ $t(`multi_address.fund.${action.key}_description`) }}
          </p>
        </div>
      </div>
    </app-card>
  </div>
</template>

<script setup lang="ts">
import AppCard from '@/components/card/AppCard.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import type { IconName } from '@/components/icon/icons'

/**
 * The two ways to fund an empty wallet, shown in the account menu under the
 * saved addresses: buy with a card or bank account, or deposit from another
 * wallet. It only says which one was chosen; the menu decides what opens.
 */
const emit = defineEmits<{
  buy: []
  deposit: []
}>()

const ACTIONS: ReadonlyArray<{
  key: 'buy' | 'deposit'
  icon: IconName
  choose: () => void
}> = [
  { key: 'buy', icon: 'credit-card', choose: () => emit('buy') },
  {
    key: 'deposit',
    icon: 'arrow-down-circle',
    choose: () => emit('deposit'),
  },
]
</script>

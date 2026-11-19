<script setup lang="ts" generic="TId extends string">
import { useI18n } from 'vue-i18n'
import AppActionBarButton from './AppActionBarButton.vue'
import type { ActionBarItem } from './types'

/**
 * ActionBar (design library, Figma component 776:259). The right-side rail:
 * one ActionBarButton per item. The drawer it opens owns its own close button,
 * so the bar has no top action. It holds no state and imports no store — the
 * caller passes the items and the active one, and decides what `select` does.
 * Positioning (fixed, offsets, z-index, height) comes from the caller's class.
 */
withDefaults(
  defineProps<{
    items: ActionBarItem<TId>[]
    /** Id of the item whose drawer is open. */
    activeId?: TId | null
  }>(),
  { activeId: null },
)

const emit = defineEmits<{
  select: [id: TId]
}>()

const { t } = useI18n()
</script>

<template>
  <nav
    :aria-label="t('common.wallet_actions')"
    class="flex w-15 flex-col items-center border-l border-border-default bg-background-alternative p-0.5 pt-6 sm:w-20 sm:p-1 sm:pt-6"
  >
    <ul>
      <li v-for="item in items" :key="item.id">
        <AppActionBarButton
          :icon="item.icon"
          :label="item.label"
          :disabled="item.disabled"
          :active="item.id === activeId"
          :data-action-id="item.id"
          @click="emit('select', item.id)"
        />
      </li>
    </ul>
  </nav>
</template>

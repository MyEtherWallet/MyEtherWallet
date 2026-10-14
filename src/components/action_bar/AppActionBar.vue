<script setup lang="ts" generic="TId extends string">
import { useI18n } from 'vue-i18n'
import AppActionBarButton from './AppActionBarButton.vue'
import type { ActionBarItem } from './types'

/**
 * ActionBar (design library, Figma component 776:259). The right-side rail: an
 * icon-only top action that toggles the side menu, then one ActionBarButton per
 * item. It holds no state and imports no store — the caller passes the items and
 * the active one, and decides what `select` and `toggle` do. Positioning (fixed,
 * offsets, z-index, height) comes from the caller's class.
 */
withDefaults(
  defineProps<{
    items: ActionBarItem<TId>[]
    /** Id of the item whose drawer is open. */
    activeId?: TId | null
    /** Side menu open state; drives the top action's chevron. */
    expanded?: boolean
  }>(),
  { activeId: null, expanded: false },
)

const emit = defineEmits<{
  select: [id: TId]
  toggle: []
}>()

const { t } = useI18n()
</script>

<template>
  <nav
    :aria-label="t('common.wallet_actions')"
    class="flex w-20 flex-col items-center border-l border-border-default bg-background-alternative p-1"
  >
    <AppActionBarButton
      :icon="expanded ? 'chevron-double-right' : 'chevron-double-left'"
      :aria-label="
        t(expanded ? 'common.close_side_menu' : 'common.open_side_menu')
      "
      :aria-expanded="expanded"
      @click="emit('toggle')"
    />
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

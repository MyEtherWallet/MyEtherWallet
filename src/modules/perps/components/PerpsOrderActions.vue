<script setup lang="ts">
import { computed } from 'vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import type { CellSurface } from '@/components/cell/cellSizes'
import type { TableSize } from '@/components/table/types'
import type { ApiOrder } from '../sdk/types'

/**
 * Row actions of the Perps orders tables (positions page and market page),
 * for an AppTableRow's `#actions` slot (`size`, `surface`). Only an open order
 * has any. At L/M viewing is the row click, so the action is a Cancel button;
 * at S the row has no room for it and a menu holds view and cancel. Cancel
 * asks the parent to confirm; `cancelling` shows the spinner meanwhile.
 */
const props = defineProps<{
  order: ApiOrder
  size: TableSize
  surface: CellSurface
  cancelling?: boolean
}>()

const emit = defineEmits<{
  view: [order: ApiOrder]
  cancel: [order: ApiOrder]
}>()

const cancellable = computed(() =>
  ['pending', 'untriggered', 'open'].includes(props.order.status),
)
</script>

<template>
  <AppBaseButton
    v-if="cancellable && size !== 's'"
    type="secondary"
    size="medium"
    tone="danger"
    class="w-24"
    :surface="surface"
    :is-loading="cancelling"
    @click="emit('cancel', order)"
  >
    {{ $t('perps.confirm.cancel') }}
  </AppBaseButton>
  <AppPopUpMenu
    v-else-if="cancellable"
    :placeholder="$t('perps.market-list.actions-menu-label')"
    location="right"
  >
    <template #menu-button="{ toggleMenu }">
      <AppBtnIcon
        icon="ellipsis-horizontal"
        :label="$t('perps.market-list.action-menu-label')"
        @click="toggleMenu"
      />
    </template>
    <template #menu-content="{ toggleMenu }">
      <ul class="px-2 py-3 max-w-full bg-white rounded-xl min-w-60">
        <li
          class="p-2 flex items-center hoverBGWhite rounded-12"
          @click.stop="[toggleMenu(), emit('view', order)]"
        >
          {{ $t('perps.positions.view-order-label') }}
        </li>
        <li
          class="p-2 flex items-center hoverBGWhite rounded-12 text-text-error"
          @click.stop="[toggleMenu(), emit('cancel', order)]"
        >
          {{
            cancelling
              ? $t('perps.order.cancelling')
              : $t('perps.order.cancel-order-button')
          }}
        </li>
      </ul>
    </template>
  </AppPopUpMenu>
</template>

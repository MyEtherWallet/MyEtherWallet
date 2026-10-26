<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppCellWatchlistToggle from '@/components/cell/AppCellWatchlistToggle.vue'
import { BTN_ICON_SIZE } from '@/components/btnIconTypes'
import type { AvatarSize } from '@/components/avatar/types'
import type { CellSurface } from '@/components/cell/cellSizes'
import { ROW_PADDING, TABLE_CONTEXT, defaultTableContext } from './types'

/**
 * Table row (design library, Figma TableRow 2126:16555). Lives inside an
 * AppTable: the row is a subgrid of the table grid, so its cells sit on the
 * same tracks as the header. Size (L/M/S) comes from the table.
 *
 * Cells left to right: drag handle + watchlist star (when the table has a
 * start track), the leading cell (`#avatar` + title/description, or
 * `#leading`), the data cells from the default slot (AppTableCell), then
 * `#actions`. The actions slot gets `size` (Figma: two buttons at L, one at M,
 * the ellipsis Button Icon at S) and `surface` for AppBaseButton: grey buttons
 * on the white row, white ones while the row is hovered grey.
 *
 * The row is clickable only when a `@click` listener is bound (tabindex 0,
 * Enter/Space). The star, handle and actions never trigger it.
 */
withDefaults(
  defineProps<{
    title?: string
    description?: string
    /** Bind to show the watchlist star; leave unbound for no star. */
    watchlisted?: boolean
    watchlistLoading?: boolean
  }>(),
  { title: '', description: '', watchlisted: undefined },
)

const emit = defineEmits<{ 'update:watchlisted': [on: boolean] }>()

const { size, start, reorderable, actions } = inject(
  TABLE_CONTEXT,
  defaultTableContext,
  true,
)

const attrs = useAttrs()
const clickable = computed(() => Boolean(attrs.onClick))

const hovered = ref(false)
const surface = computed<CellSurface>(() =>
  hovered.value ? 'alternative' : 'default',
)
const avatarSize = computed<AvatarSize>(() => (size.value === 's' ? 'm' : 'l'))

const activate = (e: KeyboardEvent) => {
  if (clickable.value) (e.currentTarget as HTMLElement).click()
}
</script>

<template>
  <div
    role="row"
    :tabindex="clickable ? 0 : undefined"
    :class="[
      'group col-span-full grid grid-cols-subgrid items-center rounded-12 bg-background-alternative py-3 transition-colors hover:bg-background-alternative-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-brand',
      ROW_PADDING[size],
      { 'cursor-pointer': clickable },
    ]"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @keydown.enter.self.prevent="activate"
    @keydown.space.self.prevent="activate"
  >
    <div v-if="start" role="cell" class="flex items-center">
      <!-- Mouse-only in v1: AppTable reads the drag from the rowgroup. -->
      <span
        v-if="reorderable"
        data-test="table-row-handle"
        draggable="true"
        aria-hidden="true"
        :class="[
          'invisible flex cursor-grab items-center justify-center text-icon-default group-focus-within:visible group-hover:visible',
          BTN_ICON_SIZE.s.box,
        ]"
        @click.stop
      >
        <AppIcon name="bars-2" size="xxs" />
      </span>
      <AppCellWatchlistToggle
        v-if="watchlisted !== undefined"
        :model-value="watchlisted"
        :loading="watchlistLoading"
        @update:model-value="emit('update:watchlisted', $event)"
      />
    </div>

    <div role="cell" class="flex min-w-0 items-center gap-2">
      <slot name="leading" :size="avatarSize">
        <span v-if="$slots.avatar" class="flex h-11 shrink-0 items-center">
          <slot name="avatar" :size="avatarSize" />
        </span>
        <AppContentGroup
          :title="title"
          :description="description"
          size="m"
          no-wrap
          class="min-w-0 flex-1"
        />
      </slot>
    </div>

    <slot />

    <div
      v-if="actions"
      role="cell"
      class="flex items-center justify-end gap-2"
      @click.stop
    >
      <slot name="actions" :size="size" :surface="surface" />
    </div>
  </div>
</template>

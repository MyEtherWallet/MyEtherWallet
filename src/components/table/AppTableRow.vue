<script setup lang="ts">
import { computed, inject, provide, ref, toRef, useAttrs } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppCellWatchlistToggle from '@/components/cell/AppCellWatchlistToggle.vue'
import AppSkeleton from '@/components/skeleton/AppSkeleton.vue'
import AppTableCell from './AppTableCell.vue'
import { BTN_ICON_SIZE } from '@/components/btnIconTypes'
import { AVATAR_SIZES, type AvatarSize } from '@/components/avatar/types'
import type { CellSurface } from '@/components/cell/cellSizes'
import {
  ROW_PADDING,
  TABLE_CONTEXT,
  TABLE_ROW_LOADING,
  defaultTableContext,
} from './types'

/**
 * Table row (design library, Figma TableRow 2126:16555). Lives inside an
 * AppTable: the row is a subgrid of the table grid, so its cells sit on the
 * same tracks as the header. Size (L/M/S) comes from the table.
 *
 * Cells left to right: drag handle + watchlist star (when the table has a
 * start track), the leading cell (`#avatar` + title/description, or
 * `#leading`; `#title` / `#title-icon` pass through to the Content Group),
 * the data cells from the default slot (AppTableCell), then
 * `#actions`. The actions slot gets `size` (Figma: two buttons at L, one at M,
 * the ellipsis Button Icon at S) and `surface` for AppBaseButton: grey buttons
 * on the white row, white ones while the row is hovered grey.
 *
 * Navigation: `to` turns the title into a RouterLink stretched over the
 * whole row, so the row keeps link semantics (new tab, middle-click, screen
 * readers) and Tab reaches the star before it. Without `to`, the row is
 * clickable only when a `@click` listener is bound (tabindex 0, Enter/Space).
 * A `@click` next to `to` still fires (analytics). The star, handle and
 * actions sit above the link and never trigger the row.
 *
 * `loading` turns the row into a skeleton copy of itself: every skeleton
 * sits in the box of the element it stands for, so nothing moves when the
 * data lands. The avatar (when `#avatar` is given) becomes a skeleton of the
 * same size, the title and description the Content Group's bars, each
 * AppTableCell line a bar (see AppTableCell), and the actions
 * `loadingButtons` medium-button skeletons, or a Button Icon M one at 0
 * (default: one at L/M, the icon at S).
 * A bound star stays live; without one, a table with a watchlist gets a
 * skeleton in its place. AppTable's `loading` rows use the same mode.
 */
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    to?: RouteLocationRaw
    /** Bind to show the watchlist star; leave unbound for no star. */
    watchlisted?: boolean
    watchlistLoading?: boolean
    loading?: boolean
    /** Buttons the loading actions show; 0 is the Button Icon. */
    loadingButtons?: number
  }>(),
  { title: '', description: '', watchlisted: undefined },
)

const emit = defineEmits<{ 'update:watchlisted': [on: boolean] }>()

const { size, visibleKeys, start, watchlist, reorderable, actions } = inject(
  TABLE_CONTEXT,
  defaultTableContext,
  true,
)
provide(TABLE_ROW_LOADING, toRef(props, 'loading'))

const attrs = useAttrs()
const clickable = computed(
  () => !props.to && !props.loading && Boolean(attrs.onClick),
)

const hovered = ref(false)
const surface = computed<CellSurface>(() =>
  hovered.value ? 'alternative' : 'default',
)
const loadingButtonCount = computed(
  () => props.loadingButtons ?? (size.value === 's' ? 0 : 1),
)
const avatarSize = computed<AvatarSize>(() => (size.value === 's' ? 'm' : 'l'))
// Same box as the avatar it stands in for (AppCell does the same).
const avatarBox = computed(() => {
  const px = `${AVATAR_SIZES[avatarSize.value].box}px`
  return { width: px, height: px }
})

const activate = (e: KeyboardEvent) => {
  if (clickable.value) (e.currentTarget as HTMLElement).click()
}
</script>

<template>
  <div
    role="row"
    :tabindex="clickable ? 0 : undefined"
    :class="[
      'group relative col-span-full grid grid-cols-subgrid items-center rounded-12 bg-background-alternative py-3 transition-colors hover:bg-background-alternative-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-brand',
      ROW_PADDING[size],
      { 'cursor-pointer': clickable },
    ]"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @keydown.enter.self.prevent="activate"
    @keydown.space.self.prevent="activate"
  >
    <div v-if="start" role="cell" class="relative z-10 flex items-center">
      <!-- AppTable's SortableJS drags the row by this handle. -->
      <span
        v-if="reorderable"
        data-table-handle
        aria-hidden="true"
        :class="[
          'invisible flex cursor-grab items-center justify-center text-icon-default group-focus-within:visible group-hover:visible pointer-coarse:visible',
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
      <span
        v-else-if="loading && watchlist"
        :class="['flex items-center justify-center', BTN_ICON_SIZE.s.box]"
      >
        <AppSkeleton shape="circle" class="size-4" />
      </span>
    </div>

    <!-- Native tooltip: the title truncates on narrow rows. -->
    <div
      role="cell"
      class="flex min-w-0 items-center gap-2"
      :title="(!loading && title) || undefined"
    >
      <slot
        v-if="$slots.leading && !loading"
        name="leading"
        :size="avatarSize"
      />
      <template v-else>
        <span v-if="$slots.avatar" class="flex h-11 shrink-0 items-center">
          <AppSkeleton v-if="loading" shape="circle" :style="avatarBox" />
          <slot v-else name="avatar" :size="avatarSize" />
        </span>
        <AppContentGroup
          :title="title"
          :description="description"
          :loading="loading"
          size="m"
          no-wrap
          class="min-w-0 flex-1"
        >
          <template v-if="to || $slots.title" #title>
            <RouterLink
              v-if="to"
              :to="to"
              class="outline-none after:absolute after:inset-0 after:rounded-12 focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-border-brand"
            >
              <slot name="title">{{ title }}</slot>
            </RouterLink>
            <slot v-else name="title" />
          </template>
          <template
            v-if="$slots['title-icon']"
            #title-icon="{ size: iconSize }"
          >
            <slot name="title-icon" :size="iconSize" />
          </template>
        </AppContentGroup>
      </template>
    </div>

    <slot v-if="$slots.default" />
    <!-- AppTable's placeholder rows have no cells: one per visible column. -->
    <template v-else-if="loading">
      <AppTableCell v-for="key in visibleKeys" :key="key" :column="key" />
    </template>

    <div
      v-if="actions"
      role="cell"
      class="relative z-10 flex items-center justify-end gap-2"
      @click.stop
    >
      <!-- shape circle is rounded-full: a pill on the button's box. -->
      <template v-if="loading">
        <AppSkeleton
          v-for="n in loadingButtonCount"
          :key="n"
          shape="circle"
          class="h-10 w-24"
        />
        <AppSkeleton
          v-if="!loadingButtonCount"
          shape="circle"
          :class="BTN_ICON_SIZE.m.box"
        />
      </template>
      <slot v-else name="actions" :size="size" :surface="surface" />
    </div>
  </div>
</template>

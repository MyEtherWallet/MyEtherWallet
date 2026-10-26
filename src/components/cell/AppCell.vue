<template>
  <div
    :class="[
      'box-border flex w-full items-center gap-3 rounded-12 px-4 outline-none transition-colors',
      sizeSpec.cell,
      surfaceClass,
      // Figma Focus: 2px border/brand drawn inside, so the content doesn't move.
      isInteractive
        ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-brand'
        : '',
      disabled ? 'pointer-events-none opacity-30' : '',
    ]"
    :role="isInteractive ? 'button' : undefined"
    :tabindex="isInteractive ? 0 : undefined"
    :aria-disabled="disabled || undefined"
    :aria-busy="loading || undefined"
    :aria-pressed="checkbox || radio ? selected : undefined"
    data-testid="cell"
    @click="onClick"
    @keydown.enter.self.prevent="onClick"
    @keydown.space.self.prevent="onClick"
  >
    <!-- inert: the control only mirrors `selected`; clicks reach the cell. -->
    <span v-if="checkbox" class="flex shrink-0" data-test="cell-checkbox" inert>
      <AppCheckbox :model-value="selected" />
    </span>

    <div
      v-if="$slots.prefix"
      class="flex h-11 w-7 shrink-0 items-center justify-center"
      @click.stop
    >
      <slot name="prefix" />
    </div>

    <template v-if="$slots.avatar">
      <!-- Figma Loading: a 32px circle in both sizes. -->
      <AppSkeleton
        v-if="loading"
        shape="circle"
        data-test="cell-skeleton-avatar"
        class="size-8 shrink-0"
      />
      <div v-else class="relative flex shrink-0">
        <slot name="avatar" :size="sizeSpec.avatar" />
        <!-- The checkbox / radio already shows selection; never both. -->
        <span
          v-if="selected && !checkbox && !radio"
          data-test="cell-selected-badge"
          class="absolute"
          :style="selectedBadgeStyle"
        >
          <AppAvatarBadge type="icon" tone="contrast">
            <AppIcon name="check" size="xxs" />
          </AppAvatarBadge>
        </span>
      </div>
    </template>

    <!-- Figma "Content Group Skeleton": the Cell's own 60 / 100 bars, not the
         Content Group's loading state. -->
    <div
      v-if="loading"
      data-test="cell-skeleton-content"
      class="flex min-w-0 flex-1 flex-col gap-1.5 py-[5px]"
    >
      <AppSkeleton class="h-3 w-[60px]" />
      <AppSkeleton v-if="description" class="h-3 w-[100px]" />
    </div>
    <AppContentGroup
      v-else
      :title="title"
      :description="description"
      size="m"
      no-wrap
      class="flex-1"
    >
      <template v-if="$slots.title" #title>
        <slot name="title" />
      </template>
    </AppContentGroup>

    <template v-if="hasAccessory">
      <AppCellRightAccessory
        v-if="loading"
        :accessory="{ kind: 'loading' }"
        data-test="cell-skeleton-accessory"
      />
      <div v-else-if="$slots.accessory" class="shrink-0 text-right">
        <slot name="accessory" />
      </div>
      <AppCellRightAccessory
        v-else-if="rightAccessory"
        :accessory="rightAccessory"
      />
    </template>

    <template v-if="!loading">
      <div v-if="$slots.action" class="shrink-0" @click.stop>
        <slot name="action" />
      </div>

      <div
        v-if="$slots.suffix"
        class="flex h-11 shrink-0 items-center justify-center"
        @click.stop
      >
        <slot name="suffix" />
      </div>

      <!-- Figma "Additional content": hugs its content at the row's height. -->
      <div
        v-if="$slots.extra"
        class="flex shrink-0 items-center self-stretch"
        @click.stop
      >
        <slot name="extra" />
      </div>
    </template>

    <span v-if="radio" class="flex shrink-0" data-test="cell-radio" inert>
      <AppRadio :model-value="selected" :value="true" :name="radioName" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useId, useSlots, type PropType } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppCheckbox from '@/components/checkbox/AppCheckbox.vue'
import AppRadio from '@/components/radio/AppRadio.vue'
import AppSkeleton from '@/components/skeleton/AppSkeleton.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppAvatarBadge from '@/components/avatar/AppAvatarBadge.vue'
import AppCellRightAccessory from '@/components/cell/AppCellRightAccessory.vue'
import { badgePositionStyle } from '@/components/avatar/types'
import {
  CELL_SIZE_SPEC,
  CELL_SURFACE_BG_CLASS,
  CELL_SURFACE_INTERACTIVE_CLASS,
  type CellRightAccessory,
  type CellSize,
  type CellSurface,
} from '@/components/cell/cellSizes'

/**
 * Cell (design library, MEW-2195). A list row composed from AppAvatar (slot),
 * AppAvatarBadge (selected check), AppContentGroup (title / description),
 * AppCellRightAccessory (right-hand side) and the optional AppCheckbox /
 * AppRadio. Figma axes: Style → `surface`, Size → `size`,
 * State → native hover / pressed / focus plus the `selected`, `disabled` and
 * `loading` props. Colours are semantic tokens only, so the cell flips with
 * the theme; the Content Group carries the typography tokens.
 */
const props = defineProps({
  /**
   * Figma "Style". `default` rests on the grey page and fills white;
   * `alternative` rests on a white card and fills grey (same spelling and
   * meaning as Chip and Picker).
   */
  surface: {
    type: String as PropType<CellSurface>,
    default: 'default',
  },
  size: {
    type: String as PropType<CellSize>,
    default: 'medium',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  /**
   * Right-hand side (Figma `_right accesory`): balance, performance, graph,
   * icon or loading. The `accessory` slot replaces it when given.
   */
  rightAccessory: {
    type: Object as PropType<CellRightAccessory>,
    default: undefined,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
  /**
   * Figma `Checkbox` / `Radio`: a leading checkbox (multi-select lists) or a
   * trailing radio (single-select lists), checked while `selected`. The cell
   * stays the click target; the consumer toggles `selected` on `click`.
   */
  checkbox: {
    type: Boolean,
    default: false,
  },
  radio: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  click: []
}>()

const slots = useSlots()

const radioName = useId()

const sizeSpec = computed(() => CELL_SIZE_SPEC[props.size])

const selectedBadgeStyle = computed(() =>
  badgePositionStyle(sizeSpec.value.avatar, 'topLeft'),
)

const hasAccessory = computed(
  () => Boolean(slots.accessory) || Boolean(props.rightAccessory),
)

const isInteractive = computed(
  () => props.interactive && !props.disabled && !props.loading,
)

const surfaceClass = computed(() => [
  CELL_SURFACE_BG_CLASS[props.surface],
  isInteractive.value ? CELL_SURFACE_INTERACTIVE_CLASS[props.surface] : '',
])

const onClick = () => {
  if (isInteractive.value) emit('click')
}
</script>

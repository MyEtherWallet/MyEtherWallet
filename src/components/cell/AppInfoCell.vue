<template>
  <div
    :class="[
      'box-border flex w-full items-center rounded-16 border border-transparent outline-none',
      sizeSpec.cell,
      CELL_SURFACE_BG_CLASS[surface],
      isInteractive
        ? 'cursor-pointer focus-visible:border-border-focus focus-visible:outline-none'
        : '',
    ]"
    :role="isInteractive ? 'button' : undefined"
    :tabindex="isInteractive ? 0 : undefined"
    :aria-busy="loading || undefined"
    :aria-pressed="checkbox || radio ? selected : undefined"
    data-testid="info-cell"
    @click="onClick"
    @keydown.enter.self.prevent="onClick"
    @keydown.space.self.prevent="onClick"
  >
    <!-- inert: the control only mirrors `selected`; clicks reach the row. -->
    <span
      v-if="checkbox"
      class="flex shrink-0"
      data-test="info-cell-checkbox"
      inert
    >
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
      <AppSkeleton
        v-if="loading"
        shape="circle"
        data-test="info-cell-skeleton-avatar"
        class="shrink-0"
        :style="skeletonAvatarStyle"
      />
      <div v-else class="flex shrink-0">
        <slot name="avatar" :size="sizeSpec.avatar" />
      </div>
    </template>

    <!-- S is title only; Figma sets its leading title in the inverted (text/sm) style. -->
    <AppContentGroup
      :title="title"
      :description="isSmall ? undefined : description"
      :loading="loading"
      :inverted="isSmall"
      size="m"
      no-wrap
      class="flex-1"
    />

    <template v-if="!loading">
      <div v-if="$slots.accessory" class="shrink-0 text-right">
        <slot name="accessory" />
      </div>
      <AppCellRightAccessory
        v-else-if="rightAccessory"
        :accessory="rightAccessory"
      />
      <AppContentGroup
        v-else-if="trailingTitle"
        :title="trailingTitle"
        :description="isSmall ? undefined : trailingDescription"
        align="right"
        size="m"
        no-wrap
        class="flex-1"
      />
    </template>

    <template v-if="$slots['trailing-avatar']">
      <AppSkeleton
        v-if="loading"
        shape="circle"
        data-test="info-cell-skeleton-trailing-avatar"
        class="shrink-0"
        :style="skeletonAvatarStyle"
      />
      <div v-else class="flex shrink-0">
        <slot name="trailing-avatar" :size="sizeSpec.avatar" />
      </div>
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

      <div
        v-if="$slots.extra"
        class="flex shrink-0 items-center self-stretch"
        @click.stop
      >
        <slot name="extra" />
      </div>
    </template>

    <span v-if="radio" class="flex shrink-0" data-test="info-cell-radio" inert>
      <AppRadio :model-value="selected" :value="true" :name="radioName" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useId, type PropType } from 'vue'
import AppCheckbox from '@/components/checkbox/AppCheckbox.vue'
import AppRadio from '@/components/radio/AppRadio.vue'
import AppSkeleton from '@/components/skeleton/AppSkeleton.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppCellRightAccessory from '@/components/cell/AppCellRightAccessory.vue'
import { AVATAR_SIZES } from '@/components/avatar/types'
import {
  CELL_SURFACE_BG_CLASS,
  INFO_CELL_SIZE_SPEC,
  type CellRightAccessory,
  type CellSize,
  type CellSurface,
} from '@/components/cell/cellSizes'

/**
 * InfoCell (design library, MEW-2464, Figma 2656:30288). The two-sided Cell:
 * leading avatar + Content Group, and on the right a Content Group (right
 * aligned), the Cell right accessory or a custom `accessory` slot, then a
 * trailing avatar. Same slots and selection model as AppCell (checkbox / radio
 * mirror `selected`, the row is the click target), but its own geometry and no
 * hover / pressed / selected look, which Figma doesn't define for InfoCell.
 * Avatars come through the `avatar` / `trailing-avatar` slots with a `size`.
 */
const props = defineProps({
  /** Figma "Style": `default` fills white, `alternative` fills grey (as AppCell). */
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
  /** Medium only; Figma's S row is title only. */
  description: {
    type: String,
    default: '',
  },
  trailingTitle: {
    type: String,
    default: '',
  },
  trailingDescription: {
    type: String,
    default: '',
  },
  /**
   * Figma `Right accessory swap`: replaces the trailing Content Group with the
   * Cell right accessory (balance, performance, graph, icon). The `accessory`
   * slot wins over both.
   */
  rightAccessory: {
    type: Object as PropType<CellRightAccessory>,
    default: undefined,
  },
  selected: {
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
  /** Figma `Checkbox` / `Radio`: leading checkbox or trailing radio, checked while `selected`. */
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

const radioName = useId()

const sizeSpec = computed(() => INFO_CELL_SIZE_SPEC[props.size])
const isSmall = computed(() => props.size === 'small')

// Same box as the avatar it replaces, so the row doesn't jump once it loads.
const skeletonAvatarStyle = computed(() => {
  const px = `${AVATAR_SIZES[sizeSpec.value.avatar].box}px`
  return { width: px, height: px }
})

const isInteractive = computed(() => props.interactive && !props.loading)

const onClick = () => {
  if (isInteractive.value) emit('click')
}
</script>

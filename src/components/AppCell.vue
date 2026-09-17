<template>
  <div
    :class="[
      'box-border flex w-full items-center gap-3 rounded-12 px-4 outline-none transition-colors',
      sizeSpec.cell,
      surfaceClass,
      isInteractive
        ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary'
        : '',
      disabled ? 'pointer-events-none opacity-30' : '',
    ]"
    :role="isInteractive ? 'button' : undefined"
    :tabindex="isInteractive ? 0 : undefined"
    :aria-disabled="disabled || undefined"
    :aria-busy="loading || undefined"
    @click="onClick"
    @keydown.enter.self.prevent="onClick"
    @keydown.space.self.prevent="onClick"
  >
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
        data-test="cell-skeleton-avatar"
        class="size-8 shrink-0"
      />
      <div v-else class="relative flex shrink-0">
        <slot name="avatar" :size="sizeSpec.avatar" />
        <span
          v-if="selected"
          data-test="cell-selected-badge"
          class="absolute"
          :style="selectedBadgeStyle"
        >
          <AppAvatarBadge type="icon" tone="contrast">
            <CheckIcon />
          </AppAvatarBadge>
        </span>
      </div>
    </template>

    <AppContentGroup
      :title="title"
      :description="description"
      :loading="loading"
      size="m"
      no-wrap
      class="flex-1"
    >
      <template v-if="$slots.title" #title>
        <slot name="title" />
      </template>
    </AppContentGroup>

    <template v-if="hasAccessory">
      <div
        v-if="loading"
        data-test="cell-skeleton-accessory"
        class="flex shrink-0 flex-col items-end gap-2"
      >
        <AppSkeleton class="h-3 w-[50px]" />
        <AppSkeleton class="h-3 w-[70px]" />
      </div>
      <div v-else class="shrink-0 text-right">
        <slot name="accessory">
          <AppContentGroup
            :title="accessoryTitle"
            :description="accessoryDescription"
            size="m"
            align="right"
            no-wrap
          />
        </slot>
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

      <div v-if="$slots.extra" class="h-11 w-7 shrink-0" @click.stop>
        <slot name="extra" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots, type PropType } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import AppSkeleton from '@/components/AppSkeleton.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppAvatarBadge from '@/components/avatar/AppAvatarBadge.vue'
import { badgePositionStyle } from '@/components/avatar/types'
import { CELL_SIZE_SPEC, type CellSize } from '@/components/cellSizes'

const props = defineProps({
  /**
   * Figma "Style" axis, named by the surface the cell renders on.
   * `surface` (Figma Default) rests on white, `base` (Figma Alternative)
   * rests on #f5f5f5. This is the inverse of AppInput's `surface` prop, where
   * `default` is the grey field — do not reuse that prop name or its values.
   */
  variant: {
    type: String as PropType<'surface' | 'base'>,
    default: 'surface',
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
  accessoryTitle: {
    type: String,
    default: '',
  },
  accessoryDescription: {
    type: String,
    default: '',
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
})

const emit = defineEmits<{
  click: []
}>()

const slots = useSlots()

const sizeSpec = computed(() => CELL_SIZE_SPEC[props.size])

const selectedBadgeStyle = computed(() =>
  badgePositionStyle(sizeSpec.value.avatar, 'topLeft'),
)

const hasAccessory = computed(
  () => Boolean(slots.accessory) || props.accessoryTitle !== '',
)

const isInteractive = computed(
  () => props.interactive && !props.disabled && !props.loading,
)

const surfaceClass = computed(() => {
  const onBase = props.variant === 'base'
  const resting = onBase ? 'bg-bgBase' : 'bg-white'
  if (!isInteractive.value) return resting
  return onBase
    ? `${resting} hover:bg-bgBase-hover active:bg-bgBase-pressed`
    : `${resting} hover:bg-bgSurface-hover active:bg-bgSurface-pressed`
})

const onClick = () => {
  if (isInteractive.value) emit('click')
}
</script>

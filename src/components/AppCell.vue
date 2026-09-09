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

    <template v-if="loading">
      <AppSkeleton
        v-if="$slots.avatar"
        shape="circle"
        data-test="cell-skeleton-avatar"
        class="size-8 shrink-0"
      />
      <div
        data-test="cell-skeleton-content"
        class="flex min-w-0 flex-1 flex-col gap-1.5 py-[5px]"
      >
        <AppSkeleton class="h-3 w-[60px]" />
        <AppSkeleton class="h-3 w-[100px]" />
      </div>
      <div
        v-if="$slots.accessory"
        data-test="cell-skeleton-accessory"
        class="flex shrink-0 flex-col items-end gap-2"
      >
        <AppSkeleton class="h-3 w-[50px]" />
        <AppSkeleton class="h-3 w-[70px]" />
      </div>
    </template>

    <template v-else>
      <div
        v-if="$slots.avatar"
        :class="[
          'relative shrink-0 rounded-full bg-[rgba(177,179,178,0.3)]',
          sizeSpec.avatar,
        ]"
      >
        <div
          class="flex size-full items-center justify-center overflow-hidden rounded-full"
        >
          <slot name="avatar" />
        </div>
        <span
          v-if="$slots.avatarBadge"
          :class="[badgeClass, sizeSpec.badge, '-bottom-[5px] -right-[5px]']"
        >
          <slot name="avatarBadge" />
        </span>
        <span
          v-if="selected && $slots.avatarBadge"
          data-test="cell-selected-badge"
          :class="[badgeClass, sizeSpec.badge, '-left-[5px] -top-[5px]']"
        >
          <slot name="avatarBadge" />
        </span>
      </div>

      <AppCellContent :title="title" :description="description" class="flex-1">
        <template v-if="$slots.title" #title>
          <slot name="title" />
        </template>
      </AppCellContent>

      <div
        v-if="$slots.accessory"
        class="flex shrink-0 flex-col items-end justify-center text-right"
      >
        <slot name="accessory" />
      </div>

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
import { computed, type PropType } from 'vue'
import AppSkeleton from '@/components/AppSkeleton.vue'
import AppCellContent from '@/components/AppCellContent.vue'
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

const sizeSpec = computed(() => CELL_SIZE_SPEC[props.size])

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

const badgeClass =
  'absolute flex items-center justify-center overflow-hidden rounded-full border border-white bg-white'

const onClick = () => {
  if (isInteractive.value) emit('click')
}
</script>

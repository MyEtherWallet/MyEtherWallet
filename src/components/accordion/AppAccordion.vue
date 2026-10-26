<template>
  <div
    v-bind="$attrs"
    :class="[
      'flex w-full flex-col overflow-hidden rounded-12',
      CELL_SURFACE_BG_CLASS[surface],
    ]"
  >
    <AppCell
      :id="headerId"
      :surface="surface"
      :title="title"
      :description="description"
      :right-accessory="rightAccessory"
      :disabled="disabled"
      :loading="loading"
      :aria-expanded="isOpen"
      :aria-controls="bodyId"
      :aria-disabled="disabled || loading || undefined"
      @click="toggle"
    >
      <template v-for="name in cellSlots" :key="name" #[name]="scope">
        <slot :name="name" v-bind="scope" />
      </template>
      <template #indicator>
        <AppIcon
          :name="isOpen ? 'chevron-up' : 'chevron-down'"
          size="s"
          class="text-text-default"
        />
      </template>
    </AppCell>

    <ExpandTransition>
      <div
        v-show="isOpen"
        :id="bodyId"
        role="region"
        :aria-labelledby="headerId"
        class="w-full motion-reduce:transition-none!"
      >
        <slot />
      </div>
    </ExpandTransition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, useId, useSlots } from 'vue'
import AppCell from '@components/cell/AppCell.vue'
import AppIcon from '@components/icon/AppIcon.vue'
import ExpandTransition from '@components/transitions/ExpandTransition.vue'
import {
  CELL_SURFACE_BG_CLASS,
  type CellRightAccessory,
  type CellSurface,
} from '@components/cell/cellSizes'
import { ACCORDION_GROUP_KEY, type AccordionKey } from './types'

/**
 * Accordion (design library, MEW-2465; Figma ↳ Acordion 2387:27248). An
 * AppCell header that shows or hides the default slot beneath it. The whole
 * header is the toggle (one tab stop) and the chevron is decorative. Figma
 * axes: Style → `surface` (same meaning as the Cell), Open → `v-model:open`,
 * State → the Cell's own hover / pressed / focus plus `disabled` / `loading`.
 * Named slots (avatar, title, accessory…) go straight to the Cell. Inside an
 * AppAccordionGroup the group decides what is open.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    surface?: CellSurface
    title?: string
    description?: string
    rightAccessory?: CellRightAccessory
    disabled?: boolean
    loading?: boolean
    /** Key inside an AppAccordionGroup. Defaults to a generated id. */
    value?: AccordionKey
  }>(),
  {
    surface: 'default',
    title: '',
    description: '',
    rightAccessory: undefined,
    value: undefined,
  },
)

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  toggle: [open: boolean]
}>()

const slots = useSlots()
const group = inject(ACCORDION_GROUP_KEY, null)

const id = useId()
const headerId = `${id}-header`
const bodyId = `${id}-body`
const key = computed(() => props.value ?? id)

const isOpen = computed(() => (group ? group.isOpen(key.value) : open.value))

const cellSlots = computed(() =>
  Object.keys(slots).filter(name => name !== 'default'),
)

// AppCell only emits click while interactive, so disabled / loading never land here.
const toggle = () => {
  const next = !isOpen.value
  if (group) group.toggle(key.value)
  else open.value = next
  emit('toggle', next)
}
</script>

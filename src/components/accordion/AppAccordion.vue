<template>
  <div
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
      role="button"
      :aria-expanded="isOpen"
      :aria-controls="bodyId"
      @click="toggle"
    >
      <template v-for="name in cellSlots()" :key="name" #[name]="scope">
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
import { computed, inject, provide, useId, useSlots } from 'vue'
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
 * AppAccordionGroup the group decides what is open. Disabled / loading a11y
 * (aria-disabled, aria-busy) comes from the Cell; the header keeps its button
 * role in those states (the Cell drops it when not interactive), so
 * aria-expanded still has a disclosure to describe.
 */
const props = withDefaults(
  defineProps<{
    surface?: CellSurface
    title?: string
    description?: string
    rightAccessory?: CellRightAccessory
    disabled?: boolean
    loading?: boolean
    /** Key inside an AppAccordionGroup. Defaults to the generated id. */
    value?: AccordionKey
    /** Base for the header / body ids. Generated when omitted. */
    id?: string
  }>(),
  {
    surface: 'default',
    title: '',
    description: '',
    rightAccessory: undefined,
    value: undefined,
    id: undefined,
  },
)

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  toggle: [open: boolean]
}>()

const slots = useSlots()
const group = inject(ACCORDION_GROUP_KEY, null)
// An accordion in this one's body keeps its own open state.
provide(ACCORDION_GROUP_KEY, null)

// useId always runs (stable across renders); the ids follow a changed `id`.
const generatedId = useId()
const baseId = computed(() => props.id ?? generatedId)
const headerId = computed(() => `${baseId.value}-header`)
const bodyId = computed(() => `${baseId.value}-body`)
const key = computed(() => props.value ?? baseId.value)

const isOpen = computed(() => (group ? group.isOpen(key.value) : open.value))

// Read at render time: slots aren't reactive, a computed would miss a named
// slot the consumer adds later (e.g. behind v-if).
const cellSlots = () => Object.keys(slots).filter(name => name !== 'default')

// AppCell only emits click while interactive, so disabled / loading never land here.
const toggle = () => {
  const next = !isOpen.value
  if (group) group.toggle(key.value)
  else open.value = next
  emit('toggle', next)
}
</script>

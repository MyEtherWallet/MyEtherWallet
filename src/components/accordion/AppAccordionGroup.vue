<template>
  <div class="flex w-full flex-col gap-2">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { ACCORDION_GROUP_KEY, type AccordionKey } from './types'

/**
 * Accordion group (MEW-2465). Owns which AppAccordion children are open: one
 * at a time by default, any number with `multiple`. `v-model` holds the open
 * key (or keys with `multiple`); each child's key is its `value`. Tab moves
 * between headers like separate buttons (WAI disclosure pattern), so there is
 * no arrow-key roving.
 */
const props = defineProps<{
  multiple?: boolean
}>()

const model = defineModel<AccordionKey | AccordionKey[] | null>({
  default: null,
})

const openKeys = (): AccordionKey[] =>
  model.value === null ? [] : [model.value].flat()

provide(ACCORDION_GROUP_KEY, {
  isOpen: key => openKeys().includes(key),
  toggle: key => {
    const keys = openKeys()
    const isOpen = keys.includes(key)
    if (props.multiple)
      model.value = isOpen ? keys.filter(k => k !== key) : [...keys, key]
    else model.value = isOpen ? null : key
  },
})
</script>

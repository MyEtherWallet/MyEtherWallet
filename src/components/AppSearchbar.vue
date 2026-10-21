<template>
  <label
    :class="[
      'group flex min-w-0 cursor-text items-center gap-2.5 rounded-full',
      VARIANT_CLASS[variant].field,
      // Keyboard Focus draws the Checkbox ring; clicking in or typing is
      // Figma Focus/Typing, which keep only the caret (same rule as Input).
      inFocusInput && !isActive
        ? 'outline-2 outline-offset-4 outline-border-focus'
        : '',
    ]"
    @pointerdown="setActive()"
  >
    <AppIcon
      name="magnifying-glass"
      size="s"
      :class="[
        'group-focus-within:text-icon-brand',
        query ? 'text-icon-brand' : 'text-icon-subtle',
      ]"
    />
    <input
      ref="searchInput"
      type="search"
      autocomplete="off"
      spellcheck="false"
      enterkeyhint="search"
      :value="query"
      :placeholder="placeholder || $t('common.search')"
      :aria-label="placeholder || $t('common.search')"
      :class="[
        'min-w-0 flex-1 appearance-none border-none bg-transparent p-0 text-text-default caret-border-selected focus:outline-none focus:ring-0',
        'placeholder:text-text-muted focus:placeholder:text-text-placeholder',
        '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
        VARIANT_CLASS[variant].text,
      ]"
      @focus="setInFocusInput()"
      @blur="startOutOfFocusTimeout()"
      @input="onInput"
      @keydown.enter="onSubmit"
      @keydown.esc="onEsc"
    />
    <AppBtnIcon
      v-if="query"
      :icon="actionIcon ?? 'x-mark'"
      size="s"
      class="text-icon-default"
      :label="actionIcon ? actionLabel : $t('common.clear_icon')"
      @click="onAction"
    />
  </label>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import type { IconName } from '@/components/icon/icons'
import { useInFocusInput } from '@/composables/useInFocusInput'

/**
 * Searchbar (design library, Figma 82:14709). Text field for filtering or
 * finding items within a list: search icon, input and a clear button.
 *
 * Pick `variant` by surface: `outline` (48px white field, 4px border) sits on
 * grey surfaces, `default` (40px formfield fill) on white ones. Focus and
 * Typing are CSS/value states, not props: the icon turns brand on focus and
 * stays brand while there's a value. The clear button (Button Icon S) shows
 * while there's a value; Esc clears too. Layout classes and listeners land on
 * the root `<label>`.
 *
 * @example <AppSearchbar v-model="query" variant="default" />
 * @example <AppSearchbar v-model="query" variant="outline" :debounce="250" />
 */
const props = withDefaults(
  defineProps<{
    variant?: 'outline' | 'default'
    /** Also the aria-label. Falls back to the localized `common.search`. */
    placeholder?: string
    /** ms before v-model updates; 0 emits on every keystroke. Use for
     *  searches that fetch. */
    debounce?: number
    /** Swaps the clear x-mark for this glyph; a click then emits `action`
     *  with the value and the field is not cleared. */
    actionIcon?: IconName
    /** Accessible name for `actionIcon` (required with it). */
    actionLabel?: string
  }>(),
  {
    variant: 'outline',
    placeholder: '',
    debounce: 0,
    actionIcon: undefined,
    actionLabel: '',
  },
)

const emit = defineEmits<{
  clear: []
  action: [value: string]
  submit: [value: string]
}>()

// Figma: Outline pl 12 with the Button Icon 6px off the outer edge (2px inside
// the 4px border); Default px 10 with the Button Icon at 10.
const VARIANT_CLASS = {
  outline: {
    field:
      'h-12 border-4 border-border-default bg-background-alternative pl-3 pr-0.5',
    text: 'text-text-base',
  },
  default: {
    field: 'h-10 bg-background-formfield px-2.5',
    text: 'text-text-sm',
  },
} as const

const model = defineModel<string>()

// The field owns what's typed so a pending debounce never snaps the text back
// to the stale model on re-render.
const query = ref(model.value ?? '')
watch(model, (value) => {
  query.value = value ?? ''
})

const commit = () => {
  model.value = query.value
}
const { start: startDebounce, stop: stopDebounce } = useTimeoutFn(
  commit,
  () => props.debounce,
  { immediate: false },
)
const flush = () => {
  stopDebounce()
  commit()
}

const searchInput = ref<HTMLInputElement | null>(null)
const {
  inFocusInput,
  isActive,
  setActive,
  setInFocusInput,
  startOutOfFocusTimeout,
} = useInFocusInput(searchInput)

const onInput = (e: Event) => {
  query.value = (e.target as HTMLInputElement).value
  setActive()
  if (props.debounce) startDebounce()
  else commit()
}

const onSubmit = () => {
  flush()
  emit('submit', query.value)
}

const clear = () => {
  query.value = ''
  flush()
  emit('clear')
  setActive()
  searchInput.value?.focus()
}

// Esc on a filled field clears it and stops there, so an enclosing dialog
// only closes on the next Esc.
const onEsc = (e: KeyboardEvent) => {
  if (!query.value) return
  e.stopPropagation()
  clear()
}

const onAction = () => {
  if (!props.actionIcon) return clear()
  flush()
  emit('action', query.value)
}
</script>

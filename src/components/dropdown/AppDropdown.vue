<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'
import { onClickOutside } from '@vueuse/core'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppMenuList from '@/components/menu_list/AppMenuList.vue'
import {
  MENU_LIST_ROW_SELECTOR,
  type MenuListRole,
} from '@/components/menu_list/types'
import { useFlipPlacement } from './useFlipPlacement'
import {
  DROPDOWN_MENU_WIDTH_CLASS,
  DROPDOWN_TRIGGER_CLASS,
  DROPDOWN_TRIGGER_STATE_CLASS,
  type DropdownSize,
  type DropdownSurface,
} from './types'

/**
 * Dropdown (design library, MEW-2468, Figma 2555:12846). "Trigger control that
 * opens a Menu List of options; supports a leading avatar, custom trailing
 * content, and a state icon." A choice that opens a modal is a Picker instead.
 *
 * Owns open / close (outside click, Escape, focus leaving) and the focus
 * hand-off into and out of the AppMenuList that opens 4px under the trigger,
 * or above it when it doesn't fit below. It doesn't own a value: the rows are
 * consumer `AppCell size="small" inset` in the default slot (scope `close`),
 * and the consumer updates `title` and the `avatar` slot from its selection.
 * Attrs land on the wrapper.
 *
 * @example
 * <AppDropdown v-model:search="query" :title="network.name" searchable>
 *   <template #avatar="{ size }"><AppAvatar :size="size" type="network" :chain="network.id" /></template>
 *   <AppCell v-for="n in shown" :key="n.id" size="small" inset role="option" :aria-selected="n.id === network.id" :title="n.name" @click="network = n" />
 * </AppDropdown>
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    title: string
    size?: DropdownSize
    surface?: DropdownSurface
    disabled?: boolean
    /** Close once a row is picked (click, Enter or Space on it). */
    closeOnSelect?: boolean
    /** Search field on top of the menu (Menu List `showSearchbar`). */
    searchable?: boolean
    searchPlaceholder?: string
    /** `listbox` for option pickers, `menu` for action menus. */
    menuRole?: MenuListRole
    /** Classes for the menu's scrolling rows region, e.g. its max height. */
    menuClass?: string
  }>(),
  {
    size: 'm',
    surface: 'default',
    disabled: false,
    closeOnSelect: true,
    searchable: false,
    searchPlaceholder: '',
    menuRole: 'listbox',
    menuClass: undefined,
  },
)

/** Bind `v-model:open` to control it; it toggles on its own otherwise. */
const open = defineModel<boolean>('open', { default: false })
const search = defineModel<string>('search', { default: '' })

const AVATAR_SIZE = 's' as const // 24px in both sizes

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const menu = ref<InstanceType<typeof AppMenuList> | null>(null)

const triggerId = useId()
const listId = useId()

const { flipUp } = useFlipPlacement(
  trigger,
  () => menu.value?.$el as HTMLElement | undefined,
  open,
)

// Opened from the keyboard, focus moves into the menu so keyboard users aren't
// stranded on the trigger. A pointer open leaves it on the trigger: focusing the
// field would show the Searchbar's keyboard ring, which Figma's Open doesn't have.
const show = async (moveFocus = true) => {
  if (props.disabled) return
  open.value = true
  if (!moveFocus) return
  await nextTick()
  if (props.searchable) menu.value?.focusSearch()
  else menu.value?.focusRow(0)
}

const close = (refocusTrigger: boolean) => {
  if (!open.value) return
  open.value = false
  if (refocusTrigger) trigger.value?.focus()
}

// Enter / Space on a button fire a click with detail 0; a pointer click counts ≥ 1.
const toggle = (event: MouseEvent) =>
  open.value ? close(true) : show(event.detail === 0)

onClickOutside(root, () => close(false))

const onFocusOut = (event: FocusEvent) => {
  const next = event.relatedTarget as Node | null
  if (next && !root.value?.contains(next)) close(false)
}

const isRow = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest(MENU_LIST_ROW_SELECTOR))

// A Cell picked by keyboard emits its click without a DOM click event.
const onMenuClick = (event: MouseEvent) => {
  if (props.closeOnSelect && isRow(event.target)) close(true)
}

const onMenuKeydown = (event: KeyboardEvent) => {
  const picks = event.key === 'Enter' || event.key === ' '
  if (props.closeOnSelect && picks && isRow(event.target)) close(true)
}

defineExpose({ show, close })
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    data-testid="dropdown"
    class="relative"
    :class="size === 'm' ? 'flex w-full' : 'inline-flex'"
    @keydown.esc="close(true)"
    @focusout="onFocusOut"
  >
    <button
      :id="triggerId"
      ref="trigger"
      type="button"
      data-testid="dropdown-trigger"
      :aria-haspopup="menuRole"
      :aria-expanded="open"
      :aria-controls="open ? listId : undefined"
      :disabled="disabled"
      class="items-center text-left transition-colors"
      :class="[
        DROPDOWN_TRIGGER_CLASS[size][surface],
        DROPDOWN_TRIGGER_STATE_CLASS,
      ]"
      @click="toggle"
      @keydown.down.prevent="show()"
    >
      <span v-if="$slots.avatar" class="flex shrink-0">
        <slot name="avatar" :size="AVATAR_SIZE" />
      </span>
      <AppContentGroup
        v-if="size === 'm'"
        :title="title"
        size="m"
        no-wrap
        class="flex-1"
      />
      <span
        v-else
        class="whitespace-nowrap px-2 text-label-base text-text-default"
      >
        {{ title }}
      </span>
      <span
        v-if="size === 'm' && $slots.suffix"
        data-testid="dropdown-suffix"
        class="flex h-8 w-10 shrink-0 items-center justify-center"
      >
        <slot name="suffix" />
      </span>
      <AppIcon
        name="chevron-down"
        size="s"
        class="shrink-0 text-icon-subtle transition-transform motion-reduce:transition-none"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <AppMenuList
      v-if="open"
      ref="menu"
      v-model:search="search"
      :list-id="listId"
      :aria-labelledby="triggerId"
      :role="menuRole"
      :searchable="searchable"
      :search-placeholder="searchPlaceholder"
      :list-class="menuClass"
      class="absolute z-20"
      :class="[
        DROPDOWN_MENU_WIDTH_CLASS[size],
        flipUp ? 'bottom-full mb-1' : 'top-full mt-1',
      ]"
      @click="onMenuClick"
      @keydown="onMenuKeydown"
    >
      <slot :close="() => close(true)" />
    </AppMenuList>
  </div>
</template>

<template>
  <div ref="target" class="relative">
    <label for="select" class="sr-only">
      {{ props.placeholder }}
    </label>
    <slot name="menu-button" :toggleMenu="toggleMenu">
      <button
        class="rounded-full hoverNoBG p-2 text-s-17 leading-p-130 font-medium"
        @click="toggleMenu"
      >
        <div class="flex items-center">
          <span :class="`text-s-${props.labelSize}`">{{ placeholder }}</span>
          <chevron-down-icon class="w-4 h-4 ml-1" />
        </div>
      </button>
    </slot>

    <!-- Teleported dropdown: renders at body level to escape overflow-hidden parents -->
    <template v-if="props.teleport">
      <teleport to="body">
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-show="openSelect"
            ref="floating"
            :style="floatingStyle"
            class="fixed z-[2200] app-popup-menu-floating"
          >
            <div
              class="min-w-[180px] max-w-[calc(100vw-24px)] bg-white shadow-xl rounded-3xl border border-grey-10 overflow-hidden"
            >
              <slot name="menu-content" :toggleMenu="toggleMenu" />
            </div>
          </div>
        </transition>
      </teleport>
    </template>

    <!-- Default inline dropdown (unchanged behaviour) -->
    <template v-else>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          role="listbox"
          :aria-label="$t('common.select_an_option')"
          v-show="openSelect"
          :class="[
            'absolute focus:outline-none z-10 pt-2',
            { 'left-0': props.location === PopupLocation.LEFT },
            { 'right-0': props.location === PopupLocation.RIGHT },
            { 'inset-x-0': props.location === PopupLocation.CENTER },
          ]"
        >
          <div
            class="min-w-[180px] max-w-full bg-white shadow-xl rounded-3xl border border-grey-10 overflow-hidden"
          >
            <slot name="menu-content" :toggleMenu="toggleMenu" />
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * @file AppPopUpMenu.vue
 * @description A reusable customizable popup menu component that can be used to create dropdowns / popup menu.
 *
 * @props
 * - placeholder: The placeholder text for the button field, also used as the aria label.
 * - location: (left, right, center)
 * - teleport: When true the dropdown is rendered via <teleport to="body"> as a fixed-positioned
 *   element so it escapes any overflow-hidden ancestor (e.g. the Manage Accounts popup).
 *
 * @slot
 * - menu-button: Slot for the button that toggles the popup menu.
 * - menu-content: Slot for the content of the popup menu.
 *
 * @example
 * <app-pop-up-menu placeholder="Select an option" location="right">
 *   <template #menu-button="{ toggleMenu }">
 *    <div @click="toggleMenu"> Open Menu </div>
 *   </template>
 *   <template #menu-content="{ toggleMenu }">
 *    <ul>
 *      <li @click="toggleMenu">Option 1</li>
 *      <li @click="toggleMenu">Option 2</li>
 *    </ul>
 *   </template>
 * </app-pop-up-menu>
 */
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { ref, watch, type CSSProperties, type PropType } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'

enum PopupLocation {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

const props = defineProps({
  /**
   * @placeholder The placeholder text of the button field. Also used as the aria label.
   */
  placeholder: {
    type: String,
  },
  /**
   * @location The location of the popup menu.
   * Can be 'left', 'right', or 'center'.
   * Default is 'right'.
   */
  location: {
    type: String as PropType<'left' | 'right' | 'center'>,
    default: 'right',
  },
  labelSize: {
    type: String,
    default: '14',
  },
  /**
   * @teleport When true, renders the dropdown via <teleport to="body"> as a fixed-positioned
   * element. Use this when the menu is inside an overflow-hidden ancestor so it is never clipped.
   */
  teleport: {
    type: Boolean,
    default: false,
  },
})

/**
 * @target The wrapper element for the trigger area.
 * Used for outside-click detection and (when teleport=true) positioning.
 */
const target = ref<HTMLElement | null>(null)
const targetValue = ref<HTMLElement | null>(null)

/**
 * Ref for the teleported floating wrapper — added to the onClickOutside ignore list
 * so clicks inside the menu do not close it.
 */
const floating = ref<HTMLElement | null>(null)

/**
 * Inline styles applied to the teleported wrapper when teleport=true.
 */
const floatingStyle = ref<CSSProperties>({})

/**
 * controls the open state of the select dropdown
 */
const openSelect = ref(false)

/**
 * Surface the open state so consumers can react to ANY close (including an
 * outside-click, which this component handles itself) — e.g. to reset a
 * transient inline-confirm state in the menu content.
 */
const emit = defineEmits<{ 'update:open': [boolean] }>()
watch(openSelect, v => emit('update:open', v))

/**
 * Compute fixed-position coords from the trigger bounding rect.
 * Called every time the menu opens so it tracks any scroll/resize that
 * happened since the last open.
 */
const computeFloatingStyle = (): void => {
  if (!target.value) return
  const rect = target.value.getBoundingClientRect()
  const style: CSSProperties = { position: 'fixed', top: `${rect.bottom + 8}px` }

  if (props.location === PopupLocation.LEFT) {
    style.left = `${rect.left}px`
  } else if (props.location === PopupLocation.CENTER) {
    style.left = `${rect.left}px`
  } else {
    // right (default)
    style.right = `${window.innerWidth - rect.right}px`
  }

  floatingStyle.value = style
}

/**
 * @method toggleMenu
 * Toggles the open state of the select dropdown.
 */
const toggleMenu = () => {
  openSelect.value = !openSelect.value
  if (openSelect.value) {
    targetValue.value = target.value
    if (props.teleport) {
      computeFloatingStyle()
    }
  } else {
    targetValue.value = null
  }
}

/*
 * The teleported menu is position:fixed with coords frozen at open-time, but its
 * trigger scrolls with its container (e.g. the overflow-y-auto address list in
 * the Manage Accounts popup). Recompute while open so it stays anchored instead
 * of floating off. Capture phase catches scrolls on inner containers too.
 */
useEventListener(
  window,
  'scroll',
  () => {
    if (props.teleport && openSelect.value) computeFloatingStyle()
  },
  { capture: true },
)
useEventListener(window, 'resize', () => {
  if (props.teleport && openSelect.value) computeFloatingStyle()
})

/*
 * Closes the dropdown when clicking outside of it.
 * The floating element is added to the ignore list so clicks inside the
 * teleported menu do not trigger an outside-click close.
 */
onClickOutside(
  targetValue,
  () => {
    targetValue.value = null
    openSelect.value = false
  },
  { ignore: [floating] },
)
</script>

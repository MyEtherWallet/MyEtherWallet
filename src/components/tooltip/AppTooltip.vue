<script setup lang="ts">
import { ref, computed, useId, nextTick, watch, onBeforeUnmount } from 'vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import {
  PLACEMENT_FLEX,
  ARROW_BEFORE,
  ARROW_ROTATE,
  OPPOSITE,
  type TooltipPlacement,
  type TooltipTrigger,
} from './types'

/**
 * Tooltip (design library, node 2279-37377). A small contextual overlay shown on
 * hover / focus / click. Renders a dark bubble (background/info) with inverted
 * text plus an arrow that points back at the trigger from any of the four sides,
 * teleported to the app root and positioned against the trigger's rect with an
 * auto-flip when there is no room on the requested side.
 *
 * The default slot is the trigger; with no slot content a focusable info icon
 * is rendered so a bare `<AppTooltip text="…" />` works as an inline hint. The
 * `content` slot holds optional custom content shown next to / instead of
 * `text`. For rich, interactive overlays (buttons, links) use a Popover /
 * Contextual Menu instead — out of scope here.
 *
 * The root is a fragment (trigger + Teleport), so `class` and other attrs are
 * forwarded to the trigger wrapper explicitly.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    text?: string
    /** Side the tooltip sits on; the arrow points back at the trigger. */
    placement?: TooltipPlacement
    trigger?: TooltipTrigger[]
    disabled?: boolean
    /** Show delay in ms. */
    delay?: number
  }>(),
  {
    text: '',
    placement: 'top',
    trigger: () => ['hover', 'focus'],
    disabled: false,
    delay: 0,
  },
)

const tooltipId = useId()
const triggerRef = ref<HTMLElement | null>(null)
const tipRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const effectivePlacement = ref<TooltipPlacement>(props.placement)
const pos = ref({ x: 0, y: 0 })

const hasText = computed(() => props.text !== '')
const isVertical = computed(
  () =>
    effectivePlacement.value === 'top' || effectivePlacement.value === 'bottom',
)
const has = (t: TooltipTrigger) => props.trigger.includes(t)

// Gap between the arrow tip and the trigger, and the min margin to a viewport edge.
const MARGIN = 4
const HIDE_DELAY = 80
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

function update() {
  const t = triggerRef.value?.getBoundingClientRect()
  const c = tipRef.value?.getBoundingClientRect()
  if (!t || !c) return
  const vw = window.innerWidth
  const vh = window.innerHeight
  const room: Record<TooltipPlacement, number> = {
    top: t.top,
    bottom: vh - t.bottom,
    left: t.left,
    right: vw - t.right,
  }
  const need = (p: TooltipPlacement) =>
    (p === 'top' || p === 'bottom' ? c.height : c.width) + MARGIN

  // Flip to the opposite side only when the requested side is short on room and
  // the opposite side has enough.
  let place = props.placement
  if (room[place] < need(place) && room[OPPOSITE[place]] >= need(place)) {
    place = OPPOSITE[place]
  }
  effectivePlacement.value = place

  const cx = t.left + t.width / 2
  const cy = t.top + t.height / 2
  let x = 0
  let y = 0
  if (place === 'top') {
    x = cx - c.width / 2
    y = t.top - c.height - MARGIN
  } else if (place === 'bottom') {
    x = cx - c.width / 2
    y = t.bottom + MARGIN
  } else if (place === 'left') {
    x = t.left - c.width - MARGIN
    y = cy - c.height / 2
  } else {
    x = t.right + MARGIN
    y = cy - c.height / 2
  }
  // Keep the bubble on screen.
  x = Math.max(MARGIN, Math.min(x, vw - c.width - MARGIN))
  y = Math.max(MARGIN, Math.min(y, vh - c.height - MARGIN))
  pos.value = { x, y }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function open() {
  if (props.disabled) return
  clearTimeout(hideTimer)
  if (visible.value) return
  visible.value = true
  window.addEventListener('scroll', update, true)
  window.addEventListener('resize', update)
  document.addEventListener('keydown', onKeydown)
  nextTick(update)
}

function close() {
  clearTimeout(showTimer)
  if (!visible.value) return
  visible.value = false
  window.removeEventListener('scroll', update, true)
  window.removeEventListener('resize', update)
  document.removeEventListener('keydown', onKeydown)
}

function scheduleShow() {
  if (props.disabled) return
  clearTimeout(hideTimer)
  showTimer = setTimeout(open, props.delay)
}
function scheduleHide() {
  clearTimeout(showTimer)
  hideTimer = setTimeout(close, HIDE_DELAY)
}

// With both `focus` and `click` active, a mouse click on a focusable trigger
// fires focusin (open) and then click (toggle → close) in one gesture. Remember
// that focus just opened it so the click of the same gesture keeps it open.
let openedByFocus = false

const onEnter = () => has('hover') && scheduleShow()
const onLeave = () => has('hover') && scheduleHide()
const onFocus = () => {
  if (!has('focus')) return
  openedByFocus = !visible.value
  open()
}
const onBlur = () => {
  if (!has('focus')) return
  openedByFocus = false
  close()
}
// Clicks from the slotted trigger bubble up to the wrapper, so a template @click
// is enough — and it follows `trigger` reactively, unlike a mount-time listener.
const onClick = () => {
  if (!has('click')) return
  if (openedByFocus) {
    openedByFocus = false
    return
  }
  if (visible.value) close()
  else open()
}

// Disabling an open tooltip must tear it down: the template hides the bubble,
// but `visible` and the window/document listeners would otherwise linger, and
// it would pop back on its own when re-enabled.
watch(
  () => props.disabled,
  disabled => {
    if (disabled) close()
  },
)

onBeforeUnmount(close)
</script>

<template>
  <span
    ref="triggerRef"
    v-bind="$attrs"
    class="inline-flex"
    data-testid="tooltip-trigger"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="onFocus"
    @focusout="onBlur"
    @click="onClick"
  >
    <slot>
      <span
        tabindex="0"
        class="inline-flex rounded-full text-info focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        data-testid="tooltip-default-trigger"
      >
        <InformationCircleIcon class="size-6 p-1 cursor-pointer" />
      </span>
    </slot>
  </span>

  <Teleport to="body">
    <div
      v-if="visible && !disabled"
      :id="tooltipId"
      ref="tipRef"
      role="tooltip"
      data-testid="tooltip"
      :data-placement="effectivePlacement"
      class="pointer-events-none fixed z-[2101] flex items-center"
      :class="PLACEMENT_FLEX[effectivePlacement]"
      :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
    >
      <div
        class="flex max-w-60 items-center justify-center gap-2 rounded-8 bg-tooltip-bg px-2 py-1 text-center text-s-12 font-semibold leading-p-150 text-white shadow-button-elevated"
      >
        <span v-if="$slots.content" class="shrink-0"
          ><slot name="content"
        /></span>
        <span v-if="hasText">{{ text }}</span>
      </div>

      <span
        class="text-tooltip-bg"
        :class="[
          ARROW_ROTATE[effectivePlacement],
          ARROW_BEFORE[effectivePlacement] ? 'order-first' : '',
        ]"
      >
        <svg
          v-if="isVertical"
          viewBox="0 0 12 10"
          class="block h-2.5 w-3 fill-current"
        >
          <path d="M0 0h12L6 10z" />
        </svg>
        <svg v-else viewBox="0 0 10 12" class="block h-3 w-2.5 fill-current">
          <path d="M0 0v12L10 6z" />
        </svg>
      </span>
    </div>
  </Teleport>
</template>

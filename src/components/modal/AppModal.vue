<template>
  <Teleport to="#app">
    <Transition
      appear
      enter-from-class="opacity-0"
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-100 ease-in"
      leave-to-class="opacity-0"
      @after-enter="emit('opened')"
      @after-leave="emit('closed')"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-black/40 p-4 overscroll-none"
        :style="{ zIndex }"
        @click.self="onBackdrop"
      >
        <div
          ref="panel"
          v-bind="$attrs"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="hasDefaultHeader ? titleId : undefined"
          :aria-label="
            hasDefaultHeader ? undefined : ariaLabel || title || undefined
          "
          tabindex="-1"
          class="app-modal-panel relative flex max-h-full flex-col overflow-hidden rounded-20 outline-none"
          @keydown.esc="onEsc"
          @keydown.tab="onTab"
        >
          <!-- First in the DOM so Tab order matches what the user sees. -->
          <AppBtnIcon
            v-if="showBackButton"
            icon="chevron-left"
            variant="filled"
            :label="t('common.back')"
            class="absolute left-4 top-4 z-10 sm:left-6 sm:top-6"
            @click="emit('back')"
          />
          <AppBtnIcon
            v-if="showCloseButton && !persistent"
            icon="x-mark"
            variant="filled"
            :label="t('common.close')"
            class="absolute right-4 top-4 z-10 sm:right-6 sm:top-6"
            @click="close"
          />

          <header
            v-if="hasHeader"
            class="flex min-h-20 shrink-0 items-center p-4 sm:p-6"
            :class="{ 'justify-center': centeredHeader }"
          >
            <slot name="header">
              <!-- px-8 keeps the title clear of the 32px back/close buttons. -->
              <AppContentGroup
                :id="titleId"
                :title="title ?? ''"
                :description="subtitle"
                size="l"
                align="center"
                class="w-full px-8"
              />
            </slot>
          </header>

          <div ref="body" class="mew-scrollbar min-h-0 flex-1 overflow-y-auto">
            <slot />
          </div>

          <footer v-if="$slots.footer || buttons" class="shrink-0 p-4 sm:p-6">
            <slot name="footer">
              <!-- The Button Group takes 2–3 buttons; a lone one fills the footer. -->
              <component
                :is="footerButtons.length > 1 ? AppBtnGroup : 'div'"
                v-bind="footerButtons.length > 1 ? { hasPadding: false } : {}"
              >
                <AppBaseButton
                  v-for="button in footerButtons"
                  :key="button.type"
                  :type="button.type"
                  surface="alternative"
                  :tone="button.tone"
                  :disabled="button.disabled"
                  :is-loading="button.loading"
                  class="w-full"
                  @click="button.onClick"
                >
                  {{ button.label }}
                </AppBaseButton>
              </component>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
/**
 * Above the app-chrome overlays (multi-address popup + backdrop, settings and
 * notifications popups at z-[2100..2102]) and below what a modal itself can
 * open: tooltips z-[2150], teleported menus z-[2200], toasts z-[2300].
 */
const MODAL_Z_BASE = 2110

// Shared by every instance: each modal that opens stacks one above the last,
// so a modal opened from a modal (or swapped in the same tick) sits on top.
// Reset once nothing is open, so it never climbs into the tooltip range.
let stackTop = 0
</script>

<script setup lang="ts">
/**
 * AppModal — the one base modal (design library, Figma component set
 * 2279:31532; M 2279:27719 from `sm`/768px up, S 2279:31533 below).
 *
 * Optional header (Content Group L, centred), back and close buttons, a
 * default slot with no padding of its own, and an optional Button Group
 * footer from `buttons` (or the `#footer` slot). `#header` replaces the
 * default header for layouts the Content Group can't express; pass `title`
 * anyway, it becomes the dialog's aria-label.
 *
 * Owns the modal plumbing: Teleport to #app, the background `inert` + body
 * scroll lock (dialogStore refcount), focus in on open / back to the opener
 * on close, a Tab loop, Esc / backdrop close and stacking. On open, focus
 * goes to the first control in the content; `:autofocus="false"` keeps it on
 * the panel instead (a browsing list whose search field should not light up
 * until the user reaches for it).
 *
 * Width (480 from `sm`, full width below) and the white surface are defaults
 * in the components layer (`.app-modal-panel` in main.css), so a class such
 * as `sm:w-200` or `bg-background-default` passed here simply wins.
 *
 * `close` fires only when the modal closes itself (close button, Esc,
 * backdrop), not when the parent flips v-model.
 *
 * @example
 * <AppModal v-model="open" :title="t('x.title')" :buttons="{
 *   primary: { label: t('common.confirm'), onClick: confirm },
 *   secondary: { label: t('common.cancel'), onClick: () => (open = false) },
 * }">
 *   <div class="px-4 sm:px-6">…</div>
 * </AppModal>
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import { useDialogStore } from '@/stores/dialogStore'
import type { ModalButtons } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    showHeader?: boolean
    centeredHeader?: boolean
    showBackButton?: boolean
    showCloseButton?: boolean
    buttons?: ModalButtons
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
    /** Must-act flows: no Esc, no backdrop close, no close button. */
    persistent?: boolean
    /**
     * Focus the first control in the content on open (default). `false`
     * focuses the panel itself, so a leading search field does not get
     * highlighted the moment the modal appears.
     */
    autofocus?: boolean
    /** Accessible name when there is no default header. */
    ariaLabel?: string
  }>(),
  {
    showHeader: true,
    showBackButton: false,
    showCloseButton: true,
    closeOnBackdrop: true,
    closeOnEsc: true,
    persistent: false,
    autofocus: true,
  },
)

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  back: []
  close: []
  opened: []
  closed: []
}>()

const { t } = useI18n()
const slots = useSlots()
const dialogStore = useDialogStore()
const { pushAreaHidden, popAreaHidden } = dialogStore
const { isAreaHidden } = storeToRefs(dialogStore)
const panel = useTemplateRef<HTMLElement>('panel')
const body = useTemplateRef<HTMLElement>('body')
const titleId = useId()
const zIndex = ref(MODAL_Z_BASE)

const hasHeader = computed(
  () => props.showHeader && (!!props.title || !!slots.header),
)
const hasDefaultHeader = computed(() => hasHeader.value && !slots.header)

const footerButtons = computed(() => {
  const { primary, secondary, tertiary } = props.buttons ?? {}
  return [
    tertiary && { ...tertiary, type: 'tertiary' as const },
    secondary && { ...secondary, type: 'secondary' as const },
    primary && { ...primary, type: 'primary' as const },
  ].filter(b => !!b)
})

const close = () => {
  isOpen.value = false
  emit('close')
}

const onBackdrop = () => {
  if (props.closeOnBackdrop && !props.persistent) close()
}

const onEsc = () => {
  if (props.closeOnEsc && !props.persistent) close()
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Inert subtrees and unrendered nodes can't take focus, so a Tab loop that
// ends on one never wraps. Without checkVisibility (older browsers, jsdom)
// everything counts as visible.
const canFocus = (el: HTMLElement) =>
  !el.closest('[inert]') && el.checkVisibility?.() !== false

const focusables = (root = panel.value) =>
  Array.from(root?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
    canFocus,
  )

// The background is inert, but a modal stacked on another could still Tab
// into the one below, so wrap at both ends.
const onTab = (e: KeyboardEvent) => {
  const items = focusables()
  if (!items.length) return e.preventDefault()
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  const atEdge = e.shiftKey
    ? active === first || active === panel.value
    : active === last
  if (!atEdge) return
  e.preventDefault()
  ;(e.shiftKey ? last : first).focus()
}

// This instance's contribution to the dialogStore refcount, which drives the
// background `inert` and the body scroll lock. A refcount (not a boolean)
// keeps the background locked through modal-to-modal swaps, where the closing
// modal's watcher can run after the opening one's, and makes mounting a
// closed modal a no-op.
let countsAsOpen = false
// This modal's level in the stack; handed back on close when it's still the
// top one, so a child reopened over an open base doesn't climb each time.
let layer = 0
const syncAreaHidden = (open: boolean) => {
  if (open === countsAsOpen) return
  countsAsOpen = open
  if (open) {
    pushAreaHidden()
    layer = ++stackTop
    zIndex.value = MODAL_Z_BASE + layer
  } else {
    popAreaHidden()
    if (layer === stackTop) stackTop = Math.max(0, stackTop - 1)
    layer = 0
    if (!isAreaHidden.value) stackTop = 0
  }
}

let opener: HTMLElement | null = null

watch(
  isOpen,
  async open => {
    syncAreaHidden(open)
    if (open) {
      opener = document.activeElement as HTMLElement | null
      await nextTick()
      // First control in the content, else the panel: never the close button
      // or a footer action, so Enter can't confirm a destructive step.
      const first = props.autofocus ? focusables(body.value)[0] : undefined
      ;(first ?? panel.value)?.focus()
    } else if (opener) {
      // After the tick the background is no longer inert, so it can take focus.
      const target = opener
      // Read now: the ref is null after the tick while the panel still leaves.
      const own = panel.value
      opener = null
      await nextTick()
      // A modal that opened in the same tick (a swap) already took focus.
      const holder = document.activeElement?.closest('[role="dialog"]')
      if (holder && holder !== own) return
      target.focus()
    }
  },
  { immediate: true },
)

// Torn down while still open (a parent v-if flips, e.g. the wallet is
// removed): the watcher never runs a closing pass, so release the lock here
// or the whole app stays non-interactive (MEW-2094).
onBeforeUnmount(() => syncAreaHidden(false))
</script>

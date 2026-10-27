<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppToast from '@/components/toast/AppToast.vue'
import { useToastStore } from '@/stores/toastStore'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import type { Toast } from '@/types/notification'
import {
  toastAssetOf,
  toastDurationOf,
  toastTypeOf,
} from '@/modules/toast/toastMapping'

/**
 * Renders one store toast with the design-library AppToast and owns its
 * auto-dismiss timer, which pauses while the toast is hovered or focused.
 */
const props = defineProps<{ toast: Toast }>()

const toastStore = useToastStore()
const { isXS } = useAppBreakpoints()

const type = computed(() => toastTypeOf(props.toast))
const asset = computed(() => toastAssetOf(props.toast))

const dismiss = () => {
  if (props.toast.id) toastStore.removeToastById(props.toast.id)
}

const openLink = () => {
  if (props.toast.link) {
    window.open(props.toast.link.url, '_blank', 'noopener,noreferrer')
  }
}

let timer: ReturnType<typeof setTimeout> | undefined
let remainingMs = toastDurationOf(props.toast)
let startedAt = 0

const startTimer = () => {
  if (remainingMs === null || timer) return
  startedAt = Date.now()
  timer = setTimeout(dismiss, remainingMs)
}

const pauseTimer = () => {
  if (!timer || remainingMs === null) return
  clearTimeout(timer)
  timer = undefined
  remainingMs = Math.max(0, remainingMs - (Date.now() - startedAt))
}

const isHovered = ref(false)
const hasFocus = ref(false)

const onFocusOut = (event: FocusEvent) => {
  const root = event.currentTarget as HTMLElement
  hasFocus.value = root.contains(event.relatedTarget as Node | null)
}

watch([isHovered, hasFocus], ([hovered, focused]) => {
  if (hovered || focused) pauseTimer()
  else startTimer()
})

onMounted(startTimer)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <AppToast
    :type="type"
    :title="toast.text"
    :description="toast.textSecondary"
    :asset="asset"
    :button-label="toast.link?.title"
    class="mt-4"
    :class="{ 'mx-auto': isXS }"
    @dismiss="dismiss"
    @action="openLink"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="hasFocus = true"
    @focusout="onFocusOut"
  />
</template>

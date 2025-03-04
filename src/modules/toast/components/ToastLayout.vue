<template>
  <div
    role="alert"
    :class="[
      borderColor,
      isXS ? 'w-[95%] mx-auto' : 'w-[400px]',
      'min-h-[60px] rounded-2xl shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.32)] mt-4',
    ]"
  >
    <div class="flex w-full items-start py-3 px-2">
      <component :is="icon" :class="[iconColor, 'w-7 h-7 mt-1 ml-2 mr-1']" />
      <div class="flex-1 px-2 pt-[5px]">
        <p :class="{ 'mb-2': toast.link }">{{ toast.text }}</p>
        <a
          v-if="toast.link"
          :href="toast.link.url"
          target="_blank"
          class="underline"
          >{{ toast.link.title }}</a
        >
      </div>
      <app-btn-icon-close @close="toastStore.removeToastMessage(index)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'
import { ToastType, type Toast } from '@/types/notification'
import {
  InformationCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/solid'
import AppBtnIconClose from '@components/AppBtnIconClose.vue'
import { computed, onMounted } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

const props = defineProps<{
  /**
   * @toast The toast message to display.
   */
  toast: Toast
  /**
   * @index The index of the toast message.
   */
  index: number
}>()

const { isXS } = useAppBreakpoints()
const toastStore = useToastStore()

/**
 * The border color of the toast message. Based on the type of the toast.
 */
const borderColor = computed(() => {
  switch (props.toast.type) {
    case ToastType.Success:
      return 'bg-[linear-gradient(90deg,rgb(5,192,165)_8px,white_0%)]'
    case ToastType.Error:
      return 'bg-[linear-gradient(90deg,rgba(228,12,91,1)_8px,white_0%)]'
    case ToastType.Warning:
      return 'bg-[linear-gradient(90deg,rgb(255,165,0)_8px,white_0%)]'
    default:
      return 'bg-[linear-gradient(90deg,rgb(0,90,229,1)_8px,white_0%)]'
  }
})

/**
 * The icon of the toast message. Based on the type of the toast.
 */
const icon = computed(() => {
  switch (props.toast.type) {
    case ToastType.Success:
      return CheckCircleIcon
    case ToastType.Error:
      return ExclamationCircleIcon
    case ToastType.Warning:
      return ExclamationTriangleIcon
    default:
      return InformationCircleIcon
  }
})

/**
 * The color of the icon. Based on the type of the toast.
 */
const iconColor = computed(() => {
  switch (props.toast.type) {
    case ToastType.Success:
      return 'text-success'
    case ToastType.Error:
      return 'text-error'
    case ToastType.Warning:
      return 'text-warning'
    default:
      return 'text-primary'
  }
})

/**
 * Once toast is mounted, remove the toast message after the duration.
 * The default duration is 6 seconds.
 */
onMounted(() => {
  if (!props.toast.isInfinite) {
    const timeout = props.toast.duration || 6000
    setTimeout(() => {
      toastStore.removeToastMessage(props.index)
    }, timeout)
  }
})
</script>

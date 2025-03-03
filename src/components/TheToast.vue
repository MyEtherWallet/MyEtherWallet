<template>
  <div
    v-if="showToastMessages.length > 0"
    class="fixed bottom-6 left-10"
    role="alert"
  >
    <div
      v-for="(i, index) in showToastMessages"
      :key="index"
      :class="[
        getBorderColor(i.type),
        'w-[320px] min-h-[60px] rounded-2xl shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.32)] mt-4',
      ]"
    >
      <div class="flex w-full items-start py-3 px-2">
        <component
          :is="getIcon(i.type)"
          :class="[getIconColor(i.type), 'w-7 h-7 mt-1 ml-2 mr-1']"
        />
        <div class="flex-1 px-2 pt-[5px]">
          <p :class="{ 'mb-2': i.link }">{{ i.text }}</p>
          <a
            v-if="i.link"
            :href="i.link.url"
            target="_blank"
            class="underline"
            >{{ i.link.title }}</a
          >
        </div>
        <app-btn-icon-close @close="toastStore.removeToastMessage(index)" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'
import { storeToRefs } from 'pinia'
import { ToastType } from '@/types/notification'
import {
  InformationCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/solid'
import AppBtnIconClose from './AppBtnIconClose.vue'
import { computed } from 'vue'
const toastStore = useToastStore()
const { messages } = storeToRefs(toastStore)

const getBorderColor = (type: ToastType) => {
  switch (type) {
    case ToastType.Success:
      return 'bg-[linear-gradient(90deg,rgb(0,90,229,1)_8px,white_0%)]'
    case ToastType.Error:
      return 'bg-[linear-gradient(90deg,rgba(228,12,91,1)_8px,white_0%)]'
    case ToastType.Warning:
      return 'bg-[linear-gradient(90deg,rgb(255,165,0)_8px,white_0%)]'
    default:
      return 'bg-[linear-gradient(90deg,rgb(0,90,229,1)_8px,white_0%)]'
  }
}

const getIcon = (type: ToastType) => {
  switch (type) {
    case ToastType.Success:
      return CheckCircleIcon
    case ToastType.Error:
      return ExclamationCircleIcon
    case ToastType.Warning:
      return ExclamationTriangleIcon
    default:
      return InformationCircleIcon
  }
}

const getIconColor = (type: ToastType) => {
  switch (type) {
    case ToastType.Success:
      return 'text-primary'
    case ToastType.Error:
      return 'text-error'
    case ToastType.Warning:
      return 'text-warning'
    default:
      return 'text-primary'
  }
}

const showToastMessages = computed(() => {
  return messages.value.slice(0, 4)
})
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import {
  ToastType,
  type ToastAsset,
  type ToastButton,
} from '@/types/notification'

const DEFAULT_DURATION = 6000

const props = withDefaults(
  defineProps<{
    type: ToastType
    title: string
    description: string
    button?: ToastButton
    asset?: ToastAsset
    duration?: number
    isInfinite?: boolean
  }>(),
  {
    duration: DEFAULT_DURATION,
    isInfinite: false,
  },
)

const emit = defineEmits<{
  dismiss: []
}>()

const icon = computed(() => {
  switch (props.type) {
    case ToastType.Success:
      return CheckCircleIcon
    case ToastType.Warning:
    case ToastType.Error:
      return ExclamationCircleIcon
    default:
      return InformationCircleIcon
  }
})

const iconColor = computed(() => {
  switch (props.type) {
    case ToastType.Success:
    case ToastType.TransactionCompleted:
      return 'text-success'
    case ToastType.Warning:
      return 'text-warning'
    case ToastType.Error:
      return 'text-error'
    default:
      return 'text-white'
  }
})

const canShowButton = computed(
  () =>
    props.button &&
    [
      ToastType.TransactionCompleted,
      ToastType.Warning,
      ToastType.Success,
      ToastType.Error,
    ].includes(props.type),
)

const timeout = ref<ReturnType<typeof setTimeout>>()

onMounted(() => {
  if (props.type === ToastType.Processing) {
    timeout.value = setTimeout(() => emit('dismiss'), props.duration)
  }
})

onBeforeUnmount(() => {
  if (timeout.value) clearTimeout(timeout.value)
})
</script>

<template>
  <div
    role="alert"
    class="mx-auto w-[95%] max-w-[400px] rounded-16 bg-background-info p-3 text-text-inverted shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.32)] xs:mx-0 xs:w-[360px]"
    data-testid="app-toast"
  >
    <div class="flex items-start gap-3">
      <div class="flex h-8 w-8 shrink-0 items-center justify-center">
        <svg
          v-if="type === ToastType.Processing"
          aria-hidden="true"
          class="h-6 w-6 animate-spin text-white/40 fill-white"
          data-testid="toast-spinner"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 11.5192 75.2124 8.2083C69.5422 4.89736 63.2754 2.73567 56.7698 1.84666C51.7666 1.16296 46.6976 1.24226 41.7345 2.07415C39.2613 2.4887 37.813 4.9932 38.4501 7.41868C39.0873 9.84416 41.5694 11.2671 44.0505 10.9025C47.8511 10.3439 51.7191 10.3223 55.5402 10.8445C60.8642 11.572 65.9928 13.3411 70.6331 16.0506C75.2735 18.7602 79.3347 22.3573 82.5849 26.6364C84.9175 29.7075 86.7997 33.0867 88.1811 36.6712C89.083 39.0112 91.5421 40.4735 93.9676 39.8363Z"
            class="fill-white"
          />
        </svg>
        <app-token-logo
          v-else-if="type === ToastType.TransactionCompleted"
          :url="asset?.url"
          :symbol="asset?.symbol"
          :is-stock="asset?.isStock"
          width="w-8"
          height="h-8"
          data-testid="toast-asset"
        />
        <component
          :is="icon"
          v-else
          aria-hidden="true"
          :class="[iconColor, 'h-6 w-6']"
          data-testid="toast-status-icon"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1">
          <p class="text-s-16 font-semibold leading-p-140 break-words">
            {{ title }}
          </p>
          <CheckCircleIcon
            v-if="type === ToastType.TransactionCompleted"
            aria-hidden="true"
            class="h-4 w-4 shrink-0 text-success"
            data-testid="toast-inline-check"
          />
        </div>
        <p
          v-if="description"
          class="mt-1 text-s-14 leading-p-140 text-text-inverted/80 break-words"
        >
          {{ description }}
        </p>
        <app-base-button
          v-if="canShowButton"
          class="mt-3"
          size="small"
          theme="neutral"
          data-testid="toast-cta"
          @click="button?.onClick"
        >
          {{ button?.label }}
        </app-base-button>
      </div>

      <app-btn-icon
        v-if="type !== ToastType.Processing"
        :label="$t('common.close')"
        class="-mr-1 -mt-1 shrink-0 !text-white"
        height="h-8"
        width="w-8"
        data-testid="toast-dismiss"
        @click="emit('dismiss')"
      >
        <XMarkIcon class="h-5 w-5" />
      </app-btn-icon>
    </div>

    <div v-if="$slots.default" class="mt-3 pl-11" data-testid="toast-slot">
      <slot />
    </div>
  </div>
</template>

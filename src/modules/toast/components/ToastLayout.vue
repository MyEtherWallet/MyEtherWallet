<template>
  <div
    role="alert"
    :class="[
      borderColor,
      isXS ? 'w-[95%] mx-auto' : 'w-[400px]',
      'bg-gradient-to-r from-[7px] to-white to-0% min-h-[60px] rounded-2xl shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.32)] mt-4',
    ]"
  >
    <div class="flex w-full items-start py-3 px-2">
      <component :is="icon" :class="[iconColor, 'w-7 h-7 mt-1 ml-2 mr-1']" />
      <div class="flex-1 px-2 pt-[5px] bg-white">
        <p
          :class="[
            { 'mb-2': toast.link },
            { 'font-bold': toast.textSecondary || toast.tradeInfo },
            'text-balance word-break',
          ]"
        >
          {{ toast.text }}
        </p>
        <div v-if="toast.textSecondary">
          <p
            v-if="!hideSecondaryText"
            :class="[
              { 'mb-3': toast.link },
              'text-s-14 mt-1 text-info  word-break',
            ]"
          >
            {{ toast.textSecondary }}
          </p>
          <div v-else>
            <button
              @click="isShownSecondaryTextInFull = !isShownSecondaryTextInFull"
              class="-ml-4 text-s-14 py-2 px-4 text-info word-break hoverBGWhite rounded-12 text-left"
            >
              <p>
                {{
                  isShownSecondaryTextInFull
                    ? toast.textSecondary
                    : `${toast.textSecondary.slice(0, 60)}...`
                }}
              </p>
              <ChevronDownIcon
                class="w-5 h-5 mt-1 mx-auto"
                aria-label="Toggle full text"
                :class="{ 'rotate-180': isShownSecondaryTextInFull }"
              />
            </button>
          </div>
        </div>
        <p
          v-if="toast.hash"
          :class="[
            { 'mb-3': toast.link },
            'text-s-14 mt-1 text-info word-break break-all',
          ]"
        >
          {{ toast.hash }}
        </p>
        <a
          v-if="toast.link"
          :href="toast.link.url"
          target="_blank"
          :class="[
            toast.link.isButton
              ? 'py-2  px-4 text-s-15 bg-primary hoverOpacityHasBG text-white rounded-full font-medium  transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white mb-1 text-center block mt-5 mx-auto'
              : 'underline',
          ]"
          >{{ toast.link.title }}</a
        >
        <div class="mt-4 -ml-4" v-if="toast.tradeInfo">
          <div
            class="flex flex-wrap justify-start gap-4 items-center rounded-16 border-grey-10 border-1 px-3 py-2"
          >
            <div class="flex items-center gap-3">
              <app-token-logo
                :url="toast.tradeInfo.fromtTokenIcon"
                :symbol="toast.tradeInfo.fromToken"
                :is-stock="toast.tradeInfo.fromTokenIsStock"
              />

              <div>
                <app-token-symbol
                  :symbol="toast.tradeInfo.fromToken"
                  :is-stock="toast.tradeInfo.fromTokenIsStock"
                />
                <p class="text-nowrap text-info text-s-14">
                  {{ toast.tradeInfo.fromAmount }}
                </p>
              </div>
            </div>
            <ArrowLongRightIcon class="w-5 h-5" />
            <div class="flex items-center gap-3">
              <app-token-logo
                :url="toast.tradeInfo.toTokenIcon"
                :symbol="toast.tradeInfo.toToken"
                :is-stock="toast.tradeInfo.toTokenIsStock"
              />
              <div>
                <app-token-symbol
                  :symbol="toast.tradeInfo.toToken"
                  :is-stock="toast.tradeInfo.toTokenIsStock"
                />
                <p class="text-nowrap text-info text-s-14">
                  {{ toast.tradeInfo.toAmount }}
                </p>
              </div>
            </div>
          </div>
        </div>
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
  ArrowLongRightIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/solid'
import AppBtnIconClose from '@components/AppBtnIconClose.vue'
import { computed, onMounted, ref, onBeforeUnmount } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
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
      return 'from-success'
    case ToastType.Error:
      return 'from-error'
    case ToastType.Warning:
      return 'from-warning'
    default:
      return 'from-primary'
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

const isShownSecondaryTextInFull = ref(false)
const hideSecondaryText = computed(() => {
  return props.toast.textSecondary
    ? props.toast.textSecondary.length > 150
    : false
})

/**
 * Once toast is mounted, remove the toast message after the duration.
 * The default duration is 6 seconds.
 */
const timeout = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
  if (!props.toast.isInfinite) {
    const time = props.toast.duration || 6000
    timeout.value = setTimeout(() => {
      toastStore.removeToastMessage(props.index)
    }, time)
  }
})

onBeforeUnmount(() => {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }
})
</script>

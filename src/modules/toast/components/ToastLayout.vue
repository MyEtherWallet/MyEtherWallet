<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppToast from '@/components/AppToast.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import { useToastStore } from '@/stores/toastStore'
import { ToastType, type Toast } from '@/types/notification'
import { ArrowLongRightIcon } from '@heroicons/vue/24/solid'
import {
  hasLegacyToastContent,
  mapToastToAppToast,
} from '../toastAdapter'

const props = defineProps<{
  toast: Toast
}>()

const toastStore = useToastStore()
const appToastProps = computed(() => mapToastToAppToast(props.toast))
const hasLegacyContent = computed(() => hasLegacyToastContent(props.toast))
const timeout = ref<ReturnType<typeof setTimeout>>()

const dismiss = () => {
  const currentIndex = toastStore.messages.indexOf(props.toast)
  if (currentIndex !== -1) toastStore.removeToastMessage(currentIndex)
}

onMounted(() => {
  if (
    appToastProps.value.type !== ToastType.Processing &&
    !appToastProps.value.isInfinite
  ) {
    timeout.value = setTimeout(dismiss, appToastProps.value.duration)
  }
})

onBeforeUnmount(() => {
  if (timeout.value) clearTimeout(timeout.value)
})
</script>

<template>
  <app-toast v-bind="appToastProps" class="mt-4" @dismiss="dismiss">
    <template v-if="hasLegacyContent" #default>
      <p v-if="toast.hash" class="text-s-14 break-all text-text-inverted/80">
        {{ toast.hash }}
      </p>
      <div
        v-if="toast.tradeInfo"
        class="flex flex-wrap items-center justify-start gap-4 rounded-12 border border-white/20 p-3"
        data-testid="toast-trade-info"
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
            <p class="text-s-14 whitespace-nowrap text-text-inverted/80">
              {{ toast.tradeInfo.fromAmount }}
            </p>
          </div>
        </div>
        <ArrowLongRightIcon class="h-5 w-5" />
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
            <p class="text-s-14 whitespace-nowrap text-text-inverted/80">
              {{ toast.tradeInfo.toAmount }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </app-toast>
</template>

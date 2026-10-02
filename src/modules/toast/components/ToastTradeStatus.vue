<template>
  <div
    role="alert"
    :class="[
      isXS ? 'w-[95%] mx-auto' : 'w-[360px]',
      'bg-background-info rounded-16 p-3 flex items-start gap-3 mt-4',
    ]"
  >
    <app-spinner
      v-if="toast.tradeStatus?.kind === 'processing'"
      :size="24"
      color="inverted"
    />
    <app-token-logo
      v-else
      :url="toast.tradeStatus?.toTokenIcon"
      :symbol="toast.tradeStatus?.toSymbol"
      :is-stock="toast.tradeStatus?.toTokenIsStock"
      width="w-6"
      height="h-6"
      no-shadow
    />

    <div class="flex-1 min-w-0 flex flex-col gap-3">
      <div class="flex flex-col">
        <p
          class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-white flex items-center gap-1"
        >
          {{ toast.text }}
          <AppIcon
            name="check-circle"
            variant="filled"
            size="xs"
            v-if="toast.tradeStatus?.kind === 'completed'"
            class="text-text-success"
          />
        </p>
        <p
          v-if="toast.textSecondary"
          class="text-s-14 leading-[20px] text-white"
        >
          {{ toast.textSecondary }}
        </p>
      </div>
      <a
        v-if="toast.link"
        :href="toast.link.url"
        target="_blank"
        rel="noopener"
        class="self-start bg-background-brand rounded-24 px-3 py-1 text-s-14 font-semibold leading-[20px] tracking-[-0.28px] text-white"
      >
        {{ toast.link.title }}
      </a>
    </div>

    <button
      v-if="toast.tradeStatus?.kind === 'completed'"
      class="p-[3px] rounded-24 text-white shrink-0"
      :aria-label="$t('common.close')"
      @click="dismiss"
    >
      <AppIcon name="x-mark" variant="filled" size="xxs" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import AppSpinner from '@/components/spinner/AppSpinner.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { useToastStore } from '@/stores/toastStore'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import type { Toast } from '@/types/notification'

import AppIcon from '@/components/icon/AppIcon.vue'
const props = defineProps<{
  toast: Toast
  index: number
}>()

const toastStore = useToastStore()
const { isXS } = useAppBreakpoints()

const dismiss = () => {
  if (props.toast.id) {
    toastStore.removeToastById(props.toast.id)
    return
  }
  toastStore.removeToastMessage(props.index)
}

let dismissTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (props.toast.isInfinite) return
  dismissTimeout = setTimeout(dismiss, props.toast.duration || 6000)
})

onBeforeUnmount(() => {
  if (dismissTimeout) clearTimeout(dismissTimeout)
})
</script>

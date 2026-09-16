<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppToast from '@/components/AppToast.vue'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'

const toastStore = useToastStore()
const { t } = useI18n()

const variants = [
  { type: ToastType.Processing, labelKey: 'dev.toast.types.processing' },
  {
    type: ToastType.TransactionCompleted,
    labelKey: 'dev.toast.types.transaction_completed',
  },
  { type: ToastType.Warning, labelKey: 'dev.toast.types.warning' },
  { type: ToastType.Success, labelKey: 'dev.toast.types.success' },
  { type: ToastType.Error, labelKey: 'dev.toast.types.error' },
  { type: ToastType.Info, labelKey: 'dev.toast.types.info' },
]

const previewButton = computed(() => ({
  label: t('dev.toast.view_details'),
  onClick: () => undefined,
}))

const previewAsset = {
  symbol: 'ETH',
}

const fireLiveToast = () => {
  toastStore.addToastMessage({
    type: ToastType.Success,
    title: t('dev.toast.live_title'),
    description: t('dev.toast.live_description'),
    button: previewButton.value,
  })
}
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-10 p-8">
    <div>
      <h1 class="text-s-24 font-bold text-t-default">
        {{ $t('dev.toast.name') }}
      </h1>
      <p class="mt-2 text-s-14 text-info">
        {{ $t('dev.toast.description') }}
      </p>
      <app-base-button class="mt-4" size="small" @click="fireLiveToast">
        {{ $t('dev.toast.fire_live') }}
      </app-base-button>
    </div>

    <section
      v-for="variant in variants"
      :key="variant.type"
      class="flex flex-col gap-4"
    >
      <h2 class="text-s-16 font-semibold">
        {{ $t(variant.labelKey) }}
      </h2>
      <div class="grid gap-6 xl:grid-cols-2">
        <div>
          <p class="mb-2 text-s-12 text-info">
            {{ $t('dev.toast.base') }}
          </p>
          <app-toast
            :type="variant.type"
            :title="$t('dev.toast.preview_title', { variant: $t(variant.labelKey) })"
            :description="$t('dev.toast.preview_description')"
            :asset="variant.type === ToastType.TransactionCompleted ? previewAsset : undefined"
            is-infinite
          />
        </div>
        <div>
          <p class="mb-2 text-s-12 text-info">
            {{ $t('dev.toast.cta_and_slot') }}
          </p>
          <app-toast
            :type="variant.type"
            :title="$t('dev.toast.preview_title', { variant: $t(variant.labelKey) })"
            :description="$t('dev.toast.preview_description')"
            :button="previewButton"
            :asset="variant.type === ToastType.TransactionCompleted ? previewAsset : undefined"
            is-infinite
          >
            <div class="rounded-8 border border-white/20 p-2 text-s-12">
              {{ $t('dev.toast.optional_slot') }}
            </div>
          </app-toast>
        </div>
      </div>
    </section>
  </div>
</template>

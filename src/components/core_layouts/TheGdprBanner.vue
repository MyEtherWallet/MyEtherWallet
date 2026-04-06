<template>
  <div
    v-show="show"
    class="fixed inset-x-0 bottom-0 flex w-screen items-end justify-center z-[50] bg-white shadow-[10px_3px_12px_rgba(0,0,0,0.32)]"
  >
    <div
      class="max-w-[1392px] md-header:mx-6 2xl:mx-auto flex flex-wrap content-center py-8 px-4"
    >
      <p class="basis-3/4 text6 mb-4 h-fit">{{ $t('gdpr.help_improve') }}</p>
      <div class="flex justify-end basis-1/4">
        <AppBtnIconClose @close="handleReject" />
      </div>
      <p
        class="basis-full md:basis-3/4 md:pr-5 text-s-14 lg:text-s-16 text-info mb-6 h-fit"
      >
        {{ $t('gdpr.cookie_notice') }}
        <a
          href="https://www.myetherwallet.com/privacy-policy"
          target="_blank"
          class="text-primary"
          >{{ $t('gdpr.privacy_policy') }}</a
        >.
      </p>
      <div
        class="flex gap-5 items-center justify-end md:justify-center basis-full md:basis-1/4"
      >
        <button
          type="button"
          class="border border-primary border-2 text-primary rounded-3xl py-2 px-5 h-fit hoverOpacity"
          @click="handleReject"
        >
          {{ $t('gdpr.reject') }}
        </button>
        <button
          type="button"
          class="bg-primary text-white rounded-3xl py-2 px-5 h-fit hoverOpacityHasBG"
          @click="handleAccept"
        >
          {{ $t('gdpr.accept') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { storeToRefs } from 'pinia'

const analyticsStore = useAnalyticsStore()
const { isEUUser, hasSetConsent } = storeToRefs(analyticsStore)
const { setTrackingConsent } = analyticsStore

const show = computed(() => isEUUser.value && !hasSetConsent.value)

const handleAccept = () => {
  setTrackingConsent(true)
}

const handleReject = () => {
  setTrackingConsent(false)
}
</script>

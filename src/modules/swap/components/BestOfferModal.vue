<template>
  <app-modal
    v-model="model"
    :aria-label="t('swap.best-offer.looking')"
    class="min-h-[385px]"
  >
    <div class="flex items-center justify-center pt-12">
      <DotLottieVue
        :src="bestOfferAnimation"
        class="w-[175px] aspect-square"
        autoplay
        loop
        role="img"
        :aria-label="t('swap.best-offer.looking')"
      />
    </div>
    <div class="p-8 pb-12 flex flex-col items-center">
      <h3 class="text-s-24 text-p-120 font-bold">
        {{ t('swap.best-offer.looking') }}
      </h3>
      <p class="text-s-14 text-text-muted font-normal mt-2">
        {{ t('swap.best-offer.analyzing') }}
      </p>
    </div>
  </app-modal>
</template>

<script lang="ts" setup>
import AppModal from '@/components/modal/AppModal.vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import bestOfferAnimation from '@/assets/images/swap/looking-for-best-offer.lottie?url'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const model = defineModel('bestOfferOpen', {
  type: Boolean,
  required: true,
  default: false,
})
</script>

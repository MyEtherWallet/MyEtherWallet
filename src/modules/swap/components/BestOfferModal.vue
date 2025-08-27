<template>
  <app-dialog
    v-model:is-open="model"
    class="sm:max-w-[400px] !min-h-[385px] sm:mx-auto"
  >
    <template #content>
      <div class="flex items-center justify-center">
        <img
          :src="bestOfferIcon"
          class="w-[175px]"
          alt="Looking for the best offer"
        />
      </div>
      <div class="p-8 pb-12 flex flex-col items-center">
        <h3 class="text-s-24 text-p-120 font-bold">
          {{ t('swap.best-offer.looking') }}
        </h3>
        <p class="text-s-14 text-grey-50 font-normal mt-2">
          {{ t('swap.best-offer.analyzing') }}
        </p>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@/components/AppDialog.vue'
import bestOfferIcon from '@/assets/images/swap/looking-for-best-offer.svg'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const model = defineModel('bestOfferOpen', {
  type: Boolean,
  required: true,
  default: false,
})
</script>

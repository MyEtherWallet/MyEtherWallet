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
          Looking for the best offer
        </h3>
        <p class="text-s-14 text-grey-50 font-normal mt-2">
          Analyzing decentralized exchanges...
        </p>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@/components/AppDialog.vue'
import bestOfferIcon from '@/assets/images/swap/looking-for-best-offer.svg'

const model = defineModel('bestOfferOpen', {
  type: Boolean,
  required: true,
  default: false,
})
</script>

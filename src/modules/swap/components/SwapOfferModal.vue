<template>
  <app-dialog
    v-model:is-open="model"
    title="Swap"
    class="sm:max-w-[460px] sm:mx-auto h-[600px]"
  >
    <template #content>
      <div class="mx-4">
        <div
          class="p-4 flex flex-col border border-solid border-grey-outline rounded-lg mb-2"
        >
          <!-- Placeholder for provider name -->
          <h3 class="font-bold text-s-20">Best offer from *Provider Name*</h3>
          <div class="font-normal text-s-20 my-2 mb-2 flex items-center gap-2">
            for
            <!-- Placeholder for token details -->
            <div
              class="w-[32px] h-[32px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center"
            >
              <img :src="ethSvg" alt="ETH" class="inline-block w-full" />
            </div>
            <span class="font-bold"> *fAmount* fSym*</span> you will get:
          </div>
          <div class="flex bg-grey-light-2 rounded-lg p-4 mb-2">
            <div class="relative">
              <div
                class="w-[64px] h-[64px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center"
              >
                <img :src="ethSvg" alt="ETH" class="inline-block w-full" />
              </div>
              <div
                class="w-[32px] h-[32px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center absolute bottom-3 right-2 translate-x-1/2 translate-y-1/2"
              >
                <img :src="ethSvg" alt="ETH" class="inline-block w-full" />
              </div>
            </div>
            <div>
              <div class="font-bold text-s-24 ml-5">*ToAmount* *ToSymbol*</div>
              <div class="text-s-12 text-grey-30 ml-5">≈ $41,011.8</div>
            </div>
          </div>
          <app-pop-up-menu placeholder="2 other offers" location="left">
            <template #menu-content>
              <div class="px-4 pt-4 pb-2">
                <div class="cursor-pointer">
                  <p class="text-grey-50 text-s-14">Offer 1</p>
                  <p class="font-bold text-s-14">~*fAmount* *fSym*</p>
                </div>
                <div class="pt-4" />
                <div class="cursor-pointer">
                  <p class="text-grey-50 text-s-14">Offer 2</p>
                  <p class="font-bold text-s-14">~*fAmount* *fSym*</p>
                </div>
                <div class="pt-4" />
                <div class="cursor-pointer">
                  <p class="text-grey-50 text-s-14">Offer 3</p>
                  <p class="font-bold text-s-14">~*fAmount* *fSym*</p>
                </div>
              </div>
            </template>
          </app-pop-up-menu>
          <div class="pt-3">
            <div class="text-s-14 text-grey-50">Rate: 1 ETH ≈ 12.07 *tSym*</div>
            <div class="text-s-14 text-grey-50">Price impact: -0.07%</div>
            <div class="text-s-14 text-grey-50">Max. slippage: 1.3%</div>
            <div class="text-s-14 text-grey-50">
              Minimum received: 128.345 *tSym*
            </div>
            <div class="text-s-14 text-grey-50">Offer includes 2.5% fee</div>
          </div>
        </div>
        <app-select-tx-fee />
        <app-base-button class="w-full mt-2" @click="proceedWithSwap">
          Proceed with Swap
        </app-base-button>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@/components/AppDialog.vue'
import ethSvg from '@/assets/icons/tokens/eth.svg' // Placeholder for token icon
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
const model = defineModel('swapOfferOpen', {
  type: Boolean,
  required: true,
  default: false,
})

const emits = defineEmits(['update:proceedWithSwap'])

// Let parent know when the swap is to be proceeded
const proceedWithSwap = () => {
  emits('update:proceedWithSwap', true)
  model.value = false
}
</script>

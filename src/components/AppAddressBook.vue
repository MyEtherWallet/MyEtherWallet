<template>
  <div
    class="mt-6 px-4 py-4 rounded-[20px] box-border border border-1 flex items-center"
  >
    <div
      v-if="!toAddress"
      class="blockies-container rounded-full bg-grey-30 !w-[36px] h-[32px]"
    ></div>
    <img
      v-else
      :src="addressBlockie"
      class="rounded-full w-[32px] h-[32px]"
      height="30"
      width="30"
    />
    <div class="relative ml-2 pt-2 w-full flex items-center">
      <label for="address-input" class="absolute top-[-6px] text-sm/[16px]"
        >To</label
      >
      <input
        class="address-input text-md/[24px] w-full !bg-white outline-none"
        v-model="toAddress"
        name="address-input"
        type="string"
        placeholder="Address"
        required
      />
    </div>
    <app-btn-icon class="ml-2 cursor-pointer" isWhite @click="() => {}">
      <chevron-down-icon class="w-4 h-4" />
    </app-btn-icon>
  </div>
  <p class="text-error">{{ addressErrorMessages }}</p>
</template>

<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { defineModel, computed } from 'vue'
import { isValidAddress, isValidChecksumAddress } from '@ethereumjs/util'
import createIcon from '@/providers/ethereum/blockies'

const toAddress = defineModel('toAddress', {
  type: String,
  required: true,
})

const addressBlockie = computed(() => {
  if (!toAddress.value) return ''
  return createIcon(toAddress.value)
})

const addressErrorMessages = computed(() => {
  if (toAddress.value === '') return 'Address is required'
  if (
    !isValidAddress(toAddress.value) ||
    !isValidChecksumAddress(toAddress.value)
  )
    return 'Invalid address'
  return ''
})
</script>

<style scoped>
/* Removes the weird color on inputs */
.address-input:-webkit-autofill,
.address-input:-webkit-autofill:hover,
.address-input:-webkit-autofill:focus,
.address-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
}
</style>

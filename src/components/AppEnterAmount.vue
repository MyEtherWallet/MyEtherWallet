<template>
  <div
    class="w-[32rem] h-32 rounded-md border-2 bg-white px-4 py-2"
    :class="{ 'border-error': !!error, 'border-purple': !error }"
  >
    <div class="flex justify-between items-center">
      <input
        class="h-16 w-64 text-4xl font-bold outline-none"
        :class="{ 'text-error': !!error, 'text-purple': !error }"
        name="amount-input"
        type="string"
        placeholder="0.0"
        required
        v-model="amount"
      />
      <div>
        <button
          class="bg-light-grey text-black rounded-full px-1 py-1 flex items-center"
          type="button"
        >
          <div
            class="rounded-full border-x border-y border-grey-30 mr-1 h-5 w-5 overflow-hidden"
          >
            <img
              class="w-5 h-5"
              :src="selectedToken.logo_url"
              alt="token icon"
            />
          </div>
          {{ selectedToken.symbol }}
          <ChevronDownIcon class="ml-1 w-4 h-4 stroke-4" />
        </button>
      </div>
    </div>
    <div class="flex justify-between">
      <div
        class="text-lg"
        :class="{ 'text-error': !!error, 'text-grey-50': !error }"
      >
        {{ balanceOrError }}
      </div>
      <div class="text-lg text-purple">
        Balance: {{ $filters.truncate(selectedToken.balance, 5) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Token } from '@/stores/wallet_store'
import { defineProps, defineEmits, watch, ref, computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useDebounceFn } from '@vueuse/core'
import BigNumber from 'bignumber.js'

import { toWei } from 'web3-utils'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  selectedToken: {
    type: Object as () => Token,
    required: true,
  },
  amountError: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'update:selectedToken',
  'update:amountError',
])

const amount = ref(props.modelValue)
const error = ref(props.amountError)

const balanceOrError = computed(() => {
  return error.value
    ? error.value
    : `$ ${BigNumber(
        BigNumber(props.selectedToken.price).times(BigNumber(amount.value)),
      ).toString()}`
})

watch(
  () => [amount.value],
  useDebounceFn(() => {
    const baseAmount = toWei(amount.value, 'ether')
    const tokenSelectedBalance = props.selectedToken.balance
      ? props.selectedToken.balance
      : '0'
    const baseTokenBalance = toWei(tokenSelectedBalance, 'ether')

    emit('update:modelValue', amount.value)

    if (amount.value === '')
      error.value = 'Amount is required' // amount is blank
    else if (BigInt(baseAmount) <= 0)
      error.value = 'Amount must be greater than 0' // amount less than 0
    else if (BigInt(baseTokenBalance) < BigInt(baseAmount))
      error.value = 'Insufficient balance for selected token' // amount greater than selected balance
    else error.value = ''
  }, 500),
)
</script>

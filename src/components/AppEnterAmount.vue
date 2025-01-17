<template>
  <div
    class="w-[32rem] h-32 rounded-md border-2 bg-white px-4 py-2"
    :class="{ 'border-error': !!error, 'border-mew-purple': !error }"
  >
    <div class="flex justify-between items-center">
      <input
        class="h-16 w-64 text-4xl font-bold outline-none"
        :class="{ 'text-error': !!error, 'text-mew-purple': !error }"
        name="amount-input"
        type="string"
        placeholder="0.0"
        required
        v-model="amount"
      />
      <div>
        <app-token-select v-model:selected-token="tokenSelected" />
      </div>
    </div>
    <div class="flex justify-between">
      <div
        class="text-lg"
        :class="{ 'text-error': !!error, 'text-grey-30': !error }"
      >
        {{ balanceOrError }}
      </div>
      <div class="text-lg text-mew-purple">
        Balance: {{ truncate(selectedToken.balance, 5) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Token } from '@/stores/wallet_store'
import { defineProps, defineEmits, watch, ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import { toWei } from 'web3-utils'
import { truncate } from '@/utils/filters'

import AppTokenSelect from './AppTokenSelect.vue'

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
const tokenSelected = ref(Object.assign({}, props.selectedToken))

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
    else if (BigInt(baseAmount) < 0)
      error.value = 'Amount must be greater than 0' // amount less than 0
    else if (BigInt(baseTokenBalance) < BigInt(baseAmount))
      error.value = 'Insufficient balance for selected token' // amount greater than selected balance
    else error.value = ''
  }, 500),
)

watch(
  () => [tokenSelected.value],
  () => {
    emit('update:selectedToken', tokenSelected.value)
  },
)
</script>

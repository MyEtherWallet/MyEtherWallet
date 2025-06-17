<template>
  <div class="bg-white rounded-[20px] !px-4 pt-3 pb-4 max-w-[478px] mx-auto">
    <p class="text-s-16 mb-2">{{ label }}</p>
    <app-select-chain />
    <app-enter-amount
      v-model:amount="amount"
      v-model:selected-token="tokenSelected"
      v-model:error="amountError"
      :validate-input="checkAmountForError"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import { toWei } from 'web3-utils'
import { ref, type Ref, defineProps } from 'vue'
import { TokenBalance } from '@/types/TokenBalance'
import AppSelectChain from '@/components/AppSelectChain.vue'
import AppEnterAmount from '@/components/AppEnterAmount.vue'

defineProps({
  label: {
    type: String,
    default: 'From',
  },
})

const amount = ref<number | string>('0')
const tokenSelected: Ref<TokenBalance> = ref({} as TokenBalance) // TODO: Implement token selection
const amountError = ref('')

// copied from send
// TODO: consider moving to a shared utility file
const checkAmountForError = () => {
  const baseAmount = amount.value ? toWei(amount.value, 'ether') : 0
  const tokenSelectedBalance = tokenSelected.value.balance
    ? tokenSelected.value.balance
    : '0'
  const baseTokenBalance = toWei(tokenSelectedBalance, 'ether')

  // model.value = amount.value
  if (amount.value === undefined || amount.value === '')
    amountError.value = 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0)
    amountError.value = 'Amount must be greater than 0' // amount less than 0
  else if (BigInt(baseTokenBalance) < BigInt(baseAmount))
    amountError.value = 'Insufficient balance' // amount greater than selected balance
  else amountError.value = ''
}
</script>

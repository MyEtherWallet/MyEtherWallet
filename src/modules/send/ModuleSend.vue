<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="flex">
        <div>
          <div>
            <app-enter-amount
              v-model="amount"
              v-model:selected-token="tokenSelected"
              v-model:amount-error="amountError"
            />
          </div>
        </div>
      </div>
      <div>
        <label for="address-input">Address:</label>
        <input
          v-model="toAddress"
          name="address-input"
          type="string"
          required
        />
        <p class="text-error">{{ addressErrorMessages }}</p>
      </div>
      <app-select-tx-fee />
      <div>
        <input
          type="checkbox"
          name="advanced-settings"
          v-model="toggleAdvanced"
        />
        <label for="advanced-settings">Advanced settings</label>
      </div>
      <div v-show="toggleAdvanced">
        <div>
          <label for="gas-price-input">Gas Price:</label>
          <input
            v-model="gasPrice"
            name="gas-price-input"
            type="string"
            required
          />
        </div>
        <div>
          <label for="gas-limit-input">Gas Limit:</label>
          <input
            v-model="gasLimit"
            name="gas-limit-input"
            type="string"
            required
          />
        </div>
        <div>
          <label for="nonce-input">Nonce:</label>
          <input v-model="nonce" name="nonce-input" type="string" required />
        </div>
        <div>
          <label for="data-input">Data:</label>
          <input v-model="data" name="data-input" type="string" required />
        </div>
        <!-- <input
          type="checkbox"
          name="advanced-settings"
          v-model="toggleTransactionType">
        <label for="advanced-settings">Transaction type: {{ toggleTransactionType ? 0 : 2  }}</label> -->
      </div>
      <button
        type="submit"
        :class="[
          !validSend ? 'bg-grey-30' : 'bg-primary',
          'mt-5 p-2 rounded-full text-white',
        ]"
        :disabled="!validSend"
      >
        Send
      </button>
    </form>
    <app-need-help
      title="Need help?"
      help-link="https://help.myetherwallet.com/en/article/what-is-gas"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { toHex, toWei } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { isValidAddress, isValidChecksumAddress } from '@ethereumjs/util'

import AppEnterAmount from '@/components/AppEnterAmount.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'

import {
  useWalletStore,
  MAIN_TOKEN_CONTRACT,
  type Token,
} from '@/stores/walletStore'
import { abi } from './tokenAbi'

const walletStore = useWalletStore()
const { wallet, tokens } = storeToRefs(walletStore)

const amount = ref('0')
const toAddress = ref('')
const tokenSelected: Ref<Token> = ref({} as Token) // TODO: Implement token selection
const amountError = ref('')
const toggleAdvanced = ref(false)
// advanced settings
const gasLimit = ref(21000) // TODO: Implement gas limit once api is ready
const gasPrice = ref(30000000000) // TODO: Implement gas price once api is ready
const nonce = ref(0) // TODO: Implement nonce once api is ready
const data = ref('0x')
const gasFees = ref({})
// const toggleTransactionType = ref(true) // TODO: idea, allow different transaction types

onMounted(async () => {
  const mainToken: Token = tokens.value.find(
    (t: Token) => t.contract === MAIN_TOKEN_CONTRACT,
  ) as Token
  tokenSelected.value = (mainToken as Token) ? mainToken : tokens.value[0]
  gasFees.value = await wallet.value.getGasFee({
    to: '0x000000000000000000000000000000000000',
    from: wallet.value.getAddress(),
    value: toHex(toWei(amount.value, 'ether')),
    data: data.value,
  })
})

// TODO: Reimplement fee calculation
// const fees = computed(() => {
//   return fromWei((gasLimit.value * gasPrice.value).toString(), 'ether')
// })
// const amountErrorMessages = computed(() => {
//   const baseAmount = toWei(amount.value, 'ether')
//   const baseBalance = toWei(balance.value, 'ether')
//   const baseFee = toWei(fees.value, 'ether')
//   const tokenSelectedBalance = tokenSelected.value.balance
//     ? tokenSelected.value.balance
//     : '0'
//   const baseTokenBalance = toWei(tokenSelectedBalance, 'ether')

//   if (amount.value === '') return 'Amount is required' // amount is blank
//   if (BigInt(baseAmount) <= 0) return 'Amount must be greater than 0' // amount less than 0
//   if (BigInt(baseTokenBalance) < BigInt(baseAmount))
//     return 'Insufficient balance for selected token' // amount greater than selected balance
//   if (BigInt(baseFee) > BigInt(baseBalance))
//     return 'Insufficient balance for fees' // fees greater than wallet balance
//   // if (
//   //   tokenSelected.value.contract === MAIN_TOKEN_CONTRACT &&
//   //   BigInt(baseBalance) < BigInt(baseAmount)
//   // )
//   //   return 'Insufficient balance for selected token' // amount greater than wallet balance

//   return ''
// })

const addressErrorMessages = computed(() => {
  if (toAddress.value === '') return 'Address is required'
  if (
    !isValidAddress(toAddress.value) ||
    !isValidChecksumAddress(toAddress.value)
  )
    return 'Invalid address'
  return ''
})

const validSend = computed(() => {
  return amountError.value === '' && amountError.value === ''
})

watch(
  () => [tokenSelected.value, amount.value, toAddress.value],
  () => {
    if (
      tokenSelected.value.contract !== MAIN_TOKEN_CONTRACT &&
      toAddress.value !== '' &&
      amount.value !== ''
    ) {
      const web3Contract = new Contract(abi, tokenSelected.value.contract)
      data.value = web3Contract.methods
        .transfer(toAddress.value, toWei(amount.value, 'ether'))
        .encodeABI() //
    } else {
      data.value = '0x'
    }
  },
)

const handleSubmit = () => {
  // TODO: Implement send logic once api is provided
  console.log('Send', amount.value, toAddress.value, wallet.value.getAddress())
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="flex">
        <div>
          <label for="asset-input">Token:</label>
          <select name="asset-input" v-model="tokenSelected">
            <option v-for="(t, idx) in tokens" :value="t" :key="t.symbol + idx">
              {{ t.symbol }}
            </option>
          </select>
        </div>
        <div>
          <div>
            <label for="amount-input">Amount:</label>
            <input
              v-model="amount"
              name="amount-input"
              type="number"
              step="0.000000000000000001"
              required
            />
          </div>
          <div>balance: {{ tokenSelected.balance }}</div>
          <p class="text-error">{{ amountErrorMessages }}</p>
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
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { fromWei, toWei } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { isValidAddress, isValidChecksumAddress } from '@ethereumjs/util'

import {
  useWalletStore,
  MAIN_TOKEN_CONTRACT,
  type Token,
} from '@/stores/wallet_store'
import { abi } from './tokenAbi'

const walletStore = useWalletStore()
const { wallet, tokens, balance } = storeToRefs(walletStore)

const amount = ref('')
const toAddress = ref('')
const tokenSelected: Ref<Token> = ref({} as Token) // TODO: Implement token selection
const toggleAdvanced = ref(false)
// advanced settings
const gasLimit = ref(21000) // TODO: Implement gas limit once api is ready
const gasPrice = ref(30000000000) // TODO: Implement gas price once api is ready
const nonce = ref(0) // TODO: Implement nonce once api is ready
const data = ref('0x')
// const toggleTransactionType = ref(true) // TODO: idea, allow different transaction types

onMounted(async () => {
  const mainToken: Token = tokens.value.find(
    (t: Token) => t.contract === MAIN_TOKEN_CONTRACT,
  ) as Token
  tokenSelected.value = (mainToken as Token) ? mainToken : tokens.value[0]
})

const fees = computed(() => {
  return fromWei((gasLimit.value * gasPrice.value).toString(), 'ether')
})
const amountErrorMessages = computed(() => {
  const baseAmount = toWei(amount.value, 'ether')
  const baseBalance = toWei(balance.value, 'ether')
  const baseFee = toWei(fees.value, 'ether')
  const tokenSelectedBalance = tokenSelected.value.balance
    ? tokenSelected.value.balance
    : '0'
  const baseTokenBalance = toWei(tokenSelectedBalance, 'ether')

  if (amount.value === '') return 'Amount is required' // amount is blank
  if (BigInt(baseAmount) <= 0) return 'Amount must be greater than 0' // amount less than 0
  if (BigInt(baseTokenBalance) < BigInt(baseAmount))
    return 'Insufficient balance for this token' // amount greater than selected balance
  if (BigInt(baseFee) > BigInt(baseBalance))
    return 'Insufficient balance for fees' // fees greater than wallet balance
  if (
    tokenSelected.value.contract === MAIN_TOKEN_CONTRACT &&
    BigInt(baseBalance) < BigInt(baseAmount)
  )
    return 'Insufficient balance for this token' // amount greater than wallet balance

  return ''
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

const validSend = computed(() => {
  return amountErrorMessages.value === '' && addressErrorMessages.value === ''
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
  console.log(
    'Send',
    amount.value,
    toAddress.value,
    wallet.value.getAddressString(),
  )
}
</script>

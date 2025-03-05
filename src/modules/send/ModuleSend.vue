<template>
  <div class="mt-5">
    <form @submit.prevent="handleSubmit">
      <div class="w-full">
        <p class="font-bold ml-2 mb-1 text-base">Amount</p>
        <app-enter-amount
          v-model:amount="amount"
          v-model:selected-token="tokenSelected"
          v-model:error="amountError"
          :validate-input="checkAmountForError"
        />
      </div>
      <app-address-book v-model="toAddress" />
      <app-select-tx-fee v-model="selectedFee" :fees="gasFees.fee" />
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
      title="Read more"
      help-link="https://help.myetherwallet.com/en/article/what-is-gas"
    />
  </div>

  <!-- TODO: replace network with actual selected network info -->
  <evm-transaction-confirmation
    :fromAddress="wallet.getAddress()"
    :toAddress="toAddress"
    :networkFeeUSD="networkFeeUSD"
    :networkFeeETH="networkFeeETH"
    :network="{ name_long: 'Ethereum', icon: 'ethereum', name: 'ETH' }"
    :to-token="tokenSelected"
    :to-amount="amount.toString()"
    :to-amount-fiat="amountToFiat"
    v-model="openTxModal"
  />
</template>
<script setup lang="ts">
import { onBeforeMount, ref, computed, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { toHex, toWei, fromWei } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import AppEnterAmount from '@/components/AppEnterAmount.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppAddressBook from '@/components/AppAddressBook.vue'

import {
  useWalletStore,
  MAIN_TOKEN_CONTRACT,
  type Token,
} from '@/stores/walletStore'
import { abi } from './tokenAbi'
import {
  GasPriceType,
  type GasFeeResponse,
  type HexPrefixedString,
} from '@/providers/types'
import { hexToBigInt } from '@ethereumjs/util'

import { useAddressBookStore } from '@/stores/addressBook'
import EvmTransactionConfirmation from './components/EvmTransactionConfirmation.vue'
import BigNumber from 'bignumber.js'

const addressBookStore = useAddressBookStore()
const { addAddress } = addressBookStore

const walletStore = useWalletStore()
const { wallet, tokens } = storeToRefs(walletStore)
const amount = ref<number | string>('')
const toAddress = ref('')
const tokenSelected: Ref<Token> = ref({} as Token) // TODO: Implement token selection
const amountError = ref('')
const toggleAdvanced = ref(false)
// advanced settings
const gasLimit = ref(21000) // TODO: Implement gas limit once api is ready
const gasPrice = ref('30000000000') // TODO: Implement gas price once api is ready
const nonce = ref(0) // TODO: Implement nonce once api is ready
const data = ref('0x')
const gasFees: Ref<GasFeeResponse> = ref({} as GasFeeResponse)
const selectedFee = ref(GasPriceType.REGULAR)
// const toggleTransactionType = ref(true) // TODO: idea, allow different transaction types

const openTxModal = ref(false)

onBeforeMount(async () => {
  const mainToken: Token = tokens.value.find(
    (t: Token) => t.contract === MAIN_TOKEN_CONTRACT,
  ) as Token
  tokenSelected.value = (mainToken as Token) ? mainToken : tokens.value[0]
  //TODO: DOUBLE CHECK in theory PreTransaction interface might be different for different chains. IE they will  not use  HexPrefixedString
  gasFees.value = await wallet.value.getGasFee({
    to: '0x000000000000000000000000000000000000',
    from: wallet.value.getAddress() as HexPrefixedString,
    value: toHex(toWei(amount.value, 'ether')) as HexPrefixedString,
    data: data.value as HexPrefixedString,
  })
})

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

// TODO: Reimplement fee calculation
// const fees = computed(() => {
//   return fromWei((gasLimit.value * gasPrice.value).toString(), 'ether')
// })

// Gas Fee for display
const hasGasFees = computed(() => {
  return Object.keys(gasFees.value).length > 0
})
const networkFeeUSD = computed(() => {
  if (!hasGasFees.value) return '0'
  return gasFees.value?.fee[selectedFee.value]?.fiatValue || '0'
})
const networkFeeETH = computed(() => {
  if (!hasGasFees.value) return '0'
  return (
    fromWei(gasFees.value?.fee[selectedFee.value]?.nativeValue, 'ether') || '0'
  )
})

const validSend = computed(() => {
  return amountError.value === '' && toAddress.value !== ''
})

const amountToFiat = computed(() => {
  if (!tokenSelected.value.price) return '0'
  return BigNumber(tokenSelected.value.price)
    .times(BigNumber(amount.value))
    .toString()
})

watch(
  () => [selectedFee.value, gasFees.value?.fee],
  () => {
    if (!gasFees.value?.fee || !gasFees.value.fee[selectedFee.value]) return
    gasPrice.value = hexToBigInt(
      gasFees.value.fee[selectedFee.value].nativeValue,
    ).toString()
  },
)

watch(
  () => [tokenSelected.value, amount.value, toAddress.value],
  () => {
    if (
      tokenSelected.value &&
      tokenSelected.value.contract &&
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
  addAddress(toAddress.value)
  openTxModal.value = true
  console.log('AAAAAAAA', openTxModal.value)
}
</script>

<template>
  <div class="mt-5">
    <form @submit.prevent="handleSubmit">
      <div class="w-full">
        <!-- <p class="font-bold ml-2 mb-1 text-base">Amount</p> -->
        <app-enter-amount
          v-model:amount="amount"
          v-model:selected-token="tokenSelected"
          v-model:error="amountError"
          :validate-input="checkAmountForError"
        />
      </div>
      <app-address-book v-model="toAddress" />
      <app-select-tx-fee
        v-model="selectedFee"
        :fees="gasFees.fees"
        :isLoading="isLoadingFees"
      />
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
      title="Need help sending?"
      help-link="https://help.myetherwallet.com/en/article/what-is-gas"
    />
  </div>

  <!-- TODO: replace network with actual selected network info -->
  <evm-transaction-confirmation
    :fromAddress="address"
    :toAddress="toAddress"
    :networkFeeUSD="networkFeeUSD"
    :networkFeeCrypto="networkFeeCrypto"
    :network="selectedChain || null"
    :to-token="tokenSelected"
    :to-amount="amount.toString()"
    :to-amount-fiat="amountToFiat"
    :signed-tx="signedTx"
    v-model="openTxModal"
  />
</template>
<script setup lang="ts">
import { onMounted, ref, computed, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { toWei, fromWei, toBigInt, toHex } from 'web3-utils'
import { Contract } from 'web3-eth-contract'

import AppEnterAmount from '@/components/AppEnterAmount.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppAddressBook from '@/components/AppAddressBook.vue'
import { type TokenBalance } from '@/mew_api/types'
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { abi } from './tokenAbi'
import {
  GasPriceType,
  type GasFeeResponse,
  type HexPrefixedString,
} from '@/providers/types'
import { hexToBigInt } from '@ethereumjs/util'

import EvmTransactionConfirmation from './components/EvmTransactionConfirmation.vue'
import BigNumber from 'bignumber.js'
import { useChainsStore } from '@/stores/chainsStore'
import { WalletType } from '@/providers/types'

const walletStore = useWalletStore()
const { wallet, tokens } = storeToRefs(walletStore)

const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
const amount = ref<number | string>('0')
const toAddress = ref('')
const tokenSelected: Ref<TokenBalance> = ref({} as TokenBalance) // TODO: Implement token selection
const amountError = ref('')
const toggleAdvanced = ref(false)
// advanced settings
const gasLimit = ref('21000') // TODO: Implement gas limit once api is ready
const gasPrice = ref('30000000000') // TODO: Implement gas price once api is ready
const nonce = ref(0) // TODO: Implement nonce once api is ready
const data = ref('0x')
const gasFees: Ref<GasFeeResponse> = ref({} as GasFeeResponse)
const selectedFee = ref(GasPriceType.REGULAR)
// const toggleTransactionType = ref(true) // TODO: idea, allow different transaction types

const openTxModal = ref(false)
const isLoadingFees = ref(true)

const signedTx = ref<HexPrefixedString | string>('')
const address = ref('')

onMounted(async () => {
  const mainToken: TokenBalance = tokens.value.find(
    (t: TokenBalance) => t.contract === MAIN_TOKEN_CONTRACT,
  ) as TokenBalance
  address.value = await wallet.value.getAddress()
  tokenSelected.value = (mainToken as TokenBalance)
    ? mainToken
    : tokens.value[0]
  //TODO: DOUBLE CHECK in theory PreTransaction interface might be different for different chains. IE they will  not use  HexPrefixedString
  isLoadingFees.value = true
  gasFees.value = await wallet.value.getGasFee({
    to: '0x0000000000000000000000000000000000000000',
    address: address.value as HexPrefixedString,
    value: '0x0' as HexPrefixedString,
    data: data.value as HexPrefixedString,
  })

  isLoadingFees.value = false
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

// Gas Fee for display
const hasGasFees = computed(() => {
  return Object.keys(gasFees.value).length > 0
})
const networkFeeUSD = computed(() => {
  if (!hasGasFees.value) return '0'
  return gasFees.value?.fees[selectedFee.value]?.fiatValue || '0'
})
const networkFeeCrypto = computed(() => {
  if (!hasGasFees.value) return '0'
  return (
    fromWei(gasFees.value?.fees[selectedFee.value]?.nativeValue, 'ether') || '0'
  )
})

const validSend = computed(() => {
  return (
    amountError.value === '' && toAddress.value !== '' && !isLoadingFees.value
  )
})

const amountToFiat = computed(() => {
  if (!tokenSelected.value.price) return '0'
  return BigNumber(tokenSelected.value.price)
    .times(BigNumber(amount.value))
    .toString()
})

watch(
  () => [selectedFee.value, gasFees.value?.fees],
  () => {
    if (!gasFees.value?.fees || !gasFees.value.fees[selectedFee.value]) return
    gasPrice.value = hexToBigInt(
      gasFees.value.fees[selectedFee.value].nativeValue,
    ).toString()
  },
)

watch(
  () => [tokenSelected.value, amount.value, toAddress.value],
  async () => {
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
    if (!toAddress.value) return
    isLoadingFees.value = true
    gasFees.value = {} as GasFeeResponse
    gasFees.value = await wallet.value.getGasFee({
      to: toAddress.value as HexPrefixedString,
      address:
        (address.value as HexPrefixedString) ||
        '0x0000000000000000000000000000000000000000',
      value: toHex(toBigInt(toWei(amount.value, 'ether'))) as HexPrefixedString,
      data: data.value as HexPrefixedString,
    })
    isLoadingFees.value = false
  },
)

watch(
  () => openTxModal.value,
  value => {
    if (!value) {
      amount.value = '0'
      toAddress.value = ''
      signedTx.value = ''
    }
  },
)

const handleSubmit = async () => {
  // generate signable transaction
  const signableTx = await wallet.value?.getSignableTransaction({
    priority: selectedFee.value,
    quoteId: gasFees.value?.quoteId,
  })

  if (wallet.value?.getWalletType() === WalletType.WAGMI) {
    openTxModal.value = true
    signedTx.value = signableTx.serialized
    return
  }

  // sign transaction
  if (!wallet.value?.SignTransaction) {
    console.error('SignTransaction not implemented')
    return
  }
  const signResponse = await wallet.value?.SignTransaction(
    signableTx.serialized,
  )

  signedTx.value = signResponse.signed
  openTxModal.value = true
}
</script>

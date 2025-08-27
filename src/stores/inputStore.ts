import type { NewTokenInfo } from '@/composables/useSwap'
import type { Chain } from '@/mew_api/types'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

/**
  * Input store used to hold swap/send values when changed before accessing wallet.
  * Values are cleared on refresh and after a successful wallet access.
 */
export const useInputStore = defineStore('inputStore', () => {
  const hasSwapValues = ref(false);
  const hasSendValues = ref(false);
  const sendValues = reactive({
    toAddress: '',
    amount: '',
    token: '',
  })
  const swapValues = reactive({
    fromToken: {} as NewTokenInfo,
    toToken: {} as NewTokenInfo,
    fromAmount: '',
    toChain: {} as Chain
  })

  const storeSendValues = (values: {
    toAddress: string;
    amount: string;
    token: string;
  }) => {
    sendValues.toAddress = values.toAddress
    sendValues.amount = values.amount
    sendValues.token = values.token
    hasSendValues.value = true
  }

  const clearSendValues = () => {
    sendValues.toAddress = ''
    sendValues.amount = ''
    sendValues.token = ''
    hasSendValues.value = false
  }

  const storeSwapValues = (values: {
    fromToken: NewTokenInfo;
    toToken: NewTokenInfo;
    fromAmount: string;
    toChain: Chain;
  }) => {
    swapValues.fromToken = values.fromToken
    swapValues.toToken = values.toToken
    swapValues.fromAmount = values.fromAmount
    swapValues.toChain = values.toChain
    hasSwapValues.value = true
  }
  const clearSwapValues = () => {
    swapValues.fromToken = {} as NewTokenInfo
    swapValues.toToken = {} as NewTokenInfo
    swapValues.fromAmount = ''
    swapValues.toChain = {} as Chain
    hasSwapValues.value = false
  }

  return {
    swapValues,
    storeSwapValues,
    clearSwapValues,
    hasSwapValues,
    hasSendValues,
    sendValues,
    storeSendValues,
    clearSendValues
  }
})

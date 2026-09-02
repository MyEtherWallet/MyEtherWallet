import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { encodeFunctionData, erc20Abi, formatUnits } from 'viem'
import BigNumber from 'bignumber.js'
import { captureException } from '@sentry/vue'

import { getAPIPath } from '@/utils/constructAPIPath'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { useGlobalStore } from '@/stores/globalStore'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import type { GetEvmTransactionQuoteResponse } from '@/mew_api/types'
import { ONEINCH_APPROVAL_ADDRESS } from '../providers/oneinch_fusion/configs'

const UNLIMITED_ALLOWANCE = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
)

export const buildApprovalCalldata = (): `0x${string}` =>
  encodeFunctionData({
    abi: erc20Abi,
    functionName: 'approve',
    args: [ONEINCH_APPROVAL_ADDRESS as `0x${string}`, UNLIMITED_ALLOWANCE],
  }) as `0x${string}`

export function useApprovalFee() {
  const { formatFiat } = useCurrency()
  const { gasPriceType } = storeToRefs(useGlobalStore())

  const isLoading = ref(false)
  const hasFailed = ref(false)
  const nativeFee = ref('')
  const fiatFee = ref('')

  const reset = () => {
    isLoading.value = false
    hasFailed.value = false
    nativeFee.value = ''
    fiatFee.value = ''
  }

  const fetchApprovalFee = async (options: {
    chainId: string
    tokenAddress: string
    walletAddress: string
    nativeDecimals?: number
  }): Promise<boolean> => {
    const {
      chainId,
      tokenAddress,
      walletAddress,
      nativeDecimals = 18,
    } = options
    if (!chainId || !tokenAddress || !walletAddress) return false

    isLoading.value = true
    hasFailed.value = false

    try {
      const response = await fetch(
        getAPIPath(`/v1/evm/chains/${parseInt(chainId)}/quotes`),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: walletAddress,
            to: tokenAddress,
            value: '0x0',
            data: buildApprovalCalldata(),
          }),
        },
      )
      if (!response.ok) throw new Error(`Fee quote failed: ${response.status}`)

      const quote = (await response.json()) as GetEvmTransactionQuoteResponse
      const tier = quote.fees?.[gasPriceType.value]
      if (!tier?.nativeValue) throw new Error('Fee quote has no native value')

      const native = formatUnits(BigInt(tier.nativeValue), nativeDecimals)
      nativeFee.value =
        `${formatFloatingPointValue(native).value} ${tier.nativeSymbol ?? ''}`.trim()
      fiatFee.value = tier.fiatValue
        ? formatFiat(BigNumber(tier.fiatValue)).display
        : ''

      isLoading.value = false
      return true
    } catch (error) {
      captureException(error, {
        ...SENTRY_MODULE_TAGS.TRADE,
        extra: { title: 'Approval fee quote failed', chainId, tokenAddress },
      })
      hasFailed.value = true
      isLoading.value = false
      return false
    }
  }

  return {
    isLoading,
    hasFailed,
    nativeFee,
    fiatFee,
    fetchApprovalFee,
    reset,
  }
}

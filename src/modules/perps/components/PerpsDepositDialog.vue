<template>
  <app-dialog
    v-model:is-open="isOpen"
    :title="showDepositAddress ? '' : $t('perps.deposit.title')"
    has-content-gutter
    class="sm:max-w-[460px] sm:mx-auto"
  >
    <template v-if="showDepositAddress && showIsLive" #title>
      <div class="flex items-center w-full px-4 pt-4 sm:pt-5">
        <button
          class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-5 transition-colors mr-2"
          @click="showDepositAddress = false"
        >
          <chevron-left-icon class="w-5 h-5" />
        </button>
        <h1 class="font-bold text-s-20 text-center flex-1" id="dialogTitle">
          {{ $t('perps.deposit.eth-deposit-address-title') }}
        </h1>
        <div class="w-9" />
      </div>
    </template>
    <template #content>
      <div class="pb-6">
        <!-- ===== PAGE 1: Deposit Form ===== -->
        <template v-if="!showDepositAddress">
          <!-- Content Card -->
          <div class="relative">
            <AppToggle
              v-model="showIsLive"
              :label="$t('perps.deposit.live-mode-label')"
              class="mb-4"
            />
            <div class="bg-mewBg rounded-20 px-4 p-4">
              <!-- Amount Input -->
              <p class="font-bold ml-3 mb-1">
                {{ $t('perps.deposit.amount-label') }}
              </p>
              <app-enter-amount
                v-model:amount="amount"
                v-model:selected-token="USDC_CONTRACT"
                :validate-input="checkAmountForError"
                :is-pristine="isPristine"
                :error="amountError"
                :token-obj="tokenOptions"
              >
                <template #token-select>
                  <div class="flex items-center py-1.5 ml-3 flex-shrink-0">
                    <app-token-logo
                      :url="usdcBalance?.logo_url"
                      symbol="USDC"
                      width="w-7"
                      height="h-7"
                      class="mr-2"
                    />
                    <span class="uppercase font-medium e text-s-15">USDC</span>
                  </div>
                </template>
                <template #footer>
                  <!-- Percentage Pills -->
                  <div class="flex gap-2 mt-5">
                    <button
                      v-for="pct in [25, 50, 75, 100]"
                      :key="pct"
                      class="px-[10px] py-1 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                      @click="setAmountPercent(pct)"
                    >
                      {{ pct === 100 ? $t('perps.deposit.max') : pct + '%' }}
                    </button>
                  </div>
                </template>
              </app-enter-amount>

              <!-- Network -->
              <div class="mt-5 px-2 flex items-center justify-between">
                <p
                  class="text-info uppercase tracking-sp-06 text-s-12 font-bold"
                >
                  {{ $t('perps.deposit.from-network-label') }}
                </p>

                <div class="flex items-center gap-2">
                  <app-token-logo
                    v-if="showIsLive"
                    :url="selectedChain?.icon"
                    symbol="ETH"
                    width="w-5"
                    height="h-5"
                  />
                  <p class="font-medium text-s-14">
                    {{
                      showIsLive
                        ? $t('perps.deposit.network-ethereum')
                        : $t('perps.deposit.network-sandbox')
                    }}
                  </p>
                </div>
              </div>
              <!--Deposit Address-->
              <div class="py-4 px-2 flex items-center justify-between">
                <p
                  class="text-info uppercase tracking-sp-06 text-s-12 font-bold"
                >
                  {{ $t('perps.deposit.to-address-label') }}
                </p>

                <div class="flex items-center gap-2">
                  <div
                    v-if="showIsLive"
                    class="font-medium text-s-14 flex items-center gap-2"
                    :class="{
                      'animate-pulse w-[120px] h-[21px] bg-surface rounded-8':
                        !depositAddress,
                    }"
                  >
                    <app-blockie
                      v-if="depositAddress"
                      :address="depositAddress"
                      :size="5"
                    />
                    <p>
                      {{
                        depositAddress ? truncateAddress(depositAddress, 6) : ''
                      }}
                    </p>
                  </div>
                  <p v-else class="font-medium text-s-14">
                    {{ $t('perps.deposit.smart-contract-address') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Error -->
            <div
              v-if="error"
              class="bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4 mb-4"
            >
              <p class="text-[#ff5b5a] text-s-14 font-medium">{{ error }}</p>
            </div>

            <!-- Deposit Button -->
            <AppBaseButton
              :disabled="depositDisabled"
              :is-loading="sending"
              class="w-full mt-5"
              @click="sendDeposit"
            >
              {{ depositButtonLabel }}
            </AppBaseButton>

            <!-- Deposit Address Link -->
            <div v-if="showIsLive && depositAddress" class="text-center mt-5">
              <button
                class="text-primary text-s-14 font-medium hover:underline inline-flex items-center gap-1"
                @click="showDepositAddress = true"
              >
                {{ $t('perps.deposit.use-deposit-address-link') }}
                <chevron-right-icon class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </template>

        <!-- ===== PAGE 2: Deposit Address (live only) ===== -->
        <template v-else-if="showIsLive">
          <!-- Warning text -->
          <p class="mb-6">
            {{ $t('perps.deposit.deposit-address-warning') }}
          </p>

          <!-- QR Code -->
          <div class="flex justify-center mb-8">
            <div
              class="rounded-[20px] border border-[#e5e7eb] p-4 relative inline-block"
            >
              <qrcode-vue
                :value="depositAddress || ''"
                :size="220"
                level="M"
                render-as="svg"
              />
              <!-- ETH icon overlay in center -->
              <div
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div
                  class="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
                >
                  <app-token-logo
                    :url="selectedChain?.icon"
                    symbol="ETH"
                    width="w-8"
                    height="h-8"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Address display -->
          <div class="flex items-center gap-3">
            <div class="relative">
              <app-token-logo
                :url="usdcBalance?.logo_url"
                symbol="USDC"
                width="w-10"
                height="h-10"
              />
              <div
                class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
              >
                <app-token-logo
                  :url="selectedChain?.icon"
                  symbol="ETH"
                  width="w-5"
                  height="h-5"
                />
              </div>
            </div>
            <p
              class="font-bold text-s-15 text-textDark break-all flex-1 leading-snug"
            >
              {{ depositAddress }}
            </p>
            <app-btn-copy :copy-value="depositAddress || ''" />
            <!-- Refresh -->
            <!-- <app-tooltip text="Refresh deposit address" position="top-left">
              <app-btn-icon
                label="Refresh deposit address"
                :disabled="loading"
                @click="fetchDepositAddress"
              >
                <arrow-path-icon class="w-[18px] h-[18px]" />
              </app-btn-icon>
            </app-tooltip> -->
          </div>
        </template>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppEnterAmount from '@/components/AppEnterAmount.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import AppToggle from '@/components/AppToggle.vue'
import {
  perpsClient,
  USDC_ADDRESS,
  USDC_DECIMALS,
  IS_PERPS_LIVE,
} from '../configs'
import { usePerpsAuth } from '../composables/usePerpsAuth'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { Contract } from 'web3-eth-contract'
import { abi } from '@/modules/send/tokenAbi'
import { mainnet } from 'viem/chains'
import { type HexPrefixedString, WalletType } from '@/providers/types'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { usePerpsToasts } from '@/modules/perps/composables/usePerpsToasts'
import type { EstimatesRequestBody, QuotesResponse } from '@/mew_api/types'
import { isSignableWallet } from '@/utils/walletUtils'
import { useI18n } from 'vue-i18n'
import { parseUnits, formatUnits } from 'viem'
import { type TokenBalance } from '@/mew_api/types'
import { truncateAddress } from '@/utils/filters'
import { analytics, PerpsDepositEvent } from '@/analytics'

const { t } = useI18n()
const SANDBOX_MAX_DEPOSIT = 1000

const showIsLive = ref(IS_PERPS_LIVE)

const isOpen = defineModel<boolean>({ required: true })

const { accountId, triggerRefresh } = usePerpsAuth()
const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)
const chainsStore = useChainsStore()
const { selectedChain, chains } = storeToRefs(chainsStore)
const globalStore = useGlobalStore()
const { gasPriceType: selectedFee } = storeToRefs(globalStore)
const toastStore = useToastStore()
const perpsToasts = usePerpsToasts()

watch(isOpen, open => {
  if (!open) {
    // TODO(perps): once the SDK exposes a way to cancel an in-flight deposit
    // (sandbox API call / live broadcast), hook it up here and surface a
    // single "Deposit Canceled" toast. For now the request runs to completion
    // regardless of whether the dialog is closed.
    return
  }
  analytics.trackPerpsDepositEvent(PerpsDepositEvent.CLICKED)
  if (selectedChain.value?.name !== 'ETHEREUM') {
    const ethChain = chains.value.find(c => c.name === 'ETHEREUM')
    if (ethChain) {
      // Note: setSelectedNetwork is a synchronous store mutation (no user interaction),
      // so toastFailedToSwitchNetwork does not apply here. This toast is intentionally
      // kept as an informational message about the automatic switch.
      globalStore.setSelectedNetwork('ETHEREUM')
      // Direct toastStore call intentionally kept here; this is informational, not an error path.
      toastStore.addToastMessage({
        text: t('perps.deposit.switched-network-toast-title'),
        textSecondary: t('perps.deposit.switched-network-toast-detail'),
        type: ToastType.Info,
        duration: 30000,
      })
    }
  }
})

const depositAddress = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const amount = ref('')
const sending = ref(false)
const showDepositAddress = ref(false)

// User-cancel phrases used to distinguish a wallet-prompt rejection (which
// should yield "Deposit Canceled") from a generic RPC/API "rejected" error
// (which should still surface as a failure toast).
const USER_CANCEL_PATTERNS = [
  'user rejected',
  'user denied',
  'rejected by user',
  'cancelled by user',
  'canceled by user',
]
const isUserCancelError = (e: unknown) => {
  const msg = (e instanceof Error ? e.message : String(e ?? '')).toLowerCase()
  return USER_CANCEL_PATTERNS.some(p => msg.includes(p))
}

/** --------------------------
 * AMOUNT
 --------------------------*/
const USDC_CONTRACT = USDC_ADDRESS[mainnet.id] // future select tokens when multicollateral is enabled
const isPristine = ref(true)

// Mark form as not pristine when user starts typing
watch(
  () => amount.value,
  (newAmount, oldAmount) => {
    if (newAmount !== '' && oldAmount === '') {
      isPristine.value = false
    }
  },
)
const amountError = ref('')

//For Sandbox Only
const tokenOptions = computed<TokenBalance | null>(() => {
  if (showIsLive.value) return null
  return {
    symbol: 'USDC',
    name: 'USD Coin',
    contract: USDC_CONTRACT,
    decimals: USDC_DECIMALS[mainnet.id],
    balance: '1000', // dummy balance for sandbox since we don't want to gate by actual balance
    balanceWei: parseUnits('1000', USDC_DECIMALS[mainnet.id]).toString(),
    price: 1,
  }
})

// USDC balance
const usdcBalance = computed(() => {
  const usdcContract = USDC_CONTRACT
  if (!usdcContract) return null
  return walletStore.getTokenBalance(usdcContract)
})

const checkAmountForError = () => {
  // Skip validation if form is pristine (just cleared or initial state)
  if (isPristine.value) {
    amountError.value = ''
    return
  }
  const tokenDecimals = USDC_DECIMALS[mainnet.id]
  const tokenBalance = showIsLive.value
    ? walletStore.getTokenBalance(USDC_CONTRACT)
    : null
  const baseTokenBalance =
    tokenBalance?.balanceWei ?? parseUnits('1000', tokenDecimals)
  const baseAmount = amount.value
    ? parseUnits(amount.value.toString(), tokenDecimals)
    : BigInt(0)
  // if (amount.value === undefined || amount.value === '')
  //   amountError.value = t('error.amount.required') // amount is undefined or blank
  if (amount.value !== '' && baseAmount <= BigInt(0))
    amountError.value = t('error.amount.less_than_zero') // amount is 0 or negative
  else if (BigInt(baseTokenBalance) < baseAmount) {
    amountError.value = t('error.balance.insufficient') // amount greater than selected balance
  } else if (
    showIsLive.value &&
    baseAmount > parseUnits(SANDBOX_MAX_DEPOSIT.toString(), tokenDecimals)
  ) {
    amountError.value = t('perps.deposit.amount-exceeds-max') // arbitrary max for live to prevent large deposits while we're monitoring performance and stability
  } else amountError.value = ''
}

/**
 * Sets the deposit amount based on a percentage of the available balance or sandbox max deposit.
 * @param pct The percentage of the balance to set as the deposit amount.
 */
const setAmountPercent = (pct: number) => {
  if (!showIsLive.value) {
    const val = (SANDBOX_MAX_DEPOSIT * pct) / 100
    amount.value = val.toFixed(2)
    return
  }

  if (!usdcBalance.value) return

  const tokenDecimals = USDC_DECIMALS[mainnet.id]
  const balanceWei = usdcBalance.value.balanceWei || '0'

  if (balanceWei === '0') return

  // Convert percentage to bigint calculation
  const balanceBigInt = BigInt(balanceWei)
  const amountBigInt = (balanceBigInt * BigInt(pct)) / BigInt(100)

  // Format using viem's formatUnits
  amount.value = formatUnits(amountBigInt, tokenDecimals)
}

const clearAmount = () => {
  amount.value = ''
  isPristine.value = true
  amountError.value = ''
}

/** --------------------------
 * DEPOSIT
 ------------------------- */
const depositDisabled = computed(() => {
  if (amountError.value !== '') return true
  const amt = parseFloat(amount.value)
  if (!amt || amt <= 0 || sending.value || loading.value) return true
  if (showIsLive.value) {
    if (!depositAddress.value) return true
    if (!usdcBalance.value) return true
    if (amt > parseFloat(usdcBalance.value.balance)) return true
  }

  return false
})

const depositButtonLabel = computed(() => {
  if (loading.value) return t('perps.deposit.loading')
  if (sending.value) return t('perps.deposit.sending')

  if (isPristine.value) return t('perps.deposit.enter-amount')
  const amt = parseFloat(amount.value)
  if (!showIsLive.value) {
    if (amt > SANDBOX_MAX_DEPOSIT)
      return t('perps.deposit.max-usdc-amount', { amount: SANDBOX_MAX_DEPOSIT })
    return t('perps.deposit.title')
  }
  if (!usdcBalance.value) return t('perps.deposit.no-usdc-balance')
  if (amt > parseFloat(usdcBalance.value.balance))
    return t('perps.deposit.insufficient-balance')
  return t('perps.deposit.title')
})

// Fetch deposit address on open
watch(
  () => isOpen.value,
  async isOpen => {
    if (!isOpen) return
    showDepositAddress.value = false
    amount.value = ''
    error.value = null
    if (showIsLive.value) {
      await fetchDepositAddress()
    }
  },
)

watch(
  () => showIsLive.value,
  async live => {
    if (live && isOpen.value) {
      await fetchDepositAddress()
    } else {
      depositAddress.value = null
    }
  },
)

const fetchDepositAddress = async () => {
  if (!accountId.value) return
  loading.value = true
  error.value = null
  try {
    const res = await perpsClient.listDepositAddresses({
      coins: ['USDC'],
      network: 'ethereum',
      depositDestination: { id: accountId.value, wallet: 'margin' },
    })

    if (res.result && res.result.length > 0) {
      depositAddress.value = res.result[0].address
    } else {
      const provision = await perpsClient.provisionAddress({
        network: 'ethereum',
        symbol: 'USDC',
        deposit_destination: { id: accountId.value, wallet: 'margin' },
      })
      depositAddress.value = provision.result.address
    }
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : t('perps.deposit.fetch-address-failed')
  } finally {
    loading.value = false
  }
}

const sendSandboxDeposit = async () => {
  if (!amount.value || !accountId.value) return
  const depositAmount = amount.value
  sending.value = true
  error.value = null
  try {
    await perpsClient.sandboxDeposit({
      amount: parseFloat(depositAmount).toFixed(2),
      symbol: 'USDC',
      deposit_destination: { id: accountId.value, wallet: 'margin' },
      chain_id: 'eth-sepolia',
    })
    triggerRefresh()
    analytics.trackPerpsDepositEvent(PerpsDepositEvent.SUCCESS, {
      depositAmount,
      token: 'USDC',
    })
    analytics.trackPerpsDepositEvent(PerpsDepositEvent.COMPLETED, {
      depositAmount,
      token: 'USDC',
    })
    perpsToasts.toastDepositComplete(depositAmount, 'USDC')
    clearAmount()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e ?? '')
    if (isUserCancelError(e)) {
      error.value = t('perps.deposit.transaction-cancelled')
      perpsToasts.toastDepositCanceled()
    } else {
      error.value = msg || t('perps.deposit.sandbox-deposit-failed')
      analytics.trackPerpsDepositErrorEvent(PerpsDepositEvent.ERROR, {
        depositAmount,
        token: 'USDC',
        errorMessage: msg,
      })
      perpsToasts.toastFailedToInitiateDeposit()
    }
  } finally {
    sending.value = false
  }
}

const sendLiveDeposit = async () => {
  if (
    !amount.value ||
    !depositAddress.value ||
    !wallet.value ||
    !usdcBalance.value
  )
    return
  const depositAmount = amount.value
  sending.value = true
  error.value = null
  try {
    const usdcContract = USDC_CONTRACT
    const decimals = usdcBalance.value.decimals ?? 6
    const amountBase = parseUnits(amount.value, decimals)
    const walletAddress = await wallet.value.getAddress()

    // Encode ERC-20 transfer calldata
    const web3Contract = new Contract(abi, usdcContract)
    const data = web3Contract.methods
      .transfer(depositAddress.value, amountBase.toString())
      .encodeABI()

    // Estimate gas fees
    const txBody: EstimatesRequestBody = {
      to: usdcContract as HexPrefixedString,
      address: walletAddress as HexPrefixedString,
      value: '0x0',
      data: data as HexPrefixedString,
    }

    const gasFees: QuotesResponse | undefined =
      await wallet.value.getGasFee?.(txBody)
    if (!gasFees?.fees || !gasFees.fees[selectedFee.value]) {
      throw new Error(t('perps.deposit.gas-estimate-failed'))
    }

    // Get signable transaction
    const signableTx = await wallet.value.getSignableTransaction({
      priority: selectedFee.value,
      quoteId: gasFees.quoteId,
    })

    // Sign
    let signedTx: string
    if (isSignableWallet(wallet.value)) {
      const signResponse = await wallet.value.SignTransaction!(
        signableTx.serialized as HexPrefixedString,
      )
      signedTx = signResponse.signed
    } else {
      signedTx = signableTx.serialized
    }

    // Broadcast
    const broadcastFn =
      wallet.value.getWalletType() === WalletType.WAGMI ||
      wallet.value.getWalletType() === WalletType.INJECTED
        ? wallet.value.SendTransaction
        : wallet.value.broadcastTransaction

    const hash = await broadcastFn?.(signedTx as HexPrefixedString)
    if (!hash) {
      throw new Error(t('perps.deposit.broadcast-failed'))
    }
    triggerRefresh()
    analytics.trackPerpsDepositEvent(PerpsDepositEvent.SUCCESS, {
      depositAmount,
      token: 'USDC',
    })
    analytics.trackPerpsDepositEvent(PerpsDepositEvent.COMPLETED, {
      depositAmount,
      token: 'USDC',
    })
    perpsToasts.toastDepositInitiated()
    clearAmount()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e ?? '')
    if (isUserCancelError(e)) {
      error.value = t('perps.deposit.transaction-cancelled')
      perpsToasts.toastDepositCanceled()
    } else {
      error.value = msg || t('perps.deposit.transaction-failed')
      analytics.trackPerpsDepositErrorEvent(PerpsDepositEvent.ERROR, {
        depositAmount,
        token: 'USDC',
        errorMessage: msg,
      })
      perpsToasts.toastFailedToCreditAccount()
    }
  } finally {
    sending.value = false
  }
}

function sendDeposit() {
  const amt = parseFloat(amount.value)
  if (!amt || amt <= 0) return
  if (!accountId.value) return
  analytics.trackPerpsDepositEvent(PerpsDepositEvent.SUBMIT, {
    depositAmount: amount.value,
    token: 'USDC',
  })
  if (showIsLive.value) {
    sendLiveDeposit()
  } else {
    sendSandboxDeposit()
  }
}
</script>

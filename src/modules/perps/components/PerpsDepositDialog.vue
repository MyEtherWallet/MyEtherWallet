<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="$emit('close')"
      />

      <!-- Modal -->
      <div
        class="relative bg-white rounded-[28px] shadow-2xl w-[460px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-8"
      >
        <!-- ===== PAGE 1: Deposit Form ===== -->
        <template v-if="!showDepositAddress">
          <!-- Header -->
          <div class="flex items-center justify-center mb-6 relative">
            <h2 class="font-bold text-[24px] text-textDark">Deposit</h2>
            <button
              class="absolute right-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
              @click="$emit('close')"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Content Card -->
          <div class="bg-[#edf2fa] rounded-[24px] p-5 mb-6">
            <!-- Network Selector -->
            <div
              class="bg-white rounded-[18px] border border-[#e5e7eb] p-4 mb-5"
            >
              <div class="flex items-center gap-3">
                <img
                  v-if="IS_PERPS_LIVE"
                  :src="selectedChain?.icon"
                  alt="Ethereum"
                  class="w-9 h-9 rounded-full"
                />
                <div
                  v-else
                  class="w-9 h-9 rounded-full bg-[#edf2fa] flex items-center justify-center text-[#0052ff] font-bold text-s-14"
                >
                  S
                </div>
                <div class="flex-1">
                  <p class="text-[#58595b] text-s-12 font-medium">Network</p>
                  <p class="font-bold text-[18px] text-textDark leading-tight">
                    {{ IS_PERPS_LIVE ? 'Ethereum' : 'Sandbox (Sepolia)' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Amount Input -->
            <p class="text-s-14 font-bold text-textDark mb-3 ml-1">
              Amount to deposit
            </p>
            <div class="bg-white rounded-[18px] border border-[#e5e7eb] p-4">
              <div class="flex items-center justify-between mb-2">
                <input
                  v-model="amount"
                  type="text"
                  inputmode="decimal"
                  placeholder="0"
                  class="font-bold text-[36px] text-textDark tracking-tight outline-none bg-transparent w-full"
                />
                <div
                  class="flex items-center gap-1.5 border border-[#e5e7eb] rounded-full py-1.5 px-3 ml-3 flex-shrink-0"
                >
                  <img
                    :src="usdcBalance?.logo_url"
                    alt="USDC"
                    class="w-5 h-5 rounded-full"
                  />
                  <span class="text-s-14 font-bold text-textDark">USDC</span>
                  <img
                    src="@/assets/icons/chevron-down.svg"
                    class="w-4 h-4 opacity-30"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center text-s-13 mb-3">
                <span class="text-[#58595b]">{{
                  amount
                    ? `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '$0.00'
                }}</span>
                <span class="text-[#58595b]">
                  <template v-if="IS_PERPS_LIVE">
                    Available:
                    <span class="font-bold text-textDark"
                      >{{ formattedUsdcBalance }} USDC</span
                    >
                  </template>
                  <template v-else>
                    Max:
                    <span class="font-bold text-textDark"
                      >{{ SANDBOX_MAX_DEPOSIT }} USDC</span
                    >
                  </template>
                </span>
              </div>

              <!-- Percentage Pills -->
              <div class="flex gap-2">
                <button
                  v-for="pct in [25, 50, 75, 100]"
                  :key="pct"
                  class="h-8 flex-1 border border-[#e5e7eb] hover:border-grey-300 rounded-full text-[13px] font-bold text-textDark transition-all flex items-center justify-center bg-white"
                  @click="setAmountPercent(pct)"
                >
                  {{ pct === 100 ? 'Max' : pct + '%' }}
                </button>
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

          <!-- Success -->
          <div
            v-if="txHash"
            class="bg-[#e6f9f0] border border-[#b3ecd4] rounded-[16px] p-4 mb-4"
          >
            <p class="text-[#00c896] font-bold text-s-14 mb-1">
              Deposit submitted!
            </p>
            <p class="text-[#58595b] text-s-12">
              Funds may take a few minutes to appear in your perps balance.
            </p>
          </div>

          <!-- Deposit Button -->
          <button
            v-if="!txHash"
            class="w-full text-white rounded-full py-4 text-s-16 font-bold transition-all active:scale-[0.98]"
            :class="
              depositDisabled
                ? 'bg-[#e5e7eb] text-grey-40 cursor-not-allowed'
                : 'bg-[#0052ff] hoverOpacity'
            "
            :disabled="depositDisabled"
            @click="sendDeposit"
          >
            {{ depositButtonLabel }}
          </button>
          <button
            v-else
            class="w-full bg-[#0052ff] text-white rounded-full py-4 text-s-16 font-bold hoverOpacity transition-all active:scale-[0.98]"
            @click="$emit('close')"
          >
            Done
          </button>

          <!-- Deposit Address Link -->
          <div
            v-if="IS_PERPS_LIVE && !txHash && depositAddress"
            class="text-center mt-5"
          >
            <button
              class="text-[#0052ff] text-s-14 font-medium hover:underline inline-flex items-center gap-1"
              @click="showDepositAddress = true"
            >
              Use a deposit address instead
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </template>

        <!-- ===== PAGE 2: Deposit Address (live only) ===== -->
        <template v-else-if="IS_PERPS_LIVE">
          <!-- Header -->
          <div class="flex items-center mb-6">
            <button
              class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f3f4f6] transition-colors mr-2"
              @click="showDepositAddress = false"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 class="font-bold text-[20px] text-textDark flex-1 text-center">
              Ethereum deposit address
            </h2>
            <button
              class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
              @click="$emit('close')"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Warning text -->
          <p class="text-textDark text-s-15 leading-relaxed mb-6">
            Only send USDC on Ethereum to this address. Other assets
            aren&rsquo;t supported. Your account will be credited after 1
            confirmation (~1 minute).
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
                  <img
                    :src="selectedChain?.icon"
                    alt="Ethereum"
                    class="w-8 h-8"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Address display -->
          <div class="flex items-center gap-3">
            <div class="relative flex-shrink-0">
              <img
                :src="usdcBalance?.logo_url"
                alt="USDC"
                class="w-10 h-10 rounded-full"
              />
              <img
                :src="selectedChain?.icon"
                alt="ETH"
                class="w-5 h-5 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-white"
              />
            </div>
            <p
              class="font-bold text-s-15 text-textDark break-all flex-1 leading-snug"
            >
              {{ depositAddress }}
            </p>
            <!-- Copy -->
            <button
              class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f3f4f6] transition-colors text-[#0052ff] flex-shrink-0"
              @click="copyAddress"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path
                  d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                />
              </svg>
            </button>
            <!-- Refresh -->
            <button
              class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f3f4f6] transition-colors text-[#0052ff] flex-shrink-0"
              @click="fetchDepositAddress"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path
                  d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                />
              </svg>
            </button>
          </div>

          <!-- Copied toast -->
          <div
            v-if="copied"
            class="text-center mt-3 text-[#00c896] text-s-13 font-medium"
          >
            Address copied!
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { perpsClient, USDC_ADDRESS, IS_PERPS_LIVE } from '../configs'
import { usePerpsAuth } from '../composables/usePerpsAuth'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { Contract } from 'web3-eth-contract'
import { abi } from '@/modules/send/tokenAbi'
import { parseUnits } from 'viem'
import { mainnet } from 'viem/chains'
import { type HexPrefixedString, WalletType } from '@/providers/types'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import type { EstimatesRequestBody, QuotesResponse } from '@/mew_api/types'
import { isSignableWallet } from '@/utils/walletUtils'

const SANDBOX_MAX_DEPOSIT = 1000

const props = defineProps<{
  visible: boolean
}>()

defineEmits<{
  close: []
}>()

const { accountId, triggerRefresh } = usePerpsAuth()
const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
const globalStore = useGlobalStore()
const { gasPriceType: selectedFee } = storeToRefs(globalStore)

const depositAddress = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const amount = ref('')
const sending = ref(false)
const txHash = ref<string | null>(null)
const showDepositAddress = ref(false)
const copied = ref(false)

async function copyAddress() {
  if (!depositAddress.value) return
  try {
    await navigator.clipboard.writeText(depositAddress.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // fallback
    const el = document.createElement('textarea')
    el.value = depositAddress.value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// USDC balance
const usdcBalance = computed(() => {
  const usdcContract = USDC_ADDRESS[mainnet.id]
  if (!usdcContract) return null
  return walletStore.getTokenBalance(usdcContract)
})

const formattedUsdcBalance = computed(() => {
  if (!usdcBalance.value) return '0.00'
  const bal = parseFloat(usdcBalance.value.balance)
  return bal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

function setAmountPercent(pct: number) {
  if (!IS_PERPS_LIVE) {
    const val = (SANDBOX_MAX_DEPOSIT * pct) / 100
    amount.value = val.toFixed(2)
    return
  }
  if (!usdcBalance.value) return
  const bal = parseFloat(usdcBalance.value.balance)
  const val = (bal * pct) / 100
  amount.value = val.toFixed(2)
}

const depositDisabled = computed(() => {
  const amt = parseFloat(amount.value)
  if (!amt || amt <= 0 || sending.value || loading.value) return true
  if (!IS_PERPS_LIVE) {
    return amt > SANDBOX_MAX_DEPOSIT
  }
  if (!depositAddress.value) return true
  if (!usdcBalance.value) return true
  if (amt > parseFloat(usdcBalance.value.balance)) return true
  return false
})

const depositButtonLabel = computed(() => {
  if (loading.value) return 'Loading...'
  if (sending.value) return 'Sending...'
  const amt = parseFloat(amount.value)
  if (!IS_PERPS_LIVE) {
    if (amt > SANDBOX_MAX_DEPOSIT) return `Max ${SANDBOX_MAX_DEPOSIT} USDC`
    return 'Deposit'
  }
  if (!usdcBalance.value) return 'No USDC balance'
  if (amt > parseFloat(usdcBalance.value.balance)) return 'Insufficient balance'
  return 'Deposit'
})

// Fetch deposit address on open
watch(
  () => props.visible,
  async visible => {
    if (!visible) return
    txHash.value = null
    showDepositAddress.value = false
    amount.value = ''
    error.value = null
    if (IS_PERPS_LIVE) {
      await fetchDepositAddress()
    }
  },
)

async function fetchDepositAddress() {
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
      e instanceof Error ? e.message : 'Failed to fetch deposit address'
  } finally {
    loading.value = false
  }
}

async function sendSandboxDeposit() {
  if (!amount.value || !accountId.value) return
  sending.value = true
  error.value = null
  try {
    await perpsClient.sandboxDeposit({
      amount: parseFloat(amount.value).toFixed(2),
      symbol: 'USDC',
      deposit_destination: { id: accountId.value, wallet: 'margin' },
      chain_id: 'eth-sepolia',
    })
    txHash.value = 'sandbox'
    triggerRefresh()
  } catch (e: any) {
    error.value = e?.message || e?.toString() || 'Sandbox deposit failed'
  } finally {
    sending.value = false
  }
}

async function sendLiveDeposit() {
  if (
    !amount.value ||
    !depositAddress.value ||
    !wallet.value ||
    !usdcBalance.value
  )
    return
  sending.value = true
  error.value = null
  try {
    const usdcContract = USDC_ADDRESS[mainnet.id]
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
      throw new Error('Failed to estimate gas fees')
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
    if (hash) {
      txHash.value = hash
      triggerRefresh()
    }
  } catch (e: any) {
    const msg = e?.message || e?.toString() || ''
    if (
      msg.toLowerCase().includes('user rejected') ||
      msg.toLowerCase().includes('rejected')
    ) {
      error.value = 'Transaction cancelled by user'
    } else {
      error.value = msg || 'Transaction failed'
    }
  } finally {
    sending.value = false
  }
}

function sendDeposit() {
  if (IS_PERPS_LIVE) {
    sendLiveDeposit()
  } else {
    sendSandboxDeposit()
  }
}
</script>

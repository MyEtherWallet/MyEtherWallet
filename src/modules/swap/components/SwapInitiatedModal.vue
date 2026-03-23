<template>
  <app-dialog
    v-model:is-open="model"
    class="sm:max-w-[420px] sm:mx-auto"
    :title="title"
  >
    <template #content>
      <div class="px-4 lg:px-6 pb-8 pt-2">
        <div class="flex flex-col items-center text-center">
          <div class="text-s-13 lg:text-s-16 text-info px-4 leading-p-160">
            {{ completedNote }}
            <div class="inline-flex align-middle">
              <app-blockie
                v-if="isBridge"
                :address="snapshot.toAddress"
                :size="5"
                class="inline-block mx-2 align-middle"
              />
              <a
                v-if="isBridge && snapshot.toChain?.blockExplorerAddr"
                :href="addressExplorerUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline cursor-pointer font-mono text-black text-s-13 lg:text-s-16 pr-1"
              >
                {{ truncateHash(snapshot.toAddress) }}
                <arrow-up-right-icon
                  class="w-3 h-3 inline-block align-middle text-black"
              /></a>
            </div>
            <span
              v-if="isBridge && !snapshot.toChain?.blockExplorerAddr"
              class="font-mono text-s-13 lg:text-s-16"
            >
              {{ truncateHash(snapshot.toAddress) }}
            </span>

            on {{ toTokenChain }}
          </div>

          <div class="flex flex-col gap-0 w-full mt-4 lg:mt-8">
            <!-- Progress -->
            <div
              class="flex items-end justify-center rounded-full mb-2 mx-auto"
            >
              <!-- Spinner / Status Icon -->
              <div class="mr-2">
                <svg
                  v-if="notificationStatus === 'sent'"
                  class="w-5 h-5 animate-spin text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="3"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <check-circle-icon
                  v-else-if="notificationStatus === 'confirmed'"
                  class="w-5 h-5 text-success"
                />
                <x-circle-icon
                  v-else-if="notificationStatus === 'failed'"
                  class="w-5 h-5 text-error"
                />
              </div>

              <!-- Status Text -->
              <span
                class="text-s-14 font-semibold"
                :class="{
                  'text-primary': notificationStatus === 'sent',
                  'text-success': notificationStatus === 'confirmed',
                  'text-error': notificationStatus === 'failed',
                }"
              >
                {{
                  notificationStatus === 'sent'
                    ? 'Pending'
                    : notificationStatus === 'confirmed'
                      ? 'Successful'
                      : notificationStatus === 'failed'
                        ? 'Failed'
                        : 'Pending'
                }}
              </span>
            </div>

            <div class="flex flex-col justify-start bg-mewBg p-4 rounded-20">
              <!-- From Row -->
              <div class="flex items-center gap-4">
                <div class="relative">
                  <app-token-logo
                    :url="fromTokenIcon"
                    :symbol="fromTokenSymbol"
                    :address="
                      snapshot.fromChain
                        ? {
                            address: fromTokenAddress,
                            network: snapshot.fromChain?.name,
                          }
                        : undefined
                    "
                    width="w-9 lg:w-12"
                    height="h-9 lg:h-12"
                  />
                  <div class="absolute -bottom-1 -right-1">
                    <app-token-logo
                      :url="fromTokenChainImg"
                      :symbol="fromTokenChain"
                      width="w-5"
                      height="h-5"
                    />
                  </div>
                </div>
                <div class="flex flex-col text-left">
                  <p
                    v-if="isBridge"
                    class="text-s-9 font-bold tracking-sp-06 uppercase text-info"
                  >
                    from {{ fromTokenChain }}
                  </p>
                  <p class="text-s-16 lg:text-s-20 font-bold leading-tight">
                    {{ formatFloatingPointValue(fromTokenAmount).value }}
                    <app-token-symbol
                      :symbol="fromTokenSymbol"
                      :address="
                        snapshot.fromChain
                          ? {
                              address: fromTokenAddress,
                              network: snapshot.fromChain?.name,
                            }
                          : undefined
                      "
                      class="inline-flex !text-s-16 !lg:text-s-20 !font-bold !leading-tight"
                    />
                  </p>
                  <p class="text-info text-s-14">${{ fromTokenAmountFiat }}</p>
                </div>
              </div>

              <!-- Divider Arrow -->
              <div class="flex justify-start my-2 lg:my-4 mx-[6px] lg:mx-3">
                <arrow-long-down-icon class="w-6 h-6" />
              </div>

              <!-- To Row -->
              <div class="flex items-center gap-4">
                <div class="relative">
                  <app-token-logo
                    :url="toTokenIcon"
                    :symbol="toTokenSymbol"
                    :address="
                      snapshot.toChain
                        ? {
                            address: toTokenAddress,
                            network: snapshot.toChain?.name,
                          }
                        : undefined
                    "
                    width="w-9 lg:w-12"
                    height="h-9 lg:h-12"
                  />
                  <div class="absolute -bottom-1 -right-1">
                    <app-token-logo
                      :url="toTokenChainImg"
                      :symbol="toTokenChain"
                      width="w-5"
                      height="h-5"
                    />
                  </div>
                </div>
                <div class="flex flex-col text-left">
                  <p
                    v-if="isBridge"
                    class="text-s-9 font-bold tracking-sp-06 uppercase text-info"
                  >
                    to {{ toTokenChain }}
                  </p>
                  <p class="text-s-16 lg:text-s-20 font-bold leading-tight">
                    {{ formatFloatingPointValue(toTokenAmount).value }}
                    <app-token-symbol
                      :symbol="toTokenSymbol"
                      :address="
                        snapshot.toChain
                          ? {
                              address: toTokenAddress,
                              network: snapshot.toChain?.name,
                            }
                          : undefined
                      "
                      class="inline-flex !text-s-16 !lg:text-s-20 !font-bold !leading-tight"
                    />
                  </p>
                  <p class="text-info text-s-14">${{ toTokenAmountFiat }}</p>
                </div>
              </div>
            </div>

            <!-- Transaction Info -->
            <div class="w-full my-5 px-2 lg:px-4">
              <div class="flex justify-between items-center">
                <span
                  class="text-s-11 uppercase tracking-sp-06 font-bold text-info"
                  >Transaction Hash</span
                >
                <div class="flex items-center gap-2">
                  <span class="text-s-12 font-mono truncate max-w-[150px]">
                    {{ truncatedTxHash }}
                  </span>
                  <app-btn-copy :copy-value="snapshot.txHash" class="-mr-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <p
            class="text-center text-s-13 lg:text-s-16 text-info px-4 leading-p-160"
          >
            You can close this window and
          </p>
          <app-base-button
            class="group border-2 mt-2 w-full"
            @click="openNotifications"
          >
            Track progress in notifications
          </app-base-button>

          <p class="text-center mt-4">
            <a
              v-if="blockExplorerUrl !== ''"
              :href="blockExplorerUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group underline inline-block"
              >or check block explorer
              <arrow-long-right-icon
                class="inline-block align-middle w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
              />
            </a>
          </p>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, watch, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import ethSvg from '@/assets/icons/tokens/eth.svg'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import { ArrowLongDownIcon } from '@heroicons/vue/24/solid'
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowLongRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/vue/24/solid'
import { useWalletStore } from '@/stores/walletStore'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { type Chain } from '@/mew_api/types'
import { type ProviderQuoteResponse } from '@enkryptcom/swap'
import { type HexPrefixedString } from '@/providers/types'
import { formatUnits } from 'viem'
import { useI18n } from 'vue-i18n'
import {
  useTradeOrdersStore,
  type NotificationBaseSwapBridge,
} from '@/stores/tradeOrdersStore'
import BigNumber from 'bignumber.js'
import {
  formatFiatValue,
  formatFloatingPointValue,
} from '@/utils/numberFormatHelper'

const { t } = useI18n()
const tradeOrdersStore = useTradeOrdersStore()
const walletStore = useWalletStore()
const appLayoutStore = useAppLayoutStore()
const { walletAddress } = storeToRefs(walletStore)
const { isNotificationsOpen } = storeToRefs(appLayoutStore)

const props = defineProps<{
  fromChain: Chain | undefined
  toChain: Chain | undefined
  selectedQuote: ProviderQuoteResponse | undefined
  txHash: HexPrefixedString
  toAddress: string
  fromAddress: string
}>()

const model = defineModel<boolean>('swapInitiatedOpen', {
  default: false,
  required: true,
})

// Local snapshot of props to prevent "Unknown" flash when parent resets values
const snapshot = reactive({
  fromChain: undefined as Chain | undefined,
  toChain: undefined as Chain | undefined,
  selectedQuote: undefined as ProviderQuoteResponse | undefined,
  txHash: '0x' as HexPrefixedString,
  toAddress: '',
  fromAddress: '',
})

const captureSnapshot = () => {
  snapshot.fromChain = props.fromChain
  snapshot.toChain = props.toChain
  snapshot.selectedQuote = props.selectedQuote
  snapshot.txHash = props.txHash
  snapshot.toAddress = props.toAddress
  snapshot.fromAddress = props.fromAddress
}

const clearSnapshot = () => {
  snapshot.fromChain = undefined
  snapshot.toChain = undefined
  snapshot.selectedQuote = undefined
  snapshot.txHash = '0x'
  snapshot.toAddress = ''
  snapshot.fromAddress = ''
}

// Open notifications and close modal
const openNotifications = () => {
  model.value = false
  isNotificationsOpen.value = true
}

// Truncated transaction hash
const truncatedTxHash = computed(() => {
  if (!snapshot.txHash) return ''
  if (snapshot.txHash.length <= 16) return snapshot.txHash
  return `${snapshot.txHash.slice(0, 8)}...${snapshot.txHash.slice(-8)}`
})

// Track notification status from store
const notificationStatus = computed(() => {
  if (!walletAddress.value || !snapshot.txHash) return 'sent'

  // Check swaps first
  const swapsList = tradeOrdersStore.getSwapsByAddress(walletAddress.value)
  const swap = swapsList.find(s => s.hash === snapshot.txHash)
  if (swap) return swap.status

  // Check bridges
  const bridgesList = tradeOrdersStore.getBridgesByAddress(walletAddress.value)
  const bridge = bridgesList.find(b => b.hash === snapshot.txHash)
  if (bridge) return bridge.status

  return 'sent'
})

const toTokenSymbol = computed(() => {
  return snapshot.selectedQuote?.quote.options.toToken.symbol || 'Unknown'
})

const toTokenAmount = computed(() => {
  return formatUnits(
    BigInt(snapshot.selectedQuote?.toTokenAmount.toString() || '0'),
    snapshot.selectedQuote?.quote.options.toToken.decimals ?? 18,
  )
})

const toTokenAmountFiat = computed(() => {
  const price = snapshot.selectedQuote?.quote.options.toToken.price ?? 0
  return formatFiatValue(
    BigNumber(toTokenAmount.value).multipliedBy(price).toFixed(6),
  ).value
})

const toTokenIcon = computed(() => {
  return snapshot.selectedQuote?.quote.options.toToken.logoURI || ethSvg
})

const toTokenChain = computed(() => {
  return snapshot.toChain?.nameLong || 'Unknown Chain'
})

const toTokenChainImg = computed(() => {
  return snapshot.toChain?.icon || ethSvg
})

const toTokenAddress = computed(() => {
  return snapshot.selectedQuote?.quote.options.toToken.address || ''
})

const fromTokenSymbol = computed(() => {
  return snapshot.selectedQuote?.quote.options.fromToken.symbol || 'Unknown Token'
})
const fromTokenAmount = computed(() => {
  return formatUnits(
    BigInt(snapshot.selectedQuote?.fromTokenAmount.toString() || '0'),
    snapshot.selectedQuote?.quote.options.fromToken.decimals ?? 18,
  )
})
const fromTokenAmountFiat = computed(() => {
  const price = snapshot.selectedQuote?.quote.options.fromToken.price ?? 0
  return formatFiatValue(
    BigNumber(fromTokenAmount.value).multipliedBy(price).toFixed(6),
  ).value
})

const fromTokenChain = computed(() => {
  return snapshot.fromChain?.name || 'Unknown Chain'
})
const fromTokenIcon = computed(() => {
  return snapshot.selectedQuote?.quote.options.fromToken.logoURI || ethSvg
})

const fromTokenChainImg = computed(() => {
  return snapshot.fromChain?.icon || ethSvg
})

const fromTokenAddress = computed(() => {
  return snapshot.selectedQuote?.quote.options.fromToken.address || ''
})

const blockExplorerUrl = computed(() => {
  return (
    snapshot.fromChain?.blockExplorerTX.replace('[[txHash]]', snapshot.txHash) || ''
  )
})

const addressExplorerUrl = computed(() => {
  return (
    snapshot.toChain?.blockExplorerAddr.replace('[[address]]', snapshot.toAddress) ||
    ''
  )
})

const isBridge = computed(() => {
  if (!snapshot.fromChain || !snapshot.toChain) return false
  return snapshot.fromChain.name !== snapshot.toChain.name
})

const title = computed(() => {
  return isBridge.value
    ? t('swap.initiated.bridge-initiated')
    : t('swap.initiated.swap-initiated')
})

const completedNote = computed(() => {
  const symbol = toTokenSymbol.value || 'the token'
  return isBridge.value
    ? t('swap.initiated.bridge-completed-note', { symbol })
    : t('swap.initiated.swap-completed-note', { symbol })
})

// Truncate hash
const truncateHash = (hash: string): string => {
  if (!hash) return ''
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

watch(
  () => model.value,
  (newValue: boolean) => {
    if (newValue) {
      // Capture snapshot of props when modal opens
      captureSnapshot()
    } else {
      // Clear snapshot when modal closes
      clearSnapshot()
    }

    if (newValue && snapshot.selectedQuote) {
      // Add swap or bridge notification based on cross-chain status
      const fromChain = snapshot.fromChain
      const toChain = snapshot.toChain
      const isBridge = fromChain?.chainID !== toChain?.chainID

      if (fromChain && toChain) {
        const createdAt = Math.floor(Date.now() / 1000)
        const hashLink = blockExplorerUrl.value
        const addressLink = addressExplorerUrl.value
        const shared: NotificationBaseSwapBridge = {
          status: 'sent',
          hash: snapshot.txHash,
          fromAddress: snapshot.fromAddress,
          toAddress: snapshot.toAddress,
          fromAmount: fromTokenAmount.value,
          fromUsdValue: fromTokenAmountFiat.value,
          fromSymbol: fromTokenSymbol.value,
          fromTokenIcon: fromTokenIcon.value,
          fromTokenAddress: fromTokenAddress.value,
          toAmount: toTokenAmount.value,
          toUsdValue: toTokenAmountFiat.value,
          toSymbol: toTokenSymbol.value,
          toTokenIcon: toTokenIcon.value,
          toTokenAddress: toTokenAddress.value,
          blockExplorerUrl: hashLink,
          fromChainId: fromChain.chainID || '',
          fromChainName: fromChain.nameLong,
          fromChainIcon: fromChain.icon,
          fromChainSymbol: fromChain.currencyName,
          createdAt,
        }
        if (isBridge) {
          // Add bridge notification (cross-chain)
          tradeOrdersStore.addBridge({
            ...shared,
            type: 'bridge',
            toChainId: toChain.chainID || '',
            toChainName: toChain.nameLong,
            toChainIcon: toChain.icon,
            toChainSymbol: toChain.currencyName,
            destinationBlockExplorerAddressUrl: addressLink,
          })
        } else {
          // Add swap notification (same chain)
          tradeOrdersStore.addSwap({
            ...shared,
            type: 'swap',
          })
        }
      }
    }
  },
)
</script>

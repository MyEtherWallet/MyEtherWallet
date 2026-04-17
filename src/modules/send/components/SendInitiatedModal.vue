<template>
  <app-dialog
    v-model:is-open="model"
    class="sm:max-w-[420px] sm:mx-auto"
    :title="t('send.initiated.title')"
  >
    <template #content>
      <div class="px-4 lg:px-6 pb-8 pt-2">
        <div class="flex flex-col items-center text-center">
          <div class="text-s-13 lg:text-s-16 text-info px-4 leading-p-160">
            {{ t('send.initiated.completed-note', { symbol: displayTokenSymbol }) }}
            <div class="inline-flex align-middle">
              <app-blockie
                :address="snapshot.toAddress"
                :size="5"
                class="inline-block mx-2 align-middle"
              />
              <a
                v-if="snapshot.chain?.blockExplorerAddr"
                :href="addressExplorerUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline cursor-pointer font-mono text-black text-s-13 lg:text-s-16 pr-1"
              >
                {{ truncateHash(snapshot.toAddress) }}
                <arrow-up-right-icon
                  class="w-3 h-3 inline-block align-middle text-black"
              /></a>
              <span
                v-else
                class="font-mono text-s-13 lg:text-s-16"
              >
                {{ truncateHash(snapshot.toAddress) }}
              </span>
            </div>
            {{ t('send.initiated.on-chain', { chain: chainName }) }}
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
                    ? t('send.initiated.status.pending')
                    : notificationStatus === 'confirmed'
                      ? t('send.initiated.status.successful')
                      : notificationStatus === 'failed'
                        ? t('send.initiated.status.failed')
                        : t('send.initiated.status.pending')
                }}
              </span>
            </div>

            <div class="flex flex-col justify-start bg-mewBg p-4 rounded-20">
              <!-- Token Row -->
              <div class="flex items-center gap-4">
                <div class="relative">
                <app-token-logo
                    :url="displayTokenIcon"
                    :symbol="displayTokenSymbol"
                    :address="
                      snapshot.chain
                        ? {
                            address: snapshot.tokenAddress,
                            network: snapshot.chain?.name,
                          }
                        : undefined
                    "
                    width="w-9 lg:w-12"
                    height="h-9 lg:h-12"
                  />
                  <div class="absolute -bottom-1 -right-1">
                    <app-token-logo
                      :url="chainIcon"
                      :symbol="chainName"
                      width="w-5"
                      height="h-5"
                    />
                  </div>
                </div>
                <div class="flex flex-col text-left">
                  <p class="text-s-16 lg:text-s-20 font-bold leading-tight">
                    {{ formatFloatingPointValue(snapshot.amount).value }}
                    <app-token-symbol
                      :symbol="displayTokenSymbol"
                      :address="
                        snapshot.chain
                          ? {
                              address: snapshot.tokenAddress,
                              network: snapshot.chain?.name,
                            }
                          : undefined
                      "
                      class="inline-flex !text-s-16 lg:!text-s-20 !font-bold !leading-tight"
                    />
                  </p>
                  <p class="text-info text-s-14">${{ displayAmountFiat }}</p>
                </div>
              </div>

              <!-- Divider Arrow -->
              <div class="flex justify-start my-2 lg:my-4 mx-[6px] lg:mx-3">
                <arrow-long-down-icon class="w-6 h-6" />
              </div>

              <!-- To Address Row -->
              <div class="flex items-center gap-4">
                <div class="relative">
                  <img
                    :src="createIcon(snapshot.toAddress)"
                    alt=""
                    class="w-9 lg:w-12 h-9 lg:h-12 rounded-full overflow-hidden shadow-token bg-white p-0.5"
                  />
                  <div class="absolute -bottom-1 -right-1">
                    <app-token-logo
                      :url="chainIcon"
                      :symbol="chainName"
                      width="w-5"
                      height="h-5"
                    />
                  </div>
                </div>
                <div class="flex flex-col text-left">
                  <p class="text-s-16 lg:text-s-20 font-bold leading-tight font-mono">
                    {{ truncateHash(snapshot.toAddress) }}
                  </p>
                  <p class="text-info text-s-14">{{ t('send.initiated.on-chain', { chain: chainName }) }}</p>
                </div>
              </div>
            </div>

            <!-- Transaction Info -->
            <div class="w-full my-5 px-2 lg:px-4">
              <div class="flex justify-between items-center">
                <span
                  class="text-s-11 uppercase tracking-sp-06 font-bold text-info"
                  >{{ t('send.initiated.tx-hash') }}</span
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
            {{ t('send.initiated.close-window') }}
          </p>
          <app-base-button
            class="group border-2 mt-2 w-full"
            @click="openNotifications"
          >
            {{ t('send.initiated.track-progress') }}
          </app-base-button>

          <p class="text-center mt-4">
            <a
              v-if="blockExplorerUrl !== ''"
              :href="blockExplorerUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group underline inline-block"
              >{{ t('send.initiated.check-explorer') }}
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
import { useI18n } from 'vue-i18n'
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
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { type Chain } from '@/mew_api/types'
import { type HexPrefixedString } from '@/providers/types'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import {
  formatFiatValue,
  formatFloatingPointValue,
} from '@/utils/numberFormatHelper'
import createIcon from '@/providers/ethereum/blockies'

const { t } = useI18n()
const tradeOrdersStore = useTradeOrdersStore()
const appLayoutStore = useAppLayoutStore()
const { isNotificationsOpen } = storeToRefs(appLayoutStore)

const props = defineProps<{
  chain: Chain | undefined
  txHash: HexPrefixedString
  toAddress: string
  fromAddress: string
  amount: string
  amountFiat: string
  tokenSymbol: string
  tokenIcon: string
  tokenAddress: string
}>()

const model = defineModel<boolean>('sendInitiatedOpen', {
  default: false,
  required: true,
})

// Local snapshot of props to prevent flash when parent resets values
const snapshot = reactive({
  chain: undefined as Chain | undefined,
  txHash: '0x' as HexPrefixedString,
  toAddress: '',
  fromAddress: '',
  amount: '',
  amountFiat: '',
  tokenSymbol: '',
  tokenIcon: '',
  tokenAddress: '',
})

const captureSnapshot = () => {
  snapshot.chain = props.chain
  snapshot.txHash = props.txHash
  snapshot.toAddress = props.toAddress
  snapshot.fromAddress = props.fromAddress
  snapshot.amount = props.amount
  snapshot.amountFiat = props.amountFiat
  snapshot.tokenSymbol = props.tokenSymbol
  snapshot.tokenIcon = props.tokenIcon
  snapshot.tokenAddress = props.tokenAddress
}

const clearSnapshot = () => {
  snapshot.chain = undefined
  snapshot.txHash = '0x'
  snapshot.toAddress = ''
  snapshot.fromAddress = ''
  snapshot.amount = ''
  snapshot.amountFiat = ''
  snapshot.tokenSymbol = ''
  snapshot.tokenIcon = ''
  snapshot.tokenAddress = ''
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
  if (!snapshot.fromAddress || !snapshot.txHash) return 'sent'

  const txList = tradeOrdersStore.getTransactionsByAddress(snapshot.fromAddress)
  const tx = txList.find(t => t.hash === snapshot.txHash)
  if (tx) return tx.status

  return 'sent'
})

const displayTokenSymbol = computed(() => {
  return snapshot.tokenSymbol || 'Unknown'
})

const displayTokenIcon = computed(() => {
  return snapshot.tokenIcon || ethSvg
})

const displayAmountFiat = computed(() => {
  return formatFiatValue(snapshot.amountFiat || '0').value
})

const chainName = computed(() => {
  return snapshot.chain?.nameLong || 'Unknown Chain'
})

const chainIcon = computed(() => {
  return snapshot.chain?.icon || ethSvg
})

const blockExplorerUrl = computed(() => {
  return (
    snapshot.chain?.blockExplorerTX?.replace('[[txHash]]', snapshot.txHash) || ''
  )
})

const addressExplorerUrl = computed(() => {
  return (
    snapshot.chain?.blockExplorerAddr?.replace('[[address]]', snapshot.toAddress) ||
    ''
  )
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
  },
)
</script>

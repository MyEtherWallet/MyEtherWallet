<template>
  <div>
    <!-- Supported Chains -->
    <div
      v-if="!isLoading && supportedChains?.length"
      :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 py-6']"
    >
      <h3 class="text-s-20 xs:text-s-24 font-bold mb-2">{{ $t('crypto.supported_chains') }}</h3>
      <div class="max-h-[420px] overflow-y-auto pr-2 mew-scrollbar">
        <div
          v-for="i in supportedChains"
          :key="i.chainName"
          class="flex items-center justify-start py-3 -ml-1 pl-1 gap-5 max-w-[360px]"
        >
          <div class="flex items-center">
            <div class="relative mr-4 shrink-0">
              <app-token-logo
                :url="i.iconUrl"
                :symbol="i.chainName"
                width="w-7 xl:w-9"
                height="h-7 xl:h-9"
              />
              <div
                class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
              >
                <app-token-logo
                  :url="tokenIconUrl"
                  :symbol="tokenSymbol"
                  :address="
                    i.contract
                      ? { address: i.contract, network: i.chainName }
                      : undefined
                  "
                  width="w-4 xl:w-5"
                  height="h-4 xl:h-5"
                />
              </div>
            </div>
            <div class="flex flex-col min-w-0">
              <h4 class="text-s-16 font-medium truncate">
                {{ i.chainNameLong || i.chainName }}
              </h4>
              <div class="flex items-center gap-1.5 min-w-0">
                <p
                  v-if="i.contract && i.contract !== 'N/A'"
                  class="text-info text-s-12 tracking-sp-06 truncate max-w-[120px] xs:max-w-[200px]"
                >
                  {{ truncateAddress(i.contract, 8) }}
                </p>
                <p v-else class="text-info text-s-12 tracking-sp-06 italic">
                  {{ $t('crypto.native_token') }}
                </p>
                <app-btn-copy
                  v-if="i.contract && i.contract !== 'N/A'"
                  :copy-value="i.contract"
                  width="w-6"
                  height="h-6"
                  icon-class="w-3.5 h-3.5"
                  class="hoverNoBG"
                />
              </div>
            </div>
          </div>
          <div
            v-if="selectedChain?.name === i.chainName"
            class="shrink-0 flex items-center bg-primary/10 px-[6px] py-1 rounded-full border border-primary/20"
          >
            <span
              class="uppercase text-[8px] font-bold text-primary leading-none tracking-sp-06"
            >
              {{ $t('crypto.current_chain') }}
            </span>
          </div>
          <app-base-button
            v-else-if="!isStockView && canBridge(i)"
            size="small"
            class="shrink-0 hidden sm:block ml-auto"
            @click="bridgeBtn(i)"
          >
            {{ $t('crypto.bridge') }}
          </app-base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnCopy from '@components/AppBtnCopy.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import { type PropType } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import AppTokenLogo from '@components/AppTokenLogo.vue'
import { truncateAddress } from '@/utils/filters'
import { type TokenSupportedChain } from '@/mew_api/types'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
  supportedChains: {
    type: Array as PropType<TokenSupportedChain[] | undefined>,
    required: false,
  },
  tokenSymbol: {
    type: String,
  },
  tokenIconUrl: {
    type: String,
  },
  isStockView: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const emit = defineEmits<{
  bridgeToChain: [chain: TokenSupportedChain]
}>()

const bridgeBtn = (chain: TokenSupportedChain) => {
  emit('bridgeToChain', chain)
}

const canBridge = (chain: TokenSupportedChain): boolean => {
  return chainsStore.chainHasSwapSupport(chain.chainName)
}
</script>

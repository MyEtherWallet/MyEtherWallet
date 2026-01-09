<template>
  <div>
    <hr
      v-if="!isLoading && tokenData?.supportedChains?.length"
      class="h-px bg-grey-10 border-0 w-full my-5"
    />
    <!-- Supported Chains -->
    <div
      v-if="!isLoading && tokenData?.supportedChains?.length"
      class="px-3 xs:px-6 md:px-4 md:px-4 lg:px-10 mb-5"
    >
      <h3 class="text-s-20 font-bold mb-2">Supported Chains</h3>
      <div
        v-for="i in tokenData.supportedChains"
        :key="i.chainName"
        class="flex items-center justify-between py-3 border-b border-grey-5 last:border-0"
      >
        <div class="flex items-center">
          <div class="relative mr-4 shrink-0">
            <app-token-logo
              :url="tokenData.iconUrl"
              :symbol="tokenData.symbol"
              width="w-10"
              height="h-10"
            />
            <app-token-logo
              :url="i.iconUrl"
              :symbol="i.chainName"
              width="w-5"
              height="h-5"
              class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 border-2 border-white rounded-full bg-white"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <h4 class="text-s-16 font-bold truncate">
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
                Native Token
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
          class="shrink-0 flex items-center bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20"
        >
          <span
            class="uppercase text-[10px] font-bold text-primary leading-none"
          >
            current chain
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import { type PropType } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { truncateAddress } from '@/utils/filters'
import { type GetWebTokenInfo } from '@/mew_api/types'

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
  tokenData: {
    type: Object as PropType<GetWebTokenInfo | null>,
    required: false,
  },
})

const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
</script>

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
        class="flex items-center justify-start py-2 max-w-[360px]"
      >
        <div class="relative mr-4">
          <app-blockie :address="i.contract || ''" :scale="8" class="" />
          <app-token-logo
            v-if="selectedChain"
            :url="selectedChain.icon"
            :symbol="i.chainName"
            width="w-4"
            height="h-4"
            class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
          />
        </div>
        <div>
          <p class="text-s-16 font-medium leading-p-100 capitalize">
            {{ i.chainName.toLowerCase() }}
          </p>
          <div class="flex items-center gap-[2px]">
            <p class="text-info text-s-12 tracking-sp-06 truncate w-[170px]">
              {{ truncateAddress(i.contract || '', 16) }}
            </p>
            <app-btn-copy
              :text="i.contract || ''"
              class="ml-2"
              width="w-7"
              height="h-7"
              icon-class="w-4 h-4"
            />
            <span
              v-if="selectedChain?.name === i.chainName"
              class="uppercase text-s-8 text-primary"
            >
              current chain
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import AppBlockie from '@/components/AppBlockie.vue'
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

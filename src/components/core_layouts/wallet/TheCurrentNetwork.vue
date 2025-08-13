<template>
  <!-- App Select Chain -->
  <select-chain-for-app :has-label="false">
    <template #network-button="{ openNetworkDialog, selectedChain }">
      <button
        class="hoverNoBG p-1 xs:py-2 xs:px-3 rounded-[24px] xs:rounded-full max-w-[178px] shadow-button shadow-button-elevated"
        @click="openNetworkDialog(true)"
      >
        <div v-if="selectedChain" class="flex items-center">
          <img
            v-if="selectedChain.icon"
            :src="selectedChain.icon"
            alt=""
            :class="['w-6 h-6 mr-1', 'rounded-full object-contain flex-none']"
            height="32"
            width="32"
          />
          <div v-if="!isXS" class="ml-1 pr-1 min-w-[30px]">
            <p
              class="text-ellipsis truncate font-medium text-sm overflow-hidden text-left"
            >
              {{ selectedChain.nameLong }}
            </p>
          </div>
          <chevron-down-icon
            class="flex-none w-3 h-3 xs:w-4 xs:h-4 ml-auto xs:mr-1"
          />
        </div>
      </button>
    </template>
  </select-chain-for-app>
</template>
<script setup lang="ts">
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

const { isXS } = useAppBreakpoints()
</script>

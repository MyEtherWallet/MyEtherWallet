<template>
  <!-- App Select Chain -->
  <select-chain-for-app :has-label="false">
    <template #network-button="{ openNetworkDialog, selectedChain }">
      <button
        class="hoverNoBG p-1 xs:py-2 xs:px-3 rounded-[24px] xs:rounded-full max-w-[178px] shadow-button shadow-button-elevated"
        @click="openNetworkDialog(true)"
      >
        <div
          v-if="selectedChain"
          class="flex items-center"
          :class="{ 'justify-center': isIconOnly }"
        >
          <img
            v-if="selectedChain.icon"
            :src="selectedChain.icon"
            alt=""
            :class="[
              isIconOnly ? 'w-6 h-6' : 'w-6 h-6 mr-1',
              'rounded-full object-contain flex-none',
            ]"
            height="32"
            width="32"
          />
          <div v-if="!isIconOnly" class="ml-1 pr-1 min-w-[30px]">
            <p
              class="text-ellipsis truncate font-medium text-sm overflow-hidden text-left"
            >
              {{ selectedChain.nameLong }}
            </p>
          </div>
          <chevron-down-icon
            class="flex-none w-3 h-3 xs:w-4 xs:h-4"
            :class="isIconOnly ? 'ml-0.5' : 'ml-auto xs:mr-1'"
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
import { computed } from 'vue'

/**
 * @compact When true, force the icon-only layout (no chain name) — the same
 * collapsed look the mobile `isXS` breakpoint produces. Used to reclaim header
 * space when the wallet is disconnected and the bar would otherwise cut off.
 */
const props = defineProps<{ compact?: boolean }>()

const { isXS } = useAppBreakpoints()

/**
 * Icon-only layout: the chain name is hidden and only the logo + chevron show.
 * Happens on mobile (`isXS`) or when the header forces `compact`. In this state
 * the chevron must hug the icon — `ml-auto` (used in the expanded layout to push
 * the chevron past the name) would otherwise fling it to the button edge and
 * make it look detached.
 */
const isIconOnly = computed<boolean>(() => isXS.value || props.compact === true)
</script>

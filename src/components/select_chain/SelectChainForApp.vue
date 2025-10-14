<template>
  <div>
    <slot
      name="network-button"
      :openNetworkDialog="setOpenDialog"
      :selectedChain="selectedChain"
      :filterChainType="true"
    >
      <app-btn-group
        v-if="isBtnGroup"
        v-model:selected="selectedChain"
        :btn-list="shownChains"
        :use-emit-only="true"
        :is-loaded="isLoadedChains"
        size="large"
        @onUpdate:selected="setSelectedChain"
      >
        <template #btn-content="{ data }">
          <div class="flex items-center">
            <img
              :src="data.icon"
              alt=""
              class="w-7 h-7 mr-2 rounded-full object-contain"
              height="32"
              width="32"
            />
            <span class="mr-2"> {{ data.nameLong }}</span>
          </div>
        </template>
        <template #custom>
          <button
            class="h-10 text-s-17 py-2 px-4 rounded-full bg-transparent font-medium hoverNoBG min-w-[89px]"
            @click="setOpenDialog(true)"
          >
            <div class="flex items-center justify-center capitalize">
              <span>{{ $t('common.more') }}</span>
              <chevron-down-icon class="text-info w-4 h-4 ml-1" />
            </div>
          </button>
        </template>
      </app-btn-group>
      <button
        v-else
        class="bg-white hoverNoBG py-2 px-3 rounded-16 w-full shadow-button shadow-button-elevated"
        @click="setOpenDialog(true)"
      >
        <div v-if="selectedChain" class="flex items-center">
          <img
            v-if="selectedChain.icon"
            :src="selectedChain.icon"
            alt=""
            class="w-8 h-8 mr-2 rounded-full object-contain flex-none"
            height="32"
            width="32"
          />
          <div class="ml-1 pr-1 min-w-[30px]">
            <p class="text-info text-left text-s-12 leading-[16px] capitalize">
              {{ $t('common.network') }}
            </p>
            <p
              class="text-ellipsis truncate font-medium text-sm overflow-hidden text-left"
            >
              {{ selectedChain.nameLong }}
            </p>
          </div>
          <chevron-down-icon class="flex-none w-4 h-4 ml-auto mr-1" />
        </div>
      </button>
    </slot>
    <!-- Dialog with chains list -->
    <select-chain-dialog
      v-if="isLoadedChains"
      v-model:is-open="openDialog"
      :selected-chain="selectedChain"
      :filter-chain-type="isBtnGroup ? isBtnGroup : filterChainType"
      @update:chain="setSelectedChain"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { type Chain } from '@/mew_api/types'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppBtnGroup from '@components/AppBtnGroup.vue'
import SelectChainDialog from './SelectChainDialog.vue'
import { useGlobalStore } from '@/stores/globalStore'

const prop = defineProps({
  isBtnGroup: {
    type: Boolean,
    default: false,
  },
  passedChains: {
    type: Array as () => Chain[],
    default: () => [],
  },
  canStore: {
    type: Boolean,
    default: true,
  },
  filterChainType: {
    type: Boolean,
    default: false,
  },
  preselectedChain: {
    type: Object as () => Chain | null,
    default: null,
  },
})
const defaults = ['ETHEREUM', 'BITCOIN', 'SOLANA']
const emits = defineEmits(['update:selectedChain'])
const selectedChain = ref<Chain | null>(null)
const defaultChains = ref<Chain[]>([])

const globalStore = useGlobalStore()
const { selectedNetwork: selectedChainStore } = storeToRefs(globalStore)
const { setSelectedNetwork: setSelectedChainStore } = globalStore
const chainsStore = useChainsStore()
const {
  chains,
  isLoaded: isLoadedChains,
  selectedChain: storedSelectedChain,
} = storeToRefs(chainsStore)
const lastSelectedChain = ref<Chain | null>(null)

const displayedChains = computed(() => {
  return prop.passedChains.length > 0 ? prop.passedChains : chains.value
})

const selectedIsDefault = computed(() => {
  return defaultChains.value.some(
    chain => chain.name === selectedChain.value?.name,
  )
})

const shownChains = computed<Chain[]>(() => {
  if (
    (selectedIsDefault.value && lastSelectedChain.value === null) ||
    selectedChain.value === null
  ) {
    return defaultChains.value
  }
  if (selectedIsDefault.value && lastSelectedChain.value) {
    return [...defaultChains.value, lastSelectedChain.value]
  }
  return [...defaultChains.value, selectedChain.value]
})

watch(
  isLoadedChains,
  newVal => {
    if (newVal) {
      defaults.forEach(defaultChainName => {
        const defaultChain = chains.value.find(
          chain => chain.name === defaultChainName,
        )
        if (defaultChain) {
          defaultChains.value.push(defaultChain)
        }
      })
      const preselected = displayedChains.value.find(
        chain => chain.name === prop.preselectedChain?.name,
      )
      selectedChain.value = preselected ?? defaultChains.value[0] ?? null
      if (!prop.canStore) {
        emits('update:selectedChain', selectedChain.value)
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  // If preselected chain is provided, set it as selected
  if (prop.preselectedChain) {
    const preselected = displayedChains.value.find(
      chain => chain.name === prop.preselectedChain?.name,
    )
    if (preselected) {
      selectedChain.value = preselected
      if (prop.canStore) {
        setSelectedChainStore(preselected.name)
      } else {
        emits('update:selectedChain', preselected)
      }
    }
  } else {
    selectedChain.value = storedSelectedChain.value ?? null
  }
})

/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = ref(false)
const setOpenDialog = (value: boolean) => {
  openDialog.value = value
}

/**
 * @description Set the selected chain in component and store, closes the dialog if open
 * @param chain - The chain to set as selected
 * @returns void
 */
const setSelectedChain = (chain: Chain) => {
  if (chain.name !== selectedChain.value?.name) {
    if (!selectedIsDefault.value) {
      lastSelectedChain.value = selectedChain.value
    }

    selectedChain.value = chain
    if (prop.canStore) {
      setSelectedChainStore(chain.name)
    } else {
      emits('update:selectedChain', chain)
    }
  } else {
    emits('update:selectedChain', chain)
  }

  if (openDialog.value) {
    setOpenDialog(false)
  }
}

watch(
  () => selectedChainStore.value,
  (newChain: string) => {
    if (!prop.preselectedChain) {
      const chain = displayedChains.value.find(c => c.name === newChain)
      if (chain) setSelectedChain(chain)
    }
  },
)
</script>

<template>
  <div>
    <slot
      name="network-button"
      :openNetworkDialog="setOpenDialog"
      :selectedChain="selectedChain"
    >
      <app-btn-group
        v-if="isBtnGroup"
        v-model:selected="selectedChain"
        :btn-list="shownChains"
        :use-emit-only="true"
        :is-loaded="isLoadedChains"
        is-tall
        @onUpdate:selected="setSelectedChain"
      >
        <template #btn-content="{ data }">
          <div class="flex items-center">
            <img
              :src="data.icon"
              alt=""
              class="w-8 h-8 mr-3 rounded-full object-contain"
              height="32px"
              width="32px"
            />
            <span class="mr-2"> {{ data.nameLong }}</span>
          </div>
        </template>
        <template #custom>
          <button
            class="min-h-12 text-s-17 px-4 py-2 rounded-full bg-transparent font-medium hoverNoBG min-w-[89px]"
            @click="setOpenDialog(true)"
          >
            <div class="flex items-center capitalize">
              <span>{{ $t('common.more') }}</span>
              <chevron-down-icon class="text-info w-4 h-4 ml-1" />
            </div>
          </button>
        </template>
      </app-btn-group>
      <button
        v-else
        class="hoverNoBG py-2 px-3 rounded-16 w-full shadow-button shadow-button-elevated"
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
    <app-dialog
      v-if="isLoadedChains"
      v-model:is-open="openDialog"
      title="Select Chain"
      class="xs:max-w-[428px] sm:mx-auto"
    >
      <template #content>
        <div class="h-[95vh] sm:h-[500px] !overflow-y-scroll">
          <!-- Seacrh -->
          <div class="sticky top-0 bg-white z-10">
            <div class="px-5 mb-1">
              <app-search-input
                v-model="searchInput"
                class="grow"
                placeholder="Search by Name"
              />
            </div>
            <hr class="h-px bg-grey-outline border-0 w-full" />
          </div>
          <!-- Seacrh Result-->
          <div v-if="searchResults.length" class="flex flex-col px-2 mt-2">
            <button
              v-for="chain in searchResults"
              :key="chain.name"
              class="flex items-center justify-between px-5 py-3 cursor-pointer hoverNoBG rounded-12 box-border"
              :class="{ 'bg-grey-5': chain.name === selectedChain?.name }"
              @click="setSelectedChain(chain)"
            >
              <div class="flex justify-between items-center w-full">
                <div class="flex items-center">
                  <img
                    v-if="chain.icon"
                    class="mr-4 w-7 h-7 rounded-full overflow-hidden"
                    :src="chain.icon"
                    alt="token icon"
                  />
                  <span>{{ chain.nameLong }}</span>
                </div>
                <check-icon
                  v-if="chain.name === selectedChain?.name"
                  class="w-6 h-6 text-primary"
                />
              </div>
            </button>
          </div>
          <!-- Search not found-->
          <div v-else>
            <div class="flex justify-center mt-10 h-[400px] text-info">
              <p>{{ $t('common.not_found.chains') }}</p>
            </div>
          </div>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { type Chain } from '@/mew_api/types'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from './AppSearchInput.vue'
import AppBtnGroup from './AppBtnGroup.vue'
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
  sameType: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:selectedChain'])

const defaults = ['ETHEREUM', 'BITCOIN', 'SOLANA']
const selectedChain = ref<Chain | null>(null)
const defaultChains = ref<Chain[]>([])

const globalStore = useGlobalStore()
const { selectedNetwork: selectedChainStore } = storeToRefs(globalStore)
const { setSelectedNetwork: setSelectedChainStore } = globalStore
const chainsStore = useChainsStore()
const {
  chains,
  isLoaded: isLoadedChains,
  selectedChain: storeSelectedChain,
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

/**
 * @description Watch for the chains to be loaded and set the default chains and selected chain
 */
watch(
  () => isLoadedChains.value,
  () => {
    if (isLoadedChains.value) {
      defaults.forEach(chainName => {
        const chain = displayedChains.value.find(c => c.name === chainName)
        if (chain) {
          defaultChains.value.push(chain)
        }
      })
      const preselected = displayedChains.value.find(
        chain => chain.name === selectedChainStore.value,
      )
      selectedChain.value = preselected ?? defaultChains.value[0]
      if (!prop.canStore) {
        emits('update:selectedChain', selectedChain.value)
      }
    }
  },
  { immediate: true },
)

/** -------------------------------
 * Search
 -------------------------------*/
const searchInput = ref('')
const searchResults = computed(() => {
  const chainsToSearch = !prop.sameType
    ? displayedChains.value
    : displayedChains.value.filter(chain => {
        return chain.type === storeSelectedChain.value?.type
      })

  if (!searchInput.value || searchInput.value === '') {
    if (!selectedChain.value) {
      return chainsToSearch
    }
    const unique = new Set([selectedChain.value, ...chainsToSearch])
    return [...unique]
  }
  const beginsWith = chainsToSearch.filter(chain => {
    return chain.nameLong
      .toLowerCase()
      .startsWith(searchInput.value.toLowerCase())
  })
  const other = chainsToSearch.filter(chain => {
    return chain.nameLong
      .toLowerCase()
      .includes(searchInput.value.toLowerCase())
  })
  const unique = new Set([...beginsWith, ...other])
  return [...unique]
})
</script>

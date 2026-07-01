<template>
  <div class="flex flex-col gap-4">
    <!-- Header: back + title -->
    <div class="flex items-center gap-2">
      <button
        data-test="net-back"
        class="flex items-center justify-center w-6 h-6"
        @click="$emit('back')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
        </svg>
      </button>
      <span class="text-s-16 font-normal leading-[22px] text-black">
        {{ $t('multi_address.network_title') }}
      </span>
    </div>

    <!-- Search -->
    <input
      data-test="net-search"
      v-model="search"
      type="text"
      :placeholder="$t('multi_address.network_search')"
      class="w-full border border-grey-10 rounded-full px-4 py-2 text-s-14"
    />

    <!-- Compatible chains -->
    <div class="flex flex-col gap-1">
      <button
        v-for="chain in compatible"
        :key="chain.name"
        data-test="net-compatible"
        class="flex items-center justify-between px-4 py-3 rounded-20 cursor-pointer transition-colors hover:bg-grey-faded"
        @click="apply(chain)"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="chain.icon"
            :src="chain.icon"
            alt=""
            aria-hidden="true"
            class="w-8 h-8 rounded-full object-contain bg-white"
          />
          <div v-else class="w-8 h-8 rounded-full bg-surface" />
          <span class="text-s-16 text-black">{{ chain.nameLong }}</span>
        </div>
        <svg
          v-if="chain.name === chainsStore.selectedChain?.name"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5 text-primary"
        >
          <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Incompatible section -->
    <div v-if="incompatible.length">
      <p class="text-s-12 font-bold uppercase text-info px-4 py-1">
        {{ $t('select_chain.incompatible_title') }}
      </p>
      <div
        v-for="chain in incompatible"
        :key="chain.name"
        data-test="net-incompatible"
        class="flex items-center gap-3 px-4 py-3 rounded-20 opacity-50 cursor-not-allowed"
        @click="() => {}"
      >
        <img
          v-if="chain.icon"
          :src="chain.icon"
          alt=""
          aria-hidden="true"
          class="w-8 h-8 rounded-full object-contain bg-white"
        />
        <div v-else class="w-8 h-8 rounded-full bg-surface" />
        <span class="text-s-16 text-black">{{ chain.nameLong }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletStore } from '@/stores/walletStore'
import { useGlobalStore } from '@/stores/globalStore'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'selected'): void
}>()

const chainsStore = useChainsStore()
const walletStore = useWalletStore()
const globalStore = useGlobalStore()

const search = ref('')

const filterBySearch = <T extends { nameLong: string }>(list: T[]): T[] => {
  if (!search.value) return list
  const q = search.value.toLowerCase()
  const beginsWith = list.filter(c => c.nameLong.toLowerCase().startsWith(q))
  const includes = list.filter(c => c.nameLong.toLowerCase().includes(q))
  return [...new Set([...beginsWith, ...includes])]
}

const compatible = computed(() => {
  const allChains = chainsStore.chains
  let base: typeof allChains

  if (walletStore.isWalletConnected && walletStore.walletName !== 'Enkrypt') {
    const type = chainsStore.selectedChain?.type
    base = type ? allChains.filter(c => c.type === type) : allChains
  } else {
    base = allChains
  }

  return filterBySearch(base)
})

const incompatible = computed(() => {
  if (walletStore.isWalletConnected && walletStore.walletName !== 'Enkrypt') {
    const allChains = chainsStore.chains
    const type = chainsStore.selectedChain?.type
    const other = type ? allChains.filter(c => c.type !== type) : []
    return filterBySearch(other)
  }
  return []
})

const apply = (chain: { name: string }): void => {
  globalStore.setSelectedNetwork(chain.name)
  emit('selected')
}
</script>

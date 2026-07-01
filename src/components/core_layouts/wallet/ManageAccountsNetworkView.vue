<template>
  <div class="flex flex-col gap-4">
    <!-- Header: back button + centered title + invisible spacer -->
    <div class="flex items-center gap-1 w-full">
      <button
        data-test="net-back"
        class="w-10 h-10 flex items-center justify-center rounded-[24px] shrink-0"
        @click="$emit('back')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path
            fill-rule="evenodd"
            d="M15.75 4.5a.75.75 0 0 1 0 1.06L10.81 10.5l4.94 4.94a.75.75 0 1 1-1.06 1.06l-5.5-5.5a.75.75 0 0 1 0-1.06l5.5-5.5a.75.75 0 0 1 1.06 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <span class="flex-1 text-center text-s-16 font-semibold text-black tracking-[-0.32px]">
        {{ $t('multi_address.network_title') }}
      </span>
      <!-- Invisible spacer to optically center the title -->
      <div class="w-10 h-10 shrink-0 invisible" aria-hidden="true" />
    </div>

    <!-- Search + list -->
    <div class="flex flex-col gap-4">
      <!-- Filled grey search bar -->
      <div class="flex items-center gap-2.5 h-10 px-2.5 rounded-[24px] bg-[#e6e6e6] w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5 text-[#767676] shrink-0"
        >
          <path
            fill-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          data-test="net-search"
          v-model="search"
          type="text"
          :placeholder="$t('multi_address.network_search')"
          class="bg-transparent outline-none border-0 w-full text-s-14 text-black placeholder:text-[#767676]"
        />
      </div>

      <!-- Chain list -->
      <div class="flex flex-col gap-1">
        <!-- Compatible chains -->
        <button
          v-for="chain in compatible"
          :key="chain.name"
          data-test="net-compatible"
          :class="[
            'flex items-center gap-3 p-4 rounded-[22px] w-full cursor-pointer transition-colors hover:bg-surface-hover',
            chain.name === chainsStore.selectedChain?.name
              ? 'bg-surface-hover rounded-[16px]'
              : '',
          ]"
          @click="apply(chain)"
        >
          <img
            v-if="chain.icon"
            :src="chain.icon"
            alt=""
            aria-hidden="true"
            class="w-7 h-7 rounded-full object-contain shrink-0"
          />
          <div v-else class="w-7 h-7 rounded-full bg-surface shrink-0" />
          <span class="flex-1 text-left text-s-14 font-semibold text-black tracking-[-0.28px]">
            {{ chain.nameLong }}
          </span>
          <!-- Black filled check circle for selected chain -->
          <div
            v-if="chain.name === chainsStore.selectedChain?.name"
            class="size-4 rounded-full bg-black flex items-center justify-center shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="w-3 h-3 text-white"
            >
              <path
                fill-rule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </button>

        <!-- Divider + incompatible section -->
        <template v-if="incompatible.length">
          <div class="h-px w-full bg-grey-10 my-1" />
          <div class="px-4 py-2">
            <span class="text-s-12 text-info">
              {{ $t('select_chain.incompatible_title') }}
            </span>
          </div>
          <div
            v-for="chain in incompatible"
            :key="chain.name"
            data-test="net-incompatible"
            class="flex items-center gap-3 p-4 rounded-[22px] w-full"
            @click="() => {}"
          >
            <img
              v-if="chain.icon"
              :src="chain.icon"
              alt=""
              aria-hidden="true"
              class="w-7 h-7 rounded-full object-contain shrink-0 opacity-50"
            />
            <div v-else class="w-7 h-7 rounded-full bg-surface shrink-0 opacity-50" />
            <span class="text-s-14 font-semibold text-[#a5a5a5] tracking-[-0.28px]">
              {{ chain.nameLong }}
            </span>
          </div>
        </template>
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

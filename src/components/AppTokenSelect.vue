<template>
  <button
    class="bg-light-grey text-black rounded-full px-1 py-1 flex items-center"
    type="button"
    @click="showAllTokens = true"
  >
    <div
      class="rounded-full border-x border-y border-grey-30 mr-1 h-5 w-5 overflow-hidden"
    >
      <img
        class="w-5 h-5"
        :src="imageReplacer(selectedToken.logo_url)"
        alt="token icon"
      />
    </div>
    {{ selectedToken.symbol }}
    <chevron-down-icon class="ml-1 w-4 h-4 stroke-4" />
  </button>
  <fwb-modal v-if="showAllTokens" @close="closeModal" size="xl">
    <template #header>
      <div class="w-full">
        <div class="items-center text-lg">Select token to send</div>
        <div class="flex items-center mt-2 w-full">
          <magnifying-glass-icon class="w-6 h-6 mx-3" />
          <input
            class="w-full h-10 rounded-md px-2 border-none"
            style="outline: none !important"
            type="text"
            placeholder="Search assets"
            v-model="searchInput"
          />
        </div>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col">
        <div
          v-for="token in searchResults"
          :key="token.contract"
          class="flex items-center justify-between px-2 py-4 cursor-pointer"
          @click="setSelectedToken(token)"
        >
          <div class="flex justify-between items-center w-full">
            <div class="flex items-center">
              <div class="mr-4 h-7 w-7 rounded-full overflow-hidden">
                <img
                  class="w-7 h-7"
                  :src="imageReplacer(token.logo_url)"
                  alt="token icon"
                />
              </div>
              <div>
                <h2>{{ token.name }}</h2>
                <p class="text-grey-30">
                  {{ token.balance }} {{ truncate(token.symbol, 7) }}
                </p>
              </div>
            </div>
            <div v-if="token.price !== 0">
              $
              {{ truncate(convertToValue(token.price, token.balance), 12) }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </fwb-modal>
</template>

<script setup lang="ts">
import {
  MAIN_TOKEN_CONTRACT,
  useWalletStore,
  type Token,
} from '@/stores/walletStore'
import { ref, computed, onMounted } from 'vue'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { FwbModal } from 'flowbite-vue'
import BigNumber from 'bignumber.js'

import eth from '@/assets/icons/tokens/eth.svg'

import { truncate } from '@/utils/filters'

const emit = defineEmits(['update:selectedToken'])

const store = useWalletStore()
const { tokens } = store

defineProps({
  selectedToken: {
    type: Object as () => Token,
    required: true,
  },
})

const showAllTokens = ref(false)
const searchInput = ref('')

const defaultImg = computed(() => {
  const img = tokens.find(
    (token: Token) => token.contract === MAIN_TOKEN_CONTRACT,
  )
  return img ? img.logo_url : eth
})

onMounted(() => {
  if (tokens.length > 0) setSelectedToken(tokens[0])
})

const searchResults = computed(() => {
  const resultArray = []

  for (const token of tokens) {
    if (
      token.symbol.toLowerCase() === searchInput.value.toLowerCase() ||
      token.name.toLowerCase() === searchInput.value.toLowerCase()
    ) {
      resultArray.unshift(token)
    } else if (
      token.symbol.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      token.name.toLowerCase().includes(searchInput.value.toLowerCase())
    ) {
      resultArray.push(token)
    }
  }

  return resultArray
})

const closeModal = () => {
  showAllTokens.value = false
}

const setSelectedToken = (token: Token) => {
  emit('update:selectedToken', token)
  showAllTokens.value = false
}

const imageReplacer = (logo: string) => {
  if (logo === 'https://img.mewapi.io/?image=null' || !!logo) {
    return defaultImg.value
  }
  return logo
}

const convertToValue = (price: number, balance: string) => {
  return BigNumber(BigNumber(price).times(BigNumber(balance))).toString()
}
</script>

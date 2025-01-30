<template>
  <button
    :class="[
      'bg-surface rounded-full p-2 flex flex-nowrap items-center hoverOpacityHasBG  min-h-11 ',
      { 'bg-grey-10 animate-pulse min-w-[120px]': isLoading },
    ]"
    type="button"
    @click="showAllTokens = true"
    aria-label="Select token"
    :disabled="isLoading"
  >
    <div
      v-if="!isLoading"
      class="min-w-7 h-7 box-border rounded-full border border-1 border-grey-30 mr-2 overflow-hidden"
    >
      <img
        class="w-[27px] h-[27px] rounded-full"
        :src="imageReplacer(selectedToken.logo_url)"
        width="28"
        height="28"
        alt="token icon"
      />
    </div>
    <p v-if="!isLoading" class="font-medium text-nowrap">
      {{ truncate(selectedToken.symbol, 7) }}
    </p>
    <div class="ml-1 min-w-4 h-4">
      <chevron-down-icon v-if="!isLoading" class="stroke-4" />
    </div>
  </button>
  <app-dialog
    v-model:is-open="showAllTokens"
    title="Select token"
    class="sm:max-w-[500px] sm:mx-auto"
  >
    <template #content>
      <div class="h-[95vh] sm:h-[500px] !overflow-y-scroll">
        <div class="sticky top-0 bg-white z-10 rounded-b-4xl">
          <div
            class="flex gap-4 justify-between items-center mb-4 bg-surface rounded-full p-1"
          >
            <app-search-input v-model="searchInput" class="grow" />
            <!--TODO: implement sort by-->
            <div class="text-sm pr-4">Sort by: token Name</div>
          </div>
        </div>

        <div v-if="searchResults.length" class="flex flex-col">
          <button
            v-for="token in searchResults"
            :key="token.contract"
            class="flex items-center justify-between px-2 py-3 cursor-pointer hoverNoBG rounded-full"
            @click="setSelectedToken(token)"
            v-ripple
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center">
                <img
                  class="mr-4 w-7 h-7 rounded-full overflow-hidden"
                  :src="imageReplacer(token.logo_url)"
                  alt="token icon"
                />
                <div class="text-left">
                  <h2>{{ token.name }}</h2>
                  <p class="text-info text-sm">
                    {{ getBalance(token.balance) }}
                    <span class="uppercase text-xs">
                      {{ truncate(token.symbol, 7) }}</span
                    >
                  </p>
                </div>
              </div>
              <div v-if="token.price !== 0">
                <p class="text-medium">
                  $ {{ convertToValue(token.price, token.balance) }}
                </p>
                <p class="text-info text-xs">
                  @ ${{ formatFiatValue(token.price).value }}
                </p>
              </div>
            </div>
          </button>
        </div>
        <div v-else>
          <div class="flex justify-center items-center h-[400px] text-grey-30">
            <p v-if="searchInput !== ''">No tokens match your search</p>
            <!-- TODO: verify other states when it can happen-->
            <p v-else>No tokens available</p>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import {
  MAIN_TOKEN_CONTRACT,
  useWalletStore,
  type Token,
} from '@/stores/wallet_store'
import { ref, computed, onMounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import BigNumber from 'bignumber.js'
import { storeToRefs } from 'pinia'
import eth from '@/assets/icons/tokens/eth.svg'
import { truncate } from '@/utils/filters'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from './AppSearchInput.vue'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
const emit = defineEmits(['update:selectedToken'])

const store = useWalletStore()
const { tokens } = store
const { isLoadingBalances: isLoading } = storeToRefs(store)

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
  const _value = BigNumber(
    BigNumber(price).times(BigNumber(balance)),
  ).toString()
  return formatFiatValue(_value).value
}

const getBalance = (_value: string) => {
  return formatFloatingPointValue(_value).value
}
</script>

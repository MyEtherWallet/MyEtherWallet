<template>
  <button
    :class="[
      'bg-surface rounded-full p-2 flex items-center hoverOpacityHasBG min-w-[100px] max-w-fit min-h-11',
      { 'bg-grey-10 animate-pulse': isLoading },
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
    <p v-if="!isLoading" class="font-medium">
      {{ truncate(selectedToken.symbol, 5) }}
    </p>

    <chevron-down-icon v-if="!isLoading" class="ml-1 min-w-4 h-4 stroke-4" />
  </button>
  <app-dialog
    v-model:is-open="showAllTokens"
    title="Select token"
    class="sm:max-w-[800px] sm:mx-auto"
  >
    <template #content>
      <div class="h-[550px]">
        <div
          class="flex gap-4 justify-between items-center mb-4 bg-surface rounded-full p-1"
        >
          <app-search-input v-model="searchInput" class="grow" />
          <!--TODO: implement sort by-->
          <div class="text-sm pr-4">Sort by: token Name</div>
        </div>

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
  return BigNumber(BigNumber(price).times(BigNumber(balance))).toString()
}
</script>

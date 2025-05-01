<template>
  <div class="relative">
    <input
      type="text"
      id="wallet-search-input"
      v-model="textValue"
      class="grow bg-white border-1 border-white focus:border-primary text-sm rounded-16 h-[58px] w-full px-5 py-[14px] text-xl transition-all"
      :placeholder="$t('access_wallet.search_wallet')"
      required
      aria-label="Search wallets"
      @focus="inFocusInput = true"
      @blur="inFocusInput = false"
      @input="searchWallet"
    />
    <AppBtnIconClose
      @click="clearInputValue"
      :class="[
        textValue !== '' && inFocusInput ? 'opacity-100' : 'opacity-0',
        'transition-opacity absolute top-3 right-6 z-10',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
const textValue = ref('')
const inFocusInput = ref(false)
const clearInputValue = () => {
  textValue.value = ''
  emit('search', textValue.value)
}
const emit = defineEmits<{
  search: [payload: string]
}>()

const searchWallet = () => {
  emit('search', textValue.value)
}
</script>

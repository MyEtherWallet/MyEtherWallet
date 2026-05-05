<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-[calc(100vw-40px)] sm:w-full sm:max-w-[480px] sm:mx-auto h-[calc(100dvh-40px)] sm:h-[calc(100dvh-312px)] rounded-20! sm:rounded-32!"
  >
    <template #content>
      <div class="flex flex-col gap-8 h-full p-5 sm:p-8">
        <h2
          id="dialogTitle"
          class="text-s-28 font-bold leading-[32px] tracking-[-0.84px] pr-12 flex-none"
        >
          {{ $t('purchase.select_currency.title') }}
        </h2>
        <div class="bg-bgBase rounded-full flex-none">
          <app-search-input
            v-model="searchInput"
            :placeholder="$t('purchase.select_currency.search_placeholder')"
            bg-class="bg-transparent"
          />
        </div>
        <ul role="listbox" class="flex flex-col flex-1 overflow-y-auto">
          <li v-for="currency in filteredCurrencies" :key="currency">
            <button
              type="button"
              :class="[
                currency === selected ? '!bg-mewBg' : '',
                'flex items-center w-full gap-3 px-3 py-3 rounded-12 hoverBGWhite transition-colors text-left',
              ]"
              @click="onSelect(currency)"
            >
              <img
                v-if="getFiatIcon(currency)"
                :src="getFiatIcon(currency)"
                :alt="currency"
                class="w-7 h-7 rounded-full object-cover flex-none"
                width="28"
                height="28"
              />
              <div
                v-else
                class="w-7 h-7 rounded-full bg-grey-10 flex-none"
                aria-hidden="true"
              />
              <span class="text-s-14 font-bold text-black">
                {{ currency }}
              </span>
            </button>
          </li>
          <li
            v-if="filteredCurrencies.length === 0"
            class="text-info text-s-14 text-center py-10"
          >
            {{ $t('purchase.select_currency.no_results') }}
          </li>
        </ul>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import { getFiatIcon } from '../helpers/purchaseIcons'

const props = defineProps<{
  currencies: string[]
  selected: string
}>()

const emit = defineEmits<{
  'update:selected': [currency: string]
}>()

const isOpen = defineModel('isOpen', { type: Boolean, required: true })

const searchInput = ref('')

watch(isOpen, value => {
  if (value) searchInput.value = ''
})

const filteredCurrencies = computed(() => {
  const term = searchInput.value.trim().toLowerCase()
  if (!term) return props.currencies
  return props.currencies.filter(c => c.toLowerCase().includes(term))
})

const onSelect = (currency: string) => {
  emit('update:selected', currency)
  isOpen.value = false
}
</script>

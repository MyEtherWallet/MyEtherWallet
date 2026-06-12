<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-[calc(100vw-40px)] sm:w-full sm:max-w-[480px] sm:mx-auto h-[calc(100dvh-40px)] sm:h-[calc(100dvh-312px)] rounded-20! sm:rounded-32!"
  >
    <template #content>
      <div class="flex flex-col gap-8 h-full pt-5 px-5 sm:pt-8 sm:px-8">
        <div class="flex flex-col gap-1 pr-12 flex-none">
          <h2
            id="dialogTitle"
            class="text-s-28 font-bold leading-[32px] tracking-[-0.84px]"
          >
            {{ $t('purchase.select_currency.title') }}
          </h2>
          <p class="text-s-16 text-info leading-[22px]">
            {{ $t('purchase.select_currency.subtitle') }}
          </p>
        </div>
        <div
          class="flex items-center gap-2.5 h-12 px-3 bg-white border-4 border-grey-10 rounded-24 flex-none"
        >
          <magnifying-glass-icon class="w-5 h-5 text-info flex-none" />
          <input
            v-model="searchInput"
            type="text"
            :placeholder="$t('purchase.select_currency.search_placeholder')"
            class="flex-1 min-w-0 bg-transparent outline-none border-none p-0 text-s-15 text-black placeholder:text-info"
          />
        </div>
        <div
          v-if="isLoading"
          class="flex flex-1 items-center justify-center py-16"
          aria-live="polite"
        >
          <span
            class="inline-block w-8 h-8 rounded-full border-2 border-grey-10 border-t-primary animate-spin"
          />
        </div>
        <ul v-else role="listbox" class="flex flex-col flex-1 overflow-y-auto">
          <li v-for="currency in filteredCurrencies" :key="currency">
            <button
              type="button"
              :class="[
                currency === selected ? '!bg-mewBg' : '',
                'flex items-center w-full gap-3 px-3 py-2 rounded-12 hoverBGWhite transition-colors text-left',
              ]"
              @click="onSelect(currency)"
            >
              <app-token-logo
                :url="getFiatIcon(currency)"
                :symbol="currency"
                cover
                width="w-7"
                height="h-7"
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
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { getFiatIcon } from '../helpers/purchaseIcons'

const props = defineProps<{
  currencies: string[]
  selected: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:selected': [currency: string]
}>()

const isOpen = defineModel('isOpen', { type: Boolean, required: true })

const searchInput = ref('')

watch(isOpen, value => {
  if (value) searchInput.value = ''
})

const currencyDisplayNames = new Intl.DisplayNames(['en'], {
  type: 'currency',
})

const currencyName = (code: string): string => {
  try {
    return currencyDisplayNames.of(code) ?? code
  } catch {
    return code
  }
}

const filteredCurrencies = computed(() => {
  const term = searchInput.value.trim().toLowerCase()
  if (!term) return props.currencies
  return props.currencies.filter(
    c =>
      c.toLowerCase().includes(term) ||
      currencyName(c).toLowerCase().includes(term),
  )
})

const onSelect = (currency: string) => {
  emit('update:selected', currency)
  isOpen.value = false
}
</script>

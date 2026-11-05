<template>
  <app-modal
    v-model="isOpen"
    :title="$t('purchase.select_currency.title')"
    :class="['h-full sm:h-[600px]', MODAL_HEADER_CLASS]"
  >
    <div class="flex h-full flex-col">
      <div class="flex-none px-4 pt-1.5 pb-6 sm:px-6">
        <app-searchbar v-model="searchInput" variant="default" />
      </div>

      <div
        class="mew-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6"
      >
        <div v-if="isLoading" class="flex flex-col gap-0.5" aria-busy="true">
          <app-cell v-for="n in 6" :key="n" inset loading />
        </div>
        <!-- Figma 12526:110248 draws the rows flush, without List's container -->
        <div
          v-else-if="filteredCurrencies.length"
          role="list"
          class="flex flex-col gap-0.5"
        >
          <div
            v-for="currency in filteredCurrencies"
            :key="currency"
            role="listitem"
          >
            <app-cell
              data-testid="currency-row"
              inset
              :title="currency"
              :description="getCurrencyName(currency)"
              :selected="currency === selected"
              @click="onSelect(currency)"
            >
              <template #avatar="{ size }">
                <app-avatar
                  type="cryptoAsset"
                  :size="size"
                  :url="getFiatIcon(currency)"
                  :symbol="currency"
                  fit="cover"
                />
              </template>
            </app-cell>
          </div>
        </div>
        <p
          v-else
          data-testid="currency-empty"
          class="py-10 text-center text-text-base text-text-subtle"
        >
          {{ $t('purchase.select_currency.no_results') }}
        </p>
      </div>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppModal from '@/components/modal/AppModal.vue'
import AppSearchbar from '@/components/AppSearchbar.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import { MODAL_HEADER_CLASS } from '@/components/token_selector/tokenSelector'
import { getFiatIcon } from '../helpers/purchaseIcons'
import { fuzzySearchByKeys } from '@/utils/searchArray'
import { getCurrencyName } from '../helpers/currencyName'

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

const filteredCurrencies = computed(() => {
  const term = searchInput.value.trim()
  if (!term) return [...props.currencies].sort((a, b) => a.localeCompare(b))
  const items = props.currencies.map(code => ({
    code,
    name: getCurrencyName(code),
  }))
  return fuzzySearchByKeys(items, ['code', 'name'], term).map(item => item.code)
})

const onSelect = (currency: string) => {
  emit('update:selected', currency)
  isOpen.value = false
}
</script>

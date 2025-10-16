<template>
  <div>
    <app-btn-text class="text-primary text-s-14" @click="openDialog = true">
      View All</app-btn-text
    >
    <app-dialog
      v-model:is-open="openDialog"
      :title="t('common.allocation')"
      class="w-full xs:max-w-[428px] sm:mx-auto"
    >
      <template #content>
        <div class="h-[80vh] xs:h-[500px] !overflow-y-scroll px-3 sm:px-4">
          <div
            class="flex gap-4 justify-between items-center mb-4 bg-surface rounded-full p-1"
          >
            <app-search-input
              v-model="searchInput"
              class="grow"
              :placeholder="$t('select_token.search')"
            />
            <!--SORT-->
            <app-pop-up-menu :placeholder="$t('common.sort')">
              <template #menu-button="{ toggleMenu }">
                <button
                  class="flex items-center px-2 py-2 text-s-15 font-medium hoverNoBG rounded-full"
                  @click="toggleMenu"
                >
                  <span class="mr-2 ml-1">{{ activeSortValue }}</span>
                  <ArrowUpIcon
                    v-if="activeSortDirection === SortDirection.DESC"
                    class="w-4 h-4"
                  />
                  <ArrowDownIcon v-else class="w-4 h-4" />
                </button>
              </template>
              <template #menu-content="{ toggleMenu }">
                <div class="py-4 flex flex-col">
                  <div class="flex items-center justify-between mb-1 mx-3">
                    <p class="text-s-17 font-medium ml-3">
                      {{ $t('common.sort_by') }}
                    </p>
                    <app-btn-icon-close @click="toggleMenu" />
                  </div>
                  <hr class="h-px bg-grey-outline border-0 w-full mt-1 mb-2" />
                  <button
                    v-for="option in sortOptions"
                    :key="option.value"
                    :class="[
                      option.value === activeSortValue ? 'bg-grey-5' : '',
                      'flex items-center px-4 py-2 mx-3 hoverNoBG rounded-16 min-w-[80px] text-s-15 font-medium',
                    ]"
                    :id="option.value"
                    @click="setActiveSort(option.value)"
                  >
                    <p class="capitalize">{{ option.label }}</p>
                    <div
                      v-if="activeSortValue === option.value"
                      class="ml-auto"
                    >
                      <ArrowUpIcon
                        v-if="activeSortDirection === SortDirection.DESC"
                        class="w-5 h-5 text-primary"
                      />
                      <ArrowDownIcon v-else class="w-5 h-5 text-primary" />
                    </div>
                  </button>
                </div>
              </template>
            </app-pop-up-menu>
          </div>
          <div>
            <div v-if="searchResults.length" class="flex flex-col gap-2">
              <button
                v-for="token in searchResults"
                :key="token.symbol + token.id"
                class="w-full flex items-center justify-between p-2 rounded-16 hover:bg-grey-5"
              >
                <div class="flex justify-between items-center w-full">
                  <div class="flex items-center">
                    <app-token-logo
                      :url="token.icon"
                      :symbol="token.symbol"
                      class="mr-4"
                    />
                    <div class="text-left">
                      <h2>{{ token.name }}</h2>
                      <p class="text-info text-sm">
                        <span class="uppercase text-xs">
                          {{ truncate(token.symbol, 7) }}</span
                        >
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-medium">
                      {{ token.formattedPercentage }}
                    </p>
                    <p class="text-info text-s-14">
                      $ {{ token.usdBalanceFormatted }}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/24/solid'
import { truncate } from '@/utils/filters'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { type TokenAllocation } from '@/modules/portfolio/types'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { searchArrayByKeysStr } from '@/utils/searchArray'

const props = defineProps<{
  /**
   * @title The title of the dialog, not required
   * @type string | undefined
   */
  tokens: TokenAllocation[]
}>()

/** -------------------------------
 * Dialog
 -------------------------------*/

const openDialog = ref<boolean>(false)
const { t } = useI18n()

/** -------------------
 *   Search & Sort
 * -------------------*/
enum SortValueString {
  NAME = 'Name',
  SYMBOL = 'Symbol',
  ALLOCATION = 'Allocation',
  USD = 'USD Balance',
}

const sortOptions = computed(() => {
  return [
    {
      value: SortValueString.NAME,
      label: t('common.name'),
    },
    {
      value: SortValueString.SYMBOL,
      label: t('common.symbol'),
    },
    {
      value: SortValueString.ALLOCATION,
      label: t('common.allocation'),
    },
    {
      value: SortValueString.USD,
      label: t('common.usd_balance'),
    },
  ]
})

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const activeSortValue = ref<SortValueString>(SortValueString.ALLOCATION)
const activeSortDirection = ref<SortDirection>(SortDirection.ASC)

const setActiveSort = (value: SortValueString) => {
  if (value === activeSortValue.value) {
    // Toggle direction if the same sort value is clicked
    activeSortDirection.value =
      activeSortDirection.value === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
  } else {
    // Set new sort value and default to ascending direction
    activeSortValue.value = value
    activeSortDirection.value = SortDirection.ASC
  }
}

const searchInput = ref('')

const searchResults = computed<TokenAllocation[]>(() => {
  if (!searchInput.value) {
    if (activeSortValue.value === SortValueString.NAME) {
      return sortObjectArrayString(
        props.tokens,
        'name',
        activeSortDirection.value,
      )
    }
    if (activeSortValue.value === SortValueString.SYMBOL) {
      return sortObjectArrayString(
        props.tokens,
        'symbol',
        activeSortDirection.value,
      )
    }
    if (activeSortValue.value === SortValueString.ALLOCATION) {
      return sortObjectArrayNumber(
        props.tokens,
        'percentageNumber',
        activeSortDirection.value,
      )
    }
    if (activeSortValue.value === SortValueString.USD) {
      return sortObjectArrayNumber(
        props.tokens,
        'usdBalanceRaw',
        activeSortDirection.value,
      )
    }
    return props.tokens
  }
  return searchArrayByKeysStr(
    props.tokens,
    ['name', 'symbol'],
    searchInput.value,
  )
})
</script>

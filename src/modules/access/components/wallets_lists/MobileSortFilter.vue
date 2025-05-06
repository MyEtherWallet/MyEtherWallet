<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="sm:max-w-[460px] !min-h-[400px] bg-[rgba(255, 255, 255, 0.7)]"
    :title="$t('access_wallet.sort_and_filter')"
  >
    <!-- Content -->
    <template #content>
      <div class="mt-5 px-5 mb-10">
        <!-- Filter -->
        <p class="text7 ml-3 mb-2 !font-bold">{{ $t('common.filter') }}:</p>
        <div class="flex flex-wrap gap-x-2 gap-y-3">
          <button
            v-for="option in filterOptions"
            :key="option.value"
            :class="[
              option.value === activeFilter.value
                ? 'border-primary text-primary'
                : '',
              'border border-1 border-grey-outline items-center px-2 py-1 hoverNoBG rounded-32 min-w-[80px] text-s-17 font-medium',
            ]"
            role="option"
            :id="option.value"
            @click="setActiveFilter(option)"
          >
            {{ option.name }}
          </button>
        </div>
        <!-- DIVIDER -->
        <hr class="h-px bg-grey-outline border-0 w-full mt-7 mb-6" />
        <!-- Sort -->
        <p class="text7 ml-3 mb-2 !font-bold">{{ $t('common.sort_by') }}:</p>
        <div class="flex flex-wrap gap-x-2 gap-y-3">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            :class="[
              option.value === activeSort.value
                ? 'border-primary text-primary'
                : '',
              'border border-1 border-grey-outline items-center px-2 py-1 hoverNoBG rounded-32 min-w-[80px] text-s-17 font-medium',
            ]"
            role="option"
            :id="option.value"
            @click="setActiveSort(option)"
          >
            {{ option.label }}
          </button>
        </div>
        <!-- Reset Button -->
        <div class="flex justify-end mt-12">
          <AppBaseButton
            class="ml-auto"
            variant="primary"
            size="large"
            @click="reset"
          >
            {{ $t('common.reset') }}
          </AppBaseButton>
        </div>
      </div>
    </template>
  </app-dialog>
</template>
<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { type Filter } from '@/modules/access/common/walletConfigs'
import { type AppSelectOption } from '@/types/components/appSelect'

interface Props {
  filterOptions: Filter[]
  sortOptions: AppSelectOption[]
}
const props = defineProps<Props>()

/**  -------------------
 * Slected Filter and Sort
 -------------------*/

const activeFilter = defineModel<Filter>('activeFilter', {
  required: true,
})

const setActiveFilter = (filter: Filter) => {
  activeFilter.value = filter
}
const setActiveSort = (sort: AppSelectOption) => {
  activeSort.value = sort
}
const activeSort = defineModel<AppSelectOption>('activeSort', {
  required: true,
})

const reset = () => {
  if (!props.filterOptions.length || !props.sortOptions.length) return
  activeFilter.value = props.filterOptions[0]
}
/** -------------------
 * Dialog Controls
 -------------------*/
const isOpen = defineModel('isOpen', {
  type: Boolean,
  required: true,
})
</script>

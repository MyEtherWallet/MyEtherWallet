<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-s-20 font-bold ml-2">{{ title }}</h2>

      <div class="flex">
        <app-btn-icon
          :disabled="isLoading || currentPage === 0"
          :label="$t('common.previous_page')"
          @click="previousPage"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>
        <app-btn-icon
          :disabled="isLoading || currentPage + 1 >= totalPages"
          :label="$t('common.next_page')"
          @click="nextPage"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </app-btn-icon>
      </div>
    </div>

    <app-sheet
      :is-elivated="false"
      sheet-class="!pt-5 !pb-2 !px-2 overflow-hidden min-h-[204px]"
    >
      <div class="grid grid-cols-1" v-if="!isLoading">
        <slot name="tokens" />
      </div>
      <div v-else class="grid grid-cols-1 gap-3 animate-pulse">
        <div
          v-for="token in 3"
          :key="`loading-trending-${token}`"
          class="basis-full bg-surface-strong flex items-end justify-between rounded-16 w-full h-[48px]"
        ></div>
      </div>
    </app-sheet>
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSheet from '@/components/AppSheet.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

defineProps<{
  title: string
  currentPage: number
  totalPages: number
  isLoading: boolean
}>()

/** --------------------------
 * Pagination
 --------------------------*/

const emit = defineEmits<{
  (e: 'nextPage'): void
  (e: 'previousPage'): void
}>()

const nextPage = () => {
  emit('nextPage')
}
const previousPage = () => {
  emit('previousPage')
}
</script>

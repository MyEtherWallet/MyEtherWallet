<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import AppBaseButton from '@/components/AppBaseButton.vue'
import WatchlistStepHeader from './WatchlistStepHeader.vue'
import WatchlistSelectableCard from './WatchlistSelectableCard.vue'
import type { WatchlistCategory } from '@/modules/home/composables/useWatchlistCategories'

const { t } = useI18n()

defineProps<{
  /** Curated categories for the markets picked in step 1 (fetched by the dialog). */
  categories: WatchlistCategory[]
  isLoading: boolean
}>()

// Selected category ids (e.g. "STOCK:Equities"). Continue enables with ≥1.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ continue: []; back: []; skip: []; close: [] }>()

const toggle = (id: string) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter(x => x !== id)
    : [...selected.value, id]
}
</script>

<template>
  <div data-test="watchlist-step-industries">
    <WatchlistStepHeader
      :step="2"
      show-back
      :title="t('homePage.hero.watchlist.onboarding.industries.subtitle')"
      :description="t('homePage.hero.watchlist.onboarding.industries.description')"
      @back="$emit('back')"
      @close="$emit('close')"
    />

    <!-- Categories loading skeleton. -->
    <div
      v-if="isLoading"
      data-test="industries-loading"
      class="mt-6 grid grid-cols-2 gap-3"
    >
      <span
        v-for="n in 8"
        :key="n"
        class="h-[54px] animate-pulse rounded-2xl bg-[#f0f0f0]"
      />
    </div>

    <!-- No categories came back (empty response or error): a plain message, not
         the fade+scroll frame (which would render as two empty bars). -->
    <div
      v-else-if="!categories.length"
      data-test="industries-empty"
      class="mt-6 flex min-h-[160px] flex-col items-center justify-center py-6 text-center"
    >
      <ExclamationCircleIcon class="size-6 text-[#575757]" />
      <p class="mt-4 max-w-[300px] text-s-16 font-normal leading-[22px] text-[#575757]">
        {{ t('homePage.hero.watchlist.onboarding.industries.empty') }}
      </p>
    </div>

    <!-- Only the category list scrolls; the header + footer stay put. Top/bottom
         white fades hint at the overflow (same pattern as the step-3 asset
         list); the inner py compensates them so edge pills aren't clipped. -->
    <div v-else class="relative mt-6">
      <div
        class="pointer-events-none absolute inset-x-0 top-0 z-[1] h-3 bg-gradient-to-b from-white to-transparent"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-3 bg-gradient-to-t from-white to-transparent"
        aria-hidden="true"
      />
      <div class="mew-scrollbar max-h-[320px] overflow-y-auto py-2 pr-1">
        <div class="grid grid-cols-2 gap-3">
          <WatchlistSelectableCard
            v-for="category in categories"
            :key="category.id"
            data-test="industry-pill"
            :selected="selected.includes(category.id)"
            class="p-4 text-s-16 font-medium text-black"
            @toggle="toggle(category.id)"
          >
            {{ category.label }}
          </WatchlistSelectableCard>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-end gap-4">
      <button
        type="button"
        data-test="industries-skip"
        class="hoverNoBG rounded-full px-4 py-3 text-s-16 font-semibold text-primary"
        @click="$emit('skip')"
      >
        {{ t('homePage.hero.watchlist.onboarding.skip') }}
      </button>
      <AppBaseButton
        data-test="industries-continue"
        :disabled="!selected.length"
        :style="
          !selected.length
            ? {
                backgroundColor: 'var(--color-primary) !important',
                opacity: 0.4,
                cursor: 'default',
              }
            : undefined
        "
        @click="$emit('continue')"
      >
        <span class="flex items-center gap-2">
          {{ t('homePage.hero.watchlist.onboarding.continue') }}
          <ChevronRightIcon class="size-5" />
        </span>
      </AppBaseButton>
    </div>
  </div>
</template>

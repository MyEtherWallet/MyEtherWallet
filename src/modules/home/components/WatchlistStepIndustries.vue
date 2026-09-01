<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import WatchlistStepHeader from './WatchlistStepHeader.vue'
import WatchlistSelectableCard from './WatchlistSelectableCard.vue'
import { sectors } from '@/modules/home/sectors'

const { t } = useI18n()

const props = defineProps<{
  /** Markets picked in step 1 — scopes which curated collections to offer. */
  markets: string[]
}>()

// Selected curated-collection ids (multi-select). Continue enables with ≥1.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ continue: []; back: []; skip: []; close: [] }>()

// Reuse the "Curated Collections" categories (single source of truth), scoped to
// the markets chosen in step 1 — both selected shows the combined list.
const visibleSectors = computed(() =>
  sectors.filter(
    s => props.markets.length === 0 || props.markets.includes(s.market),
  ),
)

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

    <div class="mt-6 grid grid-cols-2 gap-3">
      <WatchlistSelectableCard
        v-for="sector in visibleSectors"
        :key="sector.id"
        data-test="industry-pill"
        :selected="selected.includes(sector.id)"
        class="p-4 text-s-16 font-medium text-black"
        @toggle="toggle(sector.id)"
      >
        {{ t(sector.labelKey) }}
      </WatchlistSelectableCard>
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

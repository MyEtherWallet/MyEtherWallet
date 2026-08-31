<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import WatchlistStepHeader from './WatchlistStepHeader.vue'
import WatchlistSelectableCard from './WatchlistSelectableCard.vue'
import { WATCHLIST_INDUSTRIES } from './watchlistOnboarding'

const { t } = useI18n()

// Selected industry keys (multi-select). Continue enables with at least one.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ continue: []; back: []; skip: []; close: [] }>()

const toggle = (key: string) => {
  selected.value = selected.value.includes(key)
    ? selected.value.filter(x => x !== key)
    : [...selected.value, key]
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
        v-for="key in WATCHLIST_INDUSTRIES"
        :key="key"
        data-test="industry-pill"
        :selected="selected.includes(key)"
        class="p-4 text-s-16 font-medium text-black"
        @toggle="toggle(key)"
      >
        {{ t(`homePage.hero.watchlist.onboarding.industryLabels.${key}`) }}
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

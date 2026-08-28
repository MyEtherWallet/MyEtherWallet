<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { WATCHLIST_INDUSTRIES } from './watchlistOnboarding'

const { t } = useI18n()

// Selected industry keys (multi-select). Continue enables with at least one.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ continue: []; back: [] }>()

const toggle = (key: string) => {
  selected.value = selected.value.includes(key)
    ? selected.value.filter(x => x !== key)
    : [...selected.value, key]
}
</script>

<template>
  <div data-test="watchlist-step-industries">
    <!-- Header: back button + gray kicker + bold question (same pattern as
         step 1; the close button is provided by AppDialog). -->
    <div class="flex items-start gap-3">
      <AppBtnIcon
        :label="t('common.back')"
        data-test="industries-back"
        @click="$emit('back')"
      >
        <ChevronLeftIcon class="size-6" />
      </AppBtnIcon>
      <div>
        <p class="text-s-20 font-normal text-[#575757]">
          {{ t('homePage.hero.watchlist.title') }}
        </p>
        <h2 class="mt-1 text-s-20 font-bold text-black">
          {{ t('homePage.hero.watchlist.onboarding.industries.subtitle') }}
        </h2>
      </div>
    </div>

    <div class="mt-12 grid grid-cols-2 gap-3">
      <button
        v-for="key in WATCHLIST_INDUSTRIES"
        :key="key"
        type="button"
        data-test="industry-pill"
        :aria-pressed="selected.includes(key)"
        class="rounded-2xl border-2 p-4 text-left text-s-16 font-medium transition-colors"
        :class="
          selected.includes(key)
            ? 'border-black bg-white text-black'
            : 'border-transparent bg-[#f5f5f5] text-black'
        "
        @click="toggle(key)"
      >
        {{ t(`homePage.hero.watchlist.onboarding.industryLabels.${key}`) }}
      </button>
    </div>

    <div class="mt-12 flex justify-end">
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

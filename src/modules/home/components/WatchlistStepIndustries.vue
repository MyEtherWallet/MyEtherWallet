<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowRightIcon } from '@heroicons/vue/20/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { WATCHLIST_INDUSTRIES } from './watchlistOnboarding'

const { t } = useI18n()

// Selected industry keys (multi-select). Continue enables with at least one.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ continue: [] }>()

const toggle = (key: string) => {
  selected.value = selected.value.includes(key)
    ? selected.value.filter(x => x !== key)
    : [...selected.value, key]
}
</script>

<template>
  <div data-test="watchlist-step-industries">
    <h2 class="text-s-24 font-bold text-black">
      {{ t('homePage.hero.watchlist.title') }}
    </h2>
    <p class="mt-1 text-s-16 text-[#575757]">
      {{ t('homePage.hero.watchlist.onboarding.industries.subtitle') }}
    </p>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <button
        v-for="key in WATCHLIST_INDUSTRIES"
        :key="key"
        type="button"
        data-test="industry-pill"
        :aria-pressed="selected.includes(key)"
        class="rounded-2xl border-2 py-4 text-center text-s-16 font-medium transition-colors"
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

    <div class="mt-6 flex justify-end">
      <AppBaseButton
        data-test="industries-continue"
        :disabled="!selected.length"
        @click="$emit('continue')"
      >
        <span class="flex items-center gap-2">
          {{ t('homePage.hero.watchlist.onboarding.continue') }}
          <ArrowRightIcon class="size-5" />
        </span>
      </AppBaseButton>
    </div>
  </div>
</template>

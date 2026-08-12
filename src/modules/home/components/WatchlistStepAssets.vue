<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PlusIcon, CheckIcon } from '@heroicons/vue/20/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import type { RecommendedAsset } from './watchlistOnboarding'

const { t } = useI18n()

defineProps<{
  assets: RecommendedAsset[]
  isLoading: boolean
}>()

// Selected asset ids. Done enables with at least one.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ done: [] }>()

const toggle = (id: string) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter(x => x !== id)
    : [...selected.value, id]
}
</script>

<template>
  <div data-test="watchlist-step-assets">
    <!-- Loading -->
    <div
      v-if="isLoading"
      data-test="assets-loading"
      class="flex min-h-[360px] flex-col items-center justify-center text-center"
    >
      <span
        class="size-8 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-black"
        aria-hidden="true"
      />
      <p class="mt-6 text-s-20 font-bold text-black">
        {{ t('homePage.hero.watchlist.onboarding.assets.loadingTitle') }}
      </p>
      <p class="mt-1 text-s-16 text-[#575757]">
        {{ t('homePage.hero.watchlist.onboarding.assets.loadingSubtitle') }}
      </p>
    </div>

    <!-- Results -->
    <div v-else>
      <h2 class="text-s-24 font-bold text-black">
        {{ t('homePage.hero.watchlist.onboarding.assets.title') }}
      </h2>
      <p class="mt-1 text-s-16 text-[#575757]">
        {{ t('homePage.hero.watchlist.onboarding.assets.subtitle') }}
      </p>

      <div class="mt-6 grid grid-cols-4 gap-2">
        <button
          v-for="asset in assets"
          :key="asset.id"
          type="button"
          data-test="asset-card"
          :aria-pressed="selected.includes(asset.id)"
          class="relative flex h-[108px] flex-col items-center justify-center rounded-2xl border-2 transition-colors"
          :class="
            selected.includes(asset.id) ? 'border-black' : 'border-transparent'
          "
          @click="toggle(asset.id)"
        >
          <span
            class="absolute left-2 top-3 flex size-5 items-center justify-center rounded-full"
            :class="
              selected.includes(asset.id)
                ? 'bg-success text-white'
                : 'bg-[#e6e6e6] text-black'
            "
            aria-hidden="true"
          >
            <CheckIcon v-if="selected.includes(asset.id)" class="size-4" />
            <PlusIcon v-else class="size-4" />
          </span>
          <AppTokenLogo
            :url="asset.logoUrl"
            :symbol="asset.symbol"
            :is-stock="asset.type === 'stock'"
            width="w-10"
            height="h-10"
          />
          <span class="mt-2 text-s-14 text-black">{{ asset.symbol }}</span>
        </button>
      </div>

      <div class="mt-4 flex items-center justify-end gap-4">
        <span class="text-s-14 text-[#575757]">
          {{
            t('homePage.hero.watchlist.onboarding.assets.selected', {
              count: selected.length,
            })
          }}
        </span>
        <AppBaseButton
          data-test="assets-done"
          :disabled="!selected.length"
          @click="$emit('done')"
        >
          {{ t('homePage.hero.watchlist.onboarding.assets.done') }}
        </AppBaseButton>
      </div>
    </div>
  </div>
</template>

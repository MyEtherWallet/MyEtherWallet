<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PlusIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/vue/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import WatchlistSelectableCard from './WatchlistSelectableCard.vue'
import type { RecommendedAsset } from './watchlistOnboarding'
import cluster1 from '@/assets/images/watchlist/market-stocks-1.png'
import cluster2 from '@/assets/images/watchlist/market-crypto-1.png'
import cluster3 from '@/assets/images/watchlist/market-crypto-2.png'
import cluster4 from '@/assets/images/watchlist/market-crypto-3.png'
import cluster5 from '@/assets/images/watchlist/market-stocks-2.png'

const { t } = useI18n()

const props = defineProps<{
  assets: RecommendedAsset[]
  isLoading: boolean
}>()

// Selected asset ids. Done enables with at least one.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ done: []; back: [] }>()

// Decorative fading avatar cluster for the "Finding assets…" loading state
// (Figma: symmetric, biggest + fully opaque in the centre, fading outward).
const LOADING_CLUSTER = [
  { src: cluster1, size: 'size-4', opacity: 'opacity-30' },
  { src: cluster2, size: 'size-8', opacity: 'opacity-60' },
  { src: cluster3, size: 'size-12', opacity: 'opacity-100' },
  { src: cluster4, size: 'size-8', opacity: 'opacity-60' },
  { src: cluster5, size: 'size-4', opacity: 'opacity-30' },
]

// Search + progressive reveal. A query shows all matches (no cap); otherwise the
// first INITIAL_COUNT show and "Show more" reveals the rest.
const INITIAL_COUNT = 8
const query = ref('')
const showAll = ref(false)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.assets
  return props.assets.filter(
    a =>
      a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q),
  )
})
const visibleAssets = computed(() =>
  query.value.trim() || showAll.value
    ? filtered.value
    : filtered.value.slice(0, INITIAL_COUNT),
)
const hasMore = computed(
  () =>
    !query.value.trim() &&
    !showAll.value &&
    filtered.value.length > INITIAL_COUNT,
)

const toggle = (id: string) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter(x => x !== id)
    : [...selected.value, id]
}
</script>

<template>
  <div data-test="watchlist-step-assets">
    <!-- Loading (Figma: fading avatar cluster + "Finding assets…"). -->
    <div
      v-if="isLoading"
      data-test="assets-loading"
      class="flex min-h-[380px] flex-col items-center justify-center gap-8 text-center"
    >
      <div class="flex animate-pulse items-center" aria-hidden="true">
        <img
          v-for="(avatar, i) in LOADING_CLUSTER"
          :key="i"
          :src="avatar.src"
          alt=""
          class="rounded-full border-2 border-white object-contain"
          :class="[avatar.size, avatar.opacity, i > 0 ? '-ml-2' : '']"
        />
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-s-24 font-bold leading-[26px] text-black">
          {{ t('homePage.hero.watchlist.onboarding.assets.loadingTitle') }}
        </p>
        <p class="text-s-16 text-[#575757]">
          {{ t('homePage.hero.watchlist.onboarding.assets.loadingSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Results: column sized to content. The list area grows to a max height
         (with a smooth transition) when "Show more" is used; header, search and
         footer stay put and only the list scrolls once it is capped. -->
    <div v-else class="flex flex-col">
      <!-- Header: back button + title + subtitle (close is provided by
           AppDialog). -->
      <div class="flex shrink-0 items-start gap-3">
        <AppBtnIcon
          :label="t('common.back')"
          data-test="assets-back"
          @click="$emit('back')"
        >
          <ChevronLeftIcon class="size-6" />
        </AppBtnIcon>
        <div>
          <h2 class="text-s-20 font-bold text-black">
            {{ t('homePage.hero.watchlist.onboarding.assets.title') }}
          </h2>
          <p class="mt-1 text-s-16 text-[#575757]">
            {{ t('homePage.hero.watchlist.onboarding.assets.subtitle') }}
          </p>
        </div>
      </div>

      <AppSearchInput
        v-model="query"
        :placeholder="t('homePage.hero.watchlist.addModal.searchPlaceholder')"
        bg-class="bg-white"
        class="mt-6 shrink-0 rounded-full border border-[#e6e6e6]"
      />

      <!-- Token list: max-height grows with a smooth transition when "Show more"
           reveals the rest; inner py compensates the top/bottom white fades so
           the edge cards are never clipped (same fade idea as AppSlideGroup,
           rotated to vertical). Only this part scrolls once capped. -->
      <div class="relative mt-2">
        <div
          class="pointer-events-none absolute inset-x-0 top-0 z-[1] h-6 bg-gradient-to-b from-white to-transparent"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-6 bg-gradient-to-t from-white to-transparent"
          aria-hidden="true"
        />
        <div
          class="mew-scrollbar overflow-y-auto py-6 pr-1 transition-[max-height] duration-500 ease-out"
          :class="showAll ? 'max-h-[520px]' : 'max-h-[340px]'"
        >
          <!-- Empty search state. -->
          <div
            v-if="!visibleAssets.length"
            data-test="assets-empty"
            class="flex min-h-[160px] flex-col items-center justify-center gap-1 py-6 text-center"
          >
            <MagnifyingGlassIcon class="mb-1 size-8 text-[#767676]" />
            <p class="text-s-16 font-semibold text-black">
              {{ t('search.no_results_title') }}
            </p>
            <p class="text-s-14 text-[#575757]">
              {{ t('search.no_results_subtitle') }}
            </p>
          </div>

          <div v-else v-auto-animate class="grid grid-cols-4 gap-2">
            <WatchlistSelectableCard
              v-for="asset in visibleAssets"
              :key="asset.id"
              data-test="asset-card"
              :selected="selected.includes(asset.id)"
              bg="bg-white"
              class="flex h-[108px] flex-col items-center justify-center gap-2"
              @toggle="toggle(asset.id)"
            >
              <span class="relative">
                <AppTokenLogo
                  :url="asset.logoUrl"
                  :symbol="asset.symbol"
                  :is-stock="asset.type === 'stock'"
                  width="w-10"
                  height="h-10"
                />
                <!-- Add/added badge overlapping the avatar (Figma). -->
                <span
                  class="absolute -left-1 -top-1 flex size-[22px] items-center justify-center rounded-full border-2 border-white"
                  :class="
                    selected.includes(asset.id)
                      ? 'bg-success text-white'
                      : 'bg-[#e6e6e6] text-black'
                  "
                  aria-hidden="true"
                >
                  <CheckIcon
                    v-if="selected.includes(asset.id)"
                    class="size-3.5"
                  />
                  <PlusIcon v-else class="size-3.5" />
                </span>
              </span>
              <span class="text-s-16 font-semibold text-black">
                {{ asset.symbol }}
              </span>
            </WatchlistSelectableCard>
          </div>

          <!-- Show more divider (only while there is a hidden remainder). -->
          <div v-if="hasMore" class="mt-6 flex items-center gap-5">
            <span class="h-px flex-1 bg-[#e6e6e6]" aria-hidden="true" />
            <button
              type="button"
              data-test="assets-show-more"
              class="flex items-center gap-1 text-s-14 font-semibold text-black"
              @click="showAll = true"
            >
              {{ t('search.show_more') }}
              <ChevronDownIcon class="size-4" />
            </button>
            <span class="h-px flex-1 bg-[#e6e6e6]" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div class="mt-2 flex shrink-0 items-center justify-end">
        <AppBaseButton
          data-test="assets-done"
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
          @click="$emit('done')"
        >
          <span class="flex items-center gap-2">
            {{ t('homePage.hero.watchlist.onboarding.assets.done') }}
            <ChevronRightIcon class="size-5" />
          </span>
        </AppBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PlusIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/vue/20/solid'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import WatchlistStepHeader from './WatchlistStepHeader.vue'
import WatchlistSelectableCard from './WatchlistSelectableCard.vue'
import type { RecommendedAsset } from './watchlistOnboarding'
import findingAssetsAnimation from '@/assets/images/watchlist/finding-assets.lottie?url'

const { t } = useI18n()

const props = defineProps<{
  assets: RecommendedAsset[]
  isLoading: boolean
}>()

// Selected asset ids. Done enables with at least one.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ done: []; back: []; close: [] }>()

// Search + progressive reveal. A query shows all matches (no cap); otherwise the
// first INITIAL_COUNT show and "Show more" reveals the rest.
const INITIAL_COUNT = 12
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

// Search-loading: while the user is typing a query, show skeleton cards (Figma)
// until results settle. The filter is client-side today, so a short debounce
// stands in for the latency the backend search will have — the isSearching flag
// is what that request will drive later.
const SEARCH_DEBOUNCE_MS = import.meta.env.MODE === 'test' ? 10 : 450
const isSearching = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(query, q => {
  clearTimeout(searchTimer)
  if (!q.trim()) {
    isSearching.value = false
    return
  }
  isSearching.value = true
  searchTimer = setTimeout(() => (isSearching.value = false), SEARCH_DEBOUNCE_MS)
})
onBeforeUnmount(() => clearTimeout(searchTimer))

const toggle = (id: string) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter(x => x !== id)
    : [...selected.value, id]
}

// Footer chips for the current selection: up to 2 shown, the rest collapsed
// into a "+N more" chip whose tooltip lists their symbols.
const MAX_CHIPS = 2
const selectedAssets = computed(() =>
  props.assets.filter(a => selected.value.includes(a.id)),
)
const chipAssets = computed(() => selectedAssets.value.slice(0, MAX_CHIPS))
const overflowAssets = computed(() => selectedAssets.value.slice(MAX_CHIPS))
const overflowNames = computed(() =>
  overflowAssets.value.map(a => a.symbol).join(', '),
)
</script>

<template>
  <div data-test="watchlist-step-assets">
    <!-- Loading: Lottie animation + "Finding assets…" (no header here by design). -->
    <div
      v-if="isLoading"
      data-test="assets-loading"
      class="flex min-h-[380px] flex-col items-center justify-center text-center"
    >
      <DotLottieVue
        :src="findingAssetsAnimation"
        class="aspect-square w-[180px]"
        autoplay
        loop
        role="img"
        :aria-label="t('homePage.hero.watchlist.onboarding.assets.loadingTitle')"
      />
      <!-- The animation's artboard carries bottom padding; pull the copy up so it
           sits close under the visible art instead of the box edge. -->
      <div class="-mt-8 flex flex-col gap-2">
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
      <WatchlistStepHeader
        class="shrink-0"
        :step="3"
        show-back
        :title="t('homePage.hero.watchlist.onboarding.assets.title')"
        :description="t('homePage.hero.watchlist.onboarding.assets.subtitle')"
        @back="$emit('back')"
        @close="$emit('close')"
      />

      <AppSearchInput
        v-model="query"
        :placeholder="t('homePage.hero.watchlist.addModal.searchPlaceholder')"
        bg-class="bg-white"
        class="mt-5 shrink-0 rounded-full border border-[#e6e6e6]"
      />

      <!-- Token list: max-height grows with a smooth transition when "Show more"
           reveals the rest; inner py compensates the top/bottom white fades so
           the edge cards are never clipped (same fade idea as AppSlideGroup,
           rotated to vertical). Only this part scrolls once capped. -->
      <div class="relative mt-3">
        <div
          class="pointer-events-none absolute inset-x-0 top-0 z-[1] h-3 bg-gradient-to-b from-white to-transparent"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-3 bg-gradient-to-t from-white to-transparent"
          aria-hidden="true"
        />
        <div
          class="mew-scrollbar overflow-y-auto py-2 pr-1 transition-[height] duration-500 ease-out"
          :class="showAll ? 'h-[500px]' : 'h-[320px]'"
        >
          <!-- Search skeleton (Figma): a full grid of placeholder cards while a
               query's results settle. -->
          <div
            v-if="isSearching"
            data-test="assets-skeleton"
            class="grid grid-cols-4 gap-2"
          >
            <div
              v-for="n in INITIAL_COUNT"
              :key="n"
              class="flex h-[96px] flex-col items-center justify-center gap-2 rounded-2xl border border-transparent bg-white"
            >
              <div class="size-10 animate-pulse rounded-full bg-[#f0f0f0]" />
              <div class="h-[22px] w-16 animate-pulse rounded bg-[#f0f0f0]" />
            </div>
          </div>

          <!-- Empty search state. -->
          <div
            v-else-if="!visibleAssets.length"
            data-test="assets-empty"
            class="flex min-h-[160px] flex-col items-center justify-center py-6 text-center"
          >
            <ExclamationCircleIcon class="size-6 text-[#575757]" />
            <p class="mt-4 max-w-[300px] text-s-16 font-normal leading-[22px] text-[#575757]">
              {{ t('homePage.hero.watchlist.onboarding.assets.noResults') }}
            </p>
            <button
              type="button"
              data-test="assets-clear-search"
              class="mt-6 rounded-full bg-[#f5f5f5] px-6 py-3 text-s-16 font-semibold text-primary"
              @click="query = ''"
            >
              {{ t('homePage.hero.watchlist.onboarding.assets.clearSearch') }}
            </button>
          </div>

          <div v-else v-auto-animate class="grid grid-cols-4 gap-2">
            <WatchlistSelectableCard
              v-for="asset in visibleAssets"
              :key="asset.id"
              data-test="asset-card"
              :selected="selected.includes(asset.id)"
              bg="bg-white"
              class="flex h-[96px] flex-col items-center justify-center gap-2"
              @toggle="toggle(asset.id)"
            >
              <span class="relative">
                <AppTokenLogo
                  :url="asset.logoUrl"
                  :symbol="asset.symbol"
                  :is-stock="asset.type === 'stock'"
                  width="w-10"
                  height="h-10"
                  no-shadow
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
              <AppTokenSymbol
                :symbol="asset.symbol"
                :is-stock="asset.type === 'stock'"
                class="max-w-full text-center text-s-16 font-semibold text-black"
              />
            </WatchlistSelectableCard>
          </div>
        </div>
      </div>

      <!-- Show more divider (only while there is a hidden remainder). Kept
           outside the scroll area so its spacing to the footer is exact. -->
      <div v-if="hasMore" class="mt-6 flex shrink-0 items-center gap-5">
        <span class="h-px flex-1 bg-[#e6e6e6]" aria-hidden="true" />
        <button
          type="button"
          data-test="assets-show-more"
          class="hoverNoBG flex items-center gap-1 rounded-full px-3 py-1 text-s-14 font-semibold text-black"
          @click="showAll = true"
        >
          {{ t('search.show_more') }}
          <ChevronDownIcon class="size-4" />
        </button>
        <span class="h-px flex-1 bg-[#e6e6e6]" aria-hidden="true" />
      </div>

      <div class="mt-6 flex shrink-0 items-center justify-between gap-4">
        <!-- Selected chips: up to 2, then a "+N more" chip whose tooltip lists
             the rest by symbol. -->
        <div class="flex min-w-0 items-center gap-2">
          <span
            v-for="a in chipAssets"
            :key="a.id"
            data-test="selected-chip"
            class="flex h-8 min-w-0 items-center gap-1 rounded-full bg-[#f5f5f5] py-1 pl-1 pr-3"
          >
            <AppTokenLogo
              :url="a.logoUrl"
              :symbol="a.symbol"
              :is-stock="a.type === 'stock'"
              width="w-6"
              height="h-6"
            />
            <span
              class="max-w-[80px] truncate text-s-12 font-semibold text-black"
            >
              {{ a.symbol }}
            </span>
          </span>
          <AppTooltip
            v-if="overflowAssets.length"
            :text="overflowNames"
            position="middle"
            class="shrink-0"
          >
            <span
              data-test="selected-chip-more"
              class="flex h-8 shrink-0 items-center whitespace-nowrap rounded-full bg-[#f5f5f5] px-3 text-s-12 font-semibold text-black"
            >
              {{
                t('homePage.hero.watchlist.onboarding.assets.moreCount', {
                  count: overflowAssets.length,
                })
              }}
            </span>
          </AppTooltip>
        </div>

        <AppBaseButton
          data-test="assets-done"
          class="shrink-0"
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
            {{ t('homePage.hero.watchlist.onboarding.continue') }}
            <ChevronRightIcon class="size-5" />
          </span>
        </AppBaseButton>
      </div>
    </div>
  </div>
</template>

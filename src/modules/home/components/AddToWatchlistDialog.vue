<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppTabBar from '@/components/AppTabBar.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AssetPickerRow from './AssetPickerRow.vue'
import { sectors } from '@/modules/home/sectors'
import { useWatchlistStore, WATCHLIST_MAX } from '@/stores/watchlistTableStore'
import type { AppSelectOption } from '@/types/components/appSelect'
import {
  useAssetPicker,
  type AssetPickerItem,
  type AssetPickerTab,
} from '@/modules/home/composables/useAssetPicker'

const isOpen = defineModel<boolean>('isOpen', { required: true })

const { t } = useI18n()

const TABS: AssetPickerTab[] = ['stocks', 'crypto']

// Categories shown as chips next to "All" (Figma order); the rest of the tab's
// categories sit under "More". Values + labels come from the home sectors
// config, which mirrors the /stocks and /crypto filters.
const FEATURED: Record<AssetPickerTab, string[]> = {
  stocks: ['TECHNOLOGY', 'EQUITIES'],
  crypto: ['stablecoins', 'topGainers'],
}
const ALL_LABEL_KEY: Record<AssetPickerTab, string> = {
  stocks: 'homePage.hero.watchlist.addModal.allStocks',
  crypto: 'homePage.hero.watchlist.addModal.allCrypto',
}

const tab = ref<AssetPickerTab>('stocks')
const category = ref('all')
const query = ref('')
const { items, isLoading } = useAssetPicker(tab, category, query)

// Typing searches every market, so tabs and chips step aside.
const isSearching = computed(() => !!query.value.trim())

// AppTabBar is index-based. Categories differ per market, so a tab switch
// starts from "All" again (set in the same tick so the picker fetches once).
const tabIndex = computed({
  get: () => TABS.indexOf(tab.value),
  set: index => {
    if (TABS[index] === tab.value) return
    tab.value = TABS[index]
    category.value = 'all'
  },
})
const tabLabels = computed(() =>
  TABS.map(id => t(`homePage.hero.watchlist.addModal.tabs.${id}`)),
)

const tabCategories = computed<AppSelectOption[]>(() =>
  sectors
    .filter(s => s.market === tab.value && s.filter)
    .map(s => ({ value: s.filter as string, label: t(s.labelKey) })),
)
const chipOptions = computed<AppSelectOption[]>(() => [
  { value: 'all', label: t(ALL_LABEL_KEY[tab.value]) },
  ...FEATURED[tab.value].flatMap(v =>
    tabCategories.value.filter(c => c.value === v),
  ),
])
const moreOptions = computed(() =>
  tabCategories.value.filter(c => !FEATURED[tab.value].includes(c.value)),
)
// The More chip turns into the picked category (Figma); unset otherwise.
const moreSelected = computed(() =>
  moreOptions.value.find(o => o.value === category.value),
)
const isMoreOpen = ref(false)
const pickMore = (value: string, closeMenu: () => void) => {
  category.value = value
  closeMenu()
}

// --- Selection --------------------------------------------------------------
// Picks are a draft over the stored watchlist: already-listed assets start
// selected, and `flipped` holds the assets whose state the user changed (kept
// across tabs, categories and searches). Confirm applies them to the store.
const watchlistStore = useWatchlistStore()
const { watchListedTokens, watchListedStocks } = storeToRefs(watchlistStore)
const { setWatchlistItem, notifyWatchlistFull } = watchlistStore

const bucket = (type: AssetPickerItem['type']) =>
  (type === 'stock' ? watchListedStocks : watchListedTokens).value
const isListed = (item: AssetPickerItem) =>
  bucket(item.type).includes(item.watchlistId)

const flipped = reactive(new Map<string, AssetPickerItem>())
const isSelected = (item: AssetPickerItem) =>
  isListed(item) !== flipped.has(item.key)

// Bucket size once the draft is applied: the store caps each bucket, so the
// draft can't pick past it either.
const draftSize = (type: AssetPickerItem['type']) =>
  [...flipped.values()]
    .filter(item => item.type === type)
    .reduce((n, item) => n + (isListed(item) ? -1 : 1), bucket(type).length)

const toggle = (item: AssetPickerItem) => {
  if (flipped.has(item.key)) {
    flipped.delete(item.key)
    return
  }
  if (!isListed(item) && draftSize(item.type) >= WATCHLIST_MAX) {
    notifyWatchlistFull()
    return
  }
  flipped.set(item.key, item)
}

const addCount = computed(
  () => [...flipped.values()].filter(item => !isListed(item)).length,
)
const confirmLabel = computed(() => {
  if (addCount.value)
    return t('homePage.hero.watchlist.addModal.addAssets', addCount.value)
  return t(
    flipped.size
      ? 'homePage.hero.watchlist.addModal.update'
      : 'homePage.hero.watchlist.addModal.selectAssets',
  )
})

const confirm = () => {
  const changes = [...flipped.values()]
  // Removals first so they free room under the per-bucket cap before adding.
  const ordered = [
    ...changes.filter(isListed),
    ...changes.filter(item => !isListed(item)),
  ]
  for (const item of ordered)
    setWatchlistItem(item.watchlistId, item.type === 'stock')
  isOpen.value = false
}
</script>

<template>
  <AppDialog
    v-model:is-open="isOpen"
    class="sm:mx-auto sm:w-full sm:max-w-[480px]"
    close-class="top-6 right-6"
    data-test="add-to-watchlist-dialog"
  >
    <template #title>
      <h2
        id="dialogTitle"
        class="w-full px-14 pb-5 pt-7 text-center text-heading-base text-black"
      >
        {{ t('homePage.hero.watchlist.addModal.title') }}
      </h2>
    </template>
    <template #content>
      <div class="flex flex-col px-6">
        <AppSearchInput
          v-model="query"
          :placeholder="t('homePage.hero.watchlist.addModal.searchPlaceholder')"
          bg-class="bg-background-default"
        />

        <template v-if="!isSearching">
          <AppTabBar v-model="tabIndex" :tabs="tabLabels" class="mt-6" />

          <div
            role="group"
            :aria-label="t('homePage.hero.watchlist.addModal.categories')"
            class="mt-6 flex flex-wrap gap-2"
          >
            <button
              v-for="option in chipOptions"
              :key="option.value"
              type="button"
              data-test="picker-chip"
              :aria-pressed="category === option.value"
              class="flex h-8 items-center rounded-full border bg-background-default px-3 text-label-sm text-black transition-colors hover:bg-background-default-hover"
              :class="
                category === option.value
                  ? 'border-border-selected'
                  : 'border-transparent'
              "
              @click="category = option.value"
            >
              {{ option.label }}
            </button>
            <!-- Teleported so the dialog's scroll box can't clip the menu. -->
            <AppPopUpMenu
              location="left"
              teleport
              @update:open="isMoreOpen = $event"
            >
              <template #menu-button="{ toggleMenu }">
                <button
                  type="button"
                  data-test="picker-more"
                  :aria-pressed="!!moreSelected"
                  :aria-expanded="isMoreOpen"
                  class="flex h-8 items-center rounded-full border pl-3 pr-2 text-label-sm text-black transition-colors hover:bg-background-default-hover"
                  :class="[
                    moreSelected
                      ? 'border-border-selected'
                      : 'border-transparent',
                    isMoreOpen
                      ? 'bg-background-default-pressed'
                      : 'bg-background-default',
                  ]"
                  @click="toggleMenu"
                >
                  {{
                    moreSelected?.label ??
                    t('homePage.hero.watchlist.addModal.more')
                  }}
                  <AppIcon name="chevron-down" size="xs" class="ml-1" />
                </button>
              </template>
              <template #menu-content="{ toggleMenu }">
                <div
                  role="listbox"
                  data-test="picker-more-menu"
                  :aria-label="t('homePage.hero.watchlist.addModal.categories')"
                  class="mew-scrollbar flex max-h-64 w-[300px] max-w-full flex-col gap-1 overflow-y-auto p-1.5"
                >
                  <button
                    v-for="option in moreOptions"
                    :key="option.value"
                    type="button"
                    role="option"
                    :aria-selected="category === option.value"
                    class="flex h-12 shrink-0 items-center rounded-2xl px-4 text-left text-s-14 font-medium transition-colors hover:bg-background-default hover:text-text-brand"
                    :class="
                      category === option.value
                        ? 'bg-background-default text-text-brand'
                        : 'text-text-subtle'
                    "
                    @click="pickMore(option.value, toggleMenu)"
                  >
                    {{ option.label }}
                    <AppIcon
                      v-if="category === option.value"
                      name="check"
                      class="ml-auto"
                    />
                  </button>
                </div>
              </template>
            </AppPopUpMenu>
          </div>
        </template>

        <!-- Edgeless list: rows scroll up under the chips/search and down
             behind the footer button, softened by white fades (same idea as
             AppSlideGroup, vertical). Fixed height so the modal never resizes
             between tabs, categories or loading; it takes over the tabs + chips
             space while searching. pt/pb keep the first/last row clear of the
             fade and the button. -->
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-x-0 top-0 z-[1] h-6 bg-gradient-to-b from-white to-transparent"
            aria-hidden="true"
          />
          <div
            class="mew-scrollbar flex flex-col gap-0.5 overflow-y-auto pb-24 pt-6"
            :class="isSearching ? 'h-[578px]' : 'h-[468px]'"
          >
            <!-- Skeleton mirrors AssetPickerRow (star, avatar, name, price). -->
            <template v-if="isLoading">
              <div
                v-for="n in 6"
                :key="n"
                data-test="picker-skeleton"
                class="flex h-[68px] shrink-0 items-center gap-3 p-3"
                aria-hidden="true"
              >
                <div class="flex w-7 shrink-0 justify-center">
                  <div
                    class="size-4 animate-pulse rounded-full bg-background-skeleton"
                  />
                </div>
                <div
                  class="size-10 shrink-0 animate-pulse rounded-full bg-background-skeleton"
                />
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div
                    class="h-4 w-16 animate-pulse rounded bg-background-skeleton"
                  />
                  <div
                    class="h-3.5 w-24 animate-pulse rounded bg-background-skeleton"
                  />
                </div>
                <div class="flex flex-col items-end gap-1">
                  <div
                    class="h-4 w-16 animate-pulse rounded bg-background-skeleton"
                  />
                  <div
                    class="h-3.5 w-10 animate-pulse rounded bg-background-skeleton"
                  />
                </div>
              </div>
            </template>
            <p
              v-else-if="!items.length"
              data-test="picker-empty"
              class="py-16 text-center text-s-14 text-text-subtle"
            >
              {{ t('homePage.hero.watchlist.addModal.empty') }}
            </p>
            <AssetPickerRow
              v-for="item in items"
              v-else
              :key="item.key"
              :item="item"
              :selected="isSelected(item)"
              @toggle="toggle(item)"
            />
          </div>

          <!-- Footer floats over the list's bottom edge on a white fade. The
               disabled state keeps the brand fill, only dimmed (Figma). -->
          <div
            class="absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-white from-75% to-transparent pb-6 pt-6"
          >
            <AppBaseButton
              class="w-full disabled:!bg-background-brand disabled:opacity-40"
              :disabled="!flipped.size"
              @click="confirm"
            >
              {{ confirmLabel }}
            </AppBaseButton>
          </div>
        </div>
      </div>
    </template>
  </AppDialog>
</template>

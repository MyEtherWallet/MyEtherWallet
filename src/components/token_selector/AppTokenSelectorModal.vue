<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppModal from '@/components/modal/AppModal.vue'
import AppSearchbar from '@/components/AppSearchbar.vue'
import AppDropdown from '@/components/dropdown/AppDropdown.vue'
import AppCard from '@/components/card/AppCard.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import TokenSelectorAvatar from './TokenSelectorAvatar.vue'
import TokenSelectorList from './TokenSelectorList.vue'
import type {
  TokenSelectorItem,
  TokenSelectorNetwork,
  TokenSelectorSortDirection,
  TokenSelectorSortOption,
} from './types'

/**
 * Token selector (design library, MEW-2554, Figma 12526:110349): search and
 * network on top, quick-pick cards, "Recently viewed", then every token under a
 * sort control. Presentational: callers filter and sort `items` from `search`
 * and `sort`, so each flow keeps its own pipeline. Closes itself after `select`.
 */
const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    /** Main list, already filtered and sorted. Disabled items go last. */
    items: TokenSelectorItem[]
    quickPicks?: TokenSelectorItem[]
    recentItems?: TokenSelectorItem[]
    selectedId?: string
    sortOptions?: TokenSelectorSortOption[]
    /** Active sort; every pick emits `sort`, a repeat pick included. */
    sortValue?: string
    sortDirection?: TokenSelectorSortDirection
    /** Shows the network dropdown when set. */
    networks?: TokenSelectorNetwork[]
    /** Badge for rows that don't carry their own `chainIcon`. */
    networkIcon?: string | null
    loading?: boolean
    hasMore?: boolean
    loadingMore?: boolean
    disabledGroupTitle?: string
  }>(),
  {
    subtitle: undefined,
    quickPicks: () => [],
    recentItems: () => [],
    selectedId: undefined,
    sortOptions: () => [],
    sortValue: undefined,
    sortDirection: 'desc',
    networks: () => [],
    networkIcon: undefined,
    loading: false,
    hasMore: false,
    loadingMore: false,
    disabledGroupTitle: undefined,
  },
)

const open = defineModel<boolean>({ required: true })
const search = defineModel<string>('search', { default: '' })
const network = defineModel<string | null>('network', { default: null })

const emit = defineEmits<{
  select: [item: TokenSelectorItem]
  sort: [value: string]
  'load-more': []
}>()

const { t, locale } = useI18n()

const isSearching = computed(() => search.value.trim() !== '')
// Pinned sections make way for the results while searching.
const showPinned = computed(() => !isSearching.value && !props.loading)

const enabledItems = computed(() => props.items.filter(item => !item.disabled))
const disabledItems = computed(() => props.items.filter(item => item.disabled))

const emptyCopy = computed(() =>
  t(
    isSearching.value
      ? 'select_token.no_tokens_match'
      : 'select_token.no_tokens_available',
  ),
)

const currentNetwork = computed(
  () =>
    props.networks.find(item => item.value === network.value) ??
    props.networks[0],
)
const networkQuery = ref('')
const shownNetworks = computed(() => {
  const query = networkQuery.value.trim().toLowerCase()
  return query
    ? props.networks.filter(item => item.name.toLowerCase().includes(query))
    : props.networks
})

const activeSort = computed(
  () =>
    props.sortOptions.find(option => option.value === props.sortValue) ??
    props.sortOptions[0],
)
const sortTitle = computed(() =>
  activeSort.value
    ? t('select_token.sort_by', {
        option: activeSort.value.label.toLocaleLowerCase(locale.value),
      })
    : '',
)
const sortIcon = computed(() =>
  props.sortDirection === 'asc' ? 'arrow-long-up' : 'arrow-long-down',
)

const pick = (item: TokenSelectorItem) => {
  if (item.disabled) return
  emit('select', item)
  open.value = false
}

const onClosed = () => {
  search.value = ''
  networkQuery.value = ''
}
</script>

<template>
  <AppModal
    v-model="open"
    :title="title"
    :subtitle="subtitle"
    class="h-full sm:h-[640px]"
    @closed="onClosed"
  >
    <div class="flex h-full flex-col">
      <div
        data-testid="token-selector-toolbar"
        class="flex flex-none items-center gap-2 px-4 pt-1 pb-5 sm:px-6"
      >
        <AppSearchbar
          v-model="search"
          variant="default"
          class="min-w-0 flex-1"
          :placeholder="$t('select_token.search')"
        />
        <AppDropdown
          v-if="currentNetwork"
          v-model:search="networkQuery"
          size="s"
          surface="alternative"
          menu-align="end"
          class="shrink-0"
          :title="currentNetwork.name"
          :searchable="networks.length > 6"
          :search-placeholder="$t('select_token.search')"
          menu-class="max-h-80"
        >
          <template #avatar="{ size }">
            <AppAvatar
              type="network"
              :size="size"
              :url="currentNetwork.icon"
              :chain="currentNetwork.name"
            />
          </template>
          <AppCell
            v-for="item in shownNetworks"
            :key="item.value ?? 'all'"
            size="small"
            inset
            role="option"
            :aria-selected="item.value === network"
            :selected="item.value === network"
            :disabled="item.disabled"
            :title="item.name"
            @click="network = item.value"
          >
            <template #avatar="{ size }">
              <AppAvatar
                type="network"
                :size="size"
                :url="item.icon"
                :chain="item.name"
              />
            </template>
          </AppCell>
        </AppDropdown>
      </div>

      <div
        class="mew-scrollbar flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6 sm:px-6"
      >
        <slot name="before-list" />

        <div v-if="loading" class="flex flex-col gap-0.5" aria-busy="true">
          <AppCell v-for="n in 6" :key="n" inset loading />
        </div>

        <template v-else>
          <div
            v-if="showPinned && quickPicks.length"
            data-testid="token-selector-quick-picks"
            class="grid grid-cols-4 gap-2"
          >
            <AppCard
              v-for="item in quickPicks"
              :key="item.id"
              surface="alternative"
              interactive
              :label="item.symbol"
              :selected="item.id === selectedId || undefined"
              :disabled="item.disabled"
              @click="pick(item)"
            >
              <div
                class="flex h-[110px] flex-col items-center justify-center gap-2 p-4"
              >
                <TokenSelectorAvatar
                  :item="item"
                  size="l"
                  :network-icon="networkIcon"
                />
                <span
                  class="max-w-full truncate text-label-base text-text-default"
                >
                  {{ item.symbol }}
                </span>
              </div>
            </AppCard>
          </div>

          <section
            v-if="showPinned && recentItems.length"
            data-testid="token-selector-recent"
            class="flex flex-col gap-2"
            :aria-label="$t('select_token.recently_viewed')"
          >
            <p class="text-text-base text-text-subtle">
              {{ $t('select_token.recently_viewed') }}
            </p>
            <TokenSelectorList
              :items="recentItems"
              :selected-id="selectedId"
              :network-icon="networkIcon"
              @select="pick"
            >
              <template v-if="$slots['item-suffix']" #item-suffix="{ item }">
                <slot name="item-suffix" :item="item" />
              </template>
            </TokenSelectorList>
          </section>

          <section
            data-testid="token-selector-all"
            class="flex flex-col gap-2"
            :aria-label="$t('select_token.all_tokens')"
          >
            <div
              class="flex items-center gap-1 text-text-base text-text-subtle"
            >
              <span>{{ $t('select_token.all_tokens') }}</span>
              <template v-if="activeSort">
                <span aria-hidden="true">·</span>
                <AppDropdown bare :title="sortTitle">
                  <AppCell
                    v-for="option in sortOptions"
                    :key="option.value"
                    size="small"
                    inset
                    role="option"
                    :aria-selected="option.value === activeSort.value"
                    :title="option.label"
                    :right-accessory="
                      option.value === activeSort.value
                        ? { kind: 'icon', icon: sortIcon }
                        : undefined
                    "
                    @click="emit('sort', option.value)"
                  />
                </AppDropdown>
              </template>
            </div>

            <TokenSelectorList
              v-if="enabledItems.length"
              :items="enabledItems"
              :selected-id="selectedId"
              :network-icon="networkIcon"
              @select="pick"
            >
              <template v-if="$slots['item-suffix']" #item-suffix="{ item }">
                <slot name="item-suffix" :item="item" />
              </template>
            </TokenSelectorList>
            <p
              v-else-if="!disabledItems.length"
              data-testid="token-selector-empty"
              class="py-10 text-center text-text-base text-text-subtle"
            >
              {{ emptyCopy }}
            </p>
          </section>

          <section
            v-if="disabledItems.length"
            data-testid="token-selector-disabled"
            class="flex flex-col gap-2"
            :aria-label="disabledGroupTitle"
          >
            <p
              v-if="disabledGroupTitle"
              class="text-text-base text-text-subtle"
            >
              {{ disabledGroupTitle }}
            </p>
            <TokenSelectorList
              :items="disabledItems"
              :network-icon="networkIcon"
            >
              <template v-if="$slots['item-suffix']" #item-suffix="{ item }">
                <slot name="item-suffix" :item="item" />
              </template>
            </TokenSelectorList>
          </section>

          <AppBaseButton
            v-if="hasMore"
            data-testid="token-selector-load-more"
            type="secondary"
            class="self-center"
            :is-loading="loadingMore"
            @click="emit('load-more')"
          >
            {{ $t('common.load_more') }}
          </AppBaseButton>
        </template>
      </div>
    </div>
  </AppModal>
</template>

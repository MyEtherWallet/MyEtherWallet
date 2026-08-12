<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AssetPickerRow from './AssetPickerRow.vue'
import {
  useAssetPicker,
  type AssetPickerTab,
} from '@/modules/home/composables/useAssetPicker'

const isOpen = defineModel<boolean>('isOpen', { required: true })

const { t } = useI18n()

const TABS: { id: AssetPickerTab; labelKey: string }[] = [
  { id: 'all', labelKey: 'all' },
  { id: 'stocks', labelKey: 'stocks' },
  { id: 'crypto', labelKey: 'crypto' },
  { id: 'perps', labelKey: 'perps' },
]

const tab = ref<AssetPickerTab>('all')
const query = ref('')
const { items, isLoading } = useAssetPicker(tab, query, isOpen)
</script>

<template>
  <AppDialog
    v-model:is-open="isOpen"
    class="sm:mx-auto sm:w-full sm:max-w-[480px]"
    data-test="add-to-watchlist-dialog"
  >
    <template #content>
      <div class="flex max-h-[70vh] flex-col p-6">
        <h2 class="text-s-24 font-bold text-black">
          {{ t('homePage.hero.watchlist.addModal.title') }}
        </h2>
        <p class="mt-1 text-s-16 text-[#575757]">
          {{ t('homePage.hero.watchlist.addModal.subtitle') }}
        </p>

        <AppSearchInput
          v-model="query"
          :placeholder="t('homePage.hero.watchlist.addModal.searchPlaceholder')"
          class="mt-5"
        />

        <!-- Tabs -->
        <div
          class="mt-5 flex gap-6 border-b border-grey-outline/40"
          role="tablist"
        >
          <button
            v-for="tabItem in TABS"
            :key="tabItem.id"
            type="button"
            role="tab"
            data-test="picker-tab"
            :aria-selected="tab === tabItem.id"
            class="-mb-px border-b-2 pb-2 text-s-16 font-semibold transition-colors"
            :class="
              tab === tabItem.id
                ? 'border-black text-black'
                : 'border-transparent text-[#575757]'
            "
            @click="tab = tabItem.id"
          >
            {{ t(`homePage.hero.watchlist.addModal.tabs.${tabItem.labelKey}`) }}
          </button>
        </div>

        <!-- List -->
        <div class="mew-scrollbar mt-2 min-h-[240px] flex-1 overflow-y-auto">
          <div
            v-if="isLoading"
            data-test="picker-loading"
            class="flex h-[240px] items-center justify-center"
          >
            <span
              class="size-8 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-black"
              aria-hidden="true"
            />
          </div>
          <p
            v-else-if="!items.length"
            data-test="picker-empty"
            class="py-16 text-center text-s-14 text-[#575757]"
          >
            {{ t('homePage.hero.watchlist.addModal.empty') }}
          </p>
          <AssetPickerRow
            v-for="item in items"
            v-else
            :key="item.key"
            :item="item"
          />
        </div>
      </div>
    </template>
  </AppDialog>
</template>

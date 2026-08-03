<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
import AppIndustrySectorTile from '@/components/AppIndustrySectorTile.vue'
import { sectors, sectorLink } from '@/modules/home/sectors'
import type { Tab, Tab_Panel } from '@/types/components/appTabs'

const { t } = useI18n()

const activeTabIndex = ref(0)

const tabs = computed<Tab[]>(() => [
  {
    id: 'home-sectors-stocks-tab',
    name: t('homePage.listings.tab.stocks'),
    controlsPanel: 'home-sectors-stocks-panel',
  },
  {
    id: 'home-sectors-crypto-tab',
    name: t('homePage.listings.tab.crypto'),
    controlsPanel: 'home-sectors-crypto-panel',
  },
])

const panels: Tab_Panel[] = [
  {
    id: 'home-sectors-stocks-panel',
    ariaLabelledBy: 'home-sectors-stocks-tab',
  },
  {
    id: 'home-sectors-crypto-panel',
    ariaLabelledBy: 'home-sectors-crypto-tab',
  },
]

const tabSectors = computed(() =>
  sectors.filter(s => s.market === (activeTabIndex.value === 0 ? 'stocks' : 'crypto')),
)
</script>

<template>
  <div class="relative">
    <AppTabs
      v-model:activeTabIndex="activeTabIndex"
      :tabs="tabs"
      :panel="panels"
      :label="t('homePage.sectors.title')"
    >
      <template #tab-panel>
        <div class="relative mt-6">
          <AppSlideGroup :total-items="tabSectors.length">
            <template
              v-for="(s, index) in tabSectors"
              :key="s.id"
              #[`item-${index}`]
            >
              <AppIndustrySectorTile
                :label="t(s.labelKey)"
                :to="sectorLink(s)"
                class="mr-6"
              />
            </template>
          </AppSlideGroup>
        </div>
      </template>
    </AppTabs>
  </div>
</template>

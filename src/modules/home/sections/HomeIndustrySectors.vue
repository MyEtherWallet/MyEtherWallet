<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppTabBar from '@/components/AppTabBar.vue'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
import AppIndustrySectorTile from '@/components/AppIndustrySectorTile.vue'
import { sectors, sectorLink } from '@/modules/home/sectors'

const { t } = useI18n()

const activeTabIndex = ref(0)

const tabLabels = computed(() => [
  t('homePage.listings.tab.stocks'),
  t('homePage.listings.tab.crypto'),
])

const tabSectors = computed(() =>
  sectors.filter(s => s.market === (activeTabIndex.value === 0 ? 'stocks' : 'crypto')),
)
</script>

<template>
  <div class="relative">
    <AppTabBar v-model="activeTabIndex" :tabs="tabLabels" />
    <div class="relative mt-6">
      <AppSlideGroup :total-items="tabSectors.length" edge-nav>
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
  </div>
</template>

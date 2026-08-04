<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import AppTabBar from '@/components/AppTabBar.vue'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
import AppIndustrySectorTile from '@/components/AppIndustrySectorTile.vue'
import { sectors, sectorLink } from '@/modules/home/sectors'

const { t } = useI18n()

const activeTabIndex = ref(0)

const slideGroup = ref<{ scrollToStart: () => void } | null>(null)

// Reset the carousel to the first tile whenever the tab changes.
watch(activeTabIndex, () => {
  nextTick(() => slideGroup.value?.scrollToStart?.())
})

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
      <AppSlideGroup ref="slideGroup" :total-items="tabSectors.length" edge-nav>
        <template
          v-for="(s, index) in tabSectors"
          :key="s.id"
          #[`item-${index}`]
        >
          <AppIndustrySectorTile
            :label="t(s.labelKey)"
            :color="s.color"
            :icon="s.icon"
            :to="sectorLink(s)"
          />
        </template>
      </AppSlideGroup>
    </div>
  </div>
</template>

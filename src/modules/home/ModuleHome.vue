<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWalletStore } from '@/stores/walletStore'
import AppHomeSection from '@/components/AppHomeSection.vue'
import { homeSections } from './homeSections'

const { t } = useI18n()
const walletStore = useWalletStore()
const visible = computed(() =>
  homeSections.filter(
    s =>
      s.visibleWhen === 'always' ||
      (s.visibleWhen === 'connected') === walletStore.isWalletConnected,
  ),
)
</script>

<template>
  <div class="w-full">
    <AppHomeSection
      v-for="s in visible"
      :key="s.id"
      :title="t(s.titleKey)"
      :subtitle="t(s.subtitleKey)"
    >
      <component :is="s.component" />
    </AppHomeSection>
  </div>
</template>

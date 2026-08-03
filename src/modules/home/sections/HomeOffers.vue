<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppRewardsCard from '@/components/AppRewardsCard.vue'
import { useHomeOffers } from '../composables/useHomeOffers'

const { t } = useI18n()
const { offers } = useHomeOffers()
</script>

<template>
  <div class="grid gap-6 md:grid-cols-3">
    <AppRewardsCard
      v-for="o in offers"
      :key="o.id"
      :title="t(o.titleKey)"
      :description="t(o.descriptionKey)"
      :icon="o.icon"
      :to="o.to"
    />
  </div>
</template>

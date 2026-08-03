<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppRewardsCard from '@/components/AppRewardsCard.vue'
import { useHomeOffers } from '../composables/useHomeOffers'
import peggyAstronaut from '@/assets/images/home/offers/peggy-astronaut.svg'

const { t } = useI18n()
const { offers } = useHomeOffers()
</script>

<template>
  <div class="relative grid gap-6 md:grid-cols-3">
    <img
      :src="peggyAstronaut"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute -top-[92px] right-6 z-10 hidden h-[120px] w-auto md:block"
    />
    <AppRewardsCard
      v-for="o in offers"
      :key="o.id"
      :category="t(o.categoryKey)"
      :icon="o.icon"
      :title="t(o.titleKey)"
      :highlight="t(o.highlightKey)"
      :gradient="o.gradient"
      :to="o.to"
    />
  </div>
</template>

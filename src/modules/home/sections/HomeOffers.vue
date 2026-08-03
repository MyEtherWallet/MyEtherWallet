<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppRewardsCard from '@/components/AppRewardsCard.vue'
import { useHomeOffers } from '../composables/useHomeOffers'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import peggyAstronaut from '@/assets/images/home/offers/peggy-astronaut.svg'

const { t } = useI18n()
const { offers } = useHomeOffers()
const walletMenu = useWalletMenuStore()
</script>

<template>
  <div class="relative grid gap-6 md:grid-cols-3">
    <img
      :src="peggyAstronaut"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute -top-[120px] right-6 z-[1] hidden h-[120px] w-auto -scale-x-100 md:block"
    />
    <AppRewardsCard
      v-for="o in offers"
      :key="o.id"
      :category="t(o.categoryKey)"
      :icon="o.icon"
      :title="t(o.titleKey)"
      :highlight="t(o.highlightKey)"
      :gradient="o.gradient"
      @click="walletMenu.openPanel(o.panel)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppRewardsCard from '@/components/AppRewardsCard.vue'
import RwaTradeInfoModal from '@/modules/rwa_rewards/RwaTradeInfoModal.vue'
import { useHomeOffers, type HomeOffer } from '../composables/useHomeOffers'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useHoldingsStore } from '@/stores/holdingsStore'
import peggyAstronaut from '@/assets/images/home/offers/peggy-astronaut.svg'

const { t } = useI18n()
const { offers } = useHomeOffers()
const walletMenu = useWalletMenuStore()
const holdingsStore = useHoldingsStore()

// Reuse the Portfolio "Rewards & offers" popups: the trade offer opens the
// "Trade and get 5 USDC" learn-more modal (Portfolio's trade card), the hold
// offer opens the holdings rewards modal (Portfolio's hold card, store-driven
// and mounted app-wide). Buy keeps its wallet side-panel.
const isTradeInfoOpen = ref(false)
const onOfferClick = (offer: HomeOffer) => {
  if (offer.id === 'trade') isTradeInfoOpen.value = true
  else if (offer.id === 'hold') holdingsStore.openModal()
  else walletMenu.openPanel(offer.panel)
}
</script>

<template>
  <div class="relative grid gap-6 md:grid-cols-3">
    <!-- peggy peeks out from behind the cards: it's the first (earliest-DOM)
         positioned child, so with no positive z-index the cards paint over its
         lower half, giving the "emerging from behind" look. -->
    <img
      :src="peggyAstronaut"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute -top-[116px] right-6 hidden h-[120px] w-auto -scale-x-100 md:block"
    />
    <AppRewardsCard
      v-for="o in offers"
      :key="o.id"
      :category="t(o.categoryKey)"
      :icon="o.icon"
      :title="t(o.titleKey)"
      :highlight="t(o.highlightKey)"
      :gradient="o.gradient"
      @click="onOfferClick(o)"
    />
  </div>
  <RwaTradeInfoModal v-if="isTradeInfoOpen" v-model:is-open="isTradeInfoOpen" />
</template>

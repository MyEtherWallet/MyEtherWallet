<template>
  <base-tooltip
    :anchor="anchor"
    :visible="visible"
    :placement="placement"
    @dismiss="onDismiss"
  >
    <template v-if="entry">
      <!-- Asset image. Optional: entries can be published without one. -->
      <img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="entry.image?.alternativeText || ''"
        class="w-10 h-10 rounded-full bg-white object-cover mb-4"
      />

      <!-- Headline -->
      <p class="text-s-14 font-semibold leading-[1.3] mb-1 pr-6">
        {{ entry.title }}
      </p>

      <!-- Body -->
      <p class="text-s-12 text-info leading-[1.4]">
        {{ entry.description }}
      </p>

      <!-- CTA. `ctaText` is nullable in the CMS, so fall back to the existing
           "Trade now" copy — which is what the button does either way. -->
      <app-base-button
        size="small"
        class="mt-4 text-s-14 font-semibold tracking-[-0.28px]"
        @click="onCta"
      >
        {{ entry.ctaText || $t('trade.weekend.trade_now') }}
      </app-base-button>
    </template>
  </base-tooltip>
</template>

<script setup lang="ts">
/**
 * CMS-driven marketing tooltip running an A/B test.
 *
 * Content comes from Strapi; the user is bucketed into arm A or B on first
 * exposure and stays there. The arms differ in placement as well as copy:
 * A is pinned to the Trade button, B floats in the lower-left with no tail.
 * See `marketingVariantStore` for the assignment and the Amplitude reporting.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BaseTooltip from '@/components/core_layouts/BaseTooltip.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import { useMarketingVariantStore } from '@/stores/marketingVariantStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useGlobalStore } from '@/stores/globalStore'
import { strapiMediaUrl } from '@/utils/strapiMedia'
import type { MarketingEntry, MarketingVariant } from '@/types/marketing'

const props = defineProps<{
  anchor: HTMLElement | null
}>()

const marketing = useMarketingVariantStore()
const { canShow } = storeToRefs(marketing)

const walletMenu = useWalletMenuStore()
const { walletPanel } = storeToRefs(walletMenu)

const { isTradingRestrictedInRegion } = storeToRefs(useGlobalStore())

const visible = ref(false)
// Both held locally so the rendered copy and placement can't change under the
// user if the store's resolved entry shifts while the tooltip is on screen.
const entry = ref<MarketingEntry | null>(null)
const arm = ref<MarketingVariant | null>(null)

// B floats in the lower-left corner and drops the tail; A stays pinned to the
// Trade button.
const placement = computed<'anchor' | 'bottom-left'>(() =>
  arm.value === 'B' ? 'bottom-left' : 'anchor',
)

const imageSrc = computed(() => strapiMediaUrl(entry.value?.image))

onMounted(() => {
  marketing.load()
})

const tryShow = () => {
  if (visible.value) return
  if (isTradingRestrictedInRegion.value) return
  // The anchor is awaited for both arms: the bucket isn't known until the
  // exposure is committed below, and waiting costs nothing (the Trade button
  // exists as soon as the parent mounts) while avoiding a mispositioned first
  // paint for A.
  if (!canShow.value || !props.anchor) return
  // Buckets the user, reports the exposure, and returns the arm + its entry.
  const shown = marketing.markShown()
  if (!shown) return
  entry.value = shown.entry
  arm.value = shown.variant
  visible.value = true
}

const onDismiss = () => {
  if (!visible.value) return
  visible.value = false
  marketing.trackDismiss()
}

const onCta = () => {
  if (!visible.value) return
  visible.value = false
  marketing.trackCtaClick()
  walletMenu.openPanel('trade')
}

watch(
  [canShow, () => props.anchor, isTradingRestrictedInRegion],
  () => tryShow(),
  { immediate: true },
)

// The Trade panel opening by any other route hides the tooltip for this
// session only — it is not an answer to the offer, so the campaign continues.
watch(walletPanel, newVal => {
  if (newVal === 'trade' && visible.value) {
    visible.value = false
    marketing.hideForSession()
  }
})
</script>

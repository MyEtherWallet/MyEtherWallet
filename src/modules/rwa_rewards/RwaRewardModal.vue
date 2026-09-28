<template>
  <app-dialog
    v-model:is-open="isOpen"
    hide-close
    class="sm:max-w-[480px] w-full !rounded-32"
    z-index-overlay="z-[200]"
    z-index-container="z-[201]"
  >
    <template #content>
      <div class="relative flex flex-col items-start p-6 gap-14 w-full">
        <img
          :src="heroImg"
          alt=""
          class="pointer-events-none select-none absolute top-0 right-0 w-[178px] object-contain"
        />
        <app-btn-icon-close
          class="absolute top-4 right-4 z-20 bg-[#f5f5f5]"
          @close="holdingsStore.closeModal()"
        />

        <div class="relative z-10 flex flex-col items-start gap-2 pr-[150px]">
          <p
            class="text-s-28 font-bold leading-8 tracking-[-0.84px] text-black whitespace-pre-line"
          >
            {{ headline }}
          </p>
        </div>

        <div class="relative z-10 flex flex-col gap-8 w-full">
          <div class="flex flex-col w-full">
            <rwa-modal-step
              v-for="(step, i) in steps"
              :key="step.kind"
              :variant="step.state"
              :number="step.number"
              :connector-blue="step.state === 'done'"
              :stretch="step.hasContent"
              :last="i === steps.length - 1"
              :data-test="`rwa-step-${step.kind}`"
            >
              <div
                class="flex flex-col items-start gap-3"
                :class="{ 'pb-7': step.hasContent }"
              >
                <p
                  class="flex items-center min-h-6"
                  :class="step.state === 'plain' ? stepText : boldText"
                >
                  {{ step.label }}
                </p>

                <!-- Step 1 — the offer: invite the trade, or say why not. -->
                <template v-if="step.kind === 'trade' && isOffer">
                  <div
                    v-if="isDisabledCta"
                    class="flex items-center justify-center min-w-40 h-12 px-4 rounded-24 bg-[#f5f5f5] text-[#767676] text-s-16 font-semibold tracking-[-0.32px] whitespace-nowrap"
                  >
                    {{ disabledCtaLabel }}
                  </div>
                  <app-base-button
                    v-else
                    class="min-w-40 text-s-16 font-semibold tracking-[-0.32px]"
                    data-test="rwa-modal-trade"
                    @click="onTrade"
                  >
                    {{
                      $t('rwaRewards.trade_amount', {
                        amount: qualificationAmount,
                      })
                    }}
                  </app-base-button>
                </template>

                <!-- Hold steps — the day grid while holding or after a loss. -->
                <template
                  v-else-if="
                    (step.kind === 'hold1' || step.kind === 'hold2') &&
                    (step.state === 'current' || step.state === 'failed')
                  "
                >
                  <rwa-hold-tracker
                    :current="holdCurrent"
                    :failed-day="
                      step.state === 'failed' ? holdCurrent : undefined
                    "
                    :total="holdTotalDays"
                  />
                  <p v-if="step.state === 'current'" :class="boldText">
                    {{ holdDaysLeftLabel }}
                  </p>
                  <p
                    v-if="step.state === 'current' && step.kind === 'hold2'"
                    :class="subText"
                  >
                    {{ $t('rwaRewards.hold_warning') }}
                  </p>
                  <!-- Round 1 can be started over; a finished round 2 is terminal. -->
                  <template v-if="step.state === 'failed' && !isRoundTwoActive">
                    <app-base-button
                      v-if="canRetryTrade"
                      class="min-w-40 text-s-16 font-semibold tracking-[-0.32px]"
                      data-test="rwa-modal-trade-again"
                      @click="onTrade"
                    >
                      {{ $t('rwaRewards.trade_again') }}
                    </app-base-button>
                    <div
                      v-else
                      class="flex items-center justify-center min-w-40 h-12 px-4 rounded-24 bg-[#f5f5f5] text-[#767676] text-s-16 font-semibold tracking-[-0.32px] whitespace-nowrap"
                    >
                      {{ disabledCtaLabel }}
                    </div>
                  </template>
                </template>

                <!-- Claim steps — the reward card while claimable or expired. -->
                <template
                  v-else-if="
                    (step.kind === 'claim1' || step.kind === 'claim2') &&
                    (step.state === 'current' || step.state === 'failed')
                  "
                >
                  <div
                    :class="subCard"
                    class="flex items-center gap-3 w-full"
                    data-test="rwa-modal-claim-card"
                  >
                    <img
                      :src="usdcIcon"
                      alt=""
                      class="w-[42px] h-[42px] shrink-0"
                    />
                    <div class="flex flex-col flex-1 min-w-0">
                      <p :class="titleText">{{ rewardLabel }}</p>
                      <p
                        v-if="step.state === 'current' && hasRewardExpiry"
                        :class="subText"
                      >
                        {{
                          $t('rwaRewards.expires_in', { time: subExpiresText })
                        }}
                      </p>
                    </div>
                    <app-base-button
                      v-if="step.state === 'current'"
                      size="medium"
                      :is-loading="isClaiming"
                      class="min-w-[120px] shrink-0 whitespace-nowrap text-s-16 font-semibold tracking-[-0.32px]"
                      data-test="rwa-modal-claim"
                      @click="onClaim"
                    >
                      {{
                        isWatchOnly
                          ? $t('rwaRewards.login')
                          : $t('rwaRewards.claim')
                      }}
                    </app-base-button>
                    <span
                      v-else
                      class="shrink-0 py-1 px-2 rounded-8 bg-[#ffdbe3] text-[#cc0452] text-s-11 font-bold leading-[15px] tracking-sp-06 uppercase whitespace-nowrap"
                    >
                      {{ $t('rwaRewards.reward_expired') }}
                    </span>
                  </div>
                  <template v-if="step.state === 'failed' && !isRoundTwoActive">
                    <app-base-button
                      v-if="canRetryTrade"
                      class="min-w-40 text-s-16 font-semibold tracking-[-0.32px]"
                      data-test="rwa-modal-trade-again"
                      @click="onTrade"
                    >
                      {{ $t('rwaRewards.trade_again') }}
                    </app-base-button>
                    <div
                      v-else
                      class="flex items-center justify-center min-w-40 h-12 px-4 rounded-24 bg-[#f5f5f5] text-[#767676] text-s-16 font-semibold tracking-[-0.32px] whitespace-nowrap"
                    >
                      {{ disabledCtaLabel }}
                    </div>
                  </template>
                </template>
              </div>
            </rwa-modal-step>

            <!-- Both rewards paid: nothing follows this season. -->
            <app-base-button
              v-if="isSeasonComplete"
              class="w-full mt-5 text-s-16 font-semibold tracking-[-0.32px]"
              data-test="rwa-modal-discover"
              @click="onDiscoverRewards"
            >
              {{ $t('rwaRewards.discover_more_rewards') }}
            </app-base-button>

            <!-- Why there is (or isn't yet) a second round after the first
                 claim — nothing actionable, so a plain note. -->
            <p v-if="round2Notice" :class="subText" class="w-full mt-4 px-1">
              {{ round2Notice }}
            </p>

            <!-- Sits outside the status branches: a wallet under review keeps
                 whichever progress view it had, with the review explained here. -->
            <div
              v-if="showNotice"
              class="flex items-center justify-center w-full gap-4 p-4 mt-4 rounded-16 bg-[#f5f5f5]"
            >
              <lock-closed-icon class="w-6 h-6 text-primary shrink-0" />
              <div class="flex flex-col gap-0.5 flex-1">
                <p :class="titleText">{{ noticeTitle }}</p>
                <p :class="bodyText">{{ noticeDesc }}</p>
              </div>
              <app-base-button
                v-if="status === 'banned' || isUnderReview"
                theme="neutral"
                size="medium"
                class="shrink-0 text-s-14 font-semibold tracking-[-0.28px] whitespace-nowrap"
                @click="onContactSupport"
              >
                {{ $t('rwaRewards.contact_support') }}
              </app-base-button>
            </div>
          </div>

          <div class="h-px bg-[#e6e6e6] w-full"></div>

          <div class="flex items-center justify-between gap-4 w-full">
            <!-- A season that has already ended has nothing left to count down
                 to; an empty countdown means `/info` returned no season end. -->
            <p :class="bodyText">
              <template v-if="!isCampaignEnded && expiresText">
                {{ $t('rwaRewards.ends_in', { time: expiresText }) }}
              </template>
            </p>
            <a
              :href="rewardsPageUrl"
              target="_blank"
              rel="noopener"
              class="text-s-16 font-semibold tracking-[-0.32px] text-primary hover:underline"
              data-test="rwa-modal-terms"
              @click="trackCta('terms')"
            >
              {{ $t('rwaRewards.terms_and_conditions') }}
            </a>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useHoldingsStore } from '@/stores/holdingsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import { useCountdown } from '@/modules/rwa_rewards/composables/useCountdown'
import { useRewardSteps } from '@/modules/rwa_rewards/composables/useRewardSteps'
import RwaHoldTracker from '@/modules/rwa_rewards/RwaHoldTracker.vue'
import RwaModalStep from '@/modules/rwa_rewards/RwaModalStep.vue'
import { LockClosedIcon } from '@heroicons/vue/24/solid'
import { show as showIntercom } from '@intercom/messenger-js-sdk'
import heroImg from '@/assets/images/rwa-rewards/hold-and-get-usdc-large.webp'
import usdcIcon from '@/assets/images/rwa-rewards/usdc-icon.png'
import configs from '@/configs'
import { analytics, RerwadsAndOffersEvent } from '@/analytics'

const holdingsStore = useHoldingsStore()
const walletMenuStore = useWalletMenuStore()
const { isWatchOnly } = storeToRefs(useWalletStore())
const { openAccessDialog } = useAccessStore()
const {
  isModalOpen,
  seasonEnd,
  status,
  activeReward,
  info,
  isClaiming,
  isCampaignFull,
  isCampaignEnded,
  isUnderReview,
  isRegionBlocked,
  canRetryTrade,
  qualificationAmount,
  isRoundTwoActive,
  round2Status,
  holdTotalDays,
  hasRoundTwo,
  round1HoldDays,
  round2HoldDays,
  round1RewardAmountLabel,
  round2RewardAmountLabel,
  totalRewardAmountLabel,
  rewardAmountLabel,
} = storeToRefs(holdingsStore)
const { t } = useI18n()
const rewardsPageUrl = configs.REWARDS_PAGE_URL

const { text: expiresText } = useCountdown(() => seasonEnd.value)
// Strictly the reward's own claim deadline — never the season end. The two are
// different deadlines, and `expiration_timestamp` is optional: the store reads
// its absence as "never expires" (see `isClaimable`), so substituting the
// season end would put a countdown on a reward that has none.
const { text: subExpiresText } = useCountdown(
  () => activeReward.value?.expiration_timestamp,
)
const hasRewardExpiry = computed(
  () => !!activeReward.value?.expiration_timestamp,
)
const { remainingMs: holdRemaining } = useCountdown(
  () => activeReward.value?.qualification_timestamp,
)
const holdDaysLeftLabel = computed(() => {
  const days = Math.max(0, Math.ceil((holdRemaining.value ?? 0) / 86_400_000))
  return t('rwaRewards.days_left', {
    time: `${days} ${t('rwaRewards.unit_day', days)}`,
  })
})

const isOpen = computed({
  get: () => isModalOpen.value,
  set: value =>
    value ? holdingsStore.openModal() : holdingsStore.closeModal(),
})

// Deliberately keyed on `status`, not `isUnderReview`: a wallet under review
// that still has an entry keeps its progress view, and only one with nothing to
// show falls back to the disabled offer.
const isDisabledCta = computed(
  () =>
    status.value === 'notEligible' ||
    status.value === 'temporarilyPaused' ||
    status.value === 'campaignFull' ||
    status.value === 'underReview' ||
    status.value === 'campaignEnded',
)
const isOffer = computed(
  () =>
    status.value === 'default' ||
    isDisabledCta.value ||
    status.value === 'banned',
)
const showNotice = computed(
  () =>
    status.value === 'notEligible' ||
    status.value === 'banned' ||
    isUnderReview.value,
)
const disabledCtaLabel = computed(() => {
  if (isUnderReview.value) return t('rwaRewards.under_review')
  if (status.value === 'temporarilyPaused')
    return t('rwaRewards.temporarily_paused')
  if (status.value === 'campaignEnded') return t('rwaRewards.campaign_ended')
  if (isCampaignFull.value) return t('rwaRewards.campaign_full')
  return t('rwaRewards.not_eligible')
})
const noticeTitle = computed(() => {
  if (isUnderReview.value) return t('rwaRewards.modal_under_review_title')
  if (status.value === 'banned') return t('rwaRewards.modal_banned_title')
  // A bare `Forbidden` is the season refusing the region, so say that rather
  // than passing a jurisdiction block off as a verdict on the wallet.
  return isRegionBlocked.value
    ? t('trade.trading_not_available')
    : t('rwaRewards.modal_not_eligible_title')
})
const noticeDesc = computed(() => {
  if (isUnderReview.value) return t('rwaRewards.modal_under_review_desc')
  if (status.value === 'banned') return t('rwaRewards.modal_banned_desc')
  return isRegionBlocked.value
    ? t('trade.trading_restricted')
    : t('rwaRewards.modal_not_eligible_desc')
})

const round = computed<1 | 2>(() => (isRoundTwoActive.value ? 2 : 1))
// Fire a reward-offer CTA event for an offer-modal action
const trackCta = (cta: string) =>
  analytics.trackRewardsAndOffersEvent(RerwadsAndOffersEvent.CLICKED_CTA, {
    campaign: 'hold',
    cta,
    card_status: status.value,
    round: round.value,
    location: 'offers_card',
  })

const onContactSupport = () => {
  trackCta('contact_support')
  showIntercom()
}

const holdCurrent = computed(() => {
  const start = activeReward.value?.start_timestamp
  if (!start) return 1
  const elapsed = Math.floor(
    (Date.now() - new Date(start).getTime()) / 86_400_000,
  )
  return Math.min(Math.max(elapsed + 1, 1), holdTotalDays.value)
})

// Server-driven when the season block has landed; the campaign's advertised
// round-1 copy otherwise.
const round1Label = computed(
  () => round1RewardAmountLabel.value ?? t('rwaRewards.reward_amount'),
)
const round2Label = computed(
  () => round2RewardAmountLabel.value ?? round1Label.value,
)
const rewardLabel = computed(
  () => rewardAmountLabel.value ?? t('rwaRewards.reward_amount'),
)

// "Hold and get up to 25 USDC" once both rounds' amounts are known; the
// single-round headline otherwise.
const headline = computed(() =>
  hasRoundTwo.value && totalRewardAmountLabel.value
    ? t('rwaRewards.hero_title_total', { total: totalRewardAmountLabel.value })
    : t('rwaRewards.hero_title', { amount: round1Label.value }),
)

const qualifyingLabel = computed(() => {
  const r = activeReward.value
  if (!r?.qualifying_amount) return ''
  const meta = info.value?.metas?.find(m => m.id === r.id)
  const symbol = meta?.symbol ?? ''
  // Multi-chain metas keep ids/decimals as parallel arrays — pick the entry's
  // own chain rather than assuming the first.
  const chainIndex =
    meta?.crypto?.ids?.findIndex(id => id.startsWith(`${r.chain_id}:`)) ?? -1
  const decimals =
    meta?.crypto?.decimals?.[chainIndex === -1 ? 0 : chainIndex] ?? 18
  const amount = new BigNumber(r.qualifying_amount).shiftedBy(-decimals)
  if (amount.isNaN()) return ''
  return `${amount.toFormat()} ${symbol}`.trim()
})

const { steps } = useRewardSteps({
  status,
  isRoundTwoActive,
  hasRoundTwo,
  round1HoldDays,
  round2HoldDays,
  qualificationAmount,
  qualifyingLabel,
  round1Label,
  round2Label,
})

// Both rewards paid, or the only reward on a single-round season.
const isSeasonComplete = computed(
  () =>
    status.value === 'claimed' &&
    (isRoundTwoActive.value || !hasRoundTwo.value),
)

// After the first claim there may be nothing actionable about round 2 — the
// pool ran out, or the entry is still being opened. Say which, once.
const round2Notice = computed(() => {
  if (status.value !== 'claimed' || isRoundTwoActive.value) return ''
  if (round2Status.value === 'UNAVAILABLE')
    return t('rwaRewards.r2_unavailable_notice')
  if (round2Status.value === 'ELIGIBLE')
    return t('rwaRewards.r2_setting_up_notice')
  return ''
})

const stepText = 'text-s-14 leading-5 text-[#575757]'
const boldText =
  'text-s-14 font-semibold leading-5 text-black tracking-[-0.28px]'
const titleText =
  'text-s-14 font-semibold leading-5 tracking-[-0.28px] text-black'
const bodyText = 'text-s-14 font-normal leading-5 text-[#575757]'
const subText = 'text-s-12 leading-[18px] text-[#575757]'
const subCard = 'p-5 rounded-16 border border-black/15 bg-white'

const onTrade = () => {
  trackCta('trade')
  walletMenuStore.openPanel('trade')
  holdingsStore.closeModal()
}
const onDiscoverRewards = () => {
  trackCta('discover_rewards')
  window.open(rewardsPageUrl, '_blank', 'noopener')
}
const onClaim = async () => {
  // A watch-only address can't sign the claim — send the user to log in with a
  // full wallet instead.
  if (isWatchOnly.value) {
    holdingsStore.closeModal()
    openAccessDialog()
    return
  }
  trackCta('claim')
  const reward = activeReward.value
  if (!reward || isClaiming.value) return
  // Toasts (success/error) are emitted by holdingsStore.claim itself.
  await holdingsStore.claim(reward)
}
</script>

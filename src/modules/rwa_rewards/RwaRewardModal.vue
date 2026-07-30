<template>
  <app-dialog
    v-model:is-open="isOpen"
    hide-close
    class="sm:max-w-[480px] w-full !rounded-32"
    z-index-overlay="z-[200]"
    z-index-container="z-[201]"
  >
    <template #content>
      <div class="relative flex flex-col items-start p-6 gap-20 w-full">
        <img
          :src="heroImg"
          alt=""
          class="pointer-events-none select-none absolute top-0 right-0 w-[178px] object-contain"
        />
        <app-btn-icon-close
          class="absolute top-4 right-4 z-20 bg-[#f5f5f5]"
          @close="holdingsStore.closeModal()"
        />

        <div class="relative z-10 flex flex-col items-start gap-2">
          <p class="text-s-12 leading-[18px] text-[#575757]">
            {{ $t('rwaRewards.hero_offer_expires', { time: expiresText }) }}
          </p>
          <p
            class="text-s-28 font-bold leading-8 tracking-[-0.84px] text-black whitespace-pre-line"
          >
            {{ $t('rwaRewards.hero_title') }}
          </p>
        </div>

        <div class="relative z-10 flex flex-col gap-8 w-full">
          <div class="flex flex-col w-full">
            <!-- DEFAULT (offer) -->
            <template v-if="isOffer">
              <rwa-modal-step
                variant="plain"
                :number="1"
                :stretch="hasStep1Cta"
              >
                <div
                  class="flex flex-col items-start gap-3"
                  :class="{ 'pb-5': hasStep1Cta }"
                >
                  <p :class="stepText" class="h-6 mb-[14px]">
                    {{ $t('rwaRewards.modal_step1') }}
                    <span :class="boldText"
                      >&nbsp;{{ $t('rwaRewards.modal_step1_bold') }}</span
                    >
                  </p>
                  <div
                    v-if="
                      status === 'temporarilyPaused' ||
                      status === 'campaignFull' ||
                      status === 'underReview' ||
                      status === 'campaignEnded'
                    "
                    class="flex items-center w-full h-12 pr-5 justify-between rounded-full bg-[#e6e6e6]"
                  >
                    <div
                      class="flex items-center justify-center shrink-0 w-40 h-12 px-4 rounded-24 bg-[#f5f5f5] text-[#767676] text-s-16 font-semibold tracking-[-0.32px]"
                    >
                      {{ $t('rwaRewards.trade_now') }}
                    </div>
                    <div class="flex items-center gap-2">
                      <span
                        class="text-s-14 font-normal leading-5 text-[#575757] whitespace-nowrap"
                        >{{ disabledCtaLabel }}</span
                      >
                      <information-circle-icon
                        class="w-[22px] h-[22px] text-[#575757] shrink-0"
                      />
                    </div>
                  </div>
                  <app-base-button
                    v-else-if="status === 'default'"
                    class="w-40 text-s-16 font-semibold tracking-[-0.32px]"
                    @click="onTrade"
                  >
                    {{ $t('rwaRewards.trade_now') }}
                  </app-base-button>
                </div>
              </rwa-modal-step>
              <rwa-modal-step variant="plain" :number="2">
                <p :class="stepText" class="flex items-center h-6">
                  {{ $t('rwaRewards.modal_step2_pre')
                  }}<span :class="boldText"
                    >&nbsp;{{ $t('rwaRewards.modal_step2_bold') }}</span
                  >&nbsp;{{ $t('rwaRewards.modal_step2_post') }}
                </p>
              </rwa-modal-step>
              <rwa-modal-step variant="plain" :number="3" last>
                <p :class="stepText" class="flex items-center h-6">
                  {{ $t('rwaRewards.modal_step3')
                  }}<span :class="boldText"
                    >&nbsp;{{ $t('rwaRewards.modal_step3_bold') }}</span
                  >
                </p>
              </rwa-modal-step>
            </template>

            <!-- HOLDING -->
            <template v-else-if="status === 'holding'">
              <rwa-modal-step variant="done" connector-blue>
                <p :class="stepText" class="flex items-center h-6">
                  {{ $t('rwaRewards.modal_qualifying_trade')
                  }}<span :class="boldText">&nbsp;{{ qualifyingLabel }}</span>
                </p>
              </rwa-modal-step>
              <rwa-modal-step variant="current" :number="2" stretch>
                <div class="flex flex-col items-start gap-3 pb-7">
                  <p :class="stepText" class="flex items-center h-6">
                    {{ $t('rwaRewards.modal_step2_pre')
                    }}<span :class="boldText"
                      >&nbsp;{{ $t('rwaRewards.modal_step2_bold') }}</span
                    >&nbsp;{{ $t('rwaRewards.modal_step2_post') }}
                  </p>
                  <rwa-hold-tracker :current="holdCurrent" />
                  <p :class="boldText">{{ holdDaysLeftLabel }}</p>
                </div>
              </rwa-modal-step>
              <rwa-modal-step variant="plain" :number="3" last>
                <p :class="stepText" class="flex items-center h-6">
                  {{ $t('rwaRewards.modal_step3')
                  }}<span :class="boldText"
                    >&nbsp;{{ $t('rwaRewards.modal_step3_bold') }}</span
                  >
                </p>
              </rwa-modal-step>
            </template>

            <!-- LOST -->
            <template v-else-if="status === 'lost'">
              <rwa-modal-step variant="doneGrey">
                <p :class="mutedText" class="flex items-center h-6">
                  {{ $t('rwaRewards.modal_qualifying_trade') }}
                  {{ qualifyingLabel }}
                </p>
              </rwa-modal-step>
              <rwa-modal-step variant="failed" stretch>
                <div class="flex flex-col items-start gap-3 pb-7">
                  <p class="text-s-14 font-semibold leading-5 text-[#e40c58]">
                    {{ $t('rwaRewards.modal_lost_title') }}
                  </p>
                  <p :class="stepText">
                    {{
                      $t('rwaRewards.modal_lost_desc', {
                        amount: qualifyingLabel,
                      })
                    }}
                  </p>
                  <rwa-hold-tracker
                    :current="holdCurrent"
                    :failed-day="holdCurrent"
                  />
                  <div class="flex items-center gap-2 w-full">
                    <app-base-button
                      v-if="canRegisterTrade"
                      class="flex-1 text-s-16 font-semibold tracking-[-0.32px]"
                      @click="onTrade"
                    >
                      {{ $t('rwaRewards.start_again') }}
                    </app-base-button>
                    <!-- The season stopped taking new entries, so there is
                         nothing to start again. -->
                    <div
                      v-else
                      class="flex flex-1 items-center justify-center h-12 px-4 rounded-24 bg-[#f5f5f5] text-[#767676] text-s-16 font-semibold tracking-[-0.32px] whitespace-nowrap"
                    >
                      {{ disabledCtaLabel }}
                    </div>
                    <div
                      :class="expiresPill"
                      class="flex items-center justify-center"
                    >
                      {{
                        $t('rwaRewards.hero_offer_expires', {
                          time: expiresText,
                        })
                      }}
                    </div>
                  </div>
                </div>
              </rwa-modal-step>
              <rwa-modal-step variant="plain" :number="3" last>
                <p :class="mutedText" class="flex items-center h-6">
                  {{ $t('rwaRewards.modal_step3') }}
                  {{ $t('rwaRewards.modal_step3_bold') }}
                </p>
              </rwa-modal-step>
            </template>

            <!-- EARNED / CLAIMED / EXPIRED (steps 1 & 2 done) -->
            <template v-else>
              <rwa-modal-step variant="done" connector-blue>
                <p :class="stepText" class="flex items-center h-6">
                  {{ $t('rwaRewards.modal_qualifying_trade')
                  }}<span :class="boldText">&nbsp;{{ qualifyingLabel }}</span>
                </p>
              </rwa-modal-step>
              <rwa-modal-step variant="done" connector-blue>
                <p :class="stepText" class="flex items-center h-6">
                  {{ $t('rwaRewards.modal_held_14') }}
                </p>
              </rwa-modal-step>

              <rwa-modal-step
                v-if="status === 'earned'"
                variant="current"
                :number="3"
                last
              >
                <div class="flex flex-col items-start gap-0.5">
                  <p :class="titleText">
                    {{ $t('rwaRewards.modal_claim_title') }}
                  </p>
                  <p :class="stepText">
                    {{ $t('rwaRewards.modal_claim_desc') }}
                  </p>
                </div>
              </rwa-modal-step>
              <div
                v-if="status === 'earned'"
                :class="subCard"
                class="flex items-center gap-3 w-full mt-5"
              >
                <img
                  :src="usdcIcon"
                  alt=""
                  class="w-[42px] h-[42px] shrink-0"
                />
                <div class="flex flex-col flex-1 min-w-0">
                  <p :class="titleText">
                    {{ $t('rwaRewards.reward_amount') }}
                  </p>
                  <p :class="subText">
                    {{
                      $t('rwaRewards.hero_offer_expires', {
                        time: subExpiresText,
                      })
                    }}
                  </p>
                </div>
                <app-base-button
                  size="medium"
                  :is-loading="isClaiming"
                  class="min-w-[120px] shrink-0 whitespace-nowrap text-s-16 font-semibold tracking-[-0.32px]"
                  @click="onClaim"
                >
                  {{
                    isWatchOnly
                      ? $t('rwaRewards.login')
                      : $t('rwaRewards.claim')
                  }}
                </app-base-button>
              </div>

              <rwa-modal-step
                v-if="status === 'claimed'"
                variant="done"
                :number="3"
                last
              >
                <p :class="titleText">
                  {{ $t('rwaRewards.modal_claimed_step') }}
                </p>
              </rwa-modal-step>
              <div
                v-if="status === 'claimed'"
                :class="subCard"
                class="flex items-center gap-3 w-full mt-5"
              >
                <img
                  :src="usdcIcon"
                  alt=""
                  class="w-[42px] h-[42px] shrink-0"
                />
                <div class="flex flex-col flex-1 min-w-0">
                  <p :class="titleText">
                    {{ $t('rwaRewards.reward_amount') }}
                  </p>
                  <p :class="subText">
                    {{ $t('rwaRewards.sub_claimed') }}
                  </p>
                </div>
                <div
                  class="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-success"
                >
                  <check-icon class="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <rwa-modal-step
                v-if="status === 'expired'"
                variant="failed"
                :number="3"
                last
              >
                <p :class="titleText">
                  {{ $t('rwaRewards.modal_expired_step') }}
                </p>
              </rwa-modal-step>
              <div
                v-if="status === 'expired'"
                :class="subCard"
                class="flex items-center gap-3 w-full mt-5"
              >
                <img
                  :src="usdcIcon"
                  alt=""
                  class="w-[42px] h-[42px] shrink-0"
                />
                <div class="flex flex-col flex-1 min-w-0">
                  <p :class="titleText">
                    {{ $t('rwaRewards.reward_amount') }}
                  </p>
                  <p :class="subText">
                    {{ $t('rwaRewards.sub_closed') }}
                  </p>
                </div>
                <div
                  class="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-[#e40c58]"
                >
                  <x-mark-icon class="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </template>

            <!-- Sits outside the status branches: a wallet under review keeps
                 whichever progress view it had, with the review explained here. -->
            <div
              v-if="showNotice"
              class="flex items-center justify-center w-full gap-4 p-4 mt-4 rounded-16 bg-[#f5f5f5]"
            >
              <lock-closed-icon class="w-6 h-6 text-primary shrink-0" />
              <div class="flex flex-col gap-0.5 flex-1">
                <p :class="titleText">
                  {{ noticeTitle }}
                </p>
                <p :class="bodyText">
                  {{ noticeDesc }}
                </p>
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

          <div class="flex flex-col gap-3 w-full">
            <p :class="titleText">
              {{ $t('rwaRewards.offer_rules') }}
            </p>
            <ul class="list-disc pl-[21px] m-0 flex flex-col gap-3">
              <li v-for="(rule, i) in offerRules" :key="i" :class="bodyText">
                {{ rule }}
              </li>
            </ul>
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
import { CheckIcon, XMarkIcon } from '@heroicons/vue/16/solid'
import { useHoldingsStore } from '@/stores/holdingsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import { useCountdown } from '@/modules/rwa_rewards/useCountdown'
import RwaHoldTracker from '@/modules/rwa_rewards/RwaHoldTracker.vue'
import RwaModalStep from '@/modules/rwa_rewards/RwaModalStep.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { LockClosedIcon } from '@heroicons/vue/24/solid'
import { show as showIntercom } from '@intercom/messenger-js-sdk'
import heroImg from '@/assets/images/rwa-rewards/hold-and-get-usdc-large.webp'
import usdcIcon from '@/assets/images/rwa-rewards/usdc-icon.png'
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
  isUnderReview,
  canRegisterTrade,
} = storeToRefs(holdingsStore)
const { text: expiresText } = useCountdown(() => seasonEnd.value)
const { text: subExpiresText } = useCountdown(
  () => activeReward.value?.expiration_timestamp,
)
const { t } = useI18n()
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
const hasStep1Cta = computed(
  () =>
    status.value === 'default' ||
    status.value === 'temporarilyPaused' ||
    status.value === 'campaignFull' ||
    status.value === 'underReview' ||
    status.value === 'campaignEnded',
)
const WALLET_MIN_AGE_DAYS = 14
const eligibilityCutoff = computed(() => {
  const d = new Date(Date.now() - WALLET_MIN_AGE_DAYS * 86_400_000)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getDate()}`
})
const noticeTitle = computed(() => {
  if (isUnderReview.value) return t('rwaRewards.modal_under_review_title')
  return status.value === 'banned'
    ? t('rwaRewards.modal_banned_title')
    : t('rwaRewards.modal_not_eligible_title')
})
const noticeDesc = computed(() => {
  if (isUnderReview.value) return t('rwaRewards.modal_under_review_desc')
  return status.value === 'banned'
    ? t('rwaRewards.modal_banned_desc')
    : t('rwaRewards.modal_not_eligible_desc', {
        date: eligibilityCutoff.value,
      })
})
// Fire a reward-offer CTA event for an offer-modal action
const trackCta = (cta: string) =>
  analytics.trackRewardsAndOffersEvent(RerwadsAndOffersEvent.CLICKED_CTA, {
    campaign: 'hold',
    cta,
    card_status: status.value,
    location: 'offers_card',
  })

const onContactSupport = () => {
  trackCta('contact_support')
  showIntercom()
}

const campaignEndText = computed(() => {
  const iso = seasonEnd.value
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZoneName: 'short',
  }).formatToParts(d)
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  const minute = get('minute')
  const period = get('dayPeriod').toLowerCase()
  const time =
    minute === '0'
      ? `${get('hour')}${period}`
      : `${get('hour')}:${minute.padStart(2, '0')}${period}`
  return `${get('month')} ${get('day')} at ${time} ${get('timeZoneName')}`
})

const offerRules = computed(() => [
  t('rwaRewards.offer_rule_1'),
  t('rwaRewards.offer_rule_2'),
  t('rwaRewards.offer_rule_3'),
  t('rwaRewards.offer_rule_4'),
  t('rwaRewards.offer_rule_5'),
  t('rwaRewards.offer_rule_6'),
  t('rwaRewards.offer_rule_7', { date: campaignEndText.value }),
])

const HOLD_TOTAL = 14
const holdCurrent = computed(() => {
  const start = activeReward.value?.start_timestamp
  if (!start) return 1
  const elapsed = Math.floor(
    (Date.now() - new Date(start).getTime()) / 86_400_000,
  )
  return Math.min(Math.max(elapsed + 1, 1), HOLD_TOTAL)
})

const qualifyingLabel = computed(() => {
  const r = activeReward.value
  if (!r?.qualifying_amount) return ''
  const meta = info.value?.metas?.find(m => m.id === r.id)
  const symbol = meta?.symbol ?? ''
  const decimals = meta?.crypto?.decimals?.[0] ?? 18
  const amount = new BigNumber(r.qualifying_amount).shiftedBy(-decimals)
  if (amount.isNaN()) return ''
  return `${amount.toFormat()} ${symbol}`.trim()
})

const stepText = 'text-s-14 leading-5 text-[#575757]'
const boldText = 'font-semibold text-black tracking-[-0.28px]'
const mutedText = 'text-s-14 leading-5 text-grey-subtle'
const titleText =
  'text-s-14 font-semibold leading-5 tracking-[-0.28px] text-black'
const bodyText = 'text-s-14 font-normal leading-5 text-[#575757]'
const subText = 'text-s-12 leading-[18px] text-[#575757]'
const expiresPill =
  'h-12 px-4 rounded-24 bg-[#e6e6e6] text-[#575757] text-s-14 font-semibold whitespace-nowrap'
const subCard = 'p-5 rounded-16 border border-black/15 bg-white'

const onTrade = () => {
  trackCta('trade')
  walletMenuStore.openPanel('trade')
  holdingsStore.closeModal()
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

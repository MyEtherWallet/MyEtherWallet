<template>
  <app-dialog
    v-model:is-open="isOpen"
    hide-close
    class="sm:max-w-[480px] w-full !rounded-32"
  >
    <template #content>
      <div
        class="relative flex flex-col items-start"
        style="padding: 24px; gap: 80px; width: 100%"
      >
        <img
          :src="heroImg"
          alt=""
          class="pointer-events-none select-none absolute"
          style="top: 0; right: 0; width: 178px; object-fit: contain"
        />
        <button
          class="absolute flex items-center justify-center hoverOpacityHasBG"
          style="
            top: 16px;
            right: 16px;
            width: 32px;
            height: 32px;
            border-radius: 24px;
            background: #f5f5f5;
            z-index: 20;
          "
          aria-label="Close"
          @click="holdingsStore.closeModal()"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 6l8 8M14 6l-8 8"
              stroke="#000"
              stroke-width="1.75"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div class="relative z-10 flex flex-col items-start" style="gap: 8px">
          <p style="font-size: 12px; line-height: 18px; color: #575757">
            {{ $t('rwaRewards.hero_offer_expires', { time: expiresText }) }}
          </p>
          <p
            style="
              font-size: 28px;
              font-weight: 700;
              line-height: 32px;
              letter-spacing: -0.84px;
              color: #000;
              white-space: pre-line;
            "
          >
            {{ $t('rwaRewards.hero_title') }}
          </p>
        </div>

        <div class="relative z-10 flex flex-col" style="gap: 32px; width: 100%">
          <div class="flex flex-col" style="width: 100%">
            <!-- DEFAULT (offer) -->
            <template v-if="isOffer">
              <rwa-modal-step variant="plain" :number="1" :stretch="hasStep1Cta">
                <div
                  class="flex flex-col items-start"
                  :style="{ gap: '12px', paddingBottom: hasStep1Cta ? '20px' : '0' }"
                >
                  <p :style="stepText" class="flex items-center" style="height: 24px">
                    {{ $t('rwaRewards.modal_step1') }}
                    <span :style="boldText">&nbsp;{{ $t('rwaRewards.modal_step1_bold') }}</span>
                  </p>
                  <div
                    v-if="status === 'temporarilyPaused' || status === 'campaignEnded'"
                    class="flex items-center"
                    style="
                      width: 100%;
                      height: 48px;
                      padding-right: 20px;
                      justify-content: space-between;
                      border-radius: 999px;
                      background: #e6e6e6;
                    "
                  >
                    <div
                      class="flex items-center justify-center shrink-0"
                      style="
                        width: 160px;
                        height: 48px;
                        padding: 0 16px;
                        border-radius: 24px;
                        background: #f5f5f5;
                        color: #767676;
                        font-size: 16px;
                        font-weight: 600;
                        letter-spacing: -0.32px;
                      "
                    >
                      {{ $t('rwaRewards.trade_now') }}
                    </div>
                    <div class="flex items-center" style="gap: 8px">
                      <span
                        style="
                          font-size: 14px;
                          font-weight: 400;
                          line-height: 20px;
                          color: #575757;
                          white-space: nowrap;
                        "
                        >{{ disabledCtaLabel }}</span
                      >
                      <information-circle-icon
                        style="width: 22px; height: 22px; color: #575757; flex-shrink: 0"
                      />
                    </div>
                  </div>
                  <button v-else-if="status === 'default'" :style="tradeBtn" class="flex items-center justify-center hoverOpacityHasBG" @click="onTrade">
                    {{ $t('rwaRewards.trade_now') }}
                  </button>
                </div>
              </rwa-modal-step>
              <rwa-modal-step variant="plain" :number="2">
                <p :style="stepText" class="flex items-center" style="height: 24px">
                  {{ $t('rwaRewards.modal_step2_pre') }}<span :style="boldText">&nbsp;{{ $t('rwaRewards.modal_step2_bold') }}</span>&nbsp;{{ $t('rwaRewards.modal_step2_post') }}
                </p>
              </rwa-modal-step>
              <rwa-modal-step variant="plain" :number="3" last>
                <p :style="stepText" class="flex items-center" style="height: 24px">
                  {{ $t('rwaRewards.modal_step3') }}<span :style="boldText">&nbsp;{{ $t('rwaRewards.modal_step3_bold') }}</span>
                </p>
              </rwa-modal-step>
              <div
                v-if="showNotice"
                class="flex items-center justify-center"
                style="
                  width: 100%;
                  gap: 16px;
                  padding: 16px;
                  margin-top: 16px;
                  border-radius: 16px;
                  background: #f5f5f5;
                "
              >
                <lock-closed-icon
                  style="width: 24px; height: 24px; color: #005ae5; flex-shrink: 0"
                />
                <div class="flex flex-col" style="gap: 2px; flex: 1">
                  <p style="font-size: 14px; font-weight: 600; line-height: 20px; letter-spacing: -0.28px; color: #000">
                    {{ noticeTitle }}
                  </p>
                  <p style="font-size: 14px; font-weight: 400; line-height: 20px; color: #575757">
                    {{ noticeDesc }}
                  </p>
                </div>
                <button
                  v-if="status === 'banned'"
                  class="flex items-center justify-center hoverOpacityHasBG shrink-0"
                  style="
                    height: 40px;
                    padding: 0 12px;
                    border-radius: 24px;
                    background: #e6e6e6;
                    color: #000;
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 20px;
                    letter-spacing: -0.28px;
                    white-space: nowrap;
                  "
                  @click="onContactSupport"
                >
                  {{ $t('rwaRewards.contact_support') }}
                </button>
              </div>
            </template>

            <!-- HOLDING -->
            <template v-else-if="status === 'holding'">
              <rwa-modal-step variant="done" connector-blue>
                <p :style="stepText" class="flex items-center" style="height: 24px">
                  {{ $t('rwaRewards.modal_qualifying_trade') }}<span :style="boldText">&nbsp;{{ qualifyingLabel }}</span>
                </p>
              </rwa-modal-step>
              <rwa-modal-step variant="current" :number="2" stretch>
                <div class="flex flex-col items-start" style="gap: 12px; padding-bottom: 28px">
                  <p :style="stepText" class="flex items-center" style="height: 24px">
                    {{ $t('rwaRewards.modal_step2_pre') }}<span :style="boldText">&nbsp;{{ $t('rwaRewards.modal_step2_bold') }}</span>&nbsp;{{ $t('rwaRewards.modal_step2_post') }}
                  </p>
                  <rwa-hold-tracker :current="holdCurrent" />
                  <p :style="boldText">{{ holdDaysLeftLabel }}</p>
                </div>
              </rwa-modal-step>
              <rwa-modal-step variant="plain" :number="3" last>
                <p :style="stepText" class="flex items-center" style="height: 24px">
                  {{ $t('rwaRewards.modal_step3') }}<span :style="boldText">&nbsp;{{ $t('rwaRewards.modal_step3_bold') }}</span>
                </p>
              </rwa-modal-step>
            </template>

            <!-- LOST -->
            <template v-else-if="status === 'lost'">
              <rwa-modal-step variant="doneGrey">
                <p :style="mutedText" class="flex items-center" style="height: 24px">
                  {{ $t('rwaRewards.modal_qualifying_trade') }} {{ qualifyingLabel }}
                </p>
              </rwa-modal-step>
              <rwa-modal-step variant="failed" stretch>
                <div class="flex flex-col items-start" style="gap: 12px; padding-bottom: 28px">
                  <p style="font-size: 14px; font-weight: 600; line-height: 20px; color: #e40c58">
                    {{ $t('rwaRewards.modal_lost_title') }}
                  </p>
                  <p :style="stepText">
                    {{ $t('rwaRewards.modal_lost_desc', { amount: qualifyingLabel }) }}
                  </p>
                  <rwa-hold-tracker :current="holdCurrent" :failed-day="holdCurrent" />
                  <div class="flex items-center" style="gap: 8px; width: 100%">
                    <button :style="startAgainBtn" class="flex items-center justify-center hoverOpacityHasBG" @click="onTrade">
                      {{ $t('rwaRewards.start_again') }}
                    </button>
                    <div :style="expiresPill" class="flex items-center justify-center">
                      {{ $t('rwaRewards.hero_offer_expires', { time: expiresText }) }}
                    </div>
                  </div>
                </div>
              </rwa-modal-step>
              <rwa-modal-step variant="plain" :number="3" last>
                <p :style="mutedText" class="flex items-center" style="height: 24px">
                  {{ $t('rwaRewards.modal_step3') }} {{ $t('rwaRewards.modal_step3_bold') }}
                </p>
              </rwa-modal-step>
            </template>

            <!-- EARNED / CLAIMED / EXPIRED (steps 1 & 2 done) -->
            <template v-else>
              <rwa-modal-step variant="done" connector-blue>
                <p :style="stepText" class="flex items-center" style="height: 24px">
                  {{ $t('rwaRewards.modal_qualifying_trade') }}<span :style="boldText">&nbsp;{{ qualifyingLabel }}</span>
                </p>
              </rwa-modal-step>
              <rwa-modal-step variant="done" connector-blue>
                <p :style="stepText" class="flex items-center" style="height: 24px">
                  {{ $t('rwaRewards.modal_held_14') }}
                </p>
              </rwa-modal-step>

              <rwa-modal-step v-if="status === 'earned'" variant="current" :number="3" last>
                <div class="flex flex-col items-start" style="gap: 2px">
                  <p style="font-size: 14px; font-weight: 600; line-height: 20px; letter-spacing: -0.28px; color: #000">
                    {{ $t('rwaRewards.modal_claim_title') }}
                  </p>
                  <p :style="stepText">{{ $t('rwaRewards.modal_claim_desc') }}</p>
                </div>
              </rwa-modal-step>
              <div
                v-if="status === 'earned'"
                :style="subCard"
                class="flex items-center"
                style="gap: 12px; width: 100%; margin-top: 20px"
              >
                <img :src="usdcIcon" alt="" style="width: 42px; height: 42px; flex-shrink: 0" />
                <div class="flex flex-col" style="flex: 1; min-width: 0">
                  <p style="font-size: 14px; font-weight: 600; line-height: 20px; letter-spacing: -0.28px; color: #000">
                    {{ $t('rwaRewards.reward_amount') }}
                  </p>
                  <p style="font-size: 12px; line-height: 18px; color: #575757">
                    {{ $t('rwaRewards.hero_offer_expires', { time: subExpiresText }) }}
                  </p>
                </div>
                <button :style="claimBtn" class="flex items-center justify-center hoverOpacityHasBG" @click="onClaim">
                  {{ $t('rwaRewards.claim') }}
                </button>
              </div>

              <rwa-modal-step v-if="status === 'claimed'" variant="done" :number="3" last>
                <p style="font-size: 14px; font-weight: 600; line-height: 20px; letter-spacing: -0.28px; color: #000">
                  {{ $t('rwaRewards.modal_claimed_step') }}
                </p>
              </rwa-modal-step>
              <div
                v-if="status === 'claimed'"
                :style="subCard"
                class="flex items-center"
                style="gap: 12px; width: 100%; margin-top: 20px"
              >
                <img :src="usdcIcon" alt="" style="width: 42px; height: 42px; flex-shrink: 0" />
                <div class="flex flex-col" style="flex: 1; min-width: 0">
                  <p style="font-size: 14px; font-weight: 600; line-height: 20px; letter-spacing: -0.28px; color: #000">
                    {{ $t('rwaRewards.reward_amount') }}
                  </p>
                  <p style="font-size: 12px; line-height: 18px; color: #575757">
                    {{ $t('rwaRewards.sub_claimed') }}
                  </p>
                </div>
                <div class="flex items-center justify-center shrink-0" style="width: 24px; height: 24px; border-radius: 100px; background: #05c0a5">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10.5l3.5 3.5L15 6.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>

              <rwa-modal-step v-if="status === 'expired'" variant="failed" :number="3" last>
                <p style="font-size: 14px; font-weight: 600; line-height: 20px; letter-spacing: -0.28px; color: #000">
                  {{ $t('rwaRewards.modal_expired_step') }}
                </p>
              </rwa-modal-step>
              <div
                v-if="status === 'expired'"
                :style="subCard"
                class="flex items-center"
                style="gap: 12px; width: 100%; margin-top: 20px"
              >
                <img :src="usdcIcon" alt="" style="width: 42px; height: 42px; flex-shrink: 0" />
                <div class="flex flex-col" style="flex: 1; min-width: 0">
                  <p style="font-size: 14px; font-weight: 600; line-height: 20px; letter-spacing: -0.28px; color: #000">
                    {{ $t('rwaRewards.reward_amount') }}
                  </p>
                  <p style="font-size: 12px; line-height: 18px; color: #575757">
                    {{ $t('rwaRewards.sub_closed') }}
                  </p>
                </div>
                <div class="flex items-center justify-center shrink-0" style="width: 24px; height: 24px; border-radius: 100px; background: #e40c58">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M6 6l8 8M14 6l-8 8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </div>
              </div>
            </template>
          </div>

          <div style="height: 1px; background: #e6e6e6; width: 100%"></div>

          <div class="flex flex-col" style="gap: 12px; width: 100%">
            <p style="font-size: 14px; font-weight: 600; line-height: 20px; letter-spacing: -0.28px; color: #000">
              {{ $t('rwaRewards.offer_rules') }}
            </p>
            <ul style="list-style: disc; padding-left: 21px; margin: 0; display: flex; flex-direction: column; gap: 12px">
              <li
                v-for="(rule, i) in offerRules"
                :key="i"
                style="
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 20px;
                  color: #575757;
                "
              >
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
import { useHoldingsStore } from '@/stores/holdingsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useCountdown } from '@/modules/rwa_rewards/useCountdown'
import RwaHoldTracker from '@/modules/rwa_rewards/RwaHoldTracker.vue'
import RwaModalStep from '@/modules/rwa_rewards/RwaModalStep.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { LockClosedIcon } from '@heroicons/vue/24/solid'
import { show as showIntercom } from '@intercom/messenger-js-sdk'
import heroImg from '@/assets/images/rwa-rewards/hold-and-get-usdc.webp'
import usdcIcon from '@/assets/images/rwa-rewards/usdc-icon.png'

const holdingsStore = useHoldingsStore()
const walletMenuStore = useWalletMenuStore()
const { isModalOpen, seasonEnd, status, activeReward, info } =
  storeToRefs(holdingsStore)
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
  set: value => (value ? holdingsStore.openModal() : holdingsStore.closeModal()),
})

const isDisabledCta = computed(
  () =>
    status.value === 'notEligible' ||
    status.value === 'temporarilyPaused' ||
    status.value === 'campaignEnded',
)
const isOffer = computed(
  () =>
    status.value === 'default' ||
    isDisabledCta.value ||
    status.value === 'banned',
)
const showNotice = computed(
  () => status.value === 'notEligible' || status.value === 'banned',
)
const disabledCtaLabel = computed(() => {
  if (status.value === 'temporarilyPaused')
    return t('rwaRewards.temporarily_paused')
  if (status.value === 'campaignEnded') return t('rwaRewards.campaign_ended')
  return t('rwaRewards.not_eligible')
})
const hasStep1Cta = computed(
  () =>
    status.value === 'default' ||
    status.value === 'temporarilyPaused' ||
    status.value === 'campaignEnded',
)
const WALLET_MIN_AGE_DAYS = 14
const eligibilityCutoff = computed(() => {
  const d = new Date(Date.now() - WALLET_MIN_AGE_DAYS * 86_400_000)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getDate()}`
})
const noticeTitle = computed(() =>
  status.value === 'banned'
    ? t('rwaRewards.modal_banned_title')
    : t('rwaRewards.modal_not_eligible_title'),
)
const noticeDesc = computed(() =>
  status.value === 'banned'
    ? t('rwaRewards.modal_banned_desc')
    : t('rwaRewards.modal_not_eligible_desc', { date: eligibilityCutoff.value }),
)
const onContactSupport = () => showIntercom()

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
  t('rwaRewards.offer_rule_6', { date: campaignEndText.value }),
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

const stepText = { fontSize: '14px', lineHeight: '20px', color: '#575757' }
const boldText = { fontWeight: 600, color: '#000', letterSpacing: '-0.28px' }
const mutedText = { fontSize: '14px', lineHeight: '20px', color: '#a5a5a5' }
const tradeBtn = {
  width: '160px',
  height: '48px',
  borderRadius: '24px',
  background: '#005ae5',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '-0.32px',
}
const startAgainBtn = {
  flex: 1,
  height: '48px',
  borderRadius: '24px',
  background: '#005ae5',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '-0.32px',
}
const expiresPill = {
  height: '48px',
  padding: '0 16px',
  borderRadius: '24px',
  background: '#e6e6e6',
  color: '#575757',
  fontSize: '14px',
  fontWeight: 600,
  whiteSpace: 'nowrap' as const,
}
const subCard = {
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid rgba(0,0,0,0.15)',
  background: '#fff',
}
const claimBtn = {
  width: '120px',
  height: '40px',
  borderRadius: '20px',
  background: '#005ae5',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '-0.32px',
  flexShrink: 0,
}

const onTrade = () => {
  walletMenuStore.openPanel('trade')
  holdingsStore.closeModal()
}
const onClaim = () => {
  if (activeReward.value) holdingsStore.claim(activeReward.value)
}
</script>
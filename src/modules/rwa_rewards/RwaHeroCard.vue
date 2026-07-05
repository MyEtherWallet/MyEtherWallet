<template>
  <div
    class="relative isolate bg-white overflow-hidden flex flex-col justify-between items-start h-full"
    style="
      border: 1px solid #e6e6e6;
      border-radius: 16px;
      padding: 20px;
      min-height: 293px;
    "
  >
    <img
      v-if="status !== 'banned'"
      :src="gradientBg"
      alt=""
      class="pointer-events-none select-none absolute top-0 left-0 w-full"
      style="height: 140px; object-fit: cover; object-position: top"
    />
    <img
      v-if="status === 'lost' || status === 'expired'"
      :src="peggyCrying"
      alt=""
      class="pointer-events-none select-none absolute"
      style="top: 20px; right: 20px; height: 84px; object-fit: contain"
    />
    <img
      v-else-if="status === 'earned' || status === 'claimed'"
      :src="peggyCool"
      alt=""
      class="pointer-events-none select-none absolute"
      style="top: 20px; right: 20px; height: 84px; object-fit: contain"
    />
    <img
      v-else-if="status !== 'banned'"
      :src="heroImg"
      alt=""
      class="pointer-events-none select-none absolute top-0 right-0"
      style="width: 108px; height: 120px; object-fit: contain"
    />

    <template v-if="status === 'holding'">
      <div class="relative z-10" style="width: 100%">
        <p
          style="
            font-size: 20px;
            font-weight: 700;
            line-height: 22px;
            letter-spacing: -0.4px;
            color: #000;
            max-width: 210px;
          "
        >
          {{ $t('rwaRewards.hero_holding_title') }}
        </p>
      </div>

      <div
        class="relative z-10 flex flex-col"
        style="gap: 16px; width: 100%"
      >
        <rwa-hold-tracker
          :current="holdCurrent"
          :days-left-label="daysLeftLabel"
        />
        <button
          class="flex items-center justify-center hoverOpacityHasBG"
          style="
            width: 100%;
            height: 48px;
            border-radius: 24px;
            background: #e6e6e6;
            color: #000;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: -0.32px;
          "
          @click="onMoreInfo"
        >
          {{ $t('rwaRewards.more_info') }}
        </button>
      </div>
    </template>

    <template v-else-if="status === 'lost'">
      <div class="relative z-10 flex flex-col" style="gap: 4px; max-width: 200px">
        <p
          style="
            font-size: 12px;
            font-weight: 400;
            line-height: 18px;
            color: #575757;
            white-space: nowrap;
          "
        >
          {{ $t('rwaRewards.hero_offer_expires', { time: expiresText }) }}
        </p>
        <p
          style="
            font-size: 20px;
            font-weight: 700;
            line-height: 22px;
            letter-spacing: -0.4px;
            color: #000;
          "
        >
          {{ $t('rwaRewards.hero_lost_title') }}
        </p>
        <p style="font-size: 12px; line-height: 18px; color: #575757">
          {{ $t('rwaRewards.hero_lost_desc') }}
        </p>
      </div>

      <div
        class="relative z-10 flex flex-col"
        style="gap: 16px; width: 100%"
      >
        <rwa-hold-tracker :current="holdCurrent" :failed-day="holdCurrent" />
        <div class="flex" style="gap: 8px; width: 100%">
          <button
            class="flex items-center justify-center hoverOpacityHasBG"
            style="
              flex: 1;
              height: 48px;
              border-radius: 24px;
              background: #005ae5;
              color: #fff;
              font-size: 16px;
              font-weight: 600;
              letter-spacing: -0.32px;
            "
            @click="onTrade"
          >
            {{ $t('rwaRewards.trade_again') }}
          </button>
          <button
            class="flex items-center justify-center hoverOpacityHasBG"
            style="
              height: 48px;
              padding: 0 24px;
              border-radius: 24px;
              background: #e6e6e6;
              color: #000;
              font-size: 16px;
              font-weight: 600;
              letter-spacing: -0.32px;
            "
            @click="onMoreInfo"
          >
            {{ $t('rwaRewards.more_info') }}
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="status === 'earned'">
      <div class="relative z-10 flex flex-col" style="gap: 4px; max-width: 200px">
        <p
          style="
            font-size: 20px;
            font-weight: 700;
            line-height: 22px;
            letter-spacing: -0.4px;
            color: #000;
          "
        >
          {{ $t('rwaRewards.hero_earned_title') }}
        </p>
        <p style="font-size: 12px; line-height: 18px; color: #575757">
          {{ $t('rwaRewards.hero_earned_desc') }}
        </p>
      </div>
      <rwa-claim-card
        class="relative z-10"
        variant="claim"
        :amount-label="$t('rwaRewards.reward_amount')"
        :subtitle="$t('rwaRewards.sub_expires', { time: subExpiresText })"
        :claim-label="$t('rwaRewards.claim')"
        @claim="onClaim"
      />
    </template>

    <template v-else-if="status === 'claimed'">
      <div class="relative z-10 flex flex-col" style="gap: 4px; max-width: 200px">
        <p
          style="
            font-size: 20px;
            font-weight: 700;
            line-height: 22px;
            letter-spacing: -0.4px;
            color: #000;
            white-space: pre-line;
          "
        >
          {{ $t('rwaRewards.hero_claimed_title') }}
        </p>
        <p style="font-size: 12px; line-height: 18px; color: #575757">
          {{ $t('rwaRewards.hero_claimed_desc') }}
        </p>
      </div>
      <div class="relative z-10 flex flex-col" style="gap: 16px; width: 100%">
        <rwa-claim-card
          variant="sent"
          :amount-label="$t('rwaRewards.reward_amount')"
          :subtitle="$t('rwaRewards.sub_sent')"
        />
        <button
          class="flex items-center justify-center hoverOpacityHasBG"
          style="
            width: 100%;
            height: 48px;
            border-radius: 24px;
            background: #e6e6e6;
            color: #000;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: -0.32px;
          "
          @click="onHide"
        >
          {{ $t('rwaRewards.hide_offer') }}
        </button>
      </div>
    </template>

    <template v-else-if="status === 'expired'">
      <div class="relative z-10 flex flex-col" style="gap: 4px; max-width: 200px">
        <p
          style="
            font-size: 20px;
            font-weight: 700;
            line-height: 22px;
            letter-spacing: -0.4px;
            color: #000;
            white-space: pre-line;
          "
        >
          {{ $t('rwaRewards.hero_expired_title') }}
        </p>
        <p style="font-size: 12px; line-height: 18px; color: #575757">
          {{ $t('rwaRewards.hero_expired_desc') }}
        </p>
      </div>
      <div class="relative z-10 flex flex-col" style="gap: 16px; width: 100%">
        <rwa-claim-card
          variant="closed"
          :amount-label="$t('rwaRewards.reward_amount')"
          :subtitle="$t('rwaRewards.sub_closed')"
        />
        <button
          class="flex items-center justify-center hoverOpacityHasBG"
          style="
            width: 100%;
            height: 48px;
            border-radius: 24px;
            background: #e6e6e6;
            color: #000;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: -0.32px;
          "
          @click="onHide"
        >
          {{ $t('rwaRewards.hide_offer') }}
        </button>
      </div>
    </template>

    <template v-else-if="status === 'banned'">
      <div
        class="relative z-10 flex flex-col items-center justify-center"
        style="height: 100%; width: 100%; gap: 24px"
      >
        <div class="flex flex-col items-center" style="gap: 16px">
          <lock-closed-icon style="width: 28px; height: 28px; color: #005ae5" />
          <p
            style="
              font-size: 14px;
              font-weight: 400;
              line-height: 20px;
              color: #575757;
              text-align: center;
            "
          >
            {{ $t('rwaRewards.hero_banned_text') }}
          </p>
        </div>
        <button
          class="flex items-center justify-center hoverOpacityHasBG"
          style="
            height: 48px;
            padding: 0 16px;
            border-radius: 24px;
            background: #e6e6e6;
            color: #000;
            font-size: 16px;
            font-weight: 600;
            line-height: 22px;
            letter-spacing: -0.32px;
          "
          @click="onContactSupport"
        >
          {{ $t('rwaRewards.contact_support') }}
        </button>
      </div>
    </template>

    <template v-else>
      <div
        class="relative z-10 flex flex-col"
        style="gap: 4px; width: 100%; padding-right: 90px"
      >
        <p
          style="
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #575757;
            white-space: nowrap;
          "
        >
          {{ $t('rwaRewards.hero_offer_expires', { time: expiresText }) }}
        </p>
        <p
          style="
            font-size: 20px;
            font-weight: 700;
            line-height: 22px;
            letter-spacing: -0.4px;
            color: #000;
            white-space: pre-line;
          "
        >
          {{ $t('rwaRewards.hero_title') }}
        </p>
      </div>

      <div
        class="relative z-10 flex flex-col"
        style="gap: 16px; width: 100%"
      >
        <div class="flex flex-col" style="width: 100%">
          <rwa-modal-step
            v-for="(step, i) in steps"
            :key="step.n"
            variant="plain"
            :number="step.n"
            :last="i === steps.length - 1"
            path-height="36px"
          >
            <p
              style="
                font-size: 14px;
                line-height: 20px;
                color: #575757;
                padding-top: 2px;
              "
            >
              {{ step.pre }}
              <span
                style="font-weight: 600; color: #000; letter-spacing: -0.28px"
                >{{ step.bold }}</span
              ><span v-if="step.post"> {{ step.post }}</span>
            </p>
          </rwa-modal-step>
        </div>

        <div
          class="flex"
          style="gap: 8px; width: 100%; container-type: inline-size"
        >
          <div
            v-if="isDisabledCta"
            class="relative"
            style="flex: 1"
            @mouseenter="onTipEnter"
            @mouseleave="onTipLeave"
          >
            <button
              class="flex items-center justify-center"
              style="
                width: 100%;
                height: 48px;
                padding: 0 16px;
                gap: 8px;
                border-radius: 24px;
                background: #f5f5f5;
                color: #767676;
                font-size: clamp(12px, 4.2cqi, 16px);
                font-weight: 600;
                letter-spacing: -0.32px;
                cursor: pointer;
                white-space: nowrap;
              "
              disabled
            >
              {{ disabledCtaLabel }}
              <information-circle-icon
                style="width: 22px; height: 22px; flex-shrink: 0"
              />
            </button>
          </div>
          <button
            v-else
            class="flex items-center justify-center hoverOpacityHasBG"
            style="
              flex: 1;
              height: 48px;
              border-radius: 24px;
              background: #005ae5;
              color: #fff;
              font-size: clamp(12px, 4.2cqi, 16px);
              font-weight: 600;
              letter-spacing: -0.32px;
              white-space: nowrap;
            "
            @click="onTrade"
          >
            {{ $t('rwaRewards.trade_now') }}
          </button>
          <button
            class="flex items-center justify-center hoverOpacityHasBG"
            style="
              height: 48px;
              padding: 0 24px;
              border-radius: 24px;
              background: #e6e6e6;
              color: #000;
              font-size: clamp(12px, 4.2cqi, 16px);
              font-weight: 600;
              letter-spacing: -0.32px;
              white-space: nowrap;
            "
            @click="onMoreInfo"
          >
            {{ $t('rwaRewards.more_info') }}
          </button>
        </div>
      </div>
    </template>

    <teleport to="body">
      <div v-if="showTip" class="fixed pointer-events-none" :style="tipStyle">
        <div
          style="
            background: #fff;
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          "
        >
          <p
            style="
              font-size: 12px;
              font-weight: 600;
              line-height: 18px;
              letter-spacing: -0.24px;
              color: #000;
              text-align: center;
            "
          >
            {{ disabledCtaTooltip }}
          </p>
        </div>
        <div
          style="
            position: absolute;
            left: 50%;
            top: 100%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: 12px;
            height: 12px;
            background: #fff;
            box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.08);
          "
        ></div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { LockClosedIcon } from '@heroicons/vue/24/solid'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { show as showIntercom } from '@intercom/messenger-js-sdk'
import gradientBg from '@/assets/images/rwa-rewards/card-gradient-bg.png'
import heroImg from '@/assets/images/rwa-rewards/hold-and-get-usdc.webp'
import peggyCrying from '@/assets/images/rwa-rewards/peggy-crying.webp'
import peggyCool from '@/assets/images/rwa-rewards/peggy-cool-thumbsup.webp'
import { useHoldingsStore } from '@/stores/holdingsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useCountdown } from '@/modules/rwa_rewards/useCountdown'
import RwaHoldTracker from '@/modules/rwa_rewards/RwaHoldTracker.vue'
import RwaClaimCard from '@/modules/rwa_rewards/RwaClaimCard.vue'
import RwaModalStep from '@/modules/rwa_rewards/RwaModalStep.vue'

const { t } = useI18n()

const holdingsStore = useHoldingsStore()
const walletMenuStore = useWalletMenuStore()
const { seasonEnd, status, activeReward } = storeToRefs(holdingsStore)

const onTrade = () => walletMenuStore.openPanel('trade')
const onMoreInfo = () => holdingsStore.openModal()
const onContactSupport = () => showIntercom()

const isDisabledCta = computed(
  () =>
    status.value === 'notEligible' ||
    status.value === 'temporarilyPaused' ||
    status.value === 'campaignEnded',
)
const disabledCtaLabel = computed(() => {
  if (status.value === 'temporarilyPaused')
    return t('rwaRewards.temporarily_paused')
  if (status.value === 'campaignEnded') return t('rwaRewards.campaign_ended')
  return t('rwaRewards.not_eligible')
})
const disabledCtaTooltip = computed(() => {
  if (status.value === 'temporarilyPaused')
    return t('rwaRewards.temporarily_paused_tooltip')
  if (status.value === 'campaignEnded') return t('rwaRewards.campaign_ended')
  return t('rwaRewards.not_eligible_tooltip')
})

const showTip = ref(false)
const tipStyle = ref<Record<string, string | number>>({})
const onTipEnter = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tipStyle.value = {
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top - 10}px`,
    transform: 'translate(-50%, -100%)',
    maxWidth: '320px',
    zIndex: 9999,
  }
  showTip.value = true
}
const onTipLeave = () => {
  showTip.value = false
}
const onClaim = () => {
  if (activeReward.value) holdingsStore.claim(activeReward.value)
}
const onHide = () => {
  if (activeReward.value) holdingsStore.dismiss(activeReward.value.uuid)
}
const { text: expiresText } = useCountdown(() => seasonEnd.value)
const { text: subExpiresText } = useCountdown(
  () => activeReward.value?.expiration_timestamp,
)

const HOLD_TOTAL = 14
const holdCurrent = computed(() => {
  const start = activeReward.value?.start_timestamp
  if (!start) return 1
  const elapsed = Math.floor(
    (Date.now() - new Date(start).getTime()) / 86_400_000,
  )
  return Math.min(Math.max(elapsed + 1, 1), HOLD_TOTAL)
})
const { remainingMs: holdRemaining } = useCountdown(
  () => activeReward.value?.qualification_timestamp,
)
const daysLeftLabel = computed(() => {
  const days = Math.max(0, Math.ceil((holdRemaining.value ?? 0) / 86_400_000))
  return t('rwaRewards.days_left', {
    time: `${days} ${t('rwaRewards.unit_day', days)}`,
  })
})

const steps: { n: number; pre: string; bold: string; post?: string }[] = [
  {
    n: 1,
    pre: t('rwaRewards.hero_step1'),
    bold: t('rwaRewards.hero_step1_bold'),
    post: t('rwaRewards.hero_step1_post'),
  },
  { n: 2, pre: t('rwaRewards.hero_step2'), bold: t('rwaRewards.hero_step2_bold') },
  { n: 3, pre: t('rwaRewards.hero_step3'), bold: t('rwaRewards.hero_step3_bold') },
]
</script>
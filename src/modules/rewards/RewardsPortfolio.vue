<template>
  <!-- Claimed State -->
  <div
    v-if="!hadInitialLoad"
    class="rewards-bg rounded-16 h-full flex flex-col justify-center px-5 xs:px-[33px] lg-max:px-5 xl:px-[33px] 3xl:px-[33px] pt-8 pb-6 relative overflow-hidden max-h-[293px] animate-pulse"
  >
    <p class="text-center text-s-14 text-info">Loading Rewards</p>
  </div>
  <div
    v-else-if="isClaimed"
    class="rewards-bg rounded-16 h-full flex flex-col justify-center px-5 xs:px-[33px] lg-max:px-5 xl:px-[33px] 3xl:px-[33px] pt-8 pb-6 relative overflow-hidden max-h-[293px]"
  >
    <!-- Confetti -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        v-for="(pos, n) in confettiPositions"
        :key="n"
        class="confetti-piece absolute"
        :style="{
          left: `${pos.left}%`,
          top: `${pos.top}%`,
        }"
      />
    </div>

    <!-- Text + Astronaut -->
    <div class="relative flex items-start justify-between w-full">
      <div class="flex flex-col gap-2 min-w-[175px]">
        <h3 class="text-s-28 md:text-s-32 font-bold leading-p-100">Hooray!</h3>
        <p class="text-s-16 font-semibold leading-tight mt-1">
          You've been<br />rewarded with<br />$5 USDC
        </p>
        <p class="text-s-14 text-[#334155] leading-snug mt-2">
          Remember to earn another<br />reward with next campaign!
        </p>
        <div
          class="mt-3 inline-flex items-center gap-1.5 bg-white/60 rounded-full px-3 py-1 w-fit -mr-5 -ml-2"
        >
          <svg
            v-if="isPending"
            aria-hidden="true"
            class="animate-spin w-3 h-3 text-primary/30 fill-primary"
            viewBox="0 0 100 101"
            width="12"
            height="12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <CheckIcon v-else class="w-4 h-4 text-primary" />
          <span class="text-s-12 font-semibold text-[#334155]">
            {{
              isPending ? 'Reward is on its way' : 'Reward is in your wallet'
            }}
          </span>
        </div>
        <a
          v-if="!isPending && todaysReward?.rewardTransactionHash"
          :href="`https://www.ethvm.com/tx/${todaysReward.rewardTransactionHash}?t=actions`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-s-11 text-info mt-0.5 group hover:underline"
        >
          See Reward Tx
          <arrow-long-right-icon
            class="w-4 h-4 text-info inline-block group-hover:translate-x-1 transition-transform"
          />
        </a>
      </div>
      <div class="hidden xs:block shrink-0">
        <img
          :src="peggyClaimed"
          alt=""
          width="160"
          height="167"
          class="w-full h-full object-contain max-h-[160px] md:max-h-[200px] lg-max:max-h-[160px] 2xl:max-h-[180px] -ml-4 lg-max:-mt-10 2xl:-mt-10"
          :class="[
            isOpenSideMenu
              ? 'xl:mt-0 xl:max-h-[200px]'
              : 'xl:-mt-10 xl:max-h-[180px]',
          ]"
        />
      </div>
    </div>
  </div>

  <!-- Default State -->
  <div
    v-else
    class="rewards-bg rounded-16 h-full flex flex-col justify-center items-center xs:items-start lg-max:items-stretch 2xl:items-stretch px-5 xs:px-[33px] lg-max:px-5 2xl:px-4 pt-4 pb-2 relative overflow-hidden max-h-[293px]"
    :class="{
      'xl:items-stretch xl:px-4 2xl:px-[33px]': !isOpenSideMenu,
      'xl:px-[33px] 2xl:px-4': isOpenSideMenu,
    }"
  >
    <!-- Top section: Text left, Astronaut right -->
    <div class="relative xs:w-full flex items-start justify-between">
      <div
        class="xs:min-w-[122px] mt-[10px] xs:flex-none xs:w-[280px] md:w-[390px] lg:w-auto 2xl:w-[194px]"
      >
        <h3
          class="text-s-24 md:text-s-32 lg-max:text-s-28 2xl:text-s-28 font-bold leading-p-100 mb-3 text-center xs:text-start"
          :class="'text-s-32 '"
        >
          Earn $5
          <br
            :class="[
              isOpenSideMenu ? 'xl:hidden' : 'xl:flex',
              'hidden lg-max:flex 2xl:flex',
            ]"
          />USDC
        </h3>
        <p
          class="text-s-16 text-[#334155] leading-p-110 mt-2 max-w-[240px] sm:max-w-none lg-max:max-w-[160px] 2xl:max-w-auto 3xl:max-w-auto 2xl:flex-1 text-center xs:text-start"
          :class="[isOpenSideMenu ? 'xl:max-w-none' : 'xl:max-w-[180px]']"
        >
          First 10 swaps every hour <br class="hidden 2xl:flex" />
          over $50 get $5 USDC
        </p>
      </div>
    </div>

    <!-- Remaining Rewards Counter -->
    <div
      class="flex items-center xs:items-start lg-max:items-center 2xl:items-center justify-end flex-col gap-3 w-full pt-4 3xl:pr-0"
      :class="{ 'xl:items-start': isOpenSideMenu }"
    >
      <div
        class="text-[10px] font-light text-info tracking-sp-06 uppercase text-center"
      >
        {{ rewardsLeft }} rewards left
        <span class="mx-1">·</span>
        Resets in {{ timeUntilReset }}
      </div>

      <!-- Actions -->
      <div>
        <app-base-button
          v-if="canClaimReward && canSwap"
          class="w-full -mt-1 xs:-ml-4 lg-max:ml-0 max-w-[300px]"
          :class="{ 'xl:-ml-4 2xl:ml-0': isOpenSideMenu }"
          :disabled="!canClaimReward"
          :is-loading="earnedPotentialReward"
          @click="goToSwap"
          size="medium"
        >
          {{ 'Swap Now' }}
        </app-base-button>
        <p
          v-else-if="!canClaimReward && canSwap"
          class="bg-white/60 rounded-full px-7 py-3 font-semibold xs:-ml-4 lg-max:ml-0 text-center"
          :class="{ 'xl:-ml-4 2xl:ml-0': isOpenSideMenu }"
        >
          {{
            isAccountTooNew ? 'Account not eligible' : 'Sorry, try again later!'
          }}
        </p>
        <button
          class="text-s-12 text-[#64748B] text-[10px] font-bold tracking-wider uppercase hoverOpacity cursor-pointer w-full -mt-1 xs:-ml-4 lg-max:ml-0 max-w-[300px]"
          :class="{ 'xl:-ml-4 2xl:ml-0': isOpenSideMenu, 'pt-2': !canSwap }"
          @click="onLearnMore"
        >
          Learn More
        </button>
      </div>
      <rewards-learn-more
        v-model:is-open="isLearnMoreOpen"
        location="main-banner"
      />
      <div
        class="hidden xs:block absolute top-5 md:top-2 2xl:-right-4 xs:right-1 sm:right-10 lg-max:right-1 2xl:right-2 3xl:right-2 2xl:pl-4 3xl:pl-[33px]"
      >
        <div class="2xl:pl-[140px] 3xl:pl-[180px]">
          <img
            :src="peggyUsdc"
            alt=""
            width="160"
            height="167"
            class="w-full h-full object-contain max-h-[180px] md:max-h-[200px] lg-max:max-h-[150px] 2xl:max-h-[100px]"
            :class="[
              isOpenSideMenu
                ? 'xl:max-h-[200px] 2xl:max-h-[100px]'
                : 'xl:max-h-[140px] 2xl:max-h-[150px]',
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import RewardsLearnMore from '@/modules/rewards/RewardsLearnMore.vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
import peggyUsdc from '@/assets/images/peggy/peggy-usdc.png'
import peggyClaimed from '@/assets/images/peggy/peggy-reward-claimed.png'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useGlobalStore } from '@/stores/globalStore'
import { storeToRefs } from 'pinia'
import { analytics, RewardsEvent } from '@/analytics'
import { useToastStore } from '@/stores/toastStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletStore } from '@/stores/walletStore'
import { useRewardsStore } from '@/stores/rewardsStore'
import { ArrowLongRightIcon } from '@heroicons/vue/24/solid'

const walletMenuStore = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenuStore)
const { setWalletPanel } = walletMenuStore
const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)
const toastStore = useToastStore()
const chainsStore = useChainsStore()
const { isBitcoinChain } = storeToRefs(chainsStore)
const walletStore = useWalletStore()
const { walletName } = storeToRefs(walletStore)
const rewardsStore = useRewardsStore()
const {
  rewardsLeft,
  canClaimReward,
  hadInitialLoad,
  earnedPotentialReward,
  todaysReward,
  eligibility,
  eligibilityReasons,
  nextHourStart,
} = storeToRefs(rewardsStore)

const isLearnMoreOpen = ref(false)

const timeUntilReset = ref('')
let resetTimer: ReturnType<typeof setInterval> | null = null

function updateCountdown() {
  const target = nextHourStart.value
  if (!target) {
    timeUntilReset.value = '--:--'
    return
  }
  const now = new Date()
  const diff = Math.max(0, new Date(target).getTime() - now.getTime())
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  timeUntilReset.value =
    h > 0 ? `${String(h).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`
}

onMounted(() => {
  analytics.trackRewardsEvent(RewardsEvent.MAIN_BANNER_SHOWN)
  rewardsStore.fetchPool()
  updateCountdown()
  resetTimer = setInterval(updateCountdown, 1_000)
})

onUnmounted(() => {
  if (resetTimer) clearInterval(resetTimer)
})

const isAccountTooNew = computed(() => {
  return eligibilityReasons.value.some(r => r.type === 'ACCOUNT_TOO_NEW')
})

const isClaimed = computed(() => {
  if (todaysReward.value !== null) {
    return true
  } else if (eligibility.value && !eligibility.value.eligible) {
    const reasons = eligibility.value.reasons
    const userRewarded = reasons.filter(
      reason => reason.type === 'USER_RECENTLY_REWARDED',
    )

    return userRewarded.length > 0
  }
  return false
})

const isPending = computed(() => {
  return isClaimed.value && todaysReward.value?.rewardStatus !== 'SUCCESS'
})

// Generate confetti positions in the upper-right triangle (right of diagonal from top-left to bottom-right)
const confettiPositions = Array.from({ length: 20 }, () => {
  const top = Math.random() * 100
  const left = top + Math.random() * (100 - top)
  return { top, left }
})

const canSwap = computed(() => {
  if (isBitcoinChain.value && walletName.value !== 'Enkrypt') return false
  return true
})

const goToSwap = () => {
  analytics.trackRewardsEvent(RewardsEvent.CLICK_SWAP, {
    location: 'main-banner',
  })
  const ETH_NETWORK_NAME = 'ETHEREUM'
  if (selectedNetwork.value !== ETH_NETWORK_NAME) {
    globalStore.setSelectedNetwork(ETH_NETWORK_NAME)
    toastStore.addToastMessage({
      text: 'Switched app network to Ethereum',
    })
  }
  setWalletPanel('swap')
  if (!isOpenSideMenu.value) {
    walletMenuStore.setIsOpenSideMenu(true)
  }
}

const onLearnMore = () => {
  isLearnMoreOpen.value = true
}
</script>

<style scoped>
.rewards-bg {
  background: linear-gradient(135deg, rgba(141, 66, 255, 0.4) 0%, #c7d8ff 100%);
}

.confetti-piece {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.confetti-piece:nth-child(3n) {
  background: #7b61ff;
  width: 6px;
  height: 12px;
  border-radius: 1px;
  transform: rotate(45deg);
}

.confetti-piece:nth-child(3n + 1) {
  background: #3b82f6;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.confetti-piece:nth-child(3n + 2) {
  background: #fbbf24;
  width: 5px;
  height: 14px;
  border-radius: 1px;
  transform: rotate(-30deg);
}
</style>

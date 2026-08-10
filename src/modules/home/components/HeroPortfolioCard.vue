<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
} from '@heroicons/vue/20/solid'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useAccessStore } from '@/stores/accessStore'
import { useCreateStore } from '@/stores/createStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { usePortfolio24hChange } from '@/composables/usePortfolio24hChange'
import { useRefreshBalances } from '@/composables/useRefreshBalances'
import { truncateAddress } from '@/utils/filters'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { ROUTES_MAIN } from '@/router/routeNames'
import TheDepositDialog from '@/components/core_layouts/wallet/TheDepositDialog.vue'

const { t } = useI18n()
const router = useRouter()

const walletStore = useWalletStore()
const {
  isWalletConnected,
  walletAddress,
  isLoadingBalances,
  hasBalances,
  formattedTotalFiatPortfolioValue,
} = storeToRefs(walletStore)
const { selectedChain } = storeToRefs(useChainsStore())
const globalStore = useGlobalStore()
const { hideBalances } = storeToRefs(globalStore)
const { toggleHideBalances } = globalStore
const { openAccessDialog } = useAccessStore()
const { openCreateDialog } = useCreateStore()
const { openPanel } = useWalletMenuStore()
const { lastTwentyFourHours } = usePortfolio24hChange()
const { refreshBalances } = useRefreshBalances()

const openDepositDialog = ref(false)

type State = 'notconnected' | 'loading' | 'noassets' | 'assets'
const state = computed<State>(() => {
  if (!isWalletConnected.value) return 'notconnected'
  if (isLoadingBalances.value) return 'loading'
  if (!hasBalances.value) return 'noassets'
  return 'assets'
})

const percentChange = computed(() => lastTwentyFourHours.value.percentChange)
const isUp = computed(() => !percentChange.value.isNegative())

const MASKED_FIAT = '$***.**'
const MASKED_PERCENT = '*.**%'

const totalText = computed(() =>
  hideBalances.value ? MASKED_FIAT : formattedTotalFiatPortfolioValue.value,
)
const percentText = computed(() =>
  hideBalances.value
    ? MASKED_PERCENT
    : `${isUp.value ? '+' : '-'}${formatPercentageValue(percentChange.value.abs()).value}%`,
)

const goToPortfolio = () => router.push({ name: ROUTES_MAIN.PORTFOLIO.NAME })
</script>

<template>
  <div
    data-test="hero-portfolio-card"
    class="relative flex h-full min-h-[300px] w-full flex-col justify-between rounded-2xl p-6"
    :class="state === 'notconnected' ? 'bg-primary text-white' : 'bg-white'"
  >
    <!-- ============ NOT CONNECTED ============ -->
    <template v-if="state === 'notconnected'">
      <div class="flex w-full flex-col gap-2" data-test="hero-portfolio-notconnected">
        <p class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px]">
          {{ t('homePage.hero.welcomeTitle') }}
        </p>
        <h2 class="text-[40px] font-bold leading-[44px] tracking-[-1.2px]">
          {{ t('homePage.hero.welcomeSubtitle') }}
        </h2>
      </div>
      <div class="flex w-full items-center justify-end gap-4">
        <button
          type="button"
          data-test="hero-create"
          class="hoverNoBG h-12 rounded-3xl px-6 text-s-16 font-semibold tracking-[-0.32px] text-white"
          @click="openCreateDialog"
        >
          {{ t('homePage.hero.createWallet') }}
        </button>
        <button
          type="button"
          data-test="hero-connect"
          class="h-12 rounded-3xl bg-white px-6 text-s-16 font-semibold tracking-[-0.32px] text-primary"
          @click="openAccessDialog"
        >
          {{ t('homePage.hero.connectWallet') }}
        </button>
      </div>
    </template>

    <!-- ============ CONNECTED (loading / noassets / assets) ============ -->
    <template v-else>
      <!-- Eye + refresh: top-right icon cluster -->
      <div class="absolute right-3 top-3 flex items-center gap-1 text-black">
        <button
          v-if="state !== 'noassets'"
          type="button"
          data-test="hero-eye"
          :aria-label="t('homePage.hero.toggleBalance')"
          class="hoverNoBG flex size-10 items-center justify-center rounded-3xl"
          @click="toggleHideBalances"
        >
          <component :is="hideBalances ? EyeSlashIcon : EyeIcon" class="size-6" />
        </button>
        <button
          type="button"
          data-test="hero-refresh"
          :aria-label="t('refresh_balance')"
          class="hoverNoBG flex size-10 items-center justify-center rounded-3xl"
          @click="refreshBalances"
        >
          <ArrowPathIcon class="size-6" />
        </button>
      </div>

      <!-- Top group: chip + headline/subtitle -->
      <div class="flex w-full flex-col gap-4">
        <!-- Address chip -->
        <div class="flex items-center gap-1">
          <template v-if="state === 'loading'">
            <div class="size-2 shrink-0 animate-pulse rounded-full bg-grey-10" />
            <div class="h-5 w-24 animate-pulse rounded bg-grey-10" />
            <div class="h-5 w-16 animate-pulse rounded bg-grey-10" />
          </template>
          <template v-else>
            <span class="size-2 shrink-0 rounded-full bg-success" />
            <span
              class="text-s-16 leading-[22px] text-[#575757]"
              data-test="hero-address"
            >
              {{ truncateAddress(walletAddress ?? '') }}
            </span>
            <span class="text-s-16 leading-[22px] text-[#575757]">•</span>
            <span class="text-s-16 leading-[22px] text-[#575757]">
              {{ selectedChain?.name }}
            </span>
          </template>
        </div>

        <!-- Headline -->
        <template v-if="state === 'noassets'">
          <h2
            class="text-[40px] font-bold leading-[44px] tracking-[-1.2px] text-black"
            data-test="hero-portfolio-noassets"
          >
            {{ t('homePage.hero.noAssetsTitle') }}
          </h2>
          <p class="text-s-16 leading-[22px] text-[#575757]">
            {{ t('homePage.hero.noAssetsSubtitle') }}
          </p>
        </template>
        <h2
          v-else-if="state === 'loading'"
          class="text-[52px] font-bold leading-[56px] tracking-[-2.08px] text-black"
        >
          {{ t('homePage.hero.ownTotal') }}
          <span
            class="ml-2 inline-block h-11 w-48 animate-pulse rounded-xl bg-grey-10 align-middle"
          />
        </h2>
        <h2
          v-else
          class="text-[52px] font-bold leading-[56px] tracking-[-2.08px] text-black"
          data-test="hero-portfolio-assets"
        >
          {{ t('homePage.hero.ownTotal') }}
          <span :class="hideBalances ? 'text-[#575757]' : 'text-primary'">{{
            totalText
          }}</span>
        </h2>
      </div>

      <!-- Bottom group -->
      <!-- NO ASSETS: deposit / buy -->
      <div
        v-if="state === 'noassets'"
        class="flex w-full items-center justify-end gap-2"
      >
        <button
          type="button"
          data-test="hero-deposit"
          class="h-12 rounded-3xl bg-[#f5f5f5] px-6 text-s-16 font-semibold tracking-[-0.32px] text-primary"
          @click="openDepositDialog = true"
        >
          {{ t('homePage.hero.makeDeposit') }}
        </button>
        <button
          type="button"
          data-test="hero-buy"
          class="flex h-12 items-center gap-2 rounded-3xl bg-primary px-6 text-s-16 font-semibold tracking-[-0.32px] text-white"
          @click="openPanel('purchase')"
        >
          {{ t('homePage.hero.buyCrypto') }}
          <CurrencyDollarIcon class="size-[22px]" />
        </button>
      </div>

      <!-- LOADING / ASSETS: today % + go to portfolio -->
      <div v-else class="flex w-full items-end justify-between">
        <div
          v-if="state === 'loading'"
          class="h-6 w-28 animate-pulse rounded bg-grey-10"
        />
        <div
          v-else
          class="flex items-center gap-1 text-s-20 font-bold leading-[22px] tracking-[-0.4px]"
          data-test="hero-today"
        >
          <component
            :is="isUp ? ArrowUpIcon : ArrowDownIcon"
            class="size-[22px]"
            :class="
              hideBalances ? 'text-[#575757]' : isUp ? 'text-success' : 'text-error'
            "
          />
          <span
            :class="
              hideBalances ? 'text-[#575757]' : isUp ? 'text-success' : 'text-error'
            "
            >{{ percentText }}</span
          >
          <span class="text-black">{{ t('homePage.hero.today') }}</span>
        </div>
        <button
          type="button"
          data-test="hero-go-portfolio"
          class="flex h-12 items-center gap-2 rounded-3xl bg-[#f5f5f5] px-6 text-s-16 font-semibold tracking-[-0.32px] text-primary"
          @click="goToPortfolio"
        >
          {{ t('homePage.hero.goToPortfolio') }}
          <ArrowRightIcon class="size-[22px]" />
        </button>
      </div>
    </template>

    <TheDepositDialog v-model:open-dialog="openDepositDialog" />
  </div>
</template>

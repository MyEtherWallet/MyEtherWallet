<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
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
  hideBalances.value
    ? MASKED_FIAT
    : formattedTotalFiatPortfolioValue.value,
)
const percentText = computed(() =>
  hideBalances.value
    ? MASKED_PERCENT
    : `${isUp.value ? '+' : '-'}${formatPercentageValue(percentChange.value.abs()).value}%`,
)

const goToPortfolio = () =>
  router.push({ name: ROUTES_MAIN.PORTFOLIO.NAME })
</script>

<template>
  <div
    data-test="hero-portfolio-card"
    class="flex h-full min-h-[300px] w-full flex-col justify-between rounded-2xl p-6"
    :class="state === 'notconnected' ? 'bg-primary text-white' : 'bg-white'"
  >
    <!-- ============ NOT CONNECTED ============ -->
    <template v-if="state === 'notconnected'">
      <div class="flex flex-col gap-2" data-test="hero-portfolio-notconnected">
        <p class="text-s-14 font-semibold">
          {{ t('homePage.hero.welcomeTitle') }}
        </p>
        <h2 class="text-s-36 font-bold leading-[1.1]">
          {{ t('homePage.hero.welcomeSubtitle') }}
        </h2>
      </div>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          data-test="hero-create"
          class="hoverNoBG rounded-3xl px-5 py-3 text-s-14 font-semibold text-white"
          @click="openCreateDialog"
        >
          {{ t('homePage.hero.createWallet') }}
        </button>
        <button
          type="button"
          data-test="hero-connect"
          class="rounded-3xl bg-white px-5 py-3 text-s-14 font-semibold text-primary"
          @click="openAccessDialog"
        >
          {{ t('homePage.hero.connectWallet') }}
        </button>
      </div>
    </template>

    <!-- ============ CONNECTED (loading / noassets / assets) ============ -->
    <template v-else>
      <!-- Top: address chip + eye/refresh -->
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-2">
          <template v-if="state === 'loading'">
            <div class="size-2 shrink-0 animate-pulse rounded-full bg-grey-10" />
            <div class="h-4 w-24 animate-pulse rounded bg-grey-10" />
            <div class="h-4 w-16 animate-pulse rounded bg-grey-10" />
          </template>
          <template v-else>
            <span class="size-2 shrink-0 rounded-full bg-success" />
            <span
              class="text-s-14 text-black"
              data-test="hero-address"
            >
              {{ truncateAddress(walletAddress ?? '') }}
            </span>
            <span class="text-[#575757]">•</span>
            <span class="text-s-14 text-black">{{ selectedChain?.name }}</span>
          </template>
        </div>
        <div class="flex items-center gap-3 text-black">
          <button
            v-if="state === 'assets'"
            type="button"
            data-test="hero-eye"
            :aria-label="t('homePage.hero.toggleBalance')"
            class="hoverNoBG"
            @click="toggleHideBalances"
          >
            <component
              :is="hideBalances ? EyeSlashIcon : EyeIcon"
              class="size-5"
            />
          </button>
          <button
            type="button"
            data-test="hero-refresh"
            :aria-label="t('refresh_balance')"
            class="hoverNoBG"
            @click="refreshBalances"
          >
            <ArrowPathIcon class="size-5" />
          </button>
        </div>
      </div>

      <!-- Middle + bottom vary per sub-state -->
      <!-- LOADING -->
      <template v-if="state === 'loading'">
        <h2 class="text-s-36 font-bold leading-[1.1] text-black">
          {{ t('homePage.hero.ownTotal') }}
          <span class="ml-1 inline-block h-9 w-40 align-middle animate-pulse rounded-xl bg-grey-10" />
        </h2>
        <div class="flex items-center justify-between">
          <div class="h-5 w-28 animate-pulse rounded bg-grey-10" />
          <button
            type="button"
            data-test="hero-go-portfolio"
            class="flex items-center gap-1 rounded-3xl bg-grey-10 px-4 py-2.5 text-s-14 font-semibold text-primary"
            @click="goToPortfolio"
          >
            {{ t('homePage.hero.goToPortfolio') }}
            <ArrowRightIcon class="size-4" />
          </button>
        </div>
      </template>

      <!-- NO ASSETS -->
      <template v-else-if="state === 'noassets'">
        <div class="flex flex-col gap-2" data-test="hero-portfolio-noassets">
          <h2 class="text-s-36 font-bold leading-[1.1] text-black">
            {{ t('homePage.hero.noAssetsTitle') }}
          </h2>
          <p class="text-s-14 text-[#575757]">
            {{ t('homePage.hero.noAssetsSubtitle') }}
          </p>
        </div>
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            data-test="hero-deposit"
            class="rounded-3xl bg-grey-10 px-5 py-3 text-s-14 font-semibold text-black"
            @click="openDepositDialog = true"
          >
            {{ t('homePage.hero.makeDeposit') }}
          </button>
          <button
            type="button"
            data-test="hero-buy"
            class="flex items-center gap-2 rounded-3xl bg-primary px-5 py-3 text-s-14 font-semibold text-white"
            @click="openPanel('purchase')"
          >
            {{ t('homePage.hero.buyCrypto') }}
            <CurrencyDollarIcon class="size-5" />
          </button>
        </div>
      </template>

      <!-- ASSETS / HIDDEN -->
      <template v-else>
        <h2
          class="text-s-36 font-bold leading-[1.1] text-black"
          data-test="hero-portfolio-assets"
        >
          {{ t('homePage.hero.ownTotal') }}
          <span :class="hideBalances ? 'text-[#575757]' : 'text-primary'">{{
            totalText
          }}</span>
        </h2>
        <div class="flex items-center justify-between">
          <div
            class="flex items-center gap-1 text-s-14 font-semibold"
            data-test="hero-today"
            :class="
              hideBalances
                ? 'text-[#575757]'
                : isUp
                  ? 'text-success'
                  : 'text-error'
            "
          >
            <component
              :is="isUp ? ArrowUpIcon : ArrowDownIcon"
              class="size-4"
            />
            <span>{{ percentText }}</span>
            <span class="text-black">{{ t('homePage.hero.today') }}</span>
          </div>
          <button
            type="button"
            data-test="hero-go-portfolio"
            class="flex items-center gap-1 rounded-3xl bg-grey-10 px-4 py-2.5 text-s-14 font-semibold text-primary"
            @click="goToPortfolio"
          >
            {{ t('homePage.hero.goToPortfolio') }}
            <ArrowRightIcon class="size-4" />
          </button>
        </div>
      </template>
    </template>

    <TheDepositDialog v-model:open-dialog="openDepositDialog" />
  </div>
</template>

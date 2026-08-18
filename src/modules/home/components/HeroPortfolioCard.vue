<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useIntervalFn, useClipboard } from '@vueuse/core'
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
import AppTooltip from '@/components/AppTooltip.vue'

const { t } = useI18n()
const router = useRouter()

const walletStore = useWalletStore()
const {
  isWalletConnected,
  walletAddress,
  isLoadingBalances,
  totalFiatPortfolioValueBN,
  formattedTotalFiatPortfolioValue,
} = storeToRefs(walletStore)

// "assets" only when the portfolio is actually worth something. `hasBalances`
// is true for dust / price-less tokens (balanceWei > 0 but $0 value), which is
// why a chain like BNB showed "$0.00" instead of the empty state.
const hasValue = computed(() =>
  totalFiatPortfolioValueBN.value.isGreaterThan(0),
)
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

// Copy the full (untruncated) address from the hero address chip. `copied`
// flips true for a beat so the tooltip can confirm the action.
const { copy: copyToClipboard, copied: addressCopied } = useClipboard()
const copyAddress = () => copyToClipboard(walletAddress.value ?? '')

// Track whether the first balance load has completed. Only the *first* load
// shows the full-card skeleton; later refreshes keep the current layout and
// skeleton just the amount (see below), so refreshing a no-assets account no
// longer swaps to a separate loading screen.
const hasLoadedOnce = ref(false)
watch(isLoadingBalances, (loading, wasLoading) => {
  if (wasLoading && !loading) hasLoadedOnce.value = true
})

// Keep the refresh icon spinning for a beat on click even if the fetch is
// instant, plus for the whole duration of an actual load.
const refreshing = ref(false)
const isRefreshing = computed(() => refreshing.value || isLoadingBalances.value)
const onRefresh = () => {
  refreshing.value = true
  refreshBalances()
  setTimeout(() => (refreshing.value = false), 800)
}

// Keep the balance fresh with a silent background refetch every 2 minutes
// (matches the refresh tooltip copy). `silent` skips the loading skeleton so
// the amount updates in place; useIntervalFn auto-clears on unmount and
// refreshBalances no-ops while disconnected.
const BALANCE_REFRESH_MS = 120_000
useIntervalFn(() => refreshBalances({ silent: true }), BALANCE_REFRESH_MS)

type State = 'notconnected' | 'initialLoading' | 'noassets' | 'assets'
const state = computed<State>(() => {
  if (!isWalletConnected.value) return 'notconnected'
  if (isLoadingBalances.value && !hasLoadedOnce.value) return 'initialLoading'
  if (!hasValue.value) return 'noassets'
  return 'assets'
})

const percentChange = computed(() => lastTwentyFourHours.value.percentChange)
const isUp = computed(() => !percentChange.value.isNegative())

// Mask by replacing only the digits with `*`, preserving the string's length
// and shape (symbol, separators). Same character count ⇒ same width ⇒ the
// masked value wraps exactly like the real one (no extra line when hidden).
const maskDigits = (value: string) => value.replace(/\d/g, '*')

const totalText = computed(() =>
  hideBalances.value
    ? maskDigits(formattedTotalFiatPortfolioValue.value)
    : formattedTotalFiatPortfolioValue.value,
)
const percentText = computed(() => {
  const shown = `${isUp.value ? '+' : '-'}${formatPercentageValue(percentChange.value.abs()).value}%`
  return hideBalances.value ? maskDigits(shown) : shown
})

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
      <div
        class="flex w-full flex-col gap-2"
        data-test="hero-portfolio-notconnected"
      >
        <p class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px]">
          {{ t('homePage.hero.welcomeTitle') }}
        </p>
        <h2
          class="max-w-[411px] text-[40px] font-bold leading-[44px] tracking-[-1.2px]"
        >
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
        <AppTooltip
          v-if="state === 'assets'"
          :text="
            hideBalances
              ? t('homePage.hero.showBalance')
              : t('homePage.hero.hideBalance')
          "
          position="middle"
        >
          <button
            type="button"
            data-test="hero-eye"
            :aria-label="t('homePage.hero.toggleBalance')"
            class="hoverNoBG flex size-10 items-center justify-center rounded-3xl"
            @click="toggleHideBalances"
          >
            <component
              :is="hideBalances ? EyeSlashIcon : EyeIcon"
              class="size-6"
            />
          </button>
        </AppTooltip>
        <AppTooltip :text="t('homePage.hero.refreshTooltip')" position="middle">
          <button
            type="button"
            data-test="hero-refresh"
            :aria-label="t('refresh_balance')"
            class="hoverNoBG flex size-10 items-center justify-center rounded-3xl"
            @click="onRefresh"
          >
            <ArrowPathIcon
              class="size-6"
              :class="{ 'animate-spin': isRefreshing }"
            />
          </button>
        </AppTooltip>
      </div>

      <!-- Top group: chip + headline/subtitle -->
      <div class="flex w-full flex-col gap-4">
        <!-- Address chip -->
        <div class="flex items-center gap-1">
          <template v-if="state === 'initialLoading'">
            <div
              class="size-5 shrink-0 animate-pulse rounded-md bg-[#e6e6e6]"
            />
            <div class="h-5 w-[101px] animate-pulse rounded-md bg-[#e6e6e6]" />
            <span class="text-s-16 leading-[22px] text-[#575757]">•</span>
            <div class="h-5 w-[72px] animate-pulse rounded-md bg-[#e6e6e6]" />
          </template>
          <template v-else>
            <span class="size-2 shrink-0 rounded-full bg-success" />
            <AppTooltip
              :text="
                addressCopied
                  ? t('homePage.hero.addressCopied')
                  : t('homePage.hero.copyAddress')
              "
              position="middle"
            >
              <button
                type="button"
                data-test="hero-address"
                :aria-label="t('homePage.hero.copyAddress')"
                class="cursor-pointer text-s-16 leading-[22px] text-[#575757] transition-colors hover:text-primary"
                @click="copyAddress"
              >
                {{ truncateAddress(walletAddress ?? '') }}
              </button>
            </AppTooltip>
            <span class="text-s-16 leading-[22px] text-[#575757]">•</span>
            <span
              class="text-s-16 leading-[22px] text-[#575757]"
              data-test="hero-network"
            >
              {{ selectedChain?.nameLong }}
            </span>
          </template>
        </div>

        <!-- Headline -->
        <template v-if="state === 'noassets'">
          <h2
            class="max-w-[420px] whitespace-pre-line text-[52px] font-bold leading-[56px] tracking-[-2.08px] text-black"
            data-test="hero-portfolio-noassets"
          >
            {{ t('homePage.hero.noAssetsTitle') }}
          </h2>
          <p class="text-s-16 leading-[22px] text-[#575757]">
            {{ t('homePage.hero.noAssetsSubtitle') }}
          </p>
        </template>
        <h2
          v-else-if="state === 'initialLoading'"
          class="max-w-[325px] text-[52px] font-bold leading-[56px] tracking-[-2.08px] text-black"
        >
          {{ t('homePage.hero.ownTotal') }}
          <span
            class="ml-2 inline-block h-[46px] w-32 animate-pulse rounded-lg bg-[#e6e6e6] align-middle"
          />
        </h2>
        <h2
          v-else
          class="max-w-[325px] text-[52px] font-bold leading-[56px] tracking-[-2.08px] text-black"
          data-test="hero-portfolio-assets"
        >
          {{ t('homePage.hero.ownTotal') }}
          <!-- Refresh with existing assets: skeleton only the amount, keep the
               layout (no whole-card swap). `whitespace-nowrap` keeps the masked
               value from wrapping onto its own line in hidden mode. -->
          <span
            v-if="isLoadingBalances"
            data-test="hero-amount-skeleton"
            class="ml-2 inline-block h-[46px] w-32 animate-pulse rounded-lg bg-[#e6e6e6] align-middle"
          />
          <span
            v-else
            class="whitespace-nowrap"
            :class="hideBalances ? 'text-[#a5a5a5]' : 'text-primary'"
            >{{ totalText }}</span
          >
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

      <!-- INITIAL LOADING / ASSETS: today % + go to portfolio -->
      <div v-else class="flex w-full items-end justify-between">
        <div v-if="state === 'initialLoading'" class="flex items-center gap-1">
          <div class="size-[22px] animate-pulse rounded-md bg-[#e6e6e6]" />
          <div
            class="h-[22px] w-[85px] animate-pulse rounded-md bg-[#e6e6e6]"
          />
        </div>
        <div
          v-else
          class="flex items-center gap-1 text-s-20 font-bold leading-[22px] tracking-[-0.4px]"
          data-test="hero-today"
        >
          <component
            :is="isUp ? ArrowUpIcon : ArrowDownIcon"
            class="size-[22px]"
            :class="
              hideBalances
                ? 'text-[#a5a5a5]'
                : isUp
                  ? 'text-success'
                  : 'text-error'
            "
          />
          <span
            :class="
              hideBalances
                ? 'text-[#a5a5a5]'
                : isUp
                  ? 'text-success'
                  : 'text-error'
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

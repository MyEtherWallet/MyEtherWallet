<template>
  <div ref="containerRef" class="relative">
    <!-- Settings Button -->
    <app-btn-icon
      size="m"
      :label="$t('menu.open-settings')"
      @click="togglePopup"
    >
      <AppIcon name="cog-6-tooth" />
    </app-btn-icon>

    <!-- Headless network selector (mobile): owns the chain dialog. AppModal
         stacks above the settings popup's z-[2101] by default, so the popup
         stays open behind it. -->
    <select-chain-for-app v-if="isXS" v-model:dialog-open="networkOpen">
      <template #network-button><span class="hidden" /></template>
    </select-chain-for-app>

    <!-- Popup -->
    <teleport to="#app">
      <transition
        enter-from-class="opacity-0 scale-95"
        enter-active-class="transform ease-out duration-200 transition"
        enter-to-class="opacity-100 scale-100"
        leave-from-class="opacity-100 scale-100"
        leave-active-class="transform ease-in duration-150 transition"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isSettingsOpen"
          ref="popupRef"
          :style="popupStyle"
          data-test="settings-popup"
          class="fixed z-[2101] w-96 max-w-[calc(100vw-32px)] bg-white rounded-20 border border-border-default shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.30)]"
        >
          <!-- Height-animated track container -->
          <div
            class="relative overflow-hidden"
            :style="{
              height: containerHeight > 0 ? `${containerHeight}px` : undefined,
              transition: 'height 400ms cubic-bezier(0.25, 0.1, 0, 1)',
            }"
          >
            <!-- Main settings panel -->
            <div
              ref="mainPanelRef"
              data-test="settings-main"
              :inert="view !== 'main'"
              class="absolute top-0 left-0 w-full flex flex-col gap-6 p-6"
              :style="{
                transform:
                  view === 'main'
                    ? 'translateX(0)'
                    : `translateX(calc(-100% - ${GAP}px))`,
                opacity: view === 'main' ? 1 : 0,
                transition:
                  'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <h3 class="text-center text-heading-base text-black">
                {{ $t('settings.title') }}
              </h3>

              <!-- Preferences -->
              <section class="flex flex-col gap-2">
                <p class="text-label-sm text-text-subtle">
                  {{ $t('settings.preferences') }}
                </p>
                <div class="flex flex-col">
                  <!-- Network (mobile only — relocated here from the header
                       below xs). The trigger lives here; the dialog is owned by
                       the headless SelectChainForApp mounted outside the popup. -->
                  <app-cell
                    v-if="isXS"
                    size="small"
                    inset
                    class="capitalize"
                    :title="$t('common.network')"
                    @click="openNetwork"
                  >
                    <template #avatar>
                      <span class="flex size-7 items-center justify-center">
                        <AppIcon name="globe-alt" size="s" />
                      </span>
                    </template>
                    <template #accessory>
                      <span
                        class="flex min-w-0 items-center gap-2 text-text-sm text-text-subtle"
                      >
                        <img
                          v-if="selectedChain?.icon"
                          :src="selectedChain.icon"
                          alt=""
                          class="w-5 h-5 rounded-full object-contain flex-shrink-0"
                          height="20"
                          width="20"
                        />
                        <span class="truncate max-w-[120px] normal-case">{{
                          selectedChain?.nameLong
                        }}</span>
                        <AppIcon name="chevron-right" size="xxs" />
                      </span>
                    </template>
                  </app-cell>
                  <!-- Currency -->
                  <app-cell
                    size="small"
                    inset
                    :title="$t('settings.currency')"
                    @click="view = 'currency'"
                  >
                    <template #avatar>
                      <span class="flex size-7 items-center justify-center">
                        <AppIcon name="banknotes" size="s" />
                      </span>
                    </template>
                    <template #accessory>
                      <span
                        class="flex items-center gap-2 text-text-sm text-text-subtle"
                      >
                        {{ selectedCurrency }}
                        <AppIcon name="chevron-right" size="xxs" />
                      </span>
                    </template>
                  </app-cell>
                  <!-- Language -->
                  <app-cell
                    size="small"
                    inset
                    :title="$t('settings.language')"
                    @click="view = 'language'"
                  >
                    <template #avatar>
                      <span class="flex size-7 items-center justify-center">
                        <AppIcon name="language" size="s" />
                      </span>
                    </template>
                    <template #accessory>
                      <span
                        class="flex items-center gap-2 text-text-sm text-text-subtle"
                      >
                        {{ selectedLanguageOption?.native }}
                        <AppIcon name="chevron-right" size="xxs" />
                      </span>
                    </template>
                  </app-cell>
                  <!-- Default fee -->
                  <app-cell
                    size="small"
                    inset
                    :title="$t('settings.default_fee')"
                    @click="view = 'fee'"
                  >
                    <template #avatar>
                      <span class="flex size-7 items-center justify-center">
                        <AppIcon name="adjustments-horizontal" size="s" />
                      </span>
                    </template>
                    <template #accessory>
                      <span
                        class="flex items-center gap-2 text-text-sm text-text-subtle"
                      >
                        {{ selectedFeeLabel }}
                        <AppIcon name="chevron-right" size="xxs" />
                      </span>
                    </template>
                  </app-cell>
                  <!-- Usage analytics -->
                  <app-cell size="small" inset :interactive="false">
                    <template #avatar>
                      <span class="flex size-7 items-center justify-center">
                        <AppIcon name="chart-bar" size="s" />
                      </span>
                    </template>
                    <template #title>
                      <span class="flex items-center gap-1">
                        {{ $t('settings.usage_analytics') }}
                        <app-tooltip
                          :text="$t('settings.usage_analytics_tooltip')"
                        >
                          <AppIcon
                            name="question-mark-circle"
                            variant="filled"
                            size="xxs"
                            class="text-text-placeholder flex-shrink-0 cursor-pointer"
                          />
                        </app-tooltip>
                      </span>
                    </template>
                    <template #action>
                      <app-toggle
                        :model-value="analyticsEnabled"
                        :aria-label="$t('settings.usage_analytics')"
                        @update:model-value="
                          analyticsStore.setTrackingConsent($event)
                        "
                      />
                    </template>
                  </app-cell>
                </div>
              </section>

              <!-- Connected wallet: the Privy account's own settings -->
              <section
                v-if="isPrivyConnected"
                data-test="settings-connected-wallet"
                class="flex flex-col gap-2"
              >
                <p class="text-label-sm text-text-subtle">
                  {{ $t('settings.connected_wallet') }}
                </p>
                <div class="flex flex-col">
                  <app-cell
                    size="small"
                    inset
                    :title="$t('settings.login_methods')"
                    @click="view = 'login-methods'"
                  >
                    <template #avatar>
                      <span class="flex size-7 items-center justify-center">
                        <AppIcon name="shield-check" size="s" />
                      </span>
                    </template>
                    <template #accessory>
                      <span class="flex items-center text-text-subtle">
                        <AppIcon name="chevron-right" size="xxs" />
                      </span>
                    </template>
                  </app-cell>
                  <app-cell
                    size="small"
                    inset
                    :title="$t('settings.recovery_phrase')"
                    @click="openPhrase"
                  >
                    <template #avatar>
                      <span class="flex size-7 items-center justify-center">
                        <AppIcon name="bars-3" size="s" />
                      </span>
                    </template>
                    <template #accessory>
                      <span class="flex items-center text-text-subtle">
                        <AppIcon name="chevron-right" size="xxs" />
                      </span>
                    </template>
                  </app-cell>
                </div>
              </section>

              <!-- Log out: disconnects whichever wallet is connected -->
              <app-base-button
                v-if="isWalletUnlocked"
                type="link"
                tone="danger"
                class="self-center"
                @click="logOut"
              >
                <span class="flex items-center gap-2">
                  <AppIcon name="arrow-right-on-rectangle" size="s" />
                  {{ $t('settings.log_out') }}
                </span>
              </app-base-button>
            </div>

            <!-- Login methods panel (Privy account) -->
            <div
              ref="loginMethodsPanelRef"
              data-test="settings-login-methods"
              :inert="view !== 'login-methods'"
              class="absolute top-0 left-0 w-full overflow-y-auto p-6"
              :style="{
                maxHeight: `${panelMaxHeight}px`,
                transform:
                  view === 'login-methods'
                    ? 'translateX(0)'
                    : `translateX(calc(100% + ${GAP}px))`,
                opacity: view === 'login-methods' ? 1 : 0,
                transition:
                  'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <settings-login-methods
                :method="loginMethod"
                :email="email"
                @back="view = 'main'"
              />
            </div>

            <!-- Recovery phrase: "Before you continue" (Privy account) -->
            <div
              ref="phraseAckPanelRef"
              data-test="settings-phrase-ack"
              :inert="view !== 'phrase-ack'"
              class="absolute top-0 left-0 w-full overflow-y-auto p-6"
              :style="{
                maxHeight: `${panelMaxHeight}px`,
                transform:
                  view === 'phrase-ack'
                    ? 'translateX(0)'
                    : `translateX(calc(100% + ${GAP}px))`,
                opacity: view === 'phrase-ack' ? 1 : 0,
                transition:
                  'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <settings-phrase-acknowledge
                @back="view = 'main'"
                @view="openExportPage"
              />
            </div>

            <!-- Fee selector panel -->
            <div
              ref="feePanelRef"
              :inert="view !== 'fee'"
              class="absolute top-0 left-0 w-full flex flex-col gap-6 p-6"
              :style="{
                transform:
                  view === 'fee'
                    ? 'translateX(0)'
                    : `translateX(calc(100% + ${GAP}px))`,
                opacity: view === 'fee' ? 1 : 0,
                transition:
                  'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <!-- Header: back + title -->
              <div class="flex items-center gap-2">
                <app-btn-icon
                  size="s"
                  :label="$t('common.back')"
                  @click="view = 'main'"
                >
                  <AppIcon name="chevron-left" variant="filled" size="s" />
                </app-btn-icon>
                <span class="text-text-base text-black">
                  {{ $t('settings.select_transaction_fee') }}
                </span>
              </div>

              <!-- Description -->
              <p class="self-stretch text-text-sm text-text-subtle">
                {{ $t('settings.fee_description') }}
              </p>

              <!-- Fee options -->
              <div class="flex flex-col gap-2 w-full">
                <div
                  v-for="option in feeOptions"
                  :key="option.id"
                  class="flex items-center gap-12 p-4 rounded-xl border cursor-pointer transition-colors duration-150 group"
                  :class="
                    selectedFee === option.id
                      ? 'border-border-brand'
                      : 'border-border-default hover:border-border-hover'
                  "
                  @click="selectedFee = option.id"
                >
                  <div class="flex-1 flex flex-col gap-1">
                    <div class="flex items-center gap-0.5">
                      <span class="text-label-sm text-black">{{
                        option.label
                      }}</span>
                      <span class="text-text-sm text-text-placeholder">
                        – {{ option.price }}</span
                      >
                    </div>
                    <span class="text-text-xs text-text-subtle">{{
                      option.description
                    }}</span>
                  </div>
                  <AppIcon
                    name="check-circle"
                    variant="filled"
                    size="s"
                    class="flex-shrink-0 transition-colors duration-150"
                    :class="
                      selectedFee === option.id
                        ? 'text-text-brand'
                        : 'text-icon-disabled invisible group-hover:visible'
                    "
                  />
                </div>
              </div>
            </div>

            <!-- Currency selector panel -->
            <div
              ref="currencyPanelRef"
              data-test="settings-currency"
              :inert="view !== 'currency'"
              class="absolute top-0 left-0 w-full flex flex-col gap-6 p-6"
              :style="{
                transform:
                  view === 'currency'
                    ? 'translateX(0)'
                    : `translateX(calc(100% + ${GAP}px))`,
                opacity: view === 'currency' ? 1 : 0,
                transition:
                  'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <!-- Header: back + title -->
              <div class="flex items-center gap-2">
                <app-btn-icon
                  size="s"
                  :label="$t('common.back')"
                  @click="view = 'main'"
                >
                  <AppIcon name="chevron-left" variant="filled" size="s" />
                </app-btn-icon>
                <span class="text-s-16 font-bold leading-[22px] text-black">
                  {{ $t('settings.select_currency') }}
                </span>
              </div>

              <!-- Description -->
              <p class="self-stretch text-text-sm text-text-subtle">
                {{ $t('settings.currency_description') }}
              </p>

              <!-- Currency options -->
              <div
                ref="currencyListRef"
                class="flex flex-col gap-1 w-full max-h-80 overflow-y-auto -mx-2 px-2"
              >
                <div
                  v-for="option in currencyOptions"
                  :key="option.code"
                  class="relative flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer group"
                  :class="
                    selectedCurrency === option.code
                      ? 'bg-background-brand-subtle'
                      : ''
                  "
                  @click="selectCurrency(option.code)"
                >
                  <div
                    v-if="selectedCurrency !== option.code"
                    class="absolute inset-0 rounded-xl bg-background-default opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  />
                  <div class="relative flex items-center gap-2.5 min-w-0">
                    <app-token-logo
                      :url="getFiatIcon(option.code)"
                      :symbol="option.code"
                      cover
                      width="w-6"
                      height="h-6"
                      class="flex-shrink-0"
                    />
                    <span
                      class="text-s-14 font-semibold leading-[20px] text-black flex-shrink-0"
                      >{{ option.code }}</span
                    >
                    <span class="text-text-xs text-text-placeholder truncate">{{
                      option.name
                    }}</span>
                  </div>
                  <AppIcon
                    name="check-circle"
                    variant="filled"
                    size="s"
                    class="relative flex-shrink-0 transition-colors duration-150"
                    :class="
                      selectedCurrency === option.code
                        ? 'text-text-brand'
                        : 'text-icon-disabled invisible group-hover:visible'
                    "
                  />
                </div>
              </div>
            </div>

            <!-- Language selector panel -->
            <div
              ref="languagePanelRef"
              :inert="view !== 'language'"
              class="absolute top-0 left-0 w-full flex flex-col gap-6 p-6"
              :style="{
                transform:
                  view === 'language'
                    ? 'translateX(0)'
                    : `translateX(calc(100% + ${GAP}px))`,
                opacity: view === 'language' ? 1 : 0,
                transition:
                  'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <!-- Header: back + title -->
              <div class="flex items-center gap-2">
                <app-btn-icon
                  size="s"
                  :label="$t('common.back')"
                  @click="view = 'main'"
                >
                  <AppIcon name="chevron-left" variant="filled" size="s" />
                </app-btn-icon>
                <span class="text-text-base text-black">
                  {{ $t('settings.select_language') }}
                </span>
              </div>

              <!-- Search -->
              <app-searchbar
                v-model="languageQuery"
                variant="default"
                :placeholder="$t('common.search')"
              />

              <!-- Language options -->
              <div class="flex flex-col gap-6 w-full">
                <!-- Pinned selected language -->
                <div
                  v-if="selectedLanguageOption"
                  class="flex w-full items-center gap-1 border-y border-border-default py-3"
                >
                  <div class="flex flex-1 min-w-0 items-center gap-1">
                    <span class="text-label-base text-black">{{
                      selectedLanguageOption.label
                    }}</span>
                    <span class="text-text-xs text-text-subtle">/</span>
                    <span class="text-text-xs text-text-subtle">{{
                      selectedLanguageOption.native
                    }}</span>
                  </div>
                  <AppIcon
                    name="check"
                    variant="filled"
                    size="s"
                    class="text-text-brand flex-shrink-0"
                  />
                </div>

                <!-- Full language list -->
                <div
                  v-for="language in filteredLanguages"
                  :key="language.code"
                  class="relative flex w-full items-center gap-1 cursor-pointer group"
                  @click="selectLanguage(language.code)"
                >
                  <div
                    class="absolute -inset-x-2 -inset-y-[7px] rounded-lg bg-background-default opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  />
                  <div class="relative flex flex-1 min-w-0 items-center gap-1">
                    <span class="text-label-base text-black">{{
                      language.label
                    }}</span>
                    <span class="text-text-xs text-text-subtle">/</span>
                    <span class="text-text-xs text-text-subtle">{{
                      language.native
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { onClickOutside, useResizeObserver, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '@/stores/currencyStore'
import { useWalletStore } from '@/stores/walletStore'
import { usePrivyAccount } from '@/composables/usePrivyAccount'
import configs from '@/configs'
import { analytics } from '@/analytics'
import { AccountSecurityEvent } from '@/analytics/events'
import { getFiatIcon } from '@/utils/fiatIcons'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppToggle from '@/components/AppToggle.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTooltip from '@/components/tooltip/AppTooltip.vue'
import AppSearchbar from '@/components/AppSearchbar.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import SettingsLoginMethods from '@/components/core_layouts/settings/SettingsLoginMethods.vue'
import SettingsPhraseAcknowledge from '@/components/core_layouts/settings/SettingsPhraseAcknowledge.vue'

import AppIcon from '@/components/icon/AppIcon.vue'
const GAP = 24

const appLayoutStore = useAppLayoutStore()
const { isSettingsOpen } = storeToRefs(appLayoutStore)

// Below xs the network selector lives inside this popup (see template).
const { isXS } = useAppBreakpoints()

const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

/**
 * Whether the mobile chain dialog is open. Tapping the network row opens it in
 * front of the settings popup, which stays open behind it.
 */
const networkOpen = ref(false)
const openNetwork = () => {
  networkOpen.value = true
}

const analyticsStore = useAnalyticsStore()
const analyticsEnabled = computed(() => analyticsStore.consent)
const globalStore = useGlobalStore()
const { defaultGasPriceType, locale: storedLocale } = storeToRefs(globalStore)

const { t, locale } = useI18n()

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', native: 'English', abbr: 'ENG' },
  { code: 'zh', label: 'Chinese', native: '中文', abbr: 'CHN' },
  { code: 'es', label: 'Spanish', native: 'Español', abbr: 'ESP' },
]

const selectedLanguage = computed(() => storedLocale.value)
const selectedLanguageOption = computed(() =>
  LANGUAGE_OPTIONS.find(language => language.code === selectedLanguage.value),
)

const languageQuery = ref('')
const filteredLanguages = computed(() => {
  const query = languageQuery.value.trim().toLowerCase()
  if (!query) return LANGUAGE_OPTIONS
  return LANGUAGE_OPTIONS.filter(
    language =>
      language.label.toLowerCase().includes(query) ||
      language.native.toLowerCase().includes(query),
  )
})
const selectLanguage = (code: string) => {
  storedLocale.value = code
  locale.value = code
  view.value = 'main'
}

const currencyStore = useCurrencyStore()
const { selectedCurrency } = storeToRefs(currencyStore)

// Surface the currently selected currency at the top of the list.
const currencyOptions = computed(() => {
  const active = SUPPORTED_CURRENCIES.filter(
    c => c.code === selectedCurrency.value,
  )
  const rest = SUPPORTED_CURRENCIES.filter(
    c => c.code !== selectedCurrency.value,
  )
  return [...active, ...rest].map(c => ({
    code: c.code,
    name: t(`settings.currency_country.${c.code}`),
  }))
})

const selectCurrency = (code: string) => {
  currencyStore.setCurrency(code)
  view.value = 'main'
}

const FEE_MAP: Record<string, string> = {
  economy: 'ECONOMY',
  recommended: 'REGULAR',
  higher: 'FAST',
  highest: 'FASTEST',
}
const FEE_MAP_REVERSE: Record<string, string> = {
  ECONOMY: 'economy',
  REGULAR: 'recommended',
  FAST: 'higher',
  FASTEST: 'highest',
}

type SettingsView =
  'main' | 'fee' | 'currency' | 'language' | 'login-methods' | 'phrase-ack'
const view = ref<SettingsView>('main')

// The connected wallet. Its own section is for a Privy account; Log out is
// for any wallet that is connected, and is the same as disconnecting it.
const walletStore = useWalletStore()
const { isWalletUnlocked, walletAddress } = storeToRefs(walletStore)
const { isPrivyConnected, email, loginMethod } = usePrivyAccount()

const logOut = () => {
  walletStore.disconnectWallet()
  isSettingsOpen.value = false
  view.value = 'main'
}

// The recovery phrase of the connected Privy wallet. Settings never holds it:
// Privy shows it, on the wallet export page, after the user has logged in
// again there. Settings says what to know first and opens that page.
const openPhrase = () => {
  view.value = 'phrase-ack'
  void analytics.trackAccountSecurityEvent(
    AccountSecurityEvent.RECOVERY_PHRASE_OPENED,
  )
}
const openExportPage = () => {
  // Its own tab, with no opener: the page gets nothing of this one, and this
  // tab's wallet stays connected behind it.
  window.open(configs.WALLET_EXPORT_PAGE, '_blank', 'noopener')
  void analytics.trackAccountSecurityEvent(
    AccountSecurityEvent.RECOVERY_PHRASE_EXPORT_OPENED,
  )
  view.value = 'main'
}
const selectedFee = computed({
  get: () => FEE_MAP_REVERSE[defaultGasPriceType.value] ?? 'recommended',
  set: (val: string) => {
    defaultGasPriceType.value = FEE_MAP[val] as any
  },
})

const feeOptions = computed(() => [
  {
    id: 'economy',
    label: t('settings.fee_option.economy.label'),
    price: '$',
    description: t('settings.fee_option.economy.description'),
  },
  {
    id: 'recommended',
    label: t('settings.fee_option.recommended.label'),
    price: '$$',
    description: t('settings.fee_option.recommended.description'),
  },
  {
    id: 'higher',
    label: t('settings.fee_option.higher.label'),
    price: '$$$',
    description: t('settings.fee_option.higher.description'),
  },
  {
    id: 'highest',
    label: t('settings.fee_option.highest.label'),
    price: '$$$$',
    description: t('settings.fee_option.highest.description'),
  },
])

const selectedFeeLabel = computed(
  () => feeOptions.value.find(option => option.id === selectedFee.value)?.label,
)

const containerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const mainPanelRef = ref<HTMLElement | null>(null)
const feePanelRef = ref<HTMLElement | null>(null)
const currencyPanelRef = ref<HTMLElement | null>(null)
const currencyListRef = ref<HTMLElement | null>(null)
const languagePanelRef = ref<HTMLElement | null>(null)
const loginMethodsPanelRef = ref<HTMLElement | null>(null)
const phraseAckPanelRef = ref<HTMLElement | null>(null)
const containerHeight = ref(0)

/** Where the popup's top edge sits: just under its button. */
const popupTop = (): number => {
  const buttonEl = containerRef.value
  return buttonEl ? buttonEl.getBoundingClientRect().bottom + 8 : 76
}
/** Kept clear between the popup and the bottom of the screen. */
const SCREEN_MARGIN = 16
const { height: screenHeight } = useWindowSize()
/**
 * The room under the popup's top edge. The popup is fixed to the screen, so
 * the page cannot scroll it into view. The Privy account's panels grow with
 * the account (its passkeys, their confirmations) and end in the control the
 * user came for, so they stop here and scroll instead of running off the
 * screen.
 */
const panelMaxHeight = computed(() =>
  Math.max(0, screenHeight.value - popupTop() - SCREEN_MARGIN),
)
const SCROLLING_VIEWS: ReadonlySet<SettingsView> = new Set([
  'login-methods',
  'phrase-ack',
])

const measureHeight = () => {
  const panelByView = {
    main: mainPanelRef.value,
    fee: feePanelRef.value,
    currency: currencyPanelRef.value,
    language: languagePanelRef.value,
    'login-methods': loginMethodsPanelRef.value,
    'phrase-ack': phraseAckPanelRef.value,
  }
  const activeRef = panelByView[view.value]
  if (!activeRef) return
  // A panel reports the height of all it holds, also when it scrolls.
  const natural = activeRef.scrollHeight
  containerHeight.value = SCROLLING_VIEWS.has(view.value)
    ? Math.min(natural, panelMaxHeight.value)
    : natural
}

watch(isSettingsOpen, val => {
  if (val) {
    currencyStore.ensureRates()
    nextTick(measureHeight)
  }
})
watch(view, val => {
  if (view.value !== 'language') languageQuery.value = ''
  nextTick(() => {
    measureHeight()
    if (val === 'currency' && currencyListRef.value) {
      currencyListRef.value.scrollTop = 0
    }
  })
})
watch(filteredLanguages, () => nextTick(measureHeight))
// Login methods grows and shrinks on its own: passkeys are added and removed,
// and its confirmations and errors come and go.
useResizeObserver(loginMethodsPanelRef, () => measureHeight())
useResizeObserver(phraseAckPanelRef, () => measureHeight())
watch(panelMaxHeight, () => nextTick(measureHeight))
// The main panel gains and loses rows as the connected wallet changes, and a
// screen that belongs to the Privy account closes when that account is gone.
watch([isPrivyConnected, isWalletUnlocked, walletAddress], () => {
  // The account's own screens close once the account is not the connected one.
  const onStaleAccountScreen =
    (view.value === 'login-methods' || view.value === 'phrase-ack') &&
    !isPrivyConnected.value
  if (onStaleAccountScreen) view.value = 'main'
  nextTick(measureHeight)
})

const popupStyle = computed(() => {
  const buttonEl = containerRef.value
  if (buttonEl) {
    const rect = buttonEl.getBoundingClientRect()
    return {
      top: `${popupTop()}px`,
      right: `${window.innerWidth - rect.right}px`,
    }
  }
  return { top: `${popupTop()}px`, right: '16px' }
})

const togglePopup = () => {
  isSettingsOpen.value = !isSettingsOpen.value
  if (!isSettingsOpen.value) view.value = 'main'
}

onClickOutside(
  containerRef,
  () => {
    // Keep the popup open while the chain dialog is layered in front of it —
    // clicks inside that dialog (teleported to #app) would otherwise register as
    // an outside click and close the settings popup behind it.
    if (networkOpen.value) return
    if (isSettingsOpen.value) {
      isSettingsOpen.value = false
      view.value = 'main'
    }
  },
  { ignore: [popupRef] },
)
</script>

<template>
  <div ref="containerRef" class="relative">
    <!-- Settings Button -->
    <app-btn-icon
      :label="$t('menu.open-settings')"
      width="w-[40px]"
      height="h-[40px]"
      @click="togglePopup"
    >
      <cog6-tooth-icon class="w-6 h-6" />
    </app-btn-icon>

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
          class="fixed z-[2101] w-[344px] bg-white rounded-20 border border-[#E6E6E6] shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.30)]"
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
              :inert="view !== 'main'"
              class="absolute top-0 left-0 w-full flex flex-col gap-6 p-6"
              :style="{
                transform: view === 'main' ? 'translateX(0)' : `translateX(calc(-100% - ${GAP}px))`,
                opacity: view === 'main' ? 1 : 0,
                transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <!-- Title -->
              <h3 class="self-stretch text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black">
                {{ $t('settings.title') }}
              </h3>

              <!-- Divider -->
              <div class="self-stretch w-full h-px bg-[#E6E6E6]" />

              <!-- PREFERENCES section -->
              <div class="flex flex-col gap-6 w-full">
                <p class="self-stretch text-s-11 font-bold leading-[15px] tracking-[0.6px] uppercase text-[#575757]">
                  {{ $t('settings.preferences') }}
                </p>
                <!-- Currency -->
                <div
                  class="relative flex w-full h-6 justify-between items-center cursor-pointer group"
                  @click="view = 'currency'"
                >
                  <div class="absolute -inset-x-2 -inset-y-[7px] rounded-lg bg-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  <div class="relative flex items-center gap-2.5">
                    <banknotes-icon class="w-5 h-5 text-primary flex-shrink-0" />
                    <span class="text-s-16 font-normal leading-[22px] text-black">{{ $t('settings.currency') }}</span>
                  </div>
                  <div class="relative flex items-center gap-2">
                    <app-token-logo
                      :url="getFiatIcon(selectedCurrency)"
                      :symbol="selectedCurrency"
                      cover
                      width="w-5"
                      height="h-5"
                      class="flex-shrink-0"
                    />
                    <span class="text-s-14 font-normal leading-[20px] text-[#575757]">{{ selectedCurrency }}</span>
                    <chevron-right-icon class="w-4 h-4 text-[#575757] flex-shrink-0" />
                  </div>
                </div>
                <!-- Language -->
                <div
                  class="relative flex w-full h-6 justify-between items-center cursor-pointer group"
                  @click="view = 'language'"
                >
                  <div class="absolute -inset-x-2 -inset-y-[7px] rounded-lg bg-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  <div class="relative flex items-center gap-2.5">
                    <language-icon class="w-5 h-5 text-primary flex-shrink-0" />
                    <span class="text-s-16 font-normal leading-[22px] text-black">{{ $t('settings.language') }}</span>
                  </div>
                  <div class="relative flex items-center gap-2">
                    <span class="text-s-14 font-normal leading-[20px] text-[#575757]">{{ selectedLanguageAbbr }}</span>
                    <chevron-right-icon class="w-4 h-4 text-[#575757] flex-shrink-0" />
                  </div>
                </div>
                <!-- Default fee -->
                <div
                  class="relative flex w-full h-6 justify-between items-center cursor-pointer group"
                  @click="view = 'fee'"
                >
                  <div class="absolute -inset-x-2 -inset-y-[7px] rounded-lg bg-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  <div class="relative flex items-center gap-2.5">
                    <currency-dollar-icon class="w-5 h-5 text-primary flex-shrink-0" />
                    <span class="text-s-16 font-normal leading-[22px] text-black">{{ $t('settings.default_fee') }}</span>
                  </div>
                  <div class="relative flex items-center gap-2">
                    <span class="text-s-14 font-normal leading-[20px] text-[#575757]">{{ selectedFeeLabel }}</span>
                    <chevron-right-icon class="w-4 h-4 text-[#575757] flex-shrink-0" />
                  </div>
                </div>
              </div>

              <!-- Divider between sections -->
              <div class="self-stretch w-full h-px bg-[#E6E6E6]" />

              <!-- SECURITY section -->
              <div class="flex flex-col gap-6 w-full">
                <p class="self-stretch text-s-11 font-bold leading-[15px] tracking-[0.6px] uppercase text-[#575757]">
                  {{ $t('settings.security') }}
                </p>
                <!-- Usage analytics -->
                <div class="flex w-full h-6 justify-between items-center">
                  <div class="flex items-center gap-2.5">
                    <circle-stack-icon class="w-5 h-5 text-primary flex-shrink-0" />
                    <div class="flex items-center gap-1">
                      <span class="text-s-16 font-normal leading-[22px] text-black">{{ $t('settings.usage_analytics') }}</span>
                      <app-tooltip :text="$t('settings.usage_analytics_tooltip')" position="middle">
                        <question-mark-circle-icon class="w-4 h-4 text-[#A5A5A5] flex-shrink-0 cursor-pointer" />
                      </app-tooltip>
                    </div>
                  </div>
                  <!-- Toggle -->
                  <button
                    class="flex h-6 w-[45px] items-center rounded-full p-[3px] flex-shrink-0 transition-colors duration-200"
                    :class="analyticsEnabled ? 'bg-primary justify-end' : 'bg-[#D6D6D6] justify-start'"
                    @click="analyticsStore.setTrackingConsent(!analyticsEnabled)"
                  >
                    <div class="h-[18px] w-[18px] rounded-full bg-white flex-shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Fee selector panel -->
            <div
              ref="feePanelRef"
              :inert="view !== 'fee'"
              class="absolute top-0 left-0 w-full flex flex-col gap-6 p-6"
              :style="{
                transform: view === 'fee' ? 'translateX(0)' : `translateX(calc(100% + ${GAP}px))`,
                opacity: view === 'fee' ? 1 : 0,
                transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <!-- Header: back + title -->
              <div class="flex items-center gap-2">
                <app-btn-icon
                  :label="$t('common.back')"
                  width="w-6"
                  height="h-6"
                  @click="view = 'main'"
                >
                  <chevron-left-icon class="w-5 h-5" />
                </app-btn-icon>
                <span class="text-s-16 font-normal leading-[22px] text-black">
                  {{ $t('settings.select_transaction_fee') }}
                </span>
              </div>

              <!-- Description -->
              <p class="self-stretch text-s-14 font-normal leading-[20px] text-[#575757]">
                {{ $t('settings.fee_description') }}
              </p>

              <!-- Fee options -->
              <div class="flex flex-col gap-2 w-full">
                <div
                  v-for="option in feeOptions"
                  :key="option.id"
                  class="flex items-center gap-12 p-4 rounded-xl border cursor-pointer transition-colors duration-150 group"
                  :class="selectedFee === option.id ? 'border-primary' : 'border-[#E6E6E6] hover:border-[#A5A5A5]'"
                  @click="selectedFee = option.id"
                >
                  <div class="flex-1 flex flex-col gap-1">
                    <div class="flex items-center gap-0.5">
                      <span class="text-s-14 font-semibold leading-[20px] tracking-[-0.28px] text-black">{{ option.label }}</span>
                      <span class="text-s-14 font-normal leading-[20px] text-[#A5A5A5]"> – {{ option.price }}</span>
                    </div>
                    <span class="text-s-12 font-normal leading-[18px] text-[#575757]">{{ option.description }}</span>
                  </div>
                  <check-circle-icon
                    class="w-5 h-5 flex-shrink-0 transition-colors duration-150"
                    :class="selectedFee === option.id
                      ? 'text-primary'
                      : 'text-[#D6D6D6] invisible group-hover:visible'"
                  />
                </div>
              </div>
            </div>

            <!-- Currency selector panel -->
            <div
              ref="currencyPanelRef"
              :inert="view !== 'currency'"
              class="absolute top-0 left-0 w-full flex flex-col gap-6 p-6"
              :style="{
                transform: view === 'currency' ? 'translateX(0)' : `translateX(calc(100% + ${GAP}px))`,
                opacity: view === 'currency' ? 1 : 0,
                transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <!-- Header: back + title -->
              <div class="flex items-center gap-2">
                <app-btn-icon
                  :label="$t('common.back')"
                  width="w-6"
                  height="h-6"
                  @click="view = 'main'"
                >
                  <chevron-left-icon class="w-5 h-5" />
                </app-btn-icon>
                <span class="text-s-16 font-bold leading-[22px] text-black">
                  {{ $t('settings.select_currency') }}
                </span>
              </div>

              <!-- Description -->
              <p class="self-stretch text-s-14 font-normal leading-[20px] text-[#575757]">
                {{ $t('settings.currency_description') }}
              </p>

              <!-- Currency options -->
              <div
                ref="currencyListRef"
                class="flex flex-col gap-1 w-full max-h-[320px] overflow-y-auto -mx-2 px-2"
              >
                <div
                  v-for="option in currencyOptions"
                  :key="option.code"
                  class="relative flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer group"
                  :class="selectedCurrency === option.code ? 'bg-mewBg' : ''"
                  @click="selectCurrency(option.code)"
                >
                  <div
                    v-if="selectedCurrency !== option.code"
                    class="absolute inset-0 rounded-xl bg-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
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
                    <span class="text-s-14 font-semibold leading-[20px] text-black flex-shrink-0">{{ option.code }}</span>
                    <span class="text-s-12 font-normal leading-[18px] text-[#A5A5A5] truncate">{{ option.name }}</span>
                  </div>
                  <check-circle-icon
                    class="relative w-5 h-5 flex-shrink-0 transition-colors duration-150"
                    :class="selectedCurrency === option.code
                      ? 'text-primary'
                      : 'text-[#D6D6D6] invisible group-hover:visible'"
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
                transform: view === 'language' ? 'translateX(0)' : `translateX(calc(100% + ${GAP}px))`,
                opacity: view === 'language' ? 1 : 0,
                transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0, 1), opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
              }"
            >
              <!-- Header: back + title -->
              <div class="flex items-center gap-2">
                <app-btn-icon
                  :label="$t('common.back')"
                  width="w-6"
                  height="h-6"
                  @click="view = 'main'"
                >
                  <chevron-left-icon class="w-5 h-5" />
                </app-btn-icon>
                <span class="text-s-16 font-normal leading-[22px] text-black">
                  {{ $t('settings.select_language') }}
                </span>
              </div>

              <!-- Search -->
              <app-search-input
                v-model="languageQuery"
                size="compact"
                bg-class="bg-[#F5F5F5]"
                :placeholder="$t('common.search')"
              />

              <!-- Language options -->
              <div class="flex flex-col gap-6 w-full">
                <!-- Pinned selected language -->
                <div
                  v-if="selectedLanguageOption"
                  class="flex w-full items-center gap-1 border-y border-[#E6E6E6] py-3"
                >
                  <div class="flex flex-1 min-w-0 items-center gap-1">
                    <span class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black">{{ selectedLanguageOption.label }}</span>
                    <span class="text-s-12 font-normal leading-[18px] text-[#575757]">/</span>
                    <span class="text-s-12 font-normal leading-[18px] text-[#575757]">{{ selectedLanguageOption.native }}</span>
                  </div>
                  <check-icon class="w-5 h-5 text-primary flex-shrink-0" />
                </div>

                <!-- Full language list -->
                <div
                  v-for="language in filteredLanguages"
                  :key="language.code"
                  class="relative flex w-full items-center gap-1 cursor-pointer group"
                  @click="selectLanguage(language.code)"
                >
                  <div class="absolute -inset-x-2 -inset-y-[7px] rounded-lg bg-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  <div class="relative flex flex-1 min-w-0 items-center gap-1">
                    <span class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black">{{ language.label }}</span>
                    <span class="text-s-12 font-normal leading-[18px] text-[#575757]">/</span>
                    <span class="text-s-12 font-normal leading-[18px] text-[#575757]">{{ language.native }}</span>
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
import { Cog6ToothIcon } from '@heroicons/vue/24/solid'
import { CurrencyDollarIcon, CircleStackIcon, ChevronLeftIcon, CheckCircleIcon, CheckIcon, LanguageIcon, BanknotesIcon } from '@heroicons/vue/20/solid'
import { ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/vue/16/solid'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '@/stores/currencyStore'
import { getFiatIcon } from '@/utils/fiatIcons'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'

const GAP = 24

const appLayoutStore = useAppLayoutStore()
const { isSettingsOpen } = storeToRefs(appLayoutStore)

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
const selectedLanguageAbbr = computed(
  () => LANGUAGE_OPTIONS.find(language => language.code === selectedLanguage.value)?.abbr,
)
const selectedLanguageOption = computed(
  () => LANGUAGE_OPTIONS.find(language => language.code === selectedLanguage.value),
)

const languageQuery = ref('')
const filteredLanguages = computed(() => {
  const query = languageQuery.value.trim().toLowerCase()
  if (!query) return LANGUAGE_OPTIONS
  return LANGUAGE_OPTIONS.filter(
    language =>
      language.label.toLowerCase().includes(query) || language.native.toLowerCase().includes(query),
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
  const active = SUPPORTED_CURRENCIES.filter(c => c.code === selectedCurrency.value)
  const rest = SUPPORTED_CURRENCIES.filter(c => c.code !== selectedCurrency.value)
  return [...active, ...rest]
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

const view = ref<'main' | 'fee' | 'currency' | 'language'>('main')
const selectedFee = computed({
  get: () => FEE_MAP_REVERSE[defaultGasPriceType.value] ?? 'recommended',
  set: (val: string) => { defaultGasPriceType.value = FEE_MAP[val] as any },
})

const feeOptions = computed(() => [
  { id: 'economy', label: t('settings.fee_option.economy.label'), price: '$', description: t('settings.fee_option.economy.description') },
  { id: 'recommended', label: t('settings.fee_option.recommended.label'), price: '$$', description: t('settings.fee_option.recommended.description') },
  { id: 'higher', label: t('settings.fee_option.higher.label'), price: '$$$', description: t('settings.fee_option.higher.description') },
  { id: 'highest', label: t('settings.fee_option.highest.label'), price: '$$$$', description: t('settings.fee_option.highest.description') },
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
const containerHeight = ref(0)

const measureHeight = () => {
  const panelByView = {
    main: mainPanelRef.value,
    fee: feePanelRef.value,
    currency: currencyPanelRef.value,
    language: languagePanelRef.value,
  }
  const activeRef = panelByView[view.value]
  if (activeRef) containerHeight.value = activeRef.scrollHeight
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

const popupStyle = computed(() => {
  const buttonEl = containerRef.value
  if (buttonEl) {
    const rect = buttonEl.getBoundingClientRect()
    return {
      top: `${rect.bottom + 8}px`,
      right: `${window.innerWidth - rect.right}px`,
    }
  }
  return { top: '76px', right: '16px' }
})

const togglePopup = () => {
  isSettingsOpen.value = !isSettingsOpen.value
  if (!isSettingsOpen.value) view.value = 'main'
}

onClickOutside(containerRef, () => {
  if (isSettingsOpen.value) {
    isSettingsOpen.value = false
    view.value = 'main'
  }
}, { ignore: [popupRef] })
</script>

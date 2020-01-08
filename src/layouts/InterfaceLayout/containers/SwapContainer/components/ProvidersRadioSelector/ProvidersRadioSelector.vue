<template>
  <div class="providers-radio-selector">
    <!-- =========================================================================== -->
    <div v-show="displayToShow === 'rates'" class="radio-button-container">
      <ul>
        <li
          v-for="(provider, idx) in providerData"
          :key="provider.provider + idx"
          :class="provider.provider"
          class="providers"
          @click="setSelectedProvider(provider.provider)"
        >
          <div class="mew-custom-form__radio-button">
            <input
              v-show="providerData.length > 0"
              :id="provider.provider"
              v-model="providerChosen"
              :value="provider.provider"
              type="radio"
              name="provider"
            />

            <label :for="provider.provider" />
          </div>
          <div class="provider-image">
            <img :src="providerLogo(provider)" alt />
          </div>
          <div
            :class="[
              minCheck(provider) || maxCheck(provider) ? 'invalid-min-max' : ''
            ]"
          >
            {{
              formatRateDisplay(
                fromValue,
                provider.fromCurrency,
                provider.computeConversion(fromValue),
                provider.toCurrency
              )
            }}
            <div class="show-mobile">
              <p
                v-for="note in minNote(provider)"
                :key="note.key"
                :class="[minCheck(provider) ? 'error-message-container' : '']"
              >
                {{ note }}
              </p>
              <p :class="[maxCheck(provider) ? 'error-message-container' : '']">
                {{ maxNote(provider) }}
              </p>
            </div>
          </div>
          <div class="show-desktop">
            <p
              v-for="note in minNote(provider)"
              :key="note.key"
              :class="[minCheck(provider) ? 'error-message-container' : '']"
            >
              {{ note }}
            </p>
            <p :class="[maxCheck(provider) ? 'error-message-container' : '']">
              {{ maxNote(provider) }}
            </p>
            <span class="slippage-text">{{
              otherTextDisplay(provider.additional.display)
            }}</span>
          </div>
        </li>
      </ul>
      <!-- list of other providers who don't support the selected currency pair -->
      <provider-info-list
        :all-supported-providers="allSupportedProviders"
        :unavailable-providers="unavailableProviders"
      />
    </div>
    <!-- Animation while retrieving rates for available providers when switching to and from currencies-->
    <div
      v-show="displayToShow === 'switchCurrencyOrder'"
      class="radio-button-container animated-background"
    >
      <ul>
        <li v-for="provider in providersFound" :key="provider">
          <div class="mew-custom-form__radio-button">
            <input type="radio" name="provider" />
            <label :for="provider" />
          </div>
          <div class="provider-image">
            <img :src="providerLogo(provider)" alt />
          </div>
          <div class="background-masker" />
        </li>
      </ul>
    </div>
    <!-- Animation while retrieving rates for available providers -->
    <div
      v-show="displayToShow === 'loadingData'"
      class="radio-button-container animated-background"
    >
      <ul>
        <li v-for="provider in providersFound" :key="provider">
          <div class="mew-custom-form__radio-button">
            <input type="radio" name="provider" />
            <label :for="provider" />
          </div>
          <div class="provider-image">
            <img :src="providerLogo(provider)" alt />
          </div>
          <div class="background-masker" />
        </li>
      </ul>
      <provider-info-list
        v-show="!loadingProviderRates"
        :all-supported-providers="allSupportedProviders"
        :unavailable-providers="unavailableProviders"
      />
    </div>
    <!-- Animation while retrieving the supporting providers rates -->
    <!-- =========================================================================== -->
    <div
      v-show="displayToShow === 'loadingProviderRates'"
      class="radio-button-container animated-background"
    >
      <div class="provider-loading-message">
        {{ $t('swap.providers.loading-rates') }}
      </div>
      <provider-info-list
        :all-supported-providers="allSupportedProviders"
        :unavailable-providers="unavailableProviders"
      />
    </div>
    <!-- Message When Error Seems to have occured while retrieving rate -->
    <!-- =========================================================================== -->
    <div
      v-show="displayToShow === 'loadingProviderError'"
      class="radio-button-container animated-background"
    >
      <ul>
        <li>
          <div class="mew-custom-form__radio-button">
            <input type="radio" name="provider" />
          </div>
          <div class="provider-image">
            <img :src="providerLogo('mew')" alt />
          </div>
          <i18n tag="div" path="swap.providers.load-rate-error">
            <span slot="from-currency">{{ noProvidersPair.fromCurrency }}</span>
            <span slot="to-currency">{{ noProvidersPair.toCurrency }}</span>
          </i18n>
        </li>
      </ul>
    </div>
    <!-- Message when no valid provider is found for the selected pair -->
    <!-- =========================================================================== -->
    <div
      v-show="displayToShow === 'noAvailableProviders'"
      class="radio-button-container"
    >
      <div class="no-provider-message">
        {{ $t('swap.providers.no-provider-found') }}
      </div>
      <ul>
        <provider-info-list
          :all-supported-providers="allSupportedProviders"
          :unavailable-providers="unavailableProviders"
        />
      </ul>
    </div>
    <!-- =========================================================================== -->
    <!-- Message when offline -->
    <!-- =========================================================================== -->
    <div v-show="displayToShow === 'offline'" class="radio-button-container">
      <div class="no-provider-message">
        {{ $t('swap.warning.no-swap-offline') }}
      </div>
      <ul>
        <provider-info-list
          :all-supported-providers="allSupportedProviders"
          :unavailable-providers="unavailableProviders"
        />
      </ul>
    </div>
    <!-- =========================================================================== -->
    <!-- Message when not mainnet -->
    <!-- =========================================================================== -->
    <div
      v-show="displayToShow === 'onlyMainNet'"
      class="radio-button-container"
    >
      <div class="no-provider-message">
        {{ $t('swap.warning.swap-only-mainnet') }}
      </div>
      <ul>
        <provider-info-list
          :all-supported-providers="allSupportedProviders"
          :unavailable-providers="allSupportedProviders"
        />
      </ul>
    </div>
    <!-- =========================================================================== -->
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import MEW from '@/assets/images/logo.png';
import KyberNetwork from '@/assets/images/etc/kybernetwork.png';
import Bity from '@/assets/images/etc/bity.png';
import Simplex from '@/assets/images/etc/simplex.png';
import Changelly from '@/assets/images/etc/changelly.png';
import bityBeta from '@/assets/images/etc/bitybeta.png';

import ProviderInfoList from './ProviderInfoList';
import { mapState } from 'vuex';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'provider-info-list': ProviderInfoList
  },
  props: {
    allSupportedProviders: {
      type: Array,
      default: function() {
        return [];
      }
    },
    providerData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    noProvidersPair: {
      type: Object,
      default: function() {
        return {};
      }
    },
    loadingData: {
      type: Boolean,
      default: true
    },
    loadingProviderRates: {
      type: Boolean,
      default: true
    },
    loadingProviderError: {
      type: Boolean,
      default: false
    },
    providersFound: {
      type: Array,
      default: function() {
        return [];
      }
    },
    providerSelected: {
      type: Object,
      default: function() {
        return {};
      }
    },
    providerSelectedName: {
      type: String,
      default: ''
    },
    fromValue: {
      type: Number,
      default: 0
    },
    toValue: {
      type: Number,
      default: 0
    },
    switchCurrencyOrder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      onMainNet: true,
      providerChosen: '',
      otherProviderList: [],
      logos: {
        mew: MEW,
        kybernetwork: KyberNetwork,
        bity: Bity,
        simplex: Simplex,
        changelly: Changelly
      },
      betaLogos: {
        bity: bityBeta
      }
    };
  },
  computed: {
    ...mapState('main', ['online', 'network']),
    displayToShow() {
      if (!this.online) {
        return 'offline';
      }
      if (this.network.type.name !== 'ETH') {
        return 'onlyMainNet';
      }
      if (this.loadingProviderRates) {
        return 'loadingProviderRates';
      }
      if (this.loadingData) {
        return 'loadingData';
      }
      if (this.providerData.length > 0) {
        return 'rates';
      }
      if (this.switchCurrencyOrder) {
        return 'switchCurrencyOrder';
      }
      if (this.noAvailableProviders) {
        return 'noAvailableProviders';
      }
      if (this.loadingProviderError && !this.noAvailableProviders) {
        return 'loadingProviderError';
      }
      return 'loadingData';
    },
    noAvailableProviders() {
      return (
        (this.providersFound.length === 0 || this.providerData.length === 0) &&
        !this.loadingData
      );
    },
    unavailableProviders() {
      if (this.loadingData) {
        const activeProviders = this.listPotentialProviders();
        return this.allSupportedProviders.filter(entry => {
          return !activeProviders.includes(entry);
        });
      } else if (this.providerData.length !== 0) {
        const activeProviders = this.listActiveProviders();

        return this.allSupportedProviders.filter(entry => {
          return !activeProviders.includes(entry);
        });
      } else if (this.noAvailableProviders) {
        return this.allSupportedProviders;
      }
      return null;
    }
  },
  watch: {
    loadingData(val) {
      if (this.providerSelectedName !== '' && !val) {
        this.$nextTick(() => {
          this.$emit('selectedProvider', this.providerSelectedName);
          const clickedEl = document.getElementsByClassName(
            this.providerSelectedName
          )[0];
          clickedEl.classList.add('radio-selected');
          const inputEl = document.getElementById(this.providerSelectedName);
          inputEl.checked = true;
        });
      }
    }
  },
  methods: {
    otherProviders() {
      const activeProviders = this.listActiveProviders();
      return this.allSupportedProviders.filter(entry => {
        return !activeProviders.includes(entry);
      });
    },
    otherInactiveProviders() {
      const activeProviders = this.listPotentialProviders();
      return this.allSupportedProviders.filter(entry => {
        return !activeProviders.includes(entry);
      });
    },
    listActiveProviders() {
      this.$nextTick(() => {
        if (this.providerData.length === 1) {
          this.setSelectedProvider(this.providerData[0].provider);
        } else {
          this.providerChosen = '';
        }
      });

      const activeProviders = [];
      this.providerData.forEach(entry => {
        activeProviders.push(entry.provider);
      });
      return activeProviders;
    },
    listPotentialProviders() {
      const activeProviders = [];
      this.providersFound.forEach(entry => {
        activeProviders.push(entry);
      });
      return activeProviders;
    },
    minCheck(details) {
      return details.minValue > +this.fromValue;
    },
    maxCheck(details) {
      return +this.fromValue > details.maxValue && details.maxValue > 0;
    },
    setSelectedProvider(provider) {
      this.providerChosen = provider;
      const providerEls = document.getElementsByClassName('providers');
      Array.prototype.forEach.call(providerEls, function(el) {
        el.classList.remove('radio-selected');
      });
      const clickedEl = document.getElementsByClassName(provider)[0];
      clickedEl.classList.add('radio-selected');
      this.$emit('selectedProvider', provider);
    },
    providerLogo(details) {
      if (details.provider) {
        return this.logos[details.provider];
      }
      return this.logos[details];
    },
    minNote(details) {
      if (details.minValue > 0) {
        return [
          `${toBigNumber(details.minValue).toFixed(6)} ${
            details.fromCurrency
          } (${this.$t('swap.from-min')}.)`
        ];
      }
      return '';
    },
    maxNote(details) {
      if (details.maxValue > 0) {
        return `${toBigNumber(details.maxValue).toFixed(6)} ${
          details.fromCurrency
        } (${this.$t('swap.max')}.)`;
      }
      return '';
    },
    formatRateDisplay(fromValue, fromCurrency, toValue, toCurrency) {
      return `${toBigNumber(fromValue).toFixed(
        6
      )} ${fromCurrency} = ${toBigNumber(toValue).toFixed(6)} ${toCurrency}`;
    },
    normalizedRateDisplay(source) {
      const toValue = this.valueForRate(this.fromValue, source.rate);
      return `${source.fromValue} ${source.fromCurrency} = ${toValue} ${source.toCurrency}`;
    },
    otherTextDisplay(contentDetails) {
      if (!contentDetails) return;
      if (contentDetails.txtKey) {
        return this.$t(`swap.providers.${contentDetails.txtKey}`, {
          value: contentDetails.value
        });
      }
    },
    valueForRate(rate, value) {
      return toBigNumber(value)
        .times(rate)
        .toFixed(6)
        .toString(10);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ProvidersRadioSelector.scss';
</style>

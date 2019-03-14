<template>
  <div class="providers-radio-selector">
    <!-- =========================================================================== -->
    <div v-show="providerData.length > 0" class="radio-button-container">
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
              v-model="providerChosen"
              :id="provider.provider"
              :value="provider.provider"
              type="radio"
              name="provider"
              @input="setSelectedProvider(provider.provider)"
            />

            <label :for="provider.provider" />
          </div>
          <div class="provider-image">
            <img :src="providerLogo(provider)" />
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
      v-show="switchCurrencyOrder"
      class="radio-button-container animated-background"
    >
      <ul>
        <li v-for="provider in providersFound" :key="provider">
          <div class="mew-custom-form__radio-button">
            <input type="radio" name="provider" /> <label :for="provider" />
          </div>
          <div class="provider-image">
            <img :src="providerLogo(provider)" />
          </div>
          <div class="background-masker" />
        </li>
      </ul>
    </div>
    <!-- Animation while retrieving rates for available providers -->
    <div
      v-show="loadingData"
      class="radio-button-container animated-background"
    >
      <ul>
        <li v-for="provider in providersFound" :key="provider">
          <div class="mew-custom-form__radio-button">
            <input type="radio" name="provider" /> <label :for="provider" />
          </div>
          <div class="provider-image">
            <img :src="providerLogo(provider)" />
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
      v-show="loadingProviderRates"
      class="radio-button-container animated-background"
    >
      <div class="provider-loading-message">
        {{ $t('interface.loadingProviders') }}
      </div>
      <provider-info-list
        :all-supported-providers="allSupportedProviders"
        :unavailable-providers="unavailableProviders"
      />
    </div>
    <!-- Message When Error Seems to have occured while retrieving rate -->
    <!-- =========================================================================== -->
    <div
      v-show="loadingProviderError && !noAvaliableProviders"
      class="radio-button-container animated-background"
    >
      <ul>
        <li>
          <div class="mew-custom-form__radio-button">
            <input type="radio" name="provider" />
          </div>
          <div class="provider-image"><img :src="providerLogo('mew')" /></div>
          <div>
            {{ $t('interface.loadRateError') }}
            {{ noProvidersPair.fromCurrency }} {{ $t('interface.articleTo') }}
            {{ noProvidersPair.toCurrency }}
            {{ $t('interface.pleaseTryAgain') }}
          </div>
        </li>
      </ul>
    </div>
    <!-- Message when no valid provider is found for the selected pair -->
    <!-- =========================================================================== -->
    <div v-show="noAvaliableProviders" class="radio-button-container">
      <div class="no-provider-message">
        {{ $t('interface.noProviderFound') }}
      </div>
      <ul>
        <provider-info-list
          :all-supported-providers="allSupportedProviders"
          :unavailable-providers="unavailableProviders"
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
    noAvaliableProviders() {
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
      } else if (this.noAvaliableProviders) {
        return this.allSupportedProviders;
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
        return [`${details.minValue} ${details.fromCurrency} (From Min.)`];
      }
      return '';
    },
    maxNote(details) {
      if (details.maxValue > 0) {
        return `${details.maxValue} ${details.fromCurrency} (Max.)`;
      }
      return '';
    },
    formatRateDisplay(fromValue, fromCurrency, toValue, toCurrency) {
      return `${fromValue} ${fromCurrency} = ${toValue} ${toCurrency}`;
    },
    normalizedRateDisplay(source) {
      const toValue = this.valueForRate(this.fromValue, source.rate);
      return `${source.fromValue} ${source.fromCurrency} = ${toValue} ${
        source.toCurrency
      }`;
    },
    valueForRate(rate, value) {
      return new BigNumber(value)
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

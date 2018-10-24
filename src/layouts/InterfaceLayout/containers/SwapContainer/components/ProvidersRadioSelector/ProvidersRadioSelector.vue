<template>
  <div class="providers-radio-selector">
    <div v-show="providerData.length > 0" class="radio-button-container">
      <ul>
        <li
          v-for="(provider, idx) in providerData"
          :key="provider.provider + idx">
          <div class="mew-custom-form__radio-button">
            <input
              v-show="providerData.length > 0"
              :id="provider.provider"
              :value="provider.provider"
              type="radio"
              name="provider"
              @input="setSelectedProvider(provider.provider)">
            <label :for="provider.provider"/>
          </div>
          <div class="provider-image">
            <img :src="providerLogo(provider.provider)">
          </div>
          <div>
            {{ normalizedRateDisplay(provider) }}
          </div>
          <div>
            {{ minMaxNote(provider) }}
          </div>
        </li>
      </ul>
    </div>
      <div v-show="loadingData" class="radio-button-container animated-background">
        <ul>
          <li
            v-for="provider in providersFound"
            :key="provider">
            <div class="mew-custom-form__radio-button">
              <input
                type="radio"
                name="provider">
              <label :for="provider"/>
            </div>
            <div class="provider-image">
              <img :src="providerLogo(provider)">
            </div>
              <div class="background-masker">
              </div>
          </li>
        </ul>
      </div>

    <div v-show="noAvaliableProviders" class="radio-button-container">
      <ul>
        <li>
          <div class="mew-custom-form__radio-button">
          </div>
          <div class="provider-image">
          </div>
          <div>
            No provider found for {{noProvidersPair.fromCurrency}} to {{noProvidersPair.toCurrency}}
          </div>
          <div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import KyberNetwork from '@/assets/images/etc/kybernetowrk.png';
import Bity from '@/assets/images/etc/bity.png';
import Simplex from '@/assets/images/etc/simplex.png';
import Changelly from '@/assets/images/etc/changelly.png';

export default {
  props: {
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
    providersFound: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      logos: {
        kybernetwork: KyberNetwork,
        bity: Bity,
        simplex: Simplex,
        changelly: Changelly // TODO: get logo from changelly
      }
    };
  },
  computed: {
    noAvaliableProviders() {
      return (
        (this.providersFound.length === 0 || this.providerData.length === 0) && !this.loadingData
      );
    }
  },
  methods: {
    setSelectedProvider(provider) {
      this.$emit('selectedProvider', provider);
    },
    providerLogo(name) {
      return this.logos[name];
    },
    minMaxNote(details) {
      // TODO: ask how to relay this information to user per provider
      if (details.minValue > 0 && details.maxValue > 0) {
        return `Minimun: ${details.minValue} ${
          details.fromCurrency
        }, Maximum: ${details.maxValue} ${details.fromCurrency}`;
      } else if (details.minValue > 0) {
        return `Minimun: ${details.minValue} ${details.fromCurrency}`;
      } else if (details.maxValue > 0) {
        return `Maximum: ${details.maxValue} ${details.fromCurrency}`;
      }
      return '';
    },
    normalizedRateDisplay(source) {
      const toValue = this.valueForRate(source.fromValue, source.rate);
      return `${source.fromValue} ${source.fromCurrency} = ${toValue} ${
        source.toCurrency
      }`;
    },
    valueForRate(rate, value) {
      return new BigNumber(value).times(rate).toString(10);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ProvidersRadioSelector.scss';
</style>

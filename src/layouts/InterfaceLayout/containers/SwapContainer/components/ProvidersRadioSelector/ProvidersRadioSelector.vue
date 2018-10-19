<template>
  <div
    v-show="providerData.length > 0"
    class="providers-radio-selector">
    <div class="radio-button-container">
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

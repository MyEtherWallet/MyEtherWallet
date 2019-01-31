<template>
  <ul>
    <li
      v-for="(providerName, idx) in unavailableProviders"
      v-show="false"
      :key="providerName + idx"
      class="unavailable"
    >
      <div class="provider-image">
        <img :src="providerLogo(providerName)" />
      </div>
      <div>
        <div class="show-mobile">
          <p>crypto-to-crypto and fiat-to-crypto swaps</p>
        </div>
      </div>
      <div class="show-desktop">
        <p>crypto-to-crypto and fiat-to-crypto swaps</p>
      </div>
    </li>
  </ul>
</template>

<script>
import MEW from '@/assets/images/logo.png';
import KyberNetwork from '@/assets/images/etc/kybernetwork.png';
import Bity from '@/assets/images/etc/bity.png';
import Simplex from '@/assets/images/etc/simplex.png';
import Changelly from '@/assets/images/etc/changelly.png';
import bityBeta from '@/assets/images/etc/bitybeta.png';

export default {
  props: {
    allSupportedProviders: {
      type: Array,
      default: function() {
        return [];
      }
    },
    unavailableProviders: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
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
    }
  },
  watch: {
    providerData() {
      this.listOtherProviders();
    }
  },
  methods: {
    providerLogo(details) {
      if (details.provider) {
        if (this.useBetaLogo(details)) return this.betaLogos[details.provider];
        return this.logos[details.provider];
      }
      return this.logos[details];
    },
    useBetaLogo(details) {
      return (
        details.provider === 'bity' &&
        (details.toCurrency === 'EUR' || details.toCurrency === 'CHF')
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ProviderInfoList.scss';
</style>

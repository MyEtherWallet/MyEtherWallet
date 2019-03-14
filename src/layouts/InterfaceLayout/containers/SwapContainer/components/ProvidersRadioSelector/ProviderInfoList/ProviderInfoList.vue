<template>
  <ul>
    <li
      v-for="(providerName, idx) in unavailableProviders"
      :key="providerName + idx"
    >
      <div class="provider-image">
        <img :src="providerLogo(providerName)" />
      </div>
      <div>
        <div>
          <p>{{ getTagLine(providerName) }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import MEW from '@/assets/images/logo.png';
import KyberNetwork from '@/assets/images/etc/kybernetwork_gray.png';
import Bity from '@/assets/images/etc/bity_gray.png';
import Simplex from '@/assets/images/etc/simplex_gray.png';
import Changelly from '@/assets/images/etc/changelly_gray.png';

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
      betaLogos: {}
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
    },
    getTagLine(name) {
      return this.$t(`interface.${name}TagLine`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ProviderInfoList.scss';
</style>

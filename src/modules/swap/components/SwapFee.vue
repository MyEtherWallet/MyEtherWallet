<template>
  <div class="mt-5 mb-10">
    <v-row justify="space-between" align="start">
      <v-col cols="4" class="mb-n3">
        <p class="mew-heading-3">Network Fee</p>
      </v-col>
      <v-col cols="7">
        <div class="d-flex align-center">
          <div class="d-flex align-center">
            <mew-icon :icon-name="icon" :img-height="30" />
            <span class="capitalize ml-2">{{ gasPriceType }}</span>
          </div>
          <span v-show="!gettingFee && showFee"
            >{{ actualFees }} {{ network.type.currencyName }}
          </span>
          <span :class="[hasError ? 'error--text' : '']">{{ feesInUsd }}</span>
          <v-skeleton-loader
            v-show="gettingFee || !showFee"
            class="mx-2 mb-n1"
            type="text"
            width="150px"
          />
          <img
            class="btn-circle"
            src="@/assets/images/icons/icon-edit-btn.svg"
            alt="edit"
            @click="openGasPriceModal"
          />
        </div>
        <p
          v-if="(!gettingFee || hasError) && message"
          :class="[hasError ? 'error--text' : '']"
        >
          {{ message }}
        </p>
        <div v-if="notEnoughEth" class="d-flex align-center justify-start">
          <a rel="noopener noreferrer" class="mr-3" target="_blank"
            >Why are the fees so high?</a
          >
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://ccswap.myetherwallet.com/#/"
            >Buy more ETH</a
          >
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';

const GAS_TYPE_ICONS = {
  economy: 'bicycle',
  regular: 'car',
  fast: 'rocket',
  stored: 'tags'
};
export default {
  name: 'SwapFee',
  props: {
    showFee: {
      type: Boolean,
      default: false
    },
    gettingFee: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    notEnoughEth: {
      type: Boolean,
      default: false
    },
    totalFees: {
      type: String,
      default: '0'
    },
    openGasPriceModal: {
      type: Function,
      default: () => {}
    },
    gasPriceType: {
      type: String,
      default: 'economy'
    },
    message: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network']),
    icon() {
      return GAS_TYPE_ICONS[this.gasPriceType];
    },
    actualFees() {
      return fromWei(this.totalFees).toString();
    },
    feesInUsd() {
      const value = BigNumber(this.actualFees).times(this.fiatValue).toFixed(2);
      return `~${'$' + value}`;
    },
    hasError() {
      return this.error !== '';
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-holder {
  padding: 3px 6px;
  border-radius: 50%;
  cursor: pointer;
}
</style>

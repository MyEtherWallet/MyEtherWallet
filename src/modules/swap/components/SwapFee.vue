<template>
  <div class="mt-5 mb-10">
    <v-row v-if="!showFee">
      <v-col cols="12" class="mb-n3">
        <v-card
          flat
          color="selectorBg lighten-1"
          class="d-flex align-center px-5 py-4"
          min-height="94px"
        >
          <v-card-text
            v-if="!gettingFee || hasError"
            :class="[hasError ? 'error--text' : '', 'text-center']"
          >
            {{ message }}
          </v-card-text>
          <v-card-text v-if="gettingFee && !hasError">
            Loading transaction fee.
          </v-card-text>
          <v-skeleton-loader
            v-if="gettingFee && !hasError"
            type="chip"
            width="100%"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="space-between" align="center" v-else>
      <v-col cols="4 mb-n3">
        <p class="mew-heading-3">Network Fee</p>
      </v-col>
      <v-col cols="7" class="d-flex justify-space-around align-center">
        <div class="d-flex justify-space-around align-center">
          <mew-icon :icon-name="icon" :img-height="30" />
          <span class="capitalize">{{ gasPriceType }}</span>
        </div>
        <span v-show="!gettingFee && showFee"
          >{{ actualFees }} {{ network.type.currencyName }}
          {{ feesInUsd }}</span
        >
        <v-skeleton-loader
          v-show="gettingFee || !showFee"
          type="text"
          width="250px"
        />
        <div class="icon-holder primary" @click="openGasPriceModal">
          <v-icon size="small" color="white">mdi-pencil</v-icon>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
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
    totalFees: {
      type: String,
      default: '0'
    },
    openGasPriceModal: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    ...mapState('global', ['gasPriceType']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['network']),
    icon() {
      return GAS_TYPE_ICONS[this.gasPriceType];
    },
    actualFees() {
      return fromWei(this.totalFees).toString();
    },
    feesInUsd() {
      const value = BigNumber(this.actualFees)
        .times(this.ETHUSDValue.value)
        .toFixed(2);
      return `~${this.ETHUSDValue.symbol} ${value}`;
    },
    hasError() {
      return this.error !== '';
    },
    message() {
      return this.hasError
        ? this.error
        : ' Select provider to load transaction fee and enable Swap.';
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

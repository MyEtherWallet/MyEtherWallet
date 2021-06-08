<template>
  <div class="mt-5 mb-10">
    <v-row justify="space-between" align="start">
      <v-col cols="12" sm="3" class="pb-0">
        <p class="mew-heading-3 mb-0">Network Fee</p>
      </v-col>
      <v-spacer class="d-none d-sm-flex" />
      <v-col class="d-flex justify-end align-center">
        <v-row dense>
          <v-col cols="12 py-0">
            <div class="d-flex justify-start align-center">
              <div class="d-flex justify-space-around align-center">
                <mew-icon :icon-name="icon" :img-height="30" />
                <span class="capitalize pl-2 mew-heading-4">{{
                  gasPriceType
                }}</span>
              </div>
              <span
                v-show="!gettingFee && showFee"
                class="pl-2 mew-heading-4 textSecondary--text d-flex eth-fee"
                >{{ actualFeeFormatted }} {{ network.type.currencyName }}
              </span>
              <span
                :class="[hasError ? 'error--text' : '', 'px-2 mew-heading-4']"
                >{{ feesInUsd }}</span
              >
              <v-skeleton-loader
                v-show="gettingFee || !showFee"
                type="text"
                width="250px"
              />
            </div>
          </v-col>

          <v-col v-if="!gettingFee || hasError" cols="12">
            <p :class="[hasError ? 'error--text' : '', 'mew-label mb-0']">
              {{ message }}
            </p>
          </v-col>
          <v-col cols="12" class="pt-0">
            <div class="d-flex align-center justify-start pt-2">
              <a rel="noopener noreferrer" class="mr-3" target="_blank"
                >Why are the fees so high?</a
              >
              <a
                v-if="notEnoughEth"
                rel="noopener noreferrer"
                target="_blank"
                href="https://ccswap.myetherwallet.com/#/"
                >Buy more ETH</a
              >
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="1">
        <div class="d-flex justify-end align-center">
          <div class="icon-holder primary" @click="openGasPriceModal">
            <v-icon size="small" color="white">mdi-pencil</v-icon>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';

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
    actualFeeFormatted() {
      return formatFloatingPointValue(this.actualFees).value;
    },
    feesInUsd() {
      const value = formatFiatValue(
        BigNumber(this.actualFees).times(this.fiatValue).toFixed(2)
      ).value;
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
.eth-fee {
  white-space: nowrap;
}
</style>

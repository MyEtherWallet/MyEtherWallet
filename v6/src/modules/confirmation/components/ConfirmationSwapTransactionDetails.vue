<template>
  <div>
    <!--
      =====================================================================================
        Values
      =====================================================================================
    -->
    <confirmation-values-container :items="valueItems" is-swap />
    <!--
      =====================================================================================
        Summary
      =====================================================================================
    -->
    <confirmation-summary-block
      v-if="summaryItems.length == 2"
      :items="summaryItems"
    >
      <template #rightColItem0>
        <div class="mew-body">
          1 <span class="greyPrimary--text">{{ fromType }}</span> =
          {{ formattedRate }}
          <span class="greyPrimary--text">{{ toType }}</span>
        </div>
      </template>
      <template #rightColItem1>
        <div class="mew-body">
          {{ convertedFees.value }}
          <span class="greyPrimary--text">{{ network.type.currencyName }}</span>
          ~{{ txFeeUSD }}
        </div>
      </template>
    </confirmation-summary-block>
    <confirmation-summary-block
      v-if="summaryItems.length == 3"
      :items="summaryItems"
    >
      <template #rightColItem0>
        <div class="mew-body d-flex justify-end">
          <mew-tooltip hide-icon :text="toAddress">
            <template #activatorSlot="{ on, attrs }">
              <div class="d-flex">
                <mew-blockie :address="toAddress" width="20px" height="20px" />
                <span v-bind="attrs" class="searchText--text ml-2" v-on="on">{{
                  toAddressShortened
                }}</span>
              </div>
            </template>
          </mew-tooltip>
        </div>
      </template>
      <template #rightColItem1>
        <div class="mew-body">
          1 <span class="searchText--text">{{ fromType }}</span> =
          {{ formattedRate }}
          <span class="searchText--text">{{ toType }}</span>
        </div>
      </template>
      <template #rightColItem2>
        <div class="mew-body">
          {{ convertedFees.value }}
          <span class="searchText--text">{{ toCurrency }}</span>
          ~{{ txFeeUSD }}
        </div>
      </template>
    </confirmation-summary-block>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import { fromWei } from 'web3-utils';

import {
  formatFloatingPointValue,
  formatGasValue
} from '@/core/helpers/numberFormatHelper';

export default {
  components: {
    ConfirmationSummaryBlock: () => import('./ConfirmationSummaryBlock'),
    ConfirmationValuesContainer: () => import('./ConfirmationValuesContainer')
  },
  props: {
    provider: {
      type: Object,
      default: () => {
        return {
          exchangeInfo: {
            img: ''
          },
          amount: '0',
          rate: '0'
        };
      }
    },
    fromVal: {
      type: String,
      default: '0'
    },
    toVal: {
      type: String,
      default: '0'
    },
    fromImg: {
      type: String,
      default: ''
    },
    toImg: {
      type: String,
      default: ''
    },
    fromType: {
      type: String,
      default: ''
    },
    toType: {
      type: String,
      default: ''
    },
    fromUsd: {
      type: String,
      default: ''
    },
    toUsd: {
      type: String,
      default: ''
    },
    txFee: {
      type: String,
      default: '0'
    },
    isToNonEth: {
      type: Boolean,
      default: false
    },
    toCurrency: {
      type: String,
      default: 'ETH'
    },
    toAddress: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'getFiatValue']),
    convertedFees() {
      return formatGasValue(this.txFee);
    },
    txFeeUSD() {
      const feeETH = BigNumber(fromWei(this.txFee));
      return this.getFiatValue(feeETH.times(this.fiatValue));
    },
    summaryItems() {
      const newArr = ['Exchange rate', 'Transaction fee'];
      if (this.isToNonEth) {
        newArr.unshift(`Receive ${this.toCurrency} to`);
      }
      return newArr;
    },
    formattedToVal() {
      return formatFloatingPointValue(this.toVal).value;
    },
    formattedFromVal() {
      return formatFloatingPointValue(this.fromVal).value;
    },
    formattedRate() {
      return formatFloatingPointValue(this.provider.rate).value;
    },
    valueItems() {
      return [
        {
          title: 'You Swap',
          icon: this.fromImg,
          value: this.formattedFromVal,
          type: this.fromType,
          address: this.from,
          amount: formatFloatingPointValue(this.fromVal).value,
          usd: formatFloatingPointValue(this.fromUsd).value
        },
        {
          title: 'You will get',
          icon: this.toImg,
          value: this.formattedToVal,
          type: this.toType,
          address: this.to,
          amount: formatFloatingPointValue(this.toVal).value,
          usd: this.getFiatValue(this.toUsd)
        }
      ];
    },
    toAddressStart() {
      return this.toAddress.substring(0, 20);
    },
    toAddressEnd() {
      return this.toAddress.substring(this.toAddress.length - 4);
    },
    toAddressShortened() {
      return this.toAddress.length > 30
        ? `${this.toAddressStart}... ${this.toAddressEnd}`
        : this.toAddress;
    }
  }
};
</script>

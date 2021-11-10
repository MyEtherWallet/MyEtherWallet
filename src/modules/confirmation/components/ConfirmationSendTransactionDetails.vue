<template>
  <v-sheet max-width="600px" class="pa-2">
    <!--
      =====================================================================================
        Values
      =====================================================================================
    -->
    <confirmation-values-container :items="valueItems" class="mb-5" />
    <!--
    =====================================================================================
      Summary
    =====================================================================================
    -->
    <confirmation-summary-block :items="summaryItems">
      <template #rightColItem0>
        <div class="mew-body">
          {{ feeFormatted }}
          <span class="searchText--text">{{ network.type.currencyName }}/</span>
          ~${{ txFeeUsd }}
        </div>
      </template>
      <template #rightColItem1>
        <div class="mew-body">
          {{ totalFee }}
          <span class="searchText--text">{{ network.type.currencyName }}/</span>
          ~${{ totalFeeUSD }}
        </div>
      </template>
    </confirmation-summary-block>
  </v-sheet>
</template>

<script>
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { toChecksumAddress } from '@/core/helpers/addressUtils';
import BigNumber from 'bignumber.js';
import ConfirmationSummaryBlock from './ConfirmationSummaryBlock';
import ConfirmationValuesContainer from './ConfirmationValuesContainer';
export default {
  components: {
    ConfirmationSummaryBlock,
    ConfirmationValuesContainer
  },
  props: {
    to: {
      type: String,
      default: ''
    },
    network: {
      type: Object,
      default: () => {}
    },
    txFee: {
      type: String,
      default: '0'
    },
    txFeeUsd: {
      type: String,
      default: '0'
    },
    value: {
      type: String,
      default: '0'
    },
    valueUsd: {
      type: Number,
      default: 0
    },
    toDetails: {
      type: Object,
      default: () => {}
    },
    sendCurrency: {
      type: Object,
      default: () => {}
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {};
  },
  computed: {
    currency() {
      const obj = Object.assign({}, this.sendCurrency);
      if (!obj.hasOwnProperty('amount')) obj['amount'] = this.value;
      if (!obj.hasOwnProperty('priceRaw'))
        obj['priceRaw'] = BigNumber(this.sendCurrency.price).toNumber();
      return obj;
    },
    isNetworkCurrency() {
      return this.currency.symbol === this.network.type.currencyName;
    },
    feeFormatted() {
      return formatFloatingPointValue(this.txFee).value;
    },
    totalFee() {
      if (this.currency.symbol === this.network.type.currencyName) {
        return formatFloatingPointValue(BigNumber(this.value).plus(this.txFee))
          .value;
      }
      return this.feeFormatted;
    },
    totalFeeUSD() {
      const ethFeeToUsd = BigNumber(this.txFee).times(this.valueUsd);
      if (this.currency.symbol === this.network.type.currencyName) {
        const amountToUsd = BigNumber(this.value).times(this.valueUsd);
        return formatFiatValue(BigNumber(amountToUsd).plus(ethFeeToUsd)).value;
      }
      const tokenPrice = BigNumber(this.currency.priceRaw).times(this.value);
      return formatFiatValue(tokenPrice.plus(ethFeeToUsd)).value;
    },
    usdAmount() {
      return formatFiatValue(
        BigNumber(this.value).times(this.currency.priceRaw)
      ).value;
    },
    summaryItems() {
      return this.isNetworkCurrency
        ? ['Transaction Fee', 'Total']
        : ['Transaction Fee'];
    },
    valueItems() {
      return [
        {
          amount: formatFloatingPointValue(this.currency.amount).value,
          icon: this.currency.img,
          usd: this.usdAmount,
          type: this.currency.symbol
        },
        {
          avatar: this.avatar,
          address: this.to ? toChecksumAddress(this.to) : '',
          nickname:
            this.toDetails && this.toDetails.nickname
              ? this.toDetails.nickname
              : '',
          ensName:
            this.toDetails && this.toDetails.ensName
              ? this.toDetails.ensName
              : ''
        }
      ];
    }
  }
};
</script>

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
    <confirmation-summary-block :items="summaryItems">
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
          <span class="greyPrimary--text">{{ convertedFees.unit }}</span>
          ~{{ txFeeUSD }}
        </div>
      </template>
    </confirmation-summary-block>
  </div>
</template>

<script>
import {
  formatFiatValue,
  formatFloatingPointValue,
  formatGasValue
} from '@/core/helpers/numberFormatHelper';
import ConfirmationSummaryBlock from './ConfirmationSummaryBlock';
import ConfirmationValuesContainer from './ConfirmationValuesContainer';
import BigNumber from 'bignumber.js';
import { mapGetters, mapState } from 'vuex';
import { fromWei } from 'web3-utils';
import { currencyToNumber } from '@/core/helpers/localization';
export default {
  components: {
    ConfirmationSummaryBlock,
    ConfirmationValuesContainer
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
    }
  },
  computed: {
    ...mapState('external', ['currencyRate']),
    ...mapState('global', ['preferredCurrency']),
    ...mapGetters('external', ['fiatValue']),
    convertedFees() {
      return formatGasValue(this.txFee);
    },
    txFeeUSD() {
      const feeETH = BigNumber(fromWei(this.txFee));
      return formatFiatValue(feeETH.times(this.fiatValue), this.getLocalOptions)
        .value;
    },
    summaryItems() {
      return ['Exchange rate', 'Transaction fee'];
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
          usd: formatFiatValue(
            currencyToNumber(this.toUsd),
            this.getLocalOptions
          ).value
        }
      ];
    },
    getLocalOptions() {
      const rate = this.currencyRate.data
        ? this.currencyRate.data.exchange_rate
        : 1;
      const currency = this.preferredCurrency;
      return {
        rate,
        currency
      };
    }
  }
};
</script>

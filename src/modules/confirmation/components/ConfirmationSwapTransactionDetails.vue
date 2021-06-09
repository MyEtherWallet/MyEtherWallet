<template>
  <div>
    <!--
      =====================================================================================
        Values
      =====================================================================================
    -->
    <v-row class="position--relative" justify="space-around">
      <v-col cols="6" class="text-center value-container">
        You Swap <br />
        <img :src="fromImg" height="30px" /> <br />
        {{ fromVal }} {{ fromType }}
      </v-col>
      <v-col cols="6" class="text-center value-container">
        You will get <br />
        <img :src="toImg" height="30px" /> <br />
        {{ toVal }} {{ toType }}
      </v-col>
      <div class="icon d-flex align-center">
        <v-icon> mdi-arrow-right </v-icon>
      </div>
    </v-row>
    <!--
      =====================================================================================
        Summary
      =====================================================================================
    -->
    <confirmation-summary-block :items="summaryItems" class="mt-9">
      <template #rightColItem0>
        <div class="mew-body">
          1 <span class="searchText--text">{{ fromType }}</span> =
          {{ toFixed(provider.rate) }}
          <span class="searchText--text">{{ toType }}</span>
        </div>
      </template>
      <template #rightColItem1>
        <div class="mew-body">
          {{ convertedFees.value }}
          <span class="searchText--text">{{ convertedFees.unit }}</span>
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
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import { fromWei } from 'web3-utils';
export default {
  components: {
    ConfirmationSummaryBlock
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
    gasPriceType: {
      type: String,
      default: ''
    },
    fromVal: {
      type: String,
      default: '0'
    },
    toVal: {
      type: String,
      default: '0'
    },
    to: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
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
    show: {
      type: Boolean,
      default: false
    },
    txFee: {
      type: String,
      default: '0'
    },
    close: {
      type: Function,
      default: () => {}
    },
    send: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    convertedFees() {
      return formatGasValue(this.txFee);
    },
    txFeeUSD() {
      const feeETH = BigNumber(fromWei(this.txFee));
      console.log(this.fiatValue);
      console.log(formatFiatValue(feeETH.times(this.fiatValue)).value);
      return `$ ${formatFiatValue(feeETH.times(this.fiatValue)).value}`;
    },
    summaryItems() {
      return ['Exchange rate', 'Transaction fee'];
    },
    formattedToVal() {
      return formatFloatingPointValue(this.toVal).val;
    },
    formattedFromVal() {
      return formatFloatingPointValue(this.fromVal).val;
    }
  },
  methods: {
    toFixed(val) {
      return `~${BigNumber(val).toFixed(2)}`;
    },
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.value-container {
  border-radius: 5px;
  background-color: #f9f9f9;
}

.icon {
  width: 32px;
  border-radius: 50%;
  background-color: white;
  height: 32px;
  top: 30px;
  position: absolute;
  text-align: center;
  padding-left: 5px;
}
</style>

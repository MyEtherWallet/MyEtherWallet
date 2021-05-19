<template>
  <div>
    <v-row>
      <v-col cols="12">
        <p>
          <b>Please doublecheck everything.</b> MEW team will not be able to
          reverse your transaction once its submitted. You will still be charged
          gas fees even if the transaction fails. <a>Learn more.</a>
        </p>
      </v-col>
    </v-row>
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
    <v-row class="my-4">
      <v-col cols="6" class="text-left">
        Provider <br />
        Exchange rate <br />
        Transaction fee
      </v-col>
      <v-col cols="6" class="text-right">
        <img :src="provider.exchangeInfo.img" height="25px" /> <br />
        {{ toFixed(provider.amount) }} {{ fromType }} =
        {{ toFixed(provider.rate) }} {{ toType }} <br />
        <span class="capitalize">{{ gasPriceType }}</span>
        {{ convertedFees }} {{ txFeeUSD }}
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { fromWei } from 'web3-utils';
export default {
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
    ...mapState('external', ['ETHUSDValue']),
    convertedFees() {
      return fromWei(this.txFee);
    },
    txFeeUSD() {
      return `$ ${BigNumber(this.convertedFees)
        .times(this.ETHUSDValue.value)
        .toFixed(2)}`;
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

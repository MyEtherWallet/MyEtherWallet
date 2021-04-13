<template>
  <v-dialog :value="show" width="500">
    <v-sheet class="py-6 px-4">
      <!--
        =====================================================================================
          Dialog Header text
        =====================================================================================
        -->
      <v-row>
        <v-col cols="12" class="text-right">
          <v-icon size="large" color="grey cursor--pointer" @click="close"
            >mdi-close</v-icon
          >
        </v-col>
        <v-col cols="12" align-self="center">
          <p class="mew-heading-2 text-center">Review Swap</p>
        </v-col>
        <v-col cols="12">
          <p>
            <b>Please doublecheck everything.</b> MEW team will not be able to
            reverse your transaction once its submitted. You will still be
            charged gas fees even if the transaction fails. <a>Learn more.</a>
          </p>
        </v-col>
      </v-row>
      <!--
        =====================================================================================
          Values
        =====================================================================================
        -->
      <v-row class="position--relative" justify="space-around">
        <v-col cols="5" class="text-center value-container">
          You Swap <br />
          <img :src="fromImg" height="30px" /> <br />
          {{ fromVal }} {{ fromType }}
        </v-col>
        <v-col cols="5" class="text-center value-container">
          You will get <br />
          <img :src="toImg" height="30px" /> <br />
          {{ toVal }} {{ toType }}
        </v-col>
      </v-row>
      <!--
        =====================================================================================
          Summary
        =====================================================================================
        -->
      <v-row>
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
    </v-sheet>
  </v-dialog>
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
    send: {
      type: Function,
      default: () => {}
    },
    txFee: {
      type: String,
      default: '0'
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    ...mapState('global', ['gasPriceType']),
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
    }
  }
};
</script>

<style lang="scss" scoped>
.value-container {
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>

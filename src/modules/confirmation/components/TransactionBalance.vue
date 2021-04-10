<template>
  <div class="superPrimary border-radius--5px pa-5">
    <v-row>
      <v-col class="d-flex align-center">
        <h5 class="font-weight-bold">Balance Remaining</h5>
      </v-col>
      <v-col class="d-flex flex-column align-end justify-center">
        <h5 class="font-weight-bold">{{ balanceUsd }}</h5>
        <div>{{ balanceInETH }} {{ currency }}</div>
      </v-col>
    </v-row>

    <mew-progress-bar class="my-5" :balance-obj="progressBar" />

    <div>
      <v-row dense :class="!$vuetify.breakpoint.smAndUp ? 'mb-5' : ''">
        <v-col class="d-flex align-center text-uppercase" cols="12" sm="4">
          <v-icon color="titlePrimary"> mdi-circle-medium </v-icon>
          <h6 class="searchText--text font-weight-medium">Send</h6>
          <img
            class="ml-1"
            src="@/assets/images/currencies/icon-eth-blue.svg"
            height="17"
          />
        </v-col>
        <v-col
          class="d-flex align-center pl-6"
          :class="$vuetify.breakpoint.smAndUp ? 'justify-end' : 'justify-start'"
          cols="12"
          sm="4"
        >
          <span class="mr-1">- {{ value }}</span>
          <span class="searchText--text font-weight-medium">{{
            currency
          }}</span>
        </v-col>
        <v-col
          v-if="isEthNetwork"
          class="d-flex align-center pl-6"
          :class="$vuetify.breakpoint.smAndUp ? 'justify-end' : 'justify-start'"
          cols="12"
          sm="4"
        >
          <span> - {{ valueUsd }} </span>
        </v-col>
      </v-row>

      <v-row dense :class="!$vuetify.breakpoint.smAndUp ? 'mb-5' : ''">
        <v-col class="d-flex align-center text-uppercase" cols="4">
          <v-icon color="#f5a623"> mdi-circle-medium </v-icon>
          <h6 class="searchText--text font-weight-medium">Transaction Fee</h6>
        </v-col>
        <v-col
          class="d-flex align-center pl-6"
          :class="$vuetify.breakpoint.smAndUp ? 'justify-end' : 'justify-start'"
          cols="12"
          sm="4"
        >
          <span class="mr-1">- {{ txFee }}</span>
          <span class="searchText--text font-weight-medium">{{
            currency
          }}</span></v-col
        >
        <v-col
          v-if="isEthNetwork"
          class="d-flex align-center pl-6"
          :class="$vuetify.breakpoint.smAndUp ? 'justify-end' : 'justify-start'"
          cols="12"
          sm="4"
        >
          <span> - {{ formattedTx }} </span>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col class="d-flex align-center text-uppercase" cols="4">
          <v-icon color="transparent"> mdi-circle-medium </v-icon>
          <h6 class="searchText--text font-weight-medium">Total Pay</h6>
        </v-col>
        <v-col
          class="d-flex align-center pl-6"
          :class="$vuetify.breakpoint.smAndUp ? 'justify-end' : 'justify-start'"
          cols="12"
          sm="4"
        >
          <span class="mr-1">{{ total }} </span>
          <span class="searchText--text font-weight-medium">{{
            currency
          }}</span></v-col
        >
        <v-col
          v-if="isEthNetwork"
          class="d-flex align-center pl-6"
          :class="$vuetify.breakpoint.smAndUp ? 'justify-end' : 'justify-start'"
          cols="12"
          sm="4"
        >
          {{ totalUsd }}
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
export default {
  props: {
    txFee: {
      type: String,
      default: '0'
    },
    txFeeUSD: {
      type: String,
      default: '0'
    },
    value: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['network', 'isEthNetwork']),
    balanceUsd() {
      const value = this.isEthNetwork
        ? BigNumber(this.balanceInETH).times(this.ETHUSDValue.value).toFixed(2)
        : this.balanceInETH;
      return `$ ${value}`;
    },
    valueUsd() {
      const value = this.isEthNetwork
        ? BigNumber(this.value).times(this.ETHUSDValue.value).toFixed(2)
        : this.value;
      return `$ ${value}`;
    },
    currency() {
      return this.network.type.currencyName;
    },
    total() {
      return BigNumber(this.value).plus(this.txFee).toFixed();
    },
    totalUsd() {
      const value = this.isEthNetwork
        ? BigNumber(this.total).times(this.ETHUSDValue.value).toFixed(2)
        : 0;
      return `$ ${value}`;
    },
    formattedTx() {
      return `$ ${BigNumber(this.txFeeUSD).toFixed(2)}`;
    },
    progressBar() {
      const toSendPercent = BigNumber(this.value)
        .times(100)
        .div(this.balanceInETH);
      const txFeePercent = BigNumber(this.txFee)
        .times(100)
        .div(this.balanceInETH);
      return {
        total: this.balanceInETH,
        data: [
          {
            title: 'sendBal',
            color: 'titlePrimary',
            amount: this.value,
            tooltip: `Amount to send: ${this.value}`,
            percentage: toSendPercent
          },
          {
            title: 'feeBal',
            color: 'warning darken-1',
            amount: this.txFee,
            tooltip: `Estimated Transaction Fee: ${this.txFee}`,
            percentage: txFeePercent
          }
        ]
      };
    }
  }
};
</script>

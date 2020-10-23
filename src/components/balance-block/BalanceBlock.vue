<template>
  <div class="superPrimary border-radius--5px pa-5">
    <v-row>
      <v-col class="pt-0">
        <h5 class="font-weight-bold">Balance Remaining</h5>
      </v-col>
      <v-col class="text-right pt-0">
        <h5 class="font-weight-bold">{{ balanceUsd }}</h5>
        <div>{{ balance }} {{ currency }}</div>
      </v-col>
    </v-row>

    <mew-progress-bar :balance-obj="progressBar" />

    <div class="mt-5">
      <v-row class="py-0">
        <v-col class="d-flex align-center py-1 my-0 text-uppercase" cols="4">
          <v-icon color="titlePrimary"> mdi-circle-medium </v-icon>
          <h6 class="searchText--text font-weight-medium">Send</h6>
          <img
            class="ml-1"
            src="@/assets/images/currencies/icon-eth-blue.svg"
            height="17"
          />
        </v-col>
        <v-col class="py-0 my-0 text-right" cols="4">
          <span> - {{ value }} </span>
          <span class="searchText--text font-weight-medium">{{
            currency
          }}</span></v-col
        >
        <v-col v-if="isEth" class="py-0 my-0 text-right" cols="4">
          <span> - {{ valueUsd }} </span>
        </v-col>
      </v-row>

      <v-row class="py-0">
        <v-col class="d-flex align-center py-1 my-0 text-uppercase" cols="4">
          <v-icon color="#f5a623"> mdi-circle-medium </v-icon>
          <h6 class="searchText--text font-weight-medium">Transaction Fee</h6>
        </v-col>
        <v-col class="py-0 my-0 text-right" cols="4">
          <span> - {{ txFee }} </span>
          <span class="searchText--text font-weight-medium">ETH</span></v-col
        >
        <v-col v-if="isEth" class="py-0 my-0 text-right" cols="4">
          <span> - {{ formattedTx }} </span>
        </v-col>
      </v-row>

      <v-row class="py-0">
        <v-col class="d-flex align-center py-1 my-0 text-uppercase" cols="4">
          <v-icon color="transparent"> mdi-circle-medium </v-icon>
          <h6 class="searchText--text font-weight-medium">Total Pay</h6>
        </v-col>
        <v-col class="py-0 my-0 text-right font-weight-medium" cols="4">
          <span>{{ total }} </span>
          <span class="searchText--text font-weight-medium">{{
            currency
          }}</span></v-col
        >
        <v-col
          v-if="isEth"
          class="py-0 my-0 text-right font-weight-medium"
          cols="4"
        >
          {{ totalUsd }}
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { ETH } from '@/utils/networks/types';
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
    ...mapState('wallet', ['balance', 'usd', 'network']),
    isEth() {
      return this.network.type.name === ETH.name;
    },
    balanceUsd() {
      const value = this.isEth
        ? BigNumber(this.balance).times(this.usd).toFixed(2)
        : this.balance;
      return `$ ${value}`;
    },
    valueUsd() {
      const value = this.isEth
        ? BigNumber(this.value).times(this.usd).toFixed(2)
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
      const value = this.isEth
        ? BigNumber(this.total).times(this.usd).toFixed(2)
        : 0;
      return `$ ${value}`;
    },
    formattedTx() {
      return `$ ${BigNumber(this.txFeeUSD).toFixed(2)}`;
    },
    progressBar() {
      const toSendPercent = (this.value * 100) / this.balance;
      const txFeePercent = (this.txFee * 100) / this.balance;
      return {
        total: this.balance,
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

<style lang="scss" scoped></style>

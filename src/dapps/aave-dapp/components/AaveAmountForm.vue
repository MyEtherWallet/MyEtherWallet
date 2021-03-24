<template>
  <v-sheet
    class="pa-12 text-center"
    rounded
    color="white"
    elevation="1"
    width="650"
  >
    <v-row justify="space-around">
      <v-col cols="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          subtitle="Aave Deposit Balance"
          :title="aaveBalance.title"
          :caption="aaveBalance.caption"
          class="text-left"
        />
      </v-col>
      <v-col cols="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          subtitle="Aave Wallet Balance"
          :title="walletBalance.title"
          :caption="walletBalance.caption"
          class="text-left"
        />
      </v-col>
    </v-row>
    <div class="px-12 mt-5">
      <p class="mew-heading-3 text-left">How much would you like to deposit?</p>
      <p class="mew-body pt-1 text-left">
        Here you can set the amount you want to deposit. You can manually enter
        a specific amount or use the percentage buttons below
      </p>
    </div>
    <div class="px-12 mt-5">
      <div class="px-12">
        <mew-input
          ref="input"
          label="Amount"
          :value="amount"
          right-label="DAI"
          :hide-clear-btn="true"
          type="number"
        />
      </div>
      <mew-toggle
        :key="key"
        :button-group="group"
        button-type="percentage"
        @onBtnClick="onToggle"
      />
    </div>
    <v-row class="px-12 mt-5" align="center" justify="center">
      <v-col cols="6">
        <mew-button
          title="Deposit"
          color-theme="primary"
          btn-style="background"
          btn-size="xlarge"
          class="mb-2 px-12"
          :has-full-width="true"
          @click.native="deposit"
        />
        <br />
        <mew-button
          title="Cancel Deposit"
          color-theme="error"
          btn-style="transparent"
          btn-size="xlarge"
          class="px-12"
          :has-full-width="true"
          @click.native="cancelDeposit"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';

export default {
  name: 'AaveAmountForm',
  props: {
    selectedToken: {
      type: Object,
      default: () => {}
    },
    handler: {
      type: [Object, null],
      default: () => {}
    }
  },
  computed: {
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    ...mapGetters('global', ['network']),
    tokenBalance() {
      const symbol = this.selectedToken.token;
      if (symbol === this.network.type.currencyName) return this.balanceInETH;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });

      return hasBalance ? BigNumber(hasBalance.usdBalance).toFixed() : 0;
    },
    depositedBalance() {
      const symbol = this.selectedToken.token;
      const userReserves = this.handler.userSummary.reservesData.find(item => {
        if (item.reserve.symbol === symbol) return item;
      });
      return userReserves ? userReserves.currentUnderlyingBalance : 0;
    },
    selectedTokenUSDValue() {
      const symbol = this.selectedToken.token;
      const reserves = this.handler.reservesData.find(item => {
        if (item.symbol === symbol) return item;
      });

      return reserves ? reserves.price.priceInEth : 0;
    },
    tokenBalanceInUSD() {
      return BigNumber(this.selectedTokenUSDValue).times(this.tokenBalance);
    },
    depositedBalanceInUSD() {
      return BigNumber(this.selectedTokenUSDValue).times(this.depositedBalance);
    },
    walletBalance() {
      return {
        title: `${this.tokenBalance} ${this.selectedToken.token}`,
        caption: `$ ${this.tokenBalanceInUSD}`
      };
    },
    aaveBalance() {
      return {
        title: `${this.depositedBalance} ${this.selectedToken.token}`,
        caption: `$ ${this.depositedBalanceInUSD}`
      };
    }
  },
  data() {
    return {
      group: ['25%', '50%', '75%', 'MAX'],
      key: '50%',
      amount: '0'
    };
  },
  mounted() {
    this.onToggle(this.key);
  },
  methods: {
    onToggle(e) {
      this.key = e;
      switch (e) {
        case this.group[0]:
          this.calculatedAmt(0.25);
          break;
        case this.group[1]:
          this.calculatedAmt(0.5);
          break;
        case this.group[2]:
          this.calculatedAmt(0.75);
          break;
        default:
          this.calculatedAmt(1);
      }
    },
    cancelDeposit() {
      this.$emit('cancelDeposit');
    },
    deposit() {},
    calculatedAmt(per) {
      const amt = BigNumber(this.tokenBalance).times(per);
      return amt.toFixed();
    }
  }
};
</script>

<style></style>

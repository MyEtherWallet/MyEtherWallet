<template>
  <v-sheet
    class="pa-12 text-center"
    rounded
    color="white"
    elevation="1"
    width="650"
  >
    <v-row v-if="isDeposit" justify="space-around">
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
    <v-row v-if="!isDeposit" justify="space-around">
      <v-col cols="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          subtitle="You borrowed"
          :title="totalBorrowed.title"
          :caption="totalBorrowed.caption"
          class="text-left"
        />
      </v-col>
      <v-col cols="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          subtitle="Total Collateral"
          :title="totalCollateral.title"
          :caption="totalCollateral.caption"
          class="text-left"
        />
      </v-col>
    </v-row>
    <div class="px-12 mt-5">
      <p class="mew-heading-3 text-left">{{ formText.title }}</p>
      <p class="mew-body pt-1 text-left">
        {{ formText.caption }}
      </p>
    </div>
    <div class="px-12 mt-5">
      <div class="px-12">
        <mew-input
          ref="input"
          label="Amount"
          :value="amount"
          :right-label="selectedToken.token"
          :hide-clear-btn="true"
          type="number"
        />
      </div>
      <mew-toggle
        v-if="isDeposit"
        :button-group="group"
        button-type="percentage"
        :on-toggle-btn-idx="startingIdx"
        @onBtnClick="onToggle"
      />
    </div>
    <v-row class="px-12 mt-5" align="center" justify="center">
      <v-col cols="6">
        <mew-button
          :title="buttonTitle.action"
          color-theme="primary"
          btn-style="background"
          btn-size="xlarge"
          class="mb-2 px-12"
          :has-full-width="true"
          @click.native="emitValues"
        />
        <br />
        <mew-button
          :title="buttonTitle.cancel"
          color-theme="error"
          btn-style="transparent"
          btn-size="xlarge"
          class="px-12"
          :has-full-width="true"
          @click.native="cancel"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import {
  AAVE_TABLE_HEADER,
  convertToFixed
} from '@/dapps/aave-dapp/handlers/helpers';

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
    },
    actionType: {
      type: String,
      default: AAVE_TABLE_HEADER.DEPOSIT
    }
  },
  data() {
    return {
      group: ['25%', '50%', '75%', 'MAX'],
      amount: '0',
      startingIdx: 1
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    ...mapGetters('global', ['network']),
    isDeposit() {
      return this.actionType === AAVE_TABLE_HEADER.DEPOSIT;
    },
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
        title: `${convertToFixed(this.tokenBalance, 6)} ${
          this.selectedToken.token
        }`,
        caption: `$ ${convertToFixed(this.tokenBalanceInUSD.toFixed())}`
      };
    },
    aaveBalance() {
      return {
        title: `${convertToFixed(this.depositedBalance, 6)} ${
          this.selectedToken.token
        }`,
        caption: `$ ${convertToFixed(this.depositedBalanceInUSD.toFixed())}`
      };
    },
    totalCollateral() {
      const eth = this.handler?.userSummary.totalCollateralETH;
      const usd = this.handler?.userSummary.totalCollateralUSD;
      return {
        title: `$ ${convertToFixed(usd)}`,
        caption: `${eth} ETH`
      };
    },
    totalBorrowed() {
      const hasBorrowed = this.handler?.userSummary.reservesData.find(item => {
        if (item.reserve.symbol === this.selectedToken.token) {
          return item;
        }
      });
      const eth = hasBorrowed
        ? `${hasBorrowed.currentBorrowsETH} ETH`
        : `$ 0.00`;
      const usd = hasBorrowed
        ? `$ ${convertToFixed(hasBorrowed.currentBorrowsUSD)}`
        : `0 ETH`;
      return {
        title: eth,
        caption: usd
      };
    },
    buttonTitle() {
      const cancel = `Cancel ${this.isDeposit ? 'Deposit' : 'Borrow'}`;
      const action = this.isDeposit ? 'Deposit' : 'Borrow';
      return {
        cancel: cancel,
        action: action
      };
    },
    formText() {
      const title = `How much would you like to ${
        this.isDeposit ? 'deposit' : 'borrow'
      }?`;
      const caption = `Here you can set the amount you want to ${
        this.isDeposit
          ? 'deposit. You can manually enter a specific amount or use the percentage buttons below.'
          : 'borrow.'
      }`;
      return {
        title: title,
        caption: caption
      };
    }
  },
  mounted() {
    if (this.isDeposit) {
      this.onToggle('50%');
    }
  },
  methods: {
    onToggle(e) {
      switch (e) {
        case this.group[0]:
          this.startingIdx = 0;
          this.amount = this.calculatedAmt(0.25);
          break;
        case this.group[1]:
          this.startingIdx = 1;
          this.amount = this.calculatedAmt(0.5);
          break;
        case this.group[2]:
          this.startingIdx = 2;
          this.amount = this.calculatedAmt(0.75);
          break;
        default:
          this.startingIdx = 2;
          this.amount = this.calculatedAmt(1);
      }
    },
    cancel() {
      this.$emit('cancel');
    },
    emitValues() {
      const amtUSDvalue = BigNumber(this.selectedTokenUSDValue)
        .times(this.amount)
        .toFixed();
      this.$emit('emitValues', [this.amount, `$ ${amtUSDvalue}`]);
    },
    calculatedAmt(per) {
      const amt = BigNumber(this.tokenBalance).times(per);
      return amt.toFixed();
    }
  }
};
</script>

<style></style>

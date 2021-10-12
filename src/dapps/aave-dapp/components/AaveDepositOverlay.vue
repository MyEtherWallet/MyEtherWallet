<template>
  <mew-overlay
    :show-overlay="open"
    :title="header"
    :close="handleCancel"
    class="mew-component--aave-deposit-overlay"
  >
    <!--
      =====================================================================================
        Aave token deposit table
      =====================================================================================
      -->
    <v-sheet
      v-if="step === 0"
      color="white"
      max-width="650px"
      class="border-radius--10px pa-4"
    >
      <aave-table
        :handler="handler"
        :table-header="depositHeader"
        @selectedDeposit="handleSelectedDeposit"
      />
    </v-sheet>
    <!--
        =====================================================================================
          Aave Summary
        =====================================================================================
        -->
    <div v-if="step === 1 || step === 3">
      <aave-summary
        :selected-token="selectedToken"
        :handler="handler"
        :amount="amount"
        :amount-usd="amountUsd"
        :step="step"
        :action-type="depositHeader"
        @confirmed="handleConfirm"
        @onConfirm="emitDeposit"
      />
    </div>
    <div v-if="step === 2">
      <aave-amount-form
        :selected-token="selectedToken"
        :handler="handler"
        :show-toggle="aaveDepositForm.showToggle"
        :left-side-values="aaveDepositForm.leftSideValues"
        :right-side-values="aaveDepositForm.rightSideValues"
        :form-text="aaveDepositForm.formText"
        :button-title="aaveDepositForm.buttonTitle"
        :token-balance="tokenBalance"
        @cancel="handleCancel"
        @emitValues="handleDepositAmount"
      />
    </div>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
import AaveSummary from './AaveSummary';
import AaveAmountForm from './AaveAmountForm.vue';
import { AAVE_TABLE_HEADER, convertToFixed } from '../handlers/helpers';
import { _ } from 'web3-utils';
import aaveOverlayMixin from '../handlers/aaveOverlayMixin';
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
export default {
  components: { AaveTable, AaveSummary, AaveAmountForm },
  mixins: [aaveOverlayMixin],
  data() {
    return {
      step: 0,
      selectedToken: {},
      amount: '0',
      depositHeader: AAVE_TABLE_HEADER.DEPOSIT
    };
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
      return hasBalance ? BigNumber(hasBalance.usdBalance).toFixed() : '0';
    },
    header() {
      switch (this.step) {
        case 1:
        case 3:
          return 'Deposit';
        case 2:
          return 'Confirmation';
        default:
          return 'Select the token you want to deposit';
      }
    },
    aaveDepositForm() {
      const hasDeposit = this.selectedTokenInUserSummary;
      const depositedBalance = `${convertToFixed(
        hasDeposit ? hasDeposit?.currentUnderlyingBalance : 0,
        6
      )} ${this.selectedToken.token}`;
      const depositedBalanceInUSD = `$ ${BigNumber(this.selectedTokenUSDValue)
        .times(hasDeposit?.currentUnderlyingBalance)
        .toFixed(2)}`;

      const tokenBalance = `${this.tokenBalance} ${this.selectedToken.token}`;
      const usd = `$ ${BigNumber(this.tokenBalance)
        .times(this.selectedTokenUSDValue)
        .toFixed(2)}`;
      return {
        showToggle: true,
        leftSideValues: {
          title: depositedBalance,
          caption: depositedBalanceInUSD,
          subTitle: 'Aave Deposit Balance'
        },
        rightSideValues: {
          title: tokenBalance,
          caption: usd,
          subTitle: 'Aave Wallet Balance'
        },
        formText: {
          title: 'How much would you like to deposit?',
          caption:
            'Here you can set the amount you want to deposit. You can manually enter a specific amount or use the percentage buttons below.'
        },
        buttonTitle: {
          action: 'Deposit',
          cancel: 'Cancel Deposit'
        }
      };
    }
  },
  watch: {
    preSelectedToken(newVal) {
      if (newVal && !_.isEmpty(newVal)) {
        this.handleSelectedDeposit(this.preSelectedToken);
      }
    }
  },
  methods: {
    handleSelectedDeposit(val) {
      this.selectedToken = val;
      this.step = 1;
    },
    handleConfirm() {
      this.step += 1;
    },
    handleDepositAmount(e) {
      this.step = 3;
      this.amount = e;
    },
    handleCancel() {
      this.step = 0;
      this.selectedToken = {};
      this.amount = '0';

      this.close();
    },
    emitDeposit() {
      const param = {
        aavePool: 'proto',
        userAddress: this.address,
        amount: this.amount,
        referralCode: '14',
        reserve: this.actualToken.underlyingAsset
      };
      this.$emit('onConfirm', param);
      this.handleCancel();
    }
  }
};
</script>

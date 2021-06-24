<template>
  <mew-overlay
    :show-overlay="open"
    :title="header"
    right-btn-text="Close"
    :close="handleCancel"
    class="mew-component--aave-deposit-overlay"
  >
    <template #mewOverlayBody>
      <!--
      =====================================================================================
        Step 1: Select a token to depost (Aave token deposit table)
      =====================================================================================
      -->
      <v-sheet
        v-if="step === 0"
        color="white"
        max-width="650px"
        class="border-radius--10px pa-4"
      >
        <aave-table
          :is-loading-data="isLoadingData"
          :reserves-data="reservesData"
          :user-reserves-data="userSummary.reservesData"
          :table-header="depositHeader"
          @selectedDeposit="handleSelectedDeposit"
        />
      </v-sheet>
      <!--
        =====================================================================================
          Step 2: Select the amount to deposit
        =====================================================================================
        -->
      <div v-if="step === 1">
        <aave-amount-form
          :selected-token="selectedToken"
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
      <!--
        =====================================================================================
          Step 3: Summary
        =====================================================================================
        -->
      <div v-if="step === 2">
        <aave-summary
          :selected-token="selectedToken"
          :user-summary="userSummary"
          :amount="amount"
          :amount-usd="amountUsd"
          :step="step"
          :action-type="depositHeader"
          @onConfirm="emitDeposit"
        />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
import AaveSummary from './AaveSummary';
import AaveAmountForm from './AaveAmountForm.vue';
import { AAVE_TABLE_HEADER, ACTION_TYPES } from '../handlers/helpers';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { _ } from 'web3-utils';
import handlerAaveOverlay from '../handlers/handlerAaveOverlay.mixin';
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
export default {
  components: { AaveTable, AaveSummary, AaveAmountForm },
  mixins: [handlerAaveOverlay],
  data() {
    return {
      step: 0,
      selectedToken: {},
      amount: '0',
      depositHeader: AAVE_TABLE_HEADER.DEPOSIT,
      deposit: ACTION_TYPES.deposit
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
          return 'Deposit';
        case 2:
          return 'Confirmation';
        default:
          return 'Select the token you want to deposit';
      }
    },
    aaveDepositForm() {
      const hasDeposit = this.selectedTokenInUserSummary;
      const depositedBalance = `${
        formatFloatingPointValue(hasDeposit?.currentUnderlyingBalance || 0)
          .value
      } ${this.selectedToken.token}`;
      const depositedBalanceInUSD = `$ ${
        formatFiatValue(
          BigNumber(this.selectedTokenUSDValue).times(
            hasDeposit?.currentUnderlyingBalance || 0
          )
        ).value
      }`;

      const tokenBalance = `${
        formatFloatingPointValue(this.tokenBalance).value
      } ${this.selectedToken.token}`;
      const usd = `$ ${
        formatFiatValue(
          BigNumber(this.tokenBalance).times(this.selectedTokenUSDValue)
        ).value
      }`;
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
    handleDepositAmount(e) {
      this.step = 2;
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

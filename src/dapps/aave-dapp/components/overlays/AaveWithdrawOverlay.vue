<template>
  <!--
  =====================================================================================
    Withdraw Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Withdraw"
    right-btn-text="Close"
    :close="close"
    content-size="xlarge"
  >
    <aave-amount-form
      v-if="step === 0"
      :selected-token="preSelectedToken"
      :show-toggle="aaveWithdrawForm.showToggle"
      :left-side-values="aaveWithdrawForm.leftSideValues"
      :right-side-values="aaveWithdrawForm.rightSideValues"
      :form-text="aaveWithdrawForm.formText"
      :button-title="aaveWithdrawForm.buttonTitle"
      :aave-balance="aaveWithdrawForm.depositedBalance"
      :token-decimal="aaveWithdrawForm.decimals"
      @cancel="handleCancel"
      @emitValues="handleWithdrawAmount"
    />

    <!--
        =====================================================================================
          Step 2: Withdraw Summary
        =====================================================================================
        -->
    <aave-summary
      v-if="step === 1"
      :selected-token="preSelectedToken"
      :amount="amount"
      :action-type="withdrawTitle"
      :amount-usd="amountUSD"
      @onConfirm="handleConfirm"
    />
  </mew-overlay>
</template>

<script>
import BigNumber from 'bignumber.js';
import AaveAmountForm from '../AaveAmountForm';
import AaveSummary from '../AaveSummary';
import handlerAave from '../../handlers/handlerAave.mixin';
import { AAVE_TABLE_TITLE } from '../../handlers/helpers';
import { mapGetters } from 'vuex';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { toBase } from '@/core/helpers/unit';
import { toBN, toHex } from 'web3-utils';
import { MAX_UINT_AMOUNT } from '@aave/contract-helpers';

export default {
  name: 'AaveWithdrawOverlay',
  components: {
    AaveAmountForm,
    AaveSummary
  },
  mixins: [handlerAave],
  data() {
    return {
      step: 0,
      amount: '0',
      withdrawTitle: AAVE_TABLE_TITLE.withdraw
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    ...mapGetters('global', ['network', 'getFiatValue']),
    tokenBalanceUSD() {
      const symbol = this.preSelectedToken.token;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });
      return hasBalance ? BigNumber(hasBalance.usdBalance).toFixed() : '0';
    },
    tokenPrice() {
      const symbol = this.preSelectedToken.token;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });
      return hasBalance ? BigNumber(hasBalance.price).toFixed() : '0';
    },
    tokenBalance() {
      const symbol = this.preSelectedToken.token;
      if (symbol === this.network.type.currencyName) return this.balanceInETH;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });
      return hasBalance
        ? BigNumber(hasBalance.balancef)
            .decimalPlaces(hasBalance.decimals)
            .toString()
        : '0';
    },
    amountUSD() {
      return this.getFiatValue(
        BigNumber(this.amount).times(this.tokenPrice).toFixed()
      );
    },
    aaveWithdrawForm() {
      const hasDeposit = this.selectedTokenInUserSummary;
      const depositedBalance = `${
        formatFloatingPointValue(hasDeposit?.underlyingBalance || 0).value
      } ${this.preSelectedToken.token}`;
      const depositedBalanceInUSD = this.getFiatValue(
        BigNumber(this.tokenPrice).times(hasDeposit?.underlyingBalance || 0)
      );
      const tokenBalance = `${
        formatFloatingPointValue(this.tokenBalance).value
      } ${this.preSelectedToken.token}`;
      const usd = this.getFiatValue(this.tokenBalanceUSD);
      return {
        showToggle: true,
        leftSideValues: {
          title: depositedBalance,
          caption: depositedBalanceInUSD,
          subTitle: 'Aave Withdraw Balance'
        },
        rightSideValues: {
          title: tokenBalance,
          caption: usd,
          subTitle: 'Aave Wallet Balance'
        },
        formText: {
          title: 'How much would you like to withdraw?',
          caption:
            'Here you can set the amount you want to withdraw. You can manually enter a specific amount or use the percentage buttons below.'
        },
        buttonTitle: {
          action: 'Withdraw',
          cancel: 'Cancel Withdraw'
        },
        depositedBalance: hasDeposit?.underlyingBalance || '0',
        decimals: hasDeposit?.reserve?.decimals || 18
      };
    }
  },
  watch: {
    preSelectedToken() {
      this.handleSelectedToken();
    }
  },
  methods: {
    handleSelectedToken() {
      this.step = 0;
    },
    handleWithdrawAmount(e) {
      this.amount = e;
      this.step = 1;
    },
    handleConfirm() {
      this.amount =
        this.amount === this.selectedTokenInUserSummary.underlyingBalance
          ? toBN(MAX_UINT_AMOUNT)
          : toBase(this.amount, this.selectedTokenDetails.decimals);
      const param = {
        user: this.address,
        reserve: this.selectedTokenDetails.underlyingAsset,
        amount: toHex(this.amount)
      };
      this.$emit('onConfirm', param);
      this.step = 0;
      this.close();
    },
    handleCancel() {
      this.close();
    }
  }
};
</script>

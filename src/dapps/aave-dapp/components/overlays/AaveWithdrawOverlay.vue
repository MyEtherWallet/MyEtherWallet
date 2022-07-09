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
  >
    <aave-amount-form
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
  </mew-overlay>
</template>

<script>
import BigNumber from 'bignumber.js';
import AaveAmountForm from '../AaveAmountForm';
import handlerAave from '../../handlers/handlerAave.mixin';
import { mapGetters } from 'vuex';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { toBase } from '@/core/helpers/unit';
import { toBN, toHex } from 'web3-utils';
import { MAX_UINT_AMOUNT } from '@aave/contract-helpers';

export default {
  components: {
    AaveAmountForm
  },
  mixins: [handlerAave],
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
  methods: {
    handleWithdrawAmount(e) {
      const amount =
        e === this.selectedTokenInUserSummary.underlyingBalance
          ? toBN(MAX_UINT_AMOUNT)
          : toBase(e, this.selectedTokenDetails.decimals);
      const param = {
        user: this.address,
        reserve: this.selectedTokenDetails.underlyingAsset,
        amount: toHex(amount),
        aTokenAddress: this.selectedTokenDetails.aToken.id
      };
      console.log('param', param);
      this.$emit('onConfirm', param);
      this.close();
    },
    handleCancel() {
      this.close();
    }
  }
};
</script>

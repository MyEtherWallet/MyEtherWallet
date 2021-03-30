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
    <template #mewOverlayBody>
      <div>
        <aave-amount-form
          :selected-token="preSelectedToken"
          :handler="handler"
          :show-toggle="aaveWithdrawForm.showToggle"
          :left-side-values="aaveWithdrawForm.leftSideValues"
          :right-side-values="aaveWithdrawForm.rightSideValues"
          :form-text="aaveWithdrawForm.formText"
          :button-title="aaveWithdrawForm.buttonTitle"
          :token-balance="tokenBalance"
          @cancel="handleCancel"
          @emitValues="handleWithdrawAmount"
        />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import BigNumber from 'bignumber.js';
import { ACTION_TYPES, convertToFixed } from '../handlers/helpers';
import AaveAmountForm from './AaveAmountForm';
import actualTokenMixin from '../handlers/actualTokenMixin';
import { mapGetters } from 'vuex';
export default {
  components: {
    AaveAmountForm
  },
  mixins: [actualTokenMixin],
  data() {
    return {
      withdraw: ACTION_TYPES.withdraw,
      amount: ''
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    ...mapGetters('global', ['network']),
    tokenBalance() {
      const symbol = this.preSelectedToken.token;
      if (symbol === this.network.type.currencyName) return this.balanceInETH;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });

      return hasBalance ? BigNumber(hasBalance.usdBalance).toFixed() : '0';
    },
    aaveWithdrawForm() {
      const hasDeposit = this.selectedTokenInUserSummary;
      const depositedBalance = `${convertToFixed(
        hasDeposit ? hasDeposit?.currentUnderlyingBalance : 0,
        6
      )} ${this.preSelectedToken.token}`;
      const depositedBalanceInUSD = `$ ${BigNumber(this.selectedTokenUSDValue)
        .times(hasDeposit?.currentUnderlyingBalance)
        .toFixed(2)}`;
      const tokenBalance = `${this.tokenBalance} ${this.preSelectedToken.token}`;
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
  methods: {
    handleWithdrawAmount(e) {
      const param = {
        aavePool: 'proto',
        amount: e,
        userAddress: this.address,
        aToken: this.actualToken.aToken.id,
        interestRateMode: this.type
      };

      this.$emit('onConfirm', param);
      this.close();
    },
    handleCancel() {
      this.close();
    }
  }
};
</script>

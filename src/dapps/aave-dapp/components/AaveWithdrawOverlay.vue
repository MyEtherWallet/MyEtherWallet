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
import { ACTION_TYPES } from '../handlers/helpers';
import AaveAmountForm from './AaveAmountForm';
import handlerAaveOverlay from '../handlers/handlerAaveOverlay.mixin';
import { mapGetters } from 'vuex';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';

export default {
  components: {
    AaveAmountForm
  },
  mixins: [handlerAaveOverlay],
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

      return hasBalance ? BigNumber(hasBalance.totalBalance).toFixed() : '0';
    },
    aaveWithdrawForm() {
      const hasDeposit = this.selectedTokenInUserSummary;
      const depositedBalance = `${
        formatFloatingPointValue(hasDeposit?.currentUnderlyingBalance || 0)
          .value
      } ${this.preSelectedToken.token}`;
      const depositedBalanceInUSD = `$ ${
        formatFiatValue(
          BigNumber(this.selectedTokenUSDValue).times(
            hasDeposit?.currentUnderlyingBalance
          )
        ).value
      }`;
      const tokenBalance = `${
        formatFloatingPointValue(this.tokenBalance).value
      } ${this.preSelectedToken.token}`;
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
        aToken: this.actualToken.aToken.id
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

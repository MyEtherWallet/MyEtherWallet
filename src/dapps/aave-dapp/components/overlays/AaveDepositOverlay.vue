<template>
  <mew-overlay
    :show-overlay="open"
    :close="callClose"
    :title="header"
    content-size="xlarge"
  >
    <!--
      =====================================================================================
        Step 1: Select a token to deposit (Aave token deposit table)
      =====================================================================================
      -->
    <aave-table
      v-if="step === 0"
      :is-loading-data="isLoadingData"
      :reserves-data="reservesData"
      :user-reserves-data="userSummary.userReservesData"
      :title="depositTitle"
      @selectedDeposit="handleSelectedDeposit"
    />
    <!--
        =====================================================================================
          Step 2: Select the amount to deposit
        =====================================================================================
        -->
    <aave-amount-form
      v-if="step === 1"
      :selected-token="selectedToken"
      :show-toggle="aaveDepositForm.showToggle"
      :left-side-values="aaveDepositForm.leftSideValues"
      :right-side-values="aaveDepositForm.rightSideValues"
      :form-text="aaveDepositForm.formText"
      :button-title="aaveDepositForm.buttonTitle"
      :token-balance="tokenBalance"
      :token-decimal="selectedTokenDecimal"
      @cancel="callClose"
      @emitValues="handleDepositAmount"
    />
    <!--
        =====================================================================================
          Step 3: Deposit Summary
        =====================================================================================
        -->
    <aave-summary
      v-if="step === 2"
      :selected-token="selectedToken"
      :amount="amount"
      :step="step"
      :action-type="depositTitle"
      :amount-usd="amountUSD"
      @onConfirm="handleConfirm"
    />
  </mew-overlay>
</template>

<script>
import AaveTable from '../AaveTable';
import AaveSummary from '../AaveSummary';
import AaveAmountForm from '../AaveAmountForm.vue';
import { AAVE_TABLE_TITLE } from '../../handlers/helpers';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { isEmpty } from 'lodash';
import handlerAave from '../../handlers/handlerAave.mixin';
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import { toBase } from '@/core/helpers/unit';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'AaveDepositOverlay',
  components: { AaveTable, AaveSummary, AaveAmountForm },
  mixins: [handlerAave, handlerAnalytics],
  data() {
    return {
      step: 0,
      selectedToken: {},
      amount: '0',
      depositTitle: AAVE_TABLE_TITLE.deposit
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    ...mapGetters('global', ['network', 'getFiatValue']),
    selectedTokenDecimal() {
      return this.selectedTokenDetails
        ? this.selectedTokenDetails.decimals
        : 18;
    },
    tokenBalanceUSD() {
      const symbol = this.selectedToken.token;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });
      return hasBalance ? BigNumber(hasBalance.usdBalance).toFixed() : '0';
    },
    tokenPrice() {
      const symbol = this.selectedToken.token;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });
      return hasBalance ? BigNumber(hasBalance.price).toFixed() : '0';
    },
    tokenBalance() {
      const symbol = this.selectedToken.token;
      if (symbol === this.network.type.currencyName) return this.balanceInETH;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });
      const decimals = BigNumber(10).pow(hasBalance.decimals);
      return hasBalance
        ? BigNumber(hasBalance.balance).dividedBy(decimals).toFixed()
        : '0';
    },
    amountUSD() {
      return this.getFiatValue(
        BigNumber(this.amount).times(this.tokenPrice).toFixed()
      );
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
        formatFloatingPointValue(hasDeposit?.underlyingBalance || 0).value
      } ${this.selectedToken.token}`;
      const depositedBalanceInUSD = this.getFiatValue(
        BigNumber(this.tokenPrice).times(hasDeposit?.underlyingBalance || 0)
      );

      const tokenBalance = `${
        formatFloatingPointValue(this.tokenBalance).value
      } ${this.selectedToken.token}`;
      const usd = this.getFiatValue(this.tokenBalanceUSD);
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
          cancel: 'Cancel deposit'
        }
      };
    }
  },
  watch: {
    preSelectedToken: {
      handler: function (newVal) {
        if (newVal && !isEmpty(newVal)) {
          this.handleSelectedDeposit(this.preSelectedToken);
        }
        if (isEmpty(newVal)) {
          this.selectedToken = {};
          this.step = 0;
        }
      },
      deep: true
    },
    step(val) {
      if (val === 0) this.selectedToken = {};
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
    callClose() {
      this.step = 0;
      this.selectedToken = {};
      this.amount = '0';
      this.depositTitle = AAVE_TABLE_TITLE.deposit;

      this.close(false);
    },
    handleConfirm() {
      this.trackDapp('aaveDepositEvent');
      const amount = toBase(this.amount, this.selectedTokenDetails.decimals);
      const param = {
        user: this.address,
        amount: amount,
        referralCode: '14',
        reserve: this.selectedTokenDetails.underlyingAsset
      };
      this.onDeposit(param).then(() => {
        this.trackDapp('aaveDepositedCollateral');
      });
      this.callClose();
    }
  }
};
</script>

<template>
  <div>
    <div class="balance-wrapper">
      <div class="balance-container mr-3">
        <p class="title">
          {{ actionTitle }}
        </p>
        <p class="token-balance">
          {{
            activeDepositTab
              ? convertToFixed(token.user.principalATokenBalance)
              : convertToFixed(token.user.currentBorrowsETH, 5)
          }}
          <span class="token-name"> {{ token.symbol }} </span>
        </p>
        <p class="usd-amt">
          ${{
            activeDepositTab
              ? convertToFixed(token.user.currentUnderlyingBalanceUSD)
              : convertToFixed(token.user.currentBorrowsUSD)
          }}
        </p>
      </div>
      <div class="balance-container">
        <p class="title">
          {{
            activeDepositTab
              ? $t('dappsAave.aave-wallet-bal')
              : $t('dappsAave.total-collateral')
          }}
        </p>
        <p class="token-balance">
          {{
            activeDepositTab
              ? convertToFixed(token.tokenBalance, 5)
              : convertToFixed(userSummary.totalCollateralETH, 5)
          }}
          <span class="token-name">{{ activeDepositTab ? token.symbol : $t('common.currency.eth') }}</span>
        </p>
        <p class="usd-amt">
          ${{
            activeDepositTab
              ? getUSDBalance(token)
              : convertToFixed(userSummary.totalCollateralUSD)
          }}
        </p>
      </div>
    </div>
    <div class="action-container mt-5">
      <i18n class="action-question" tag="p" path="dappsAave.how-much-action">
        <span slot="action" class="action-title">{{ actionTitle }}</span>
      </i18n>
      <i18n class="action-info" tag="p" path="dappsAave.action-info">
        <span slot="action" class="action-title">{{ actionTitle }}</span>
      </i18n>
      <input v-model="amount" type="number" placeholder="0" />
      <div class="percentage-container">
        <div
          :class="percentBtns.twentyFivePercentEnabled ? 'active' : ''"
          @click="setPercentAmount('twentyFivePercentEnabled', 0.25)"
        >
          25%
        </div>
        <div
          :class="percentBtns.fiftyPercentEnabled ? 'active' : ''"
          @click="setPercentAmount('fiftyPercentEnabled', 0.5)"
        >
          50%
        </div>
        <div
          :class="percentBtns.seventyFivePercentEnabled ? 'active' : ''"
          @click="setPercentAmount('seventyFivePercentEnabled', 0.75)"
        >
          75%
        </div>
        <div
          :class="percentBtns.maxEnabled ? 'active' : ''"
          @click="setPercentAmount('maxEnabled', 1)"
        >
          {{ $t('dappsAave.max') }}
        </div>
      </div>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <button
        :class="[
          'take-action-btn',
          errorMsg || !amount ? 'disabled' : 'enabled'
        ]"
        @click="takeAction()"
      >
        {{ actionTitle }}
      </button>
      <i18n
        path="dappsAave.cancel-action"
        tag="button"
        class="cancel-btn"
        @click="goToHome()"
      >
        <span slot="action">{{ actionTitle }}</span>
      </i18n>
    </div>
    <rate-modal
      ref="rateModal"
      :stable-rate="token.fixedBorrowRate"
      :variable-rate="token.variableBorrowRate"
      :amount="amount"
      :token="token"
      @emitTakeAction="emitTakeAction"
    />
    <confirmation-modal
      ref="confirmationModal"
      :user-summary="userSummary"
      :active-deposit-tab="activeDepositTab"
      :amount="amount"
      :token="token"
      @emitTakeAction="emitTakeAction"
    />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import { Toast } from '@/helpers';
import { mapState } from 'vuex';
import RateModal from '@/dapps/Aave/components/RateModal';
import ConfirmationModal from '@/dapps/Aave/components/ConfirmationModal';
import { mapActions } from 'vuex';

export default {
  components: {
    'rate-modal': RateModal,
    'confirmation-modal': ConfirmationModal
  },
  props: {
    userSummary: {
      type: Object,
      default: () => {
        return {};
      }
    },
    activeBorrowTab: {
      type: Boolean,
      default: false
    },
    activeDepositTab: {
      type: Boolean,
      default: true
    },
    reserves: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      errorMsg: '',
      amount: null,
      ethPrice: 0,
      disableBtn: false,
      token: { user: {}, price: {} },
      actionType: null,
      percentBtns: {
        twentyFivePercentEnabled: false,
        fiftyPercentEnabled: false,
        seventyFivePercentEnabled: false,
        maxEnabled: false
      }
    };
  },
  computed: {
    ...mapState('main', ['online']),
    actionTitle() {
      if (!this.actionType) {
        return this.activeDepositTab
          ? this.$tc('dappsAave.deposit', 1)
          : this.$t('dappsAave.borrow');
      }
      return this.actionType === 'Withdraw'
        ? this.$t('dappsAave.withdraw')
        : this.$t('dappsAave.repay');
    }
  },
  watch: {
    amount() {
      if (
        this.activeDepositTab &&
        new BigNumber(this.amount).gt(new BigNumber(this.token.tokenBalance))
      ) {
        this.errorMsg = 'Cannot exceed wallet balance';
      } else if (
        this.activeBorrowTab &&
        new BigNumber(this.amount).gt(
          new BigNumber(this.convertToEther(this.token.availableLiquidity))
        )
      ) {
        this.errorMsg = 'Cannot exceed available balance';
      } else {
        this.errorMsg = '';
      }
    }
  },
  mounted() {
    this.token = this.$route.params.token || {};
    this.actionType = this.$route.params.actionType || null;
    console.error('this', this.actionType)
    this.callSetToken(this.token);

    if (this.online) {
      this.getEthPrice();
    }
  },
  methods: {
    ...mapActions('aave', ['setToken']),
    callSetToken(token) {
      this.setToken(token);
    },
    findReserve(id, reserves) {
      return reserves.find(reserve => {
        return reserve.id ? reserve.id === id : reserve.reserve.id === id;
      });
    },
    convertToFixed(val, int) {
      if (!val || val == 0) {
        return 0;
      }

      if (!int) {
        int = 3;
      }

      val = val.toString();
      const idx = val.indexOf('.');
      if (idx >= 0) {
        return val.slice(0, idx + int);
      }
    },
    takeAction() {
      this.activeBorrowTab
        ? this.$refs.rateModal.$refs.rateModal.show()
        : this.$refs.confirmationModal.$refs.confirmationModal.show();
    },
    emitTakeAction(param) {
      this.goToHome();
      this.$emit('emitTakeAction', param);
    },
    setPercentAmount(selectedBtn, percentage) {
      this.amount = new BigNumber(this.token.tokenBalance)
        .times(percentage)
        .toFixed();
      Object.keys(this.percentBtns).forEach(btn => {
        if (selectedBtn === btn) {
          if (this.percentBtns[btn] === true) {
            this.percentBtns[btn] = false;
            this.amount = null;
          } else {
            this.percentBtns[btn] = true;
          }
        } else {
          this.percentBtns[btn] = false;
        }
      });
    },
    goToHome() {
      this.$router.push('/interface/dapps/aave');
    },
    convertToEther(wei) {
      if (!wei) {
        return '0';
      }
      return new BigNumber(unit.fromWei(wei, 'ether')).toFixed(2);
    },
    getUSDBalance(token) {
      let usdBalance = 0;

      if (token) {
        const ethBalance = new BigNumber(
          new BigNumber(token.tokenBalance).times(
            new BigNumber(token.price.priceInEth)
          )
        );

        usdBalance = new BigNumber(
          new BigNumber(ethBalance).times(new BigNumber(this.ethPrice))
        )
          .toFixed(2)
          .toString();
      }
      return usdBalance;
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.ethPrice =
        typeof price === 'object' ? price.data.ETH.quotes.USD.price : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ActionContainer.scss';
</style>

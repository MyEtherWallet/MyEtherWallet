<template>
  <div>
    <div class="balance-wrapper">
      <div class="balance-container mr-3">
        <p class="title">
          {{
            activeDepositTab
              ? $t('dappsAave.aave-depost-bal')
              : $t('dappsAave.you-borrowed')
          }}
        </p>
        <p class="token-balance">
          {{
            activeDepositTab
              ? convertToEther(token.currentUnderlyingBalance)
              : convertToEther(currentReserveBalance)
          }}
          <span class="token-name"> {{ token.name }} </span>
        </p>
        <p class="usd-amt">
          ${{
            activeDepositTab
              ? getUSDBalance(convertToEther(token.currentUnderlyingBalance))
              : getUSDBalance(convertToEther(currentReserveBalance))
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
              ? convertToEther(token.currentATokenBalance)
              : collateralBalance
          }}
          <span class="token-name">{{ token.name }}</span>
        </p>
        <p class="usd-amt">
          ${{
            activeDepositTab
              ? getUSDBalance(convertToEther(token.currentATokenBalance))
              : getUSDBalance(collateralBalance)
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
      :active-deposit-tab="activeDepositTab"
      :amount="amount"
      :health-factor="healthFactor"
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

export default {
  components: {
    'rate-modal': RateModal,
    'confirmation-modal': ConfirmationModal
  },
  props: {
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
    },
    collateralBalance: {
      type: String,
      default: ''
    },
    currentReserveBalance: {
      type: String,
      default: ''
    },
    healthFactor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      errorMsg: '',
      amount: null,
      ethPrice: 0,
      disableBtn: false,
      token: this.$route.params.token || {},
      actionType: this.$route.params.actionType || '',
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
    currentReserveBalance(newVal) {
      this.currentReserveBalance = newVal;
    },
    amount() {
      if (
        this.activeDepositTab &&
        new BigNumber(this.amount).gt(
          new BigNumber(this.convertToEther(this.token.currentATokenBalance))
        )
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
    if (this.online) {
      this.getEthPrice();
    }
  },
  methods: {
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
      this.amount = new BigNumber(
        this.convertToEther(this.token.currentATokenBalance)
      )
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
    getUSDBalance(int) {
      let usdBalance = 0;
      if (int) {
        usdBalance = new BigNumber(
          new BigNumber(int).times(new BigNumber(this.ethPrice)) //need to add in all the token prices (not just ether)
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

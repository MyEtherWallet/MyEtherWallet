<template>
  <div
    v-if="ownedReserves.length > 0 || showPendingToken()"
    class="summary-table-container"
  >
    <div class="token-block-container">
      <div
        v-for="(reserve, index) in ownedReserves"
        :key="reserve.key"
        :class="activeDepositTab ? 'deposit-table-tr' : 'borrow-table-tr'"
        class="token-block"
      >
        <div>
          <div class="d-flex align-items-center">
            <img
              v-if="reserve.reserve.symbol && !getIcon(reserve.reserve.symbol)"
              :src="iconFetcher(reserve.reserve.symbol)"
              width="30"
            />
            <div
              v-if="getIcon(reserve.reserve.symbol)"
              class="token-symbol"
              :class="[
                'cc',
                getIcon(reserve.reserve.symbol),
                'cc-icon',
                'currency-symbol',
                'token-icon'
              ]"
            />
            <h2 class="m-0 ml-2">{{ reserve.reserve.symbol }}</h2>
          </div>
        </div>

        <div v-if="activeDepositTab" class="mt-3">
          <div class="section-name">
            <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            {{ $t('dappsAave.deposited') }}
          </div>
          <div>
            <h3>
              {{ convertToFixed(reserve.principalATokenBalance, 3) }}
              {{ reserve.reserve.symbol }}
            </h3>
            <h5 class="eth-amt">
              {{ convertToFixed(reserve.currentUnderlyingBalanceETH, 6) }}
              {{ $t('common.currency.eth') }}
            </h5>
          </div>
        </div>

        <div v-if="!activeDepositTab" class="mt-3">
          <div class="section-name">
            <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            {{ $t('dappsAave.deposited') }}
          </div>
          <h3>${{ convertToFixed(reserve.currentBorrowsUSD) }}</h3>
          <h5 class="eth-amt">
            {{ convertToFixed(reserve.currentBorrowsETH, 6) }}
            {{ $t('common.currency.eth') }}
          </h5>
        </div>

        <div class="mt-3">
          <div class="section-name">
            <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            {{ $t('dappsAave.apr') }}
          </div>
          <div>
            <span v-if="activeDepositTab">
              {{ convertToFixed(reserve.reserve.liquidityRate * 100) }}%
            </span>
            <span v-if="!activeDepositTab">
              {{ convertToFixed(reserve.borrowRate * 100) }}%
            </span>
          </div>
        </div>

        <div v-if="activeDepositTab" class="slider-container mt-3">
          <div class="section-name">
            <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            {{ $t('dappsAave.use-collateral') }}
          </div>
          <div class="sliding-switch-white">
            <label class="switch">
              <input
                v-model="reserve.usageAsCollateralEnabledOnUser"
                type="checkbox"
                @click="useAsCollateral(index)"
              />
              <span class="slider round" />
            </label>
          </div>
        </div>

        <div v-if="!activeDepositTab" class="mt-3">
          <div class="section-name">
            <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            {{ $t('dappsAave.use-collateral') }}
          </div>
          <div class="slider-container">
            <div class="sliding-switch-white">
              <label
                class="switch"
                :title="
                  !isStableEnabled(reserve.reserve.id)
                    ? $t('dappsAave.stable-rate-no-avail')
                    : ''
                "
              >
                <input
                  :disabled="!isStableEnabled(reserve.reserve.id)"
                  :checked="reserve.borrowRateMode === 'Stable'"
                  type="checkbox"
                  @click="changeInterestType(index, reserve)"
                />
                <span class="slider borrow-slider round" />
              </label>
            </div>
            <span
              :class="
                reserve.borrowRateMode === 'Stable'
                  ? 'stable-txt'
                  : 'variable-txt'
              "
              >{{
                reserve.borrowRateMode === 'Stable'
                  ? $t('dappsAave.stable')
                  : $t('dappsAave.variable')
              }}</span
            >
          </div>
        </div>

        <div class="mt-3">
          <div class="section-name">
            <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            {{ $tc('dappsAave.deposit', 1) }} / {{ $t('dappsAave.withdraw') }}
          </div>
          <button
            type="button"
            class="btn btn-dark mr-1 btn-sm"
            @click="goToPage(index)"
          >
            {{
              activeDepositTab
                ? $tc('dappsAave.deposit', 1)
                : $t('dappsAave.borrow')
            }}
          </button>
          <button
            type="button"
            class="btn btn-dark mr-1 btn-sm"
            @click="goToPage(index, activeDepositTab ? 'Withdraw' : 'Repay')"
          >
            {{
              activeDepositTab
                ? $t('dappsAave.withdraw')
                : $t('dappsAave.repay')
            }}
          </button>
        </div>
      </div>
    </div>

    <confirmation-modal
      ref="confirmationModal"
      :active-deposit-tab="activeDepositTab"
      :token="token"
      :is-collateral-modal="true"
      :health-factor="healthFactor"
      @emitTakeAction="emitTakeAction"
    />
    <switch-interest-modal
      ref="switchInterest"
      :token="token"
      @emitTakeAction="emitTakeAction"
    />
  </div>
</template>

<script>
import ConfirmationModal from '@/dapps/Aave/components/ConfirmationModal';
import SwitchInterestModal from '@/dapps/Aave/components/SwitchInterestModal';
import { hasIcon } from '@/partners';
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'confirmation-modal': ConfirmationModal,
    'switch-interest-modal': SwitchInterestModal
  },
  props: {
    pendingToken: {
      type: Object,
      default: () => {
        return {};
      }
    },
    reserves: {
      type: Array,
      default: function() {
        return [];
      }
    },
    userReserves: {
      type: Array,
      default: function() {
        return [];
      }
    },
    activeDepositTab: {
      type: Boolean,
      default: true
    },
    healthFactor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      token: {},
      collateralModalShown: false,
      switchInterestShown: false
    };
  },
  computed: {
    ownedReserves() {
      const splitReserves = [];
      this.userReserves.forEach(reserve => {
        if (this.activeDepositTab && reserve.principalATokenBalance > 0) {
          splitReserves.push(reserve);
        } else if (!this.activeDepositTab && reserve.currentBorrowsETH > 0) {
          splitReserves.push(reserve);
        }
      });
      return splitReserves;
    }
  },
  methods: {
    iconFetcher(currency) {
      let icon;
      try {
        // eslint-disable-next-line
        icon = require(`@/assets/images/currency/coins/AllImages/${currency.toUpperCase()}.svg`);
      } catch (e) {
        // eslint-disable-next-line
        return require(`@/assets/images/icons/web-solution.svg`);
      }
      return icon;
    },
    showPendingToken() {
      if (this.pendingToken === {}) {
        return false;
      }
      if (this.activeDepositTab && this.pendingToken.type === 'deposit') {
        return true;
      } else if (
        !this.activeDepositTab &&
        this.pendingToken.type === 'borrow'
      ) {
        return true;
      }
    },
    emitTakeAction(param) {
      if (this.collateralModalShown) {
        this.$refs.confirmationModal.$refs.confirmationModal.hide();
        this.collateralModalShown = false;
      }
      if (this.switchInterestShown) {
        this.$refs.switchInterest.$refs.switchInterest.hide();
        this.switchInterestShown = false;
      }
      this.$emit('emitTakeAction', param);
    },
    isStableEnabled(id) {
      const reserve = this.getReserve(id);
      return reserve.stableBorrowRateEnabled;
    },
    convertToFixed(val, num) {
      if (!val || val == 0) {
        return 0;
      }
      if (!num) {
        num = 2;
      }
      return new BigNumber(val).toFixed(num).toString();
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    getReserve(id) {
      return this.reserves.find(reserve => {
        return reserve.id === id;
      });
    },
    useAsCollateral(idx) {
      this.token = this.getReserve(this.ownedReserves[idx].reserve.id);
      this.$refs.confirmationModal.$refs.confirmationModal.show();
      this.collateralModalShown = true;
    },
    changeInterestType(idx, reserve) {
      this.token = this.getReserve(this.userReserves[idx].reserve.id);
      reserve.borrowRateMode =
        reserve.borrowRateMode === 'Stable' ? 'Variable' : 'Stable';
      this.$refs.switchInterest.$refs.switchInterest.show();
      this.switchInterestShown = true;
    },
    goToPage(idx, actionType) {
      const params = {
        token: this.getReserve(this.ownedReserves[idx].reserve.id)
      };

      if (actionType) {
        params['actionType'] = actionType;
      }

      this.$router.push({ name: 'Action', params: params });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SummaryTableMobile.scss';
</style>

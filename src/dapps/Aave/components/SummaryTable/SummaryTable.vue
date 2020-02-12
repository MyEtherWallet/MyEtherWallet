<template>
  <div v-if="ownedReserves.length > 0" class="summary-table-container">
    <table>
      <colgroup>
        <col width="20%" />
        <col width="20%" />
        <col width="15%" />
        <col width="15%" />
        <col width="25%" />
        <col width="25%" />
      </colgroup>
      <thead>
        <th class="token-header">{{ $t('dappsAave.token') }}</th>
        <th>
          {{
            activeDepositTab
              ? $t('dappsAave.deposited')
              : $t('dappsAave.amount-borrowed')
          }}
        </th>
        <th>
          {{
            activeDepositTab
              ? $t('dappsAave.earned')
              : $t('dappsAave.acc-interest')
          }}
        </th>
        <th>{{ $t('dappsAave.apr') }}</th>
        <th>
          <div
            :class="[
              'th-container',
              activeDepositTab ? '' : 'apr-borrow-header'
            ]"
          >
            {{
              activeDepositTab
                ? $t('dappsAave.use-collateral')
                : $t('dappsAave.apr-type')
            }}
            <popover
              v-if="!activeDepositTab"
              :popcontent="'CHANGE THIS'"
              class="ml-2"
            />
          </div>
        </th>
        <th></th>
      </thead>
      <tbody>
        <tr
          v-for="(reserve, index) in ownedReserves"
          :key="reserve.key"
          :class="activeDepositTab ? 'deposit-table-tr' : 'borrow-table-tr'"
        >
          <td class="token-name token-header">
            <img
              v-if="!getIcon(reserve.reserve.symbol)"
              class="token-icon"
              :src="
                require(`@/assets/images/currency/coins/AllImages/${reserve.reserve.symbol.toUpperCase()}.svg`)
              "
            />
            <span
              v-if="getIcon(reserve.reserve.symbol)"
              :class="[
                'cc',
                getIcon(reserve.reserve.symbol),
                'cc-icon',
                'currency-symbol',
                'token-icon'
              ]"
            ></span
            >{{ reserve.reserve.symbol }}
          </td>
          <td v-if="activeDepositTab">
            <span
              >{{ convertToFixed(reserve.principalATokenBalance) }}
              {{ reserve.reserve.symbol }}</span
            >
            <span class="eth-amt"
              >{{ convertToFixed(reserve.currentUnderlyingBalanceETH) }}
              {{ $t('common.currency.eth') }}</span
            >
          </td>
          <td v-if="!activeDepositTab">
            <span>${{ convertToFixed(reserve.currentBorrowsUSD) }}</span>
            <span class="eth-amt"
              >{{ convertToFixed(reserve.currentBorrowsETH) }}
              {{ $t('common.currency.eth') }}</span
            >
          </td>
          <td>
            <!-- change this to earned column -->
            <span v-if="activeDepositTab"
              >{{ convertToFixed(reserve.reserve.liquidityRate * 100) }}%</span
            >
          </td>
          <td>
            <span v-if="activeDepositTab"
              >{{ convertToFixed(reserve.reserve.liquidityRate * 100) }}%</span
            >
            <span v-if="!activeDepositTab"
              >{{ convertToFixed(reserve.borrowRate * 100) }}%</span
            >
          </td>
          <td v-if="activeDepositTab">
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
          </td>
          <td v-if="!activeDepositTab">
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
          </td>
          <td class="button-container">
            <button @click="goToPage(index)">
              {{
                activeDepositTab
                  ? $tc('dappsAave.deposit', 1)
                  : $t('dappsAave.borrow')
              }}
            </button>
            <button
              @click="goToPage(index, activeDepositTab ? 'Withdraw' : 'Repay')"
            >
              {{
                activeDepositTab
                  ? $t('dappsAave.withdraw')
                  : $t('dappsAave.repay')
              }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
    emitTakeAction(param) {
      if (this.collateralModalShown) {
        this.$refs.confirmationModal.$refs.confirmationModal.hide();
        this.collateralModalShown = false;
      }
      if (this.switchInterestShown) {
        this.$refs.switchInterest.$refs.switchInterest.hide();
        this.switchInterestShown = false;
      }
      console.error('param', param);

      this.$emit('emitTakeAction', param);
    },
    isStableEnabled(id) {
      const reserve = this.getReserve(id);
      return reserve.stableBorrowRateEnabled;
    },
    convertToFixed(val) {
      if (!val) {
        return 0;
      }
      return new BigNumber(val).toFixed(2).toString();
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
@import 'SummaryTable.scss';
</style>

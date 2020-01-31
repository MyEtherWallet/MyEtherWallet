<template>
  <div class="summary-table-container">
    <table>
      <colgroup>
        <col width="25%" />
        <col width="20%" />
        <col width="20%" />
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
        <tr v-for="(reserve, index) in userReserves" :key="reserve.key">
          <!-- need to change icon -->
          <td class="token-name">
            <img
              class="token-icon mr-2"
              src="@/assets/images/currency/eth.svg"
            />{{ reserve.reserve.name }}
          </td>
          <td class="pt-3">
            <!-- placeholder -->
            <span>$232.32</span>
            <span class="eth-amt">1.4343 {{ $t('common.currency.eth') }}</span>
          </td>
          <td class="pt-3">
            <!-- placeholder -->
            <span>$32.32</span>
            <span class="eth-amt">0.02 {{ $t('common.currency.eth') }}</span>
          </td>
          <td>
            <!-- placeholder -->
            8.91 %
          </td>
          <td v-if="activeDepositTab">
            <div class="sliding-switch-white">
              <label class="switch">
                <input type="checkbox" @click="useAsCollateral(index)" />
                <span class="slider round" />
              </label>
            </div>
          </td>
          <td v-if="!activeDepositTab">
            <div class="slider-container">
              <div class="sliding-switch-white">
                <label class="switch">
                  <input
                    :checked="reserve.isStable"
                    type="checkbox"
                    @click="changeType(index)"
                  />
                  <span class="slider borrow-slider round" />
                </label>
              </div>
              <span :class="reserve.isStable ? 'stable-txt' : 'variable-txt'">{{
                reserve.isStable
                  ? $t('dappsAave.stable')
                  : $t('dappsAave.variable')
              }}</span>
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
      :health-factor="healthFactor"
      :token="token"
      :is-collateral-modal="true"
    />
    <switch-interest-modal ref="switchInterest" :token="token" />
  </div>
</template>

<script>
import ConfirmationModal from '@/dapps/Aave/components/ConfirmationModal';
import SwitchInterestModal from '@/dapps/Aave/components/SwitchInterestModal';

export default {
  components: {
    'confirmation-modal': ConfirmationModal,
    'switch-interest-modal': SwitchInterestModal
  },
  props: {
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
      token: {}
    };
  },
  mounted() {
    console.error('reerve', this.reserves)
  },
  methods: {
    useAsCollateral(idx) {
      this.reserves[idx].isCollateral = !this.reserves[idx].isCollateral;
      this.token = this.reserves[idx];
      this.$refs.confirmationModal.$refs.confirmationModal.show();
    },
    changeType(idx) {
      this.token = this.reserves[idx];
      this.$refs.switchInterest.$refs.switchInterest.show();
      // this.reserves[idx].isStable = !this.reserves[idx].isStable;
    },
    goToPage(idx, actionType) {
      const params = {
        token: this.reserves[idx]
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

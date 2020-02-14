<template>
  <div class="modal-container">
    <b-modal
      ref="rateModal"
      :title="$t('dappsAave.select-rate')"
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <p>{{ $t('dappsAave.select-rate-info') }}</p>
        <div class="button-container">
          <div
            v-if="!token.stableBorrowRateEnabled"
            :class="['mr-3', selectStable ? 'selected-btn' : '']"
            @click="toggleBtns('stable')"
          >
            <img src="@/assets/images/icons/stable.svg" alt="" />
            <p>{{ $t('dappsAave.stable') }}</p>
            <p class="stable">
              {{ convertToFixed(token.stableBorrowRate * 100) }}%
            </p>
          </div>
          <div
            :class="selectVariable ? 'selected-btn' : ''"
            @click="toggleBtns('variable')"
          >
            <img src="@/assets/images/icons/variable.svg" alt="" />
            <p>{{ $t('dappsAave.variable') }}</p>
            <p class="variable">
              {{ convertToFixed(token.variableBorrowRate * 100) }}%
            </p>
          </div>
        </div>
        <div class="continue-btn-container">
          <button
            :class="!selectStable && !selectVariable ? 'disabled' : ''"
            @click="takeAction()"
          >
            {{ $t('dappsAave.continue') }}
          </button>
        </div>
      </div>
    </b-modal>
    <confirmation-modal
      ref="confirmationModal"
      :active-deposit-tab="false"
      :amount="amount"
      :user-summary="userSummary"
      :token="token"
      :action-title="$t('dappsAave.borrow')"
      :apr="
        selectStable
          ? convertToFixed(token.stableBorrowRate * 100)
          : convertToFixed(token.variableBorrowRate * 100)
      "
      :rate-type="selectStable ? 'Stable' : 'Variable'"
      @emitTakeAction="emitTakeAction"
    />
  </div>
</template>

<script>
import ConfirmationModal from '@/dapps/Aave/components/ConfirmationModal';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'confirmation-modal': ConfirmationModal
  },
  props: {
    userSummary: {
      type: Object,
      default: () => {
        return {};
      }
    },
    token: {
      type: Object,
      default: () => {
        return {};
      }
    },
    amount: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectStable: false,
      selectVariable: false
    };
  },
  methods: {
    convertToFixed(val) {
      if (!val) {
        return '';
      }
      return new BigNumber(val).toFixed(2).toString();
    },
    toggleBtns(type) {
      if (type === 'stable') {
        this.selectStable = true;
        this.selectVariable = false;
      } else {
        this.selectStable = false;
        this.selectVariable = true;
      }
    },
    takeAction() {
      this.$refs['rateModal'].hide();
      this.$refs.confirmationModal.$refs.confirmationModal.show();
    },
    emitTakeAction(param) {
      this.$emit('emitTakeAction', param);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'RateModal.scss';
</style>

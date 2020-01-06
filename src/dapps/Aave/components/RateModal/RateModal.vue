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
            :class="['mr-3', selectStable ? 'selected-btn' : '']"
            @click="toggleBtns('stable')"
          >
            <img src="@/assets/images/icons/stable.svg" alt="" />
            <p>{{ $t('dappsAave.stable') }}</p>
            <p class="stable">{{ convertFromRay(stableRate) }}%</p>
          </div>
          <div
            :class="selectVariable ? 'selected-btn' : ''"
            @click="toggleBtns('variable')"
          >
            <img src="@/assets/images/icons/variable.svg" alt="" />
            <p>{{ $t('dappsAave.variable') }}</p>
            <p class="variable">{{ convertFromRay(variableRate) }}%</p>
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
      :token="token"
      :apr="
        selectStable ? convertFromRay(stableRate) : convertFromRay(variableRate)
      "
      :rate-type="selectStable ? 'Stable' : 'Variable'"
      @emitTakeAction="emitTakeAction"
    />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import ConfirmationModal from '@/dapps/Aave/components/ConfirmationModal';

export default {
  components: {
    'confirmation-modal': ConfirmationModal
  },
  props: {
    stableRate: {
      type: String,
      default: ''
    },
    variableRate: {
      type: String,
      default: ''
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
    convertFromRay(int) {
      const rayUnit = new BigNumber(10).pow(27);
      const convertedInt = new BigNumber(int).div(rayUnit);
      return new BigNumber(convertedInt).times(100).toFixed(2);
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

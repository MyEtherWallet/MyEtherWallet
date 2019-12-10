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
          <div class="mr-3">
            <img src="@/assets/images/icons/stable.svg" alt="" />
            <p>{{ $t('dappsAave.stable') }}</p>
            <p class="stable">{{ convertFromRay(stableRate) }}%</p>
          </div>
          <div>
            <img src="@/assets/images/icons/variable.svg" alt="" />
            <p>{{ $t('dappsAave.variable') }}</p>
            <p class="variable">{{ convertFromRay(variableRate) }}%</p>
          </div>
        </div>
        <div class="continue-btn-container">
          <button>{{ $t('dappsAave.continue') }}</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

export default {
  props: {
    stableRate: {
      type: String,
      default: ''
    },
    variableRate: {
      type: String,
      default: ''
    }
  },
  methods: {
    convertFromRay(int) {
      const rayUnit = new BigNumber(10).pow(27);
      const convertedInt = new BigNumber(int).div(rayUnit);
      return new BigNumber(convertedInt).times(100).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'RateModal.scss';
</style>

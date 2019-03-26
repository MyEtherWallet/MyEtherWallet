<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Generate"
    >
      <div class="inputs-container">
        <div class="input-container">
          <label>How much DAI would you like to generate?</label>
          <div :class="['input-box', newCollateralRatioSafe ? '' : 'danger']">
            <input v-model="amount" /> <span class="input-unit">DAI</span>
          </div>
        </div>
      </div>
      <span @click="maxDai">Entire Balance</span>
      <p>{{ displayPercentValue(newCollateralRatio) }}%</p>
      <div class="buttons-container">
        <button class="cancel-btn">
          Submit
        </button>
        <button class="submit-btn" @click="drawDai">
          Submit
        </button>
      </div>
      <help-center-button />
    </b-modal>
  </div>
</template>

<script>
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import BigNumber from 'bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'help-center-button': HelpCenterButton
  },
  props: {
    activeCdp: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      amount: 0
    };
  },
  computed: {
    newCollateralRatio() {
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp
          .calcCollatRatio(
            this.activeCdp.ethCollateral,
            this.activeCdp.debtValue.plus(this.amount)
          )
          .toNumber();
      } else if (this.activeCdp) {
        return this.activeCdp.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp
          .calcCollatRatio(
            this.activeCdp.ethCollateral,
            this.activeCdp.debtValue.plus(this.amount)
          )
          .gte(2);
      }
      return true;
    }
  },
  watch: {},
  methods: {
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals).toString();
    },
    maxDai() {
      this.amount = this.activeCdp.maxDai;
    },
    async drawDai() {
      if (toBigNumber(this.amount).gte(0)) {
        return await this.activeCdp.drawDai(this.amount);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'GenerateDai.scss';
</style>

<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Deposit"
    >
      <div class="inputs-container">
        <div class="input-container">
          <label>How much ETH would you like to deposit?</label>
          <div class="input-box">
            <input v-model="amount"/> <span class="input-unit">ETH</span>
          </div>
        </div>
      </div>
      <div class="buttons-container">
        <button class="cancel-btn">
          Submit
        </button>
        <button class="submit-btn"  @click="lockEth">
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
  computed: {},
  watch: {},
  methods: {
    async lockEth() {
      if (toBigNumber(this.amount).gte(0)) {
        console.log(this.amount); // todo remove dev item
        const locked = await this.activeCdp.lockEth(this.amount);
        console.log(locked); // todo remove dev item
        return locked;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DepositeCollateral.scss';
</style>

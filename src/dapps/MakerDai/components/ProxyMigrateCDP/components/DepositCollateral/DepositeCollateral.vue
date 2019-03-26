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
            <input v-model="amount" /> <span class="input-unit">ETH</span>
          </div>
        </div>
      </div>
      <div class="sub-text">
        <p>0.000 PETH</p>
      </div>
      <div class="detail-info">
        <div class="info">
          <h4>Detail Information</h4>
          <div class="sliding-switch-white">
            <label class="switch">
              <input
                type="checkbox"
                @click="modalDetailInformation = !modalDetailInformation"
              />
              <span class="slider round" />
            </label>
          </div>
        </div>
        <div
          :class="modalDetailInformation && 'expended-info-open'"
          class="expended-info"
        >
          <div class="padding-container">
            <div class="grid-block">
              <p>{{ $t('interface.network') }}</p>
              <!--<p>{{ network.type.name }} by {{ network.service }}</p>-->
            </div>
            <div class="grid-block">
              <p>{{ $t('common.gasLimit') }}</p>
              <!--<p>{{ gas }} wei</p>-->
            </div>
            <div class="grid-block">
              <p>{{ $t('common.gasPrice') }}</p>
              <!--<p>{{ gasPrice }} gwei</p>-->
            </div>
            <div class="grid-block">
              <p>{{ $t('common.txFee') }}</p>
              <!--<p>{{ fee }} {{ network.type.name }}</p>-->
            </div>
            <div class="grid-block">
              <p>Nonce</p>
              <!--<p>{{ nonce }}</p>-->
            </div>
            <div class="grid-block">
              <p>{{ $t('common.data') }}</p>
              <!--<p>{{ data }}</p>-->
            </div>
          </div>
        </div>
      </div>
      <div class="buttons-container">
        <button class="cancel-btn">
          Submit
        </button>
        <button class="submit-btn" @click="lockEth">
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
      amount: 0,
      modalDetailInformation: false
    };
  },
  computed: {},
  watch: {},
  methods: {
    async lockEth() {
      if (toBigNumber(this.amount).gte(0)) {
        return await this.activeCdp.lockEth(this.amount);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DepositeCollateral.scss';
</style>

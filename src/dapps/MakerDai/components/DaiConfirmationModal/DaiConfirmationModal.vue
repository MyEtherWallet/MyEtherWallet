<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      title="DAI Confirmation"
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      hide-footer
    >
      <div class="modal-content-container">
        <div class="tx-amount">
          <div>
            <div class="interface__block-title">Collateral</div>
            <div class="amount-block">
              <div class="icon">
                <img src="~@/assets/images/icons/btc.png" />
              </div>
              <div class="amount">0.005<span>ETH</span></div>
            </div>
          </div>
          <div class="arrow">
            <img src="~@/assets/images/icons/right-arrow.svg" />
          </div>
          <div>
            <div class="interface__block-title">Generate</div>
            <div class="amount-block">
              <div class="icon">
                <img src="~@/assets/images/icons/btc.png" />
              </div>
              <div class="amount">0.005<span>ETH</span></div>
            </div>
          </div>
        </div>
        <div class="detail-info">
          <expending-option title="Details">
            <ul>
              <li>
                <p>Min ETH required</p>
                <p>0.029 ETH</p>
              </li>
              <li>
                <p>Liquidation price (ETH/USD)</p>
                <p class="bold">60.000 USB</p>
              </li>
              <li>
                <p>Current price information (ETH/USD)</p>
                <p>100.82 USD</p>
              </li>
              <li>
                <p>Liquidation penalty</p>
                <p>13.000%</p>
              </li>
              <li>
                <p>Collateralization ratio</p>
                <p class="bold">252.062$</p>
              </li>
              <li>
                <p>Minimum ratio</p>
                <p>150.000%</p>
              </li>
            </ul>
          </expending-option>
        </div>
        <div>
          <standard-button @click="opencdp" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ExpendingOption from '@/components/ExpendingOption';
import StandardButton from '@/components/Buttons/StandardButton';

export default {
  components: {
    'expending-option': ExpendingOption,
    'standard-button': StandardButton
  },
  props: {
    opencdp: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'DaiConfirmationModal';
</style>

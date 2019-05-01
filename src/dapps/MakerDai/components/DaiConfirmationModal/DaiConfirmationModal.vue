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
                <img src="~@/assets/images/currency/eth.svg" />
              </div>
              <div class="amount">{{ collateral }}<span>ETH</span></div>
            </div>
          </div>
          <div class="arrow">
            <img src="~@/assets/images/icons/right-arrow.svg" />
          </div>
          <div>
            <div class="interface__block-title">Generate</div>
            <div class="amount-block">
              <div class="icon">
                <img src="~@/assets/images/currency/coins/AllImages/DAI.svg" />
              </div>
              <div class="amount">{{ generate }}<span>DAI</span></div>
            </div>
          </div>
        </div>
        <div class="detail-info">
          <expending-option title="Details">
            <ul>
              <!--              <li>-->
              <!--                <p>Min ETH required</p>-->
              <!--                <p>TODO ETH</p>-->
              <!--              </li>-->
              <li>
                <p>Liquidation price (ETH/USD)</p>
                <p class="bold">{{ liquidationPrice }} USD</p>
              </li>
              <li>
                <p>Current price information (ETH/USD)</p>
                <p>{{ currentPrice }} USD</p>
              </li>
              <li>
                <p>Liquidation penalty</p>
                <p>{{ liquidationPenalty }}%</p>
              </li>
              <li>
                <p>Collateralization ratio</p>
                <p class="bold">{{ collatRatio }}</p>
              </li>
              <li>
                <p>Minimum ratio</p>
                <p>{{ minRatio }}%</p>
              </li>
            </ul>
          </expending-option>
        </div>
        <div class="button-container">
          <standard-button
            :options="confirmButton"
            @click.native="confirmClicked"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
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
    },
    liquidationPrice: {
      type: Number,
      default: 0
    },
    collatRatio: {
      type: String,
      default: 'Error'
    },
    liquidationPenalty: {
      type: String,
      default: 'Error'
    },
    minRatio: {
      type: String,
      default: 'Error'
    },
    currentPrice: {
      type: BigNumber,
      default: function() {
        return new BigNumber(0);
      }
    },
    collateral: {
      type: String,
      default: 'Error'
    },
    generate: {
      type: String,
      default: 'Error'
    }
  },
  data() {
    return {
      confirmButton: {
        title: 'Confirm and Create CDP',
        buttonStyle: 'green',
        helpCenter: true
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    confirmClicked() {
      this.opencdp();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DaiConfirmationModal';
</style>

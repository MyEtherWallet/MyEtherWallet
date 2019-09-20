<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMaker.DAIConfirmation')"
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      hide-footer
      static
      lazy
    >
      <div class="modal-content-container">
        <div class="tx-amount">
          <div>
            <div class="interface__block-title">
              {{ $t('dappsMaker.collateral') }}
            </div>

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
            <div class="interface__block-title">
              {{ $t('dappsMaker.generate') }}
            </div>
            <div class="amount-block">
              <div class="icon">
                <img src="~@/assets/images/currency/coins/AllImages/DAI.svg" />
              </div>
              <div class="amount">{{ generate }}<span>DAI</span></div>
            </div>
          </div>
        </div>
        <div class="detail-info">
          <expending-option :title="$t('dappsMaker.details')">
            <ul>
              <li>
                <p>{{ $t('dappsMaker.liquidPrice') }} (ETH/USD)</p>
                <p class="bold">{{ liquidationPrice }} USD</p>
              </li>
              <li>
                <p>{{ $t('dappsMaker.currentPrice') }} (ETH/USD)</p>
                <p>{{ currentPrice }} USD</p>
              </li>
              <li>
                <p>{{ $t('dappsMaker.liquidationPenalty') }}</p>
                <p>{{ liquidationPenalty }}%</p>
              </li>
              <li>
                <p>{{ $t('dappsMaker.collateralRatio') }}</p>
                <p class="bold">{{ collatRatio }} %</p>
              </li>
              <li>
                <p>{{ $t('dappsMaker.minimumRatio') }}</p>
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
      type: String,
      default: 'Error'
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
        title: this.$t('dappsMaker.confirmAndCreate'),
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

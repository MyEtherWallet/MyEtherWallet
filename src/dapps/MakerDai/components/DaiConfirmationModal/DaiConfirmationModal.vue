<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMCDMaker.dai-confirmation')"
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
              {{ $t('dappsMCDMaker.collateral') }}
            </div>

            <div class="amount-block">
              <div class="icon">
                <i
                  v-if="getIcon(currency) !== ''"
                  :class="['icon', 'cc', getIcon(currency), 'cc-icon']"
                />
              </div>

              <div class="amount">
                {{ collateral }}<span>{{ currency }}</span>
              </div>
            </div>
          </div>
          <div class="arrow">
            <img src="~@/assets/images/icons/right-arrow.svg" />
          </div>
          <div>
            <div class="interface__block-title">
              {{ $t('dappsMCDMaker.generate') }}
            </div>
            <div class="amount-block">
              <div class="icon">
                <img src="~@/assets/images/currency/coins/AllImages/DAI.svg" />
              </div>
              <div class="amount">
                {{ generate }}<span>{{ $t('dappsMCDMaker.dai') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-info">
          <expanding-option :title="$t('dappsMCDMaker.details')">
            <ul>
              <li>
                <p>
                  {{ $t('dappsMCDMaker.liquid-price') }} ({{ currency }}/USD)
                </p>
                <p class="bold">{{ liquidationPrice }} USD</p>
              </li>
              <li>
                <p>
                  {{ $t('dappsMCDMaker.current-price') }} ({{ currency }}/USD)
                </p>
                <p>{{ currentPrice }} USD</p>
              </li>
              <li>
                <p>{{ $t('dappsMCDMaker.liquidation-penalty') }}</p>
                <p>{{ liquidationPenalty }}%</p>
              </li>
              <li>
                <p>{{ $t('dappsMCDMaker.collateral-ratio') }}</p>
                <p class="bold">{{ collatRatio }} %</p>
              </li>
              <li>
                <p>{{ $t('dappsMCDMaker.minimum-ratio') }}</p>
                <p>{{ minRatio }}%</p>
              </li>
            </ul>
          </expanding-option>
        </div>
        <div class="button-container">
          <standard-button
            :options="{
              title: $t('dappsMCDMaker.confirm-and-create-vault'),
              buttonStyle: 'green',
              helpCenter: true
            }"
            :click-function="confirmClicked"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ExpandingOption from '@/components/ExpandingOption';
import StandardButton from '@/components/Buttons/StandardButton';
import { hasIcon } from '@/partners';

export default {
  components: {
    'expanding-option': ExpandingOption,
    'standard-button': StandardButton
  },
  props: {
    opencdp: {
      type: Function,
      default: function () {}
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
    },
    currency: {
      type: String,
      default: 'Error'
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    iconFetcher(currency) {
      let icon;
      try {
        // eslint-disable-next-line
        icon = require(`@/assets/images/currency/coins/AllImages/${currency}.svg`);
      } catch (e) {
        // eslint-disable-next-line
        return require(`@/assets/images/icons/web-solution.svg`);
      }
      return icon;
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    confirmClicked() {
      this.opencdp();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DaiConfirmationModal';
</style>

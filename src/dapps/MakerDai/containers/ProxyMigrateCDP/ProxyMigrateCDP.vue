<template>
  <div>
    <div class="manage-container">
      <!-- ==================================================== -->
      <div class="title-content-container">
        <p class="cpd-title">{{ $t('dappsMaker.cdpPortal') }}</p>
        <p class="cdp-id">
          {{ $t('dappsMaker.positionLabel', { value: cdpIdDisplay }) }}
        </p>
      </div>
      <!-- ==================================================== -->
      <!-- 1st row-->
      <!-- ==================================================== -->
      <div class="information-blocks">
        <div class="block-item">
          <div class="block-title">
            <p>{{ $t('dappsMaker.liquidPrice') }} (ETH/USD)</p>
            <div class="blue">
              <span class="blue-bold">{{ liquidationPriceDisplay }}</span>
              USD
            </div>
          </div>
          <div class="block-content">
            <div class="item">
              <p>{{ $t('dappsMaker.currentPrice') }}(ETH/USD)</p>
              <div>{{ ethPriceDisplay }} <span>USD</span></div>
            </div>
            <div class="item">
              <p>{{ $t('dappsMaker.liquidationPenalty') }}</p>
              <div>{{ liquidationPenaltyDisplay }}%</div>
            </div>
          </div>
        </div>
        <div class="block-item">
          <div class="block-title">
            <p>{{ $t('dappsMaker.collateralRatio') }}</p>
            <div :class="collateralRatioColoring">
              <span>{{ collaterlizationRatioDisplay }}%</span>
            </div>
          </div>
          <div class="block-content">
            <div class="item">
              <p>{{ $t('dappsMaker.minimumRatio') }}</p>
              <div>{{ liquidationRatioDisplay }}%</div>
            </div>
            <div class="item">
              <p>{{ $t('dappsMaker.stabilityFee') }}</p>
              <div>{{ stabilityFeeDisplay }}%</div>
            </div>
          </div>
        </div>
      </div>
      <!-- ==================================================== -->
      <!--2nd row-->
      <!-- ==================================================== -->
      <div class="information-single-block">
        <div class="block-item">
          <div class="block-title">
            <p>{{ $t('dappsMaker.ethCollateral') }}</p>
          </div>

          <div class="block-content-container">
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMaker.deposited') }}</p>
                <div>
                  {{ ethCollateral }}
                  <span>ETH</span>
                </div>
                <div>
                  {{ pethCollateral }}
                  <span>PETH</span> /
                  {{ usdCollateral }}
                  <span>USD</span>
                </div>
              </div>
            </div>
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMaker.maxWithDraw') }}</p>
                <div>
                  {{ maxEthDrawDisplay }}
                  <span>ETH</span>
                </div>
                <div>
                  {{ maxPethDrawDisplay }}
                  <span>PETH</span> /
                  {{ maxUsdDrawDisplay }}
                  <span>USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ==================================================== -->

      <!-- 3rd row-->
      <!-- ==================================================== -->
      <div class="information-single-block">
        <div class="block-item">
          <div class="block-title">
            <p>{{ $t('dappsMaker.daiPosition') }}</p>
          </div>

          <div class="block-content-container">
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMaker.generated') }}</p>
                <div>{{ debtValue }} <span>DAI</span></div>
                <div>
                  {{ debtValueDisplay }}
                  <span>USD</span>
                </div>
              </div>
            </div>
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMaker.maxAvailable') }}</p>
                <div>
                  {{ maxDai }}
                  <span>DAI</span>
                </div>
                <div>
                  {{ maxUsd }}
                  <span>USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ==================================================== -->
    </div>
    <help-link />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import BottomHelpLink from '@/components/BottomHelpLink';
import Blockie from '@/components/Blockie';
import CloseCdpModal from '../../components/CloseCdpModal';
import MoveCdpModal from '../../components/MoveCdpModal';
import {
  displayFixedPercent,
  displayFixedValue,
  displayPercentValue
} from '../../helpers';

import BigNumber from 'bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'close-cdp-modal': CloseCdpModal,
    'move-cdp-modal': MoveCdpModal,
    blockie: Blockie,
    'help-link': BottomHelpLink
  },
  props: {
    openCloseModal: {
      type: Boolean,
      default: false
    },
    openMoveModal: {
      type: Boolean,
      default: false
    },
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    getBalance: {
      type: Function,
      default: function() {}
    },
    makerActive: {
      type: Boolean,
      default: false
    },
    cdps: {
      type: Array,
      default: function() {
        return [];
      }
    },
    availableCdps: {
      type: Object,
      default: function() {
        return {};
      }
    },
    getCdp: {
      type: Function,
      default: function() {}
    },
    hasCdp: {
      type: Function,
      default: function() {}
    },
    values: {
      type: Object,
      default: function() {
        return {
          maxPethDraw: '',
          maxEthDraw: '',
          maxUsdDraw: '',
          ethCollateral: '',
          pethCollateral: '',
          usdCollateral: '',
          debtValue: '',
          maxDai: '',
          collateralRatio: '',
          cdpId: '',
          stabilityFee: '',
          minEth: '',
          liquidationRatio: '',
          wethToPethRatio: '',
          liquidationPenalty: '',
          targetPrice: '',
          pethPrice: ''
        };
      }
    },
    ethPrice: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    pethPrice: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    liquidationPenalty: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    stabilityFee: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    liquidationRatio: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    wethToPethRatio: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    pethMin: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    priceService: {
      type: Object,
      default: function() {
        return {};
      }
    },
    cdpService: {
      type: Object,
      default: function() {
        return {};
      }
    },
    proxyService: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      loaded: false,
      ethQty: 0,
      daiQty: 0,
      selectedCdp: '',
      cdpId: '',
      cdp: {},
      maxDaiDraw: toBigNumber(0),
      maxWithDraw: toBigNumber(0),
      maxWithDrawUSD: toBigNumber(0),
      maxPethDraw: toBigNumber(0),
      maxEthDraw: toBigNumber(0)
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    collateralRatioColoring() {
      if (this.values) {
        if (this.values.collateralRatio >= 2) {
          return 'green';
        } else if (
          this.values.collateralRatio >= 1.75 &&
          this.values.collateralRatio < 2
        ) {
          return 'orange';
        }
        return 'red';
      }
      return '';
    },
    liquidationPriceDisplay() {
      if (this.values) {
        const value = displayFixedValue(this.values.liquidationPrice, 2);
        if (new BigNumber(value).gt(0)) {
          return value;
        }
        return '--';
      }
      return '--';
    },
    collaterlizationRatioDisplay() {
      if (this.values) {
        return displayFixedPercent(this.values.collateralRatio);
      }
      return '--';
    },
    cdpIdDisplay() {
      if (this.values) {
        return this.values.cdpId;
      }
      return '--';
    },
    liquidationRatioDisplay() {
      if (this.values) {
        return displayFixedValue(displayPercentValue(this.liquidationRatio));
      }
      return '--';
    },
    liquidationPenaltyDisplay() {
      if (this.values) {
        return displayFixedValue(displayPercentValue(this.liquidationPenalty));
      }
      return '--';
    },
    stabilityFeeDisplay() {
      if (this.values) {
        return displayFixedValue(displayPercentValue(this.stabilityFee));
      }
      return '--';
    },
    ethPriceDisplay() {
      if (this.values) {
        return displayFixedValue(this.ethPrice, 2);
      }
      return '--';
    },
    maxPethDrawDisplay() {
      if (this.values) {
        return displayFixedValue(this.values.maxPethDraw, 5);
      }
      return '--';
    },
    zeroDebt() {
      return toBigNumber(this.values.debtValue).eq(0);
    },
    maxEthDrawDisplay() {
      if (this.values) {
        return this.values.maxEthDraw;
      }
      return '--';
    },
    maxUsdDrawDisplay() {
      if (this.values) {
        return displayFixedValue(this.values.maxUsdDraw, 2);
      }
      return '--';
    },
    ethCollateral() {
      if (this.values) {
        return displayFixedValue(this.values.ethCollateral, 5, true);
      }
      return '--';
    },
    pethCollateral() {
      if (this.values) {
        return displayFixedValue(this.values.pethCollateral, 5, true);
      }
      return '--';
    },
    usdCollateral() {
      if (this.values) {
        return displayFixedValue(this.values.usdCollateral, 2);
      }
      return '--';
    },
    debtValueDisplay() {
      if (this.values) {
        return displayFixedValue(this.values.debtValue, 2);
      }
      return '--';
    },
    debtValue() {
      if (this.values) {
        return this.values.debtValue;
      }
      return '--';
    },
    maxDai() {
      if (this.values) {
        return this.values.maxDai;
      }
      return '--';
    },
    maxUsd() {
      if (this.values) {
        return displayFixedValue(this.values.maxDai, 2);
      }
      return '--';
    }
  },
  watch: {
    // ['activeCdp.ready']() {
    //   this.isReady();
    // },
  },
  async mounted() {
    this.cdpId = this.$route.params.cdpId;
    if (this.makerActive) {
      this.loaded = true;
      if (this.cdpId) {
        this.$emit('activeCdpId', this.cdpId);
      }
    }
  },
  methods: {
    showClose() {},
    showMove() {},
    displayPercentValue,
    displayFixedValue,
    async isReady() {},
    async migrateCdp() {
      this.$emit('migrateCdp', this.cdpId);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ProxyMigrateCDP';
</style>

<template>
  <div class="manage-cdp">
    <div v-show="!finishMigration" class="manage-container">
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
            <div class="for-pop">
              <p>
                {{ $t('dappsMaker.liquidPrice') }} ({{ collateralType }}/USD)
              </p>
              <p v-if="liquidationPriceDisplay === '--'" class="pop-icon">
                <popover :popcontent="$t('dappsMaker.whatIsDashes')" />
              </p>
            </div>

            <div class="blue">
              <span class="blue-bold">{{ liquidationPriceDisplay }}</span>
              USD
            </div>
          </div>
          <div class="block-content">
            <div class="item">
              <p>
                {{ $t('dappsMaker.currentPrice') }}({{ collateralType }}/USD)
              </p>
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
            <div class="for-pop">
              <p>{{ $t('dappsMaker.collateralRatio') }}</p>
              <p v-if="liquidationPriceDisplay === '--'" class="pop-icon">
                <popover :popcontent="$t('dappsMaker.whatIsDashes')" />
              </p>
            </div>

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
                  <span>{{ collateralType }}</span>
                </div>
                <div>
                  {{ usdCollateral }}
                  <span>USD</span>
                </div>
                <button @click="showDeposit">
                  {{ $t('dappsMaker.deposit') }} >
                </button>
              </div>
            </div>
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMaker.maxWithDraw') }}</p>
                <div>
                  {{ maxEthDrawDisplay }}
                  <span>{{ collateralType }}</span>
                </div>
                <div>
                  {{ maxUsdDrawDisplay }}
                  <span>USD</span>
                </div>
                <button @click="showWithdraw">
                  {{ $t('dappsMaker.withdraw') }} >
                </button>
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
                <button @click="showPayback">
                  {{ $t('dappsMaker.payBack') }} >
                </button>
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
                <button @click="showGenerate">
                  {{ $t('dappsMaker.generate') }} >
                </button>
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
import BigNumber from 'bignumber.js';

import {
  displayFixedPercent,
  displayFixedValue,
  displayPercentValue,
  toBigNumber
} from '../../makerHelpers';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
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
    valuesUpdated: {
      type: Number,
      default: 0
    },
    getCdp: {
      type: Function,
      default: function() {}
    },
    hasCdp: {
      type: Function,
      default: function() {}
    },
    getValueOrFunction: {
      type: Function,
      default: function() {}
    },
    values: {
      type: Object,
      default: function() {
        return {
          maxEthDraw: '',
          maxUsdDraw: '',
          ethCollateral: '',
          usdCollateral: '',
          debtValue: '',
          maxDai: '',
          collateralRatio: '',
          cdpId: '',
          stabilityFee: '',
          minEth: '',
          liquidationRatio: '',
          liquidationPenalty: '',
          targetPrice: ''
        };
      }
    },
    ethPrice: {
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
      currentCdpLoaded: false,
      activeCdp: {},
      loaded: false,
      ethQty: 0,
      daiQty: 0,
      selectedCdp: '',
      cdpId: '',
      cdp: {},
      maxDaiDraw: toBigNumber(0),
      maxWithDraw: toBigNumber(0),
      maxWithDrawUSD: toBigNumber(0),
      maxEthDraw: toBigNumber(0)
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    noProxy() {
      if (this.activeCdp) {
        return this.activeCdp.noProxy;
      }
    },
    finishMigration() {
      if (this.activeCdp) {
        return this.activeCdp.needToFinishMigrating;
      }
    },
    collateralRatioColoring() {
      if (this.currentCdpLoaded) {
        return this.currentCdp.collateralStatus;
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
        return displayFixedPercent(this.getCollateralizationRatio());
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
      if (this.currentCdpLoaded) {
        return displayFixedValue(displayPercentValue(this.currentCdp.liquidationRatio));
      }
      return '--';
    },
    liquidationPenaltyDisplay() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(displayPercentValue(this.currentCdp.liquidationPenalty));
      }
      return '--';
    },
    stabilityFeeDisplay() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(displayPercentValue(this.currentCdp.stabilityFee));
      }
      return '--';
    },
    ethPriceDisplay() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(this.currentCdp.currentPrice, 2);
      }
      return '--';
    },
    zeroDebt() {
      return toBigNumber(this.values.debtValue).eq(0);
    },
    maxEthDrawDisplay() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(this.currentCdp.maxEthDraw, 5);
      }
      // if (this.values) {
      //   return this.values.maxEthDraw;
      // }
      return '--';
    },
    maxUsdDrawDisplay() {
      if (this.values) {
        return displayFixedValue(this.values.maxUsdDraw, 2);
      }
      return '--';
    },
    ethCollateral() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(this.getCollateralAmount(), 5);
      }
      return '--';
    },
    collateralType() {
      if (this.currentCdpLoaded) {
        return this.currentCdp.cdpCollateralType;
      }
      return 'ETH';
    },
    usdCollateral() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(this.currentCdp.collateralValue, 2);
      }
      return '--';
    },
    debtValueDisplay() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(this.currentCdp.debtValue, 2);
      }
      return '--';
    },
    debtValue() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(this.currentCdp.debtValue, 2);
      }
      return '--';
    },
    maxDai() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(this.currentCdp.maxDai, 5);
      }
      return '--';
    },
    maxUsd() {
      if (this.currentCdpLoaded) {
        return displayFixedValue(this.currentCdp.maxDai, 2);
      }
      return '--';
    }
  },
  watch: {
    ['activeCdp.ready']() {
      this.isReady();
    },
    openCloseModal(val) {
      if (val) {
        this.showClose();
      }
    },
    openMoveModal(val) {
      if (val) {
        this.showMove();
      }
    },
    makerActive(newVal) {
      if (newVal) {
        this.getActiveCdp();
      }
    }
  },
  async mounted() {
    this.activeCdp = {};
    this.cdpId = this.$route.params.cdpId;
    if (this.makerActive) {
      this.loaded = true;
      if (this.cdpId) {
        this.$emit('activeCdpId', this.cdpId);
      }
    }
    if (this.cdpId && this.cdpId !== undefined) {
      this.getActiveCdp();
    }
  },
  methods: {
    getActiveCdp() {
      const cdpId = typeof this.cdpId === 'number' ? this.cdpId : this.cdpId.id;
      const val = this.getValueOrFunction('activeCdpId');
      this.currentCdp = this.getValueOrFunction('getCdp')(cdpId);
      if (this.currentCdp) {
        this.currentCdpLoaded = true;
        this.$forceUpdate();
      }
      this.getTotalDebt();
    },
    async getTotalDebt() {
      if (this.currentCdp) this.currentCdpLoaded = true;
      if (!this.currentCdp) return toBigNumber(0);
      return await this.currentCdp.getCombinedDebtValue();
    },
    getCollateralAmount() {
      if (this.currentCdp) this.currentCdpLoaded = true;
      if (!this.currentCdp) return 0;
      return this.currentCdp.collateralAmount;
    },
    getCollateralValue() {
      if (this.currentCdp) this.currentCdpLoaded = true;
      if (!this.currentCdp) return toBigNumber(0);
      return this.currentCdp.getCollateralValue;
    },
    getCollateralizationRatio() {
      if (this.currentCdp) this.currentCdpLoaded = true;
      if (!this.currentCdp) return toBigNumber(0);
      return this.currentCdp.collateralizationRatio;
    },
    showDeposit() {
      this.$emit('showDeposit');
    },
    showWithdraw() {
      this.$emit('showWithdraw');
    },
    showPayback() {
      this.$emit('showPayback');
    },
    showGenerate() {
      this.$emit('showGenerate');
    },
    displayPercentValue,
    displayFixedValue,
    async isReady() {}
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageCDP';
</style>

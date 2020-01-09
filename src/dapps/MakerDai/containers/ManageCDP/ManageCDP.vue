<template>
  <div class="manage-cdp">
    <div v-show="!finishMigration" class="manage-container">
      <!-- ==================================================== -->
      <div class="title-content-container">
        <p class="cpd-title">{{ $t('dappsMCDMaker.vault-portal') }}</p>
        <p class="cdp-id">
          {{
            $t('dappsMCDMaker.vault-position-label', {
              value: cdpIdDisplay,
              symbol: vaultType
            })
          }}
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
                {{ $t('dappsMCDMaker.liquid-price') }} ({{ collateralType }}/{{
                  $t('common.currency.usd')
                }})
              </p>
              <p v-if="liquidationPriceDisplay === '--'" class="pop-icon">
                <popover
                  :popcontent="$t('dappsMCDMaker.what-is-dashes-vault')"
                />
              </p>
            </div>

            <div class="blue">
              <span class="blue-bold">{{ liquidationPriceDisplay }}</span>
              {{ $t('common.currency.usd') }}
            </div>
          </div>
          <div class="block-content">
            <div class="item">
              <p>
                {{ $t('dappsMCDMaker.current-price') }}({{ collateralType }}/{{
                  $t('common.currency.usd')
                }})
              </p>
              <div>
                {{ ethPriceDisplay }}
                <span>{{ $t('common.currency.usd') }}</span>
              </div>
            </div>
            <div class="item">
              <p>{{ $t('dappsMCDMaker.liquidation-penalty') }}</p>
              <div>{{ liquidationPenaltyDisplay }}%</div>
            </div>
          </div>
        </div>
        <div class="block-item">
          <div class="block-title">
            <div class="for-pop">
              <p>{{ $t('dappsMCDMaker.collateral-ratio') }}</p>
              <p v-if="liquidationPriceDisplay === '--'" class="pop-icon">
                <popover
                  :popcontent="$t('dappsMCDMaker.what-is-dashes-vault')"
                />
              </p>
            </div>

            <div :class="collateralRatioColoring">
              <span>{{ collaterlizationRatioDisplay }}%</span>
            </div>
          </div>
          <div class="block-content">
            <div class="item">
              <p>{{ $t('dappsMCDMaker.minimum-ratio') }}</p>
              <div>{{ liquidationRatioDisplay }}%</div>
            </div>
            <div class="item">
              <p>{{ $t('dappsMCDMaker.stability-fee') }}</p>
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
            <p>
              {{
                $t('dappsMCDMaker.collateral-label', { symbol: collateralType })
              }}
            </p>
          </div>

          <div class="block-content-container">
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMCDMaker.deposited') }}</p>
                <div>
                  {{ ethCollateral }}
                  <span>{{ collateralType }}</span>
                </div>
                <div>
                  {{ usdCollateral }}
                  <span>{{ $t('common.currency.usd') }}</span>
                </div>
                <button @click="showDeposit">
                  {{ $t('dappsMCDMaker.deposit') }} >
                </button>
              </div>
            </div>
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMCDMaker.max-available') }}</p>
                <div>
                  {{ maxEthDrawDisplay }}
                  <span>{{ collateralType }}</span>
                </div>
                <div>
                  {{ maxUsdDrawDisplay }}
                  <span>{{ $t('common.currency.usd') }}</span>
                </div>
                <button @click="showWithdraw">
                  {{ $t('dappsMCDMaker.withdraw') }} >
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
            <p>{{ $t('dappsMCDMaker.dai-position') }}</p>
          </div>

          <div class="block-content-container">
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMCDMaker.generated') }}</p>
                <div>
                  {{ debtValue }}
                  <span>{{ $t('dappsMCDMaker.dai') }}</span>
                </div>
                <div>
                  {{ debtValueDisplay }}
                  <span>{{ $t('common.currency.usd') }}</span>
                </div>
                <button @click="showPayback">
                  {{ $t('dappsMCDMaker.payback') }} >
                </button>
              </div>
            </div>
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMCDMaker.max-available-gen') }}</p>
                <div>
                  {{ maxDai }}
                  <span>{{ $t('dappsMCDMaker.dai') }}</span>
                </div>
                <div>
                  {{ maxUsd }}
                  <span>{{ $t('common.currency.usd') }}</span>
                </div>
                <button @click="showGenerate">
                  {{ $t('dappsMCDMaker.generate') }} >
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
import BottomHelpLink from '@/components/BottomHelpLink';
import BigNumber from 'bignumber.js';

import {
  displayFixedPercent,
  displayFixedValue,
  displayPercentValue,
  toBigNumber
} from '../../makerHelpers';

export default {
  components: {
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
    },
    updated: {
      type: Number,
      default: 0
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
      maxEthDraw: toBigNumber(0),
      vaultType: 'ETH-A',
      updatedValue: 0
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    noProxy() {
      if (this.activeCdp) {
        return this.activeCdp.noProxy;
      }
      return null;
    },
    finishMigration() {
      if (this.activeCdp) {
        return this.activeCdp.needToFinishMigrating;
      }
      return null;
    },
    collateralRatioColoring() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return this.currentCdp.collateralStatus;
      }
      return '';
    },
    liquidationPriceDisplay() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        const value = displayFixedValue(this.currentCdp.liquidationPrice, 2);
        if (new BigNumber(value).gt(0)) {
          return value;
        }
        return '--';
      }
      return '--';
    },
    collaterlizationRatioDisplay() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
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
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(
          displayPercentValue(this.currentCdp.liquidationRatio)
        );
      }
      return '--';
    },
    liquidationPenaltyDisplay() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(
          displayPercentValue(this.currentCdp.liquidationPenalty)
        );
      }
      return '--';
    },
    stabilityFeeDisplay() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(
          displayPercentValue(this.currentCdp.stabilityFee)
        );
      }
      return '--';
    },
    ethPriceDisplay() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(this.currentCdp.currentPrice, 2);
      }
      return '--';
    },
    zeroDebt() {
      return toBigNumber(this.values.debtValue).eq(0);
    },
    maxEthDrawDisplay() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(this.currentCdp.maxEthDraw, 5);
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
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(this.getCollateralAmount(), 5);
      }
      return '--';
    },
    collateralType() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return this.currentCdp.cdpCollateralType;
      }
      return 'ETH';
    },
    usdCollateral() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(this.currentCdp.collateralValue, 2);
      }
      return '--';
    },
    debtValueDisplay() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(this.currentCdp.debtValue, 2);
      }
      return '--';
    },
    debtValue() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(
          this.currentCdp.debtValue,
          5,
          true,
          true,
          true
        );
      }
      return '--';
    },
    maxDai() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(this.currentCdp.maxDai, 5);
      }
      return '--';
    },
    maxUsd() {
      if (this.currentCdpLoaded && this.updatedValue > -1) {
        return displayFixedValue(this.currentCdp.maxDai, 2);
      }
      return '--';
    }
  },
  watch: {
    ['activeCdp.ready']() {
      this.isReady();
    },
    valuesUpdated() {
      this.updatedValue++;
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
    },
    ['$route.params']() {
      this.updatedValue++;
      this.getActiveCdp();
    }
  },
  beforeDestroy() {
    this.makerCDP = {};
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
      this.cdpId = this.$route.params.cdpId;
      const cdpId = typeof this.cdpId === 'number' ? this.cdpId : this.cdpId.id;
      this.currentCdp = this.getValueOrFunction('getCdp')(cdpId);
      if (this.currentCdp) {
        this.currentCdpLoaded = true;
        this.$forceUpdate();
        this.vaultType = this.currentCdp.cdpType;
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

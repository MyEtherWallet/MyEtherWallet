<template>
  <div>
    <close-cdp-modal
      ref="closeCdp"
      :active-cdp="activeCdp"
      :tokens-with-balance="tokensWithBalance"
    >
    </close-cdp-modal>
    <move-cdp-modal
      ref="moveCdp"
      :active-cdp="activeCdp"
      :tokens-with-balance="tokensWithBalance"
    >
    </move-cdp-modal>

    <div v-show="!finishMigration" class="manage-container">
      <!-- ==================================================== -->
      <div class="title-content-container">
        <p class="cpd-title">{{ $t('dappsMaker.cdpPortal') }}</p>
        <p class="cdp-id">
          {{ $t('dappsMaker.positionLabel', { value: activeCdp.cdpId }) }}
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
              <div>{{ activeCdp.ethPrice }} <span>USD</span></div>
            </div>
            <div class="item">
              <p>{{ $t('dappsMaker.liquidationPenalty') }}</p>
              <div>
                {{
                  displayFixedValue(
                    displayPercentValue(activeCdp.liquidationPenalty)
                  )
                }}%
              </div>
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
              <div>
                {{
                  displayFixedValue(
                    displayPercentValue(activeCdp.liquidationRatio)
                  )
                }}%
              </div>
            </div>
            <div class="item">
              <p>{{ $t('dappsMaker.stabilityFee') }}</p>
              <div>
                {{
                  displayFixedValue(
                    displayPercentValue(activeCdp.stabilityFee)
                  )
                }}%
              </div>
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
                  {{ displayFixedValue(activeCdp.ethCollateral, 5, false) }}
                  <span>ETH</span>
                </div>
                <div>
                  {{ displayFixedValue(activeCdp.pethCollateral, 5, true) }}
                  <span>PETH</span> /
                  {{ displayFixedValue(activeCdp.usdCollateral, 2) }}
                  <span>USD</span>
                </div>
              </div>
            </div>
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMaker.maxWithDraw') }}</p>
                <div>
                  {{ displayFixedValue(activeCdp.maxEthDraw, 5) }}
                  <span>ETH</span>
                </div>
                <div>
                  {{ displayFixedValue(activeCdp.maxPethDraw, 5) }}
                  <span>PETH</span> /
                  {{ displayFixedValue(activeCdp.maxUsdDraw, 2) }}
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
                <div>{{ activeCdp.debtValue }} <span>DAI</span></div>
                <div>
                  {{ displayFixedValue(activeCdp.debtValue, 2) }}
                  <span>USD</span>
                </div>
              </div>
            </div>
            <div class="block-content">
              <div class="item">
                <p>{{ $t('dappsMaker.maxAvailable') }}</p>
                <div>
                  {{ displayFixedValue(activeCdp.maxDai, 5) }}
                  <span>DAI</span>
                </div>
                <div>
                  {{ displayFixedValue(activeCdp.maxDai, 2) }}
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
import { mapGetters } from 'vuex';
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
    migrationInProgress: {
      type: Object,
      default: function() {
        return {};
      }
    },
    makerManager: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
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
      maxPethDraw: toBigNumber(0),
      maxEthDraw: toBigNumber(0)
    };
  },
  computed: {
    ...mapGetters({
      account: 'account',
      gasPrice: 'gasPrice',
      web3: 'web3',
      network: 'network',
      ens: 'ens'
    }),
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
      if (this.activeCdp.collatRatio >= 2) {
        return 'green';
      } else if (
        this.activeCdp.collatRatio >= 1.75 &&
        this.activeCdp.collatRatio < 2
      ) {
        return 'orange';
      }
      return 'red';

      // if(this.activeCdp.collatRatio )
    },
    liquidationPriceDisplay() {
      const value = displayFixedValue(this.activeCdp.liquidationPrice, 2);
      if (new BigNumber(value).gt(0)) {
        return value;
      }
      return '--';
    },
    collaterlizationRatioDisplay() {
      return displayFixedPercent(this.activeCdp.collatRatio);
    }
  },
  watch: {
    ['activeCdp.ready']() {
      this.isReady();
    },
    async ['activeCdp.doUpdate'](val) {
      if (val > 0) {
        this.activeCdp = this.makerManager.getCdp(this.cdpId);
      }
    },
    valuesUpdated() {
      if (this.makerManager.hasCdp(this.cdpId)) {
        this.activeCdp = this.makerManager.getCdp(this.cdpId);
      }
    },
    ['$route.params.cdpId'](val) {
      if (this.makerManager.hasCdp(val)) {
        this.activeCdp = this.makerManager.getCdp(val);
      }
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
    }
  },
  async mounted() {
    this.cdpId = this.$route.params.cdpId;

    if (this.makerActive) {
      this.loaded = true;
      if (this.cdpId) {
        this.activeCdp = this.makerManager.getCdp(this.cdpId);
        // eslint-disable-next-line
      }
    }
  },
  methods: {
    async migrateCdpToProxy() {
      await this.activeCdp.migrateCdpComplete();
    },
    showClose() {
      this.$refs.closeCdp.$refs.modal.show();
    },
    showMove() {
      this.$refs.moveCdp.$refs.modal.show();
    },
    displayPercentValue,
    displayFixedValue,
    async isReady() {
      // this.maxWithDraw = this.activeCdp.maxDaiDraw();
      if (this.activeCdp) {
        this.maxWithDrawUSD = this.activeCdp.toUSD(this.activeCdp.maxDai);
      }
      this.maxWithDrawUSD = '--';
    },
    async migrateCdp() {
      await this.activeCdp.migrateCdp();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ProxyMigrateCDP';
</style>

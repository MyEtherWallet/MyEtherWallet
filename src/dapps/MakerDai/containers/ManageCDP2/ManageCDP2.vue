<template>
  <div class="manage-cdp">
    <deposit-modal
      ref="deposit"
      :action="'deposit'"
      :active-cdp="activeCdp"
      :tokens-with-balance="tokensWithBalance"
    ></deposit-modal>
    <generate-modal
      ref="generate"
      :action="'generate'"
      :active-cdp="activeCdp"
      :tokens-with-balance="tokensWithBalance"
    ></generate-modal>
    <withdraw-modal
      ref="withdraw"
      :action="'withdraw'"
      :active-cdp="activeCdp"
      :tokens-with-balance="tokensWithBalance"
    ></withdraw-modal>
    <payback-modal
      ref="payback"
      :action="'payback'"
      :active-cdp="activeCdp"
      :tokens-with-balance="tokensWithBalance"
    ></payback-modal>
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
              <div>{{ liquidationPenalty }}%</div>
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
              <div>{{ liquidationRatio }}%</div>
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
                  <span>ETH</span>
                </div>
                <div>
                  {{ maxPethDrawDisplay }}
                  <span>PETH</span> /
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
import GenerateModal from '../../components/GenerateModal';
import DepositModal from '../../components/DepositModal';
import WithdrawModal from '../../components/WithdrawModal';
import PaybackModal from '../../components/PaybackModal';
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

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'generate-modal': GenerateModal,
    'deposit-modal': DepositModal,
    'withdraw-modal': WithdrawModal,
    'payback-modal': PaybackModal,
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
    }
    // makerManager: {
    //   type: Object,
    //   default: function() {
    //     return {};
    //   }
    // }
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
      if (this.activeCdp) {
        if (this.activeCdp.collatRatio >= 2) {
          return 'green';
        } else if (
          this.activeCdp.collatRatio >= 1.75 &&
          this.activeCdp.collatRatio < 2
        ) {
          return 'orange';
        }
        return 'red';
      }
      return '';
    },
    liquidationPriceDisplay() {
      if (this.activeCdp) {
        const value = displayFixedValue(this.activeCdp.liquidationPrice, 2);
        if (new BigNumber(value).gt(0)) {
          return value;
        }
        return '--';
      }
      return '--';
    },
    collaterlizationRatioDisplay() {
      if (this.activeCdp) {
        return displayFixedPercent(this.activeCdp.collatRatio);
      }
      return '--';
    },
    cdpIdDisplay() {
      console.log(this.activeCdp); // todo remove dev item
      if (this.activeCdp) {
        return this.activeCdp.cdpId;
      }
      return '--';
    },
    liquidationRatio() {
      if (this.activeCdp) {
        return displayFixedValue(
          displayPercentValue(this.activeCdp.liquidationRatio)
        );
      }
      return '--';
    },
    liquidationPenalty() {
      if (this.activeCdp) {
        return displayFixedValue(
          displayPercentValue(this.activeCdp.liquidationPenalty)
        );
      }
      return '--';
    },
    stabilityFeeDisplay() {
      if (this.activeCdp) {
        return displayFixedValue(
          displayPercentValue(this.activeCdp.stabilityFee)
        );
      }
      return '--';
    },
    ethPriceDisplay() {
      if (this.activeCdp) {
        return this.activeCdp.ethPrice;
      }
      return '--';
    },
    maxPethDrawDisplay() {
      if (this.activeCdp) {
        return displayFixedValue(this.activeCdp.maxPethDraw, 5);
      }
      return '--';
    },
    maxEthDrawDisplay() {
      if (this.activeCdp) {
        return displayFixedValue(this.activeCdp.maxEthDraw, 5);
      }
      return '--';
    },
    maxUsdDrawDisplay() {
      if (this.activeCdp) {
        return displayFixedValue(this.activeCdp.maxUsdDraw, 2);
      }
      return '--';
    },
    ethCollateral() {
      console.log('this.activeCdp', this.activeCdp.ethCollateral); // todo remove dev item
      if (this.activeCdp) {
        displayFixedValue(this.activeCdp.ethCollateral, 5, false);
      }
      return '--';
    },
    pethCollateral() {
      if (this.activeCdp) {
        return displayFixedValue(this.activeCdp.pethCollateral, 5, true);
      }
      return '--';
    },
    usdCollateral() {
      if (this.activeCdp) {
        return displayFixedValue(this.activeCdp.usdCollateral, 2);
      }
      return '--';
    },
    debtValueDisplay() {
      if (this.activeCdp) {
        return displayFixedValue(this.activeCdp.debtValue, 2);
      }
      return '--';
    },
    debtValue() {
      if (this.activeCdp) {
        return this.activeCdp.debtValue;
      }
      return '--';
    },
    maxDai() {
      if (
        this.ethPrice &&
        this.ethCollateral &&
        this.liquidationRatio &&
        this.debtValue
      ) {
        return displayFixedValue(
          bnOver(
            this.ethPrice,
            this.ethCollateral,
            this.liquidationRatio
          ).minus(this.debtValue),
          5
        );
      }
      return '--';
    },
    maxUsd() {
      if (this.activeCdp) {
        return displayFixedValue(this.maxDai, 2);
      }
      return '--';
    }
  },
  watch: {
    ['activeCdp.ready']() {
      this.isReady();
    },
    async ['activeCdp.doUpdate'](val) {
      if (val > 0) {
        this.activeCdp = this.getCdp(this.cdpId);
      }
    },
    valuesUpdated() {
      if (this.cdpId) {
        console.log('activeCdp'); // todo remove dev item
        console.log(this.activeCdp); // todo remove dev item
        this.activeCdp = this.getCdp[this.cdpId];
        // this.activeCdp = this.makerManager.getCdp(this.cdpId);
        if (!this.activeCdp) {
          console.log("shouldn't run"); // todo remove dev item
          this.$emit('managerUpdate');
          // await this.makerManager.doUpdate();
          // this.activeCdp = this.makerManager.getCdp(this.cdpId);
        }
      }
    },
    ['$route.params.cdpId'](val) {
      if (this.hasCdp(val)) {
        this.activeCdp = this.getCdp(val);
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
        const activeCdp = this.availableCdps[this.cdpId];
        console.log('activeCdp', activeCdp); // todo remove dev item
        this.activeCdp = this.getCdp(this.cdpId);
        console.log('activeCdp 2', activeCdp); // todo remove dev item

        if (!this.activeCdp) {
          this.$emit('managerUpdate');
          // await this.makerManager.doUpdate();
          this.activeCdp = this.getCdp(this.cdpId);
          console.log('activeCdp 3', activeCdp); // todo remove dev item
        }
      }
      this.$refs.closeCdp.$refs.modal.$on('hidden', () => {
        this.$emit('modalHidden');
      });
      this.$refs.moveCdp.$refs.modal.$on('hidden', () => {
        this.$emit('modalHidden');
      });
    }
  },
  methods: {
    async migrateCdpToProxy() {
      await this.activeCdp.migrateCdpComplete();
    },
    showDeposit() {
      this.$refs.deposit.$refs.modal.show();
    },
    showWithdraw() {
      this.$refs.withdraw.$refs.modal.show();
    },
    showPayback() {
      this.$refs.payback.$refs.modal.show();
    },
    showGenerate() {
      this.$refs.generate.$refs.modal.show();
    },
    showClose() {
      this.$refs.closeCdp.$refs.modal.$on('hidden', () => {
        this.$emit('modalHidden');
      });
      this.$refs.closeCdp.$refs.modal.show();
    },
    showMove() {
      this.$refs.moveCdp.$refs.modal.$on('hidden', () => {
        this.$emit('modalHidden');
      });
      this.$refs.moveCdp.$refs.modal.show();
    },
    displayPercentValue,
    displayFixedValue,
    async isReady() {
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
@import 'ManageCDP';
</style>

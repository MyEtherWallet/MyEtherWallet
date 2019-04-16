<template>
  <div>
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
      <div class="content-container">
        <p class="cpd-title">{{ $t('dapps.cdpPortal') }}</p>
        <p class="cdp-id">
          {{ $t('dapps.positionLabel') }} #{{ activeCdp.cdpId }}
        </p>
      </div>

      <div class="manage-container-info-block">
        <div class="info-label-one-left">
          <p>{{ $t('dapps.liquidPrice') }} (ETH/USD)</p>
          <p>
            <span class="blue-bold">{{ liquidationPriceDisplay }}</span>
            <span class="liq-usd"> USD</span>
          </p>
        </div>
        <div class="info-content-one-left">
          <div class="info-content-one-inner-top">
            <p>{{ $t('dapps.currentPrice') }}(ETH/USD)</p>
            <p>
              <b>{{ activeCdp.ethPrice }}</b> USD
            </p>
          </div>
          <div class="info-content-one-inner-bottom">
            <p>{{ $t('dapps.liquidationPenalty') }}</p>
            <p>
              <b
                >{{
                  displayFixedValue(
                    displayPercentValue(activeCdp._liquidationPenalty)
                  )
                }}%</b
              >
            </p>
          </div>
        </div>
        <div class="info-label-one-right">
          <p>{{ $t('dapps.collateralRatio') }}</p>
          <p class="blue-bold">{{ collaterlizationRatioDisplay }}%</p>
        </div>
        <div class="info-content-one-right">
          <div class="info-content-one-inner-top">
            <p>{{ $t('dapps.minimumRatio') }}</p>
            <p>
              <b
                >{{
                  displayFixedValue(
                    displayPercentValue(activeCdp.liquidationRatio)
                  )
                }}%</b
              >
            </p>
          </div>
          <div class="info-content-one-inner-bottom">
            <p>{{ $t('dapps.stabilityFee') }}</p>
            <p>
              <b
                >{{
                  displayFixedValue(
                    displayPercentValue(activeCdp.stabilityFee)
                  )
                }}%</b
              >
            </p>
          </div>
        </div>
      </div>
      <div class="manage-container-blocks">
        <div class="label-one-left">
          <p>{{ $t('dapps.ethCollateral') }}</p>
        </div>
        <div class="content-one-left">
          <div class="content-one-inner-left">
            <p>{{ $t('dapps.deposited') }}</p>
            <p>
              <b>{{ displayFixedValue(activeCdp.ethCollateral, 5, false) }}</b>
              ETH
            </p>
            <p>
              <b>{{ displayFixedValue(activeCdp.pethCollateral, 5, true) }}</b>
              PETH /
              <b>{{ displayFixedValue(activeCdp.usdCollateral, 2) }}</b> USD
            </p>
            <p>
              <span @click="showDeposit">{{ $t('dapps.deposit') }}</span>
            </p>
          </div>
          <div class="content-border">
            <div class="Line-8"></div>
          </div>
          <div class="content-one-inner-right">
            <p>{{ $t('dapps.maxWithDraw') }}</p>
            <p>
              <b>{{ displayFixedValue(activeCdp.maxEthDraw, 5) }}</b> ETH
            </p>
            <p>
              <b>{{ displayFixedValue(activeCdp.maxPethDraw, 5) }}</b> PETH /
              <b>{{ displayFixedValue(activeCdp.maxUsdDraw, 2) }}</b> USD
            </p>
            <p>
              <span @click="showWithdraw">{{ $t('dapps.withdraw') }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="manage-container-blocks">
        <div class="label-one-left">
          <p>{{ $t('dapps.daiPosition') }}</p>
        </div>
        <div class="content-one-left">
          <div class="content-one-inner-left">
            <p>{{ $t('dapps.generated') }}</p>
            <p>
              <b>{{ activeCdp.debtValue }}</b> DAI
            </p>
            <p>
              <b>{{ displayFixedValue(activeCdp.debtValue, 2) }}</b> USD
            </p>
            <p>
              <span @click="showPayback">{{ $t('dapps.payBack') }}</span>
            </p>
          </div>
          <div class="content-border">
            <div class="Line-8"></div>
          </div>
          <div class="content-one-inner-right">
            <p>{{ $t('dapps.maxAvailable') }}</p>
            <p>
              <b>{{ displayFixedValue(activeCdp.maxDai) }}</b> DAI
            </p>
            <p>
              <b>{{ displayFixedValue(activeCdp.maxDai, 2) }}</b> USD
            </p>
            <p>
              <span @click="showGenerate">{{ $t('dapps.generate') }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import ActionModal from '../../components/ActionsModal';
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

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'action-modal': ActionModal,
    'generate-modal': GenerateModal,
    'deposit-modal': DepositModal,
    'withdraw-modal': WithdrawModal,
    'payback-modal': PaybackModal,
    'close-cdp-modal': CloseCdpModal,
    'move-cdp-modal': MoveCdpModal,
    blockie: Blockie
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
    maker: {
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
@import 'ManageCDP';
</style>

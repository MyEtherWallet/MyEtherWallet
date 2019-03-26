<template>
  <div>
    <action-modal
      ref="deposit"
      :action="'deposit'"
      :active-cdp="activeCdp"
    ></action-modal>
    <action-modal
      ref="generate"
      :action="'generate'"
      :active-cdp="activeCdp"
    ></action-modal>
    <action-modal
      ref="withdraw"
      :action="'withdraw'"
      :active-cdp="activeCdp"
    ></action-modal>
    <action-modal
      ref="payback"
      :action="'payback'"
      :active-cdp="activeCdp"
    ></action-modal>
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
    <!--<div class="container-maker">-->
    <div>
      <button @click="showClose">
        CLOSE
      </button>
      <button @click="showMove">
        MOVE
      </button>
      <div class="migrate-cdp-container">
        <div v-if="noProxy && !finishMigration" class="migrate-cdp">
          <button @click="migrateCdpToProxy">Migrate Existing CDP</button>
        </div>
        <div v-if="finishMigration" class="migrate-cdp">
          <button @click="migrateCdp">Finish Migrating CDP</button>
        </div>
      </div>
    </div>
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
            <span class="blue-bold">{{
              displayFixedValue(activeCdp.liquidationPrice, 2)
            }}</span>
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
          <p class="blue-bold">
            {{ displayFixedValue(displayPercentValue(activeCdp.collatRatio)) }}%
          </p>
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
    <!--</div>-->
  </div>
</template>

<script>
/* eslint-disable */

import { mapGetters } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import GenerateDai from './components/GenerateDai';
import DepositeCollateral from './components/DepositCollateral';
import ActionModal from './components/ActionsModal';
import CloseCdpModal from './components/CloseCdpModal';
import MoveCdpModal from './components/MoveCdpModal';

import BigNumber from 'bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'generate-dai': GenerateDai,
    'deposit-collateral': DepositeCollateral,
    'action-modal': ActionModal,
    'close-cdp-modal': CloseCdpModal,
    'move-cdp-modal': MoveCdpModal,
    blockie: Blockie
  },
  props: {
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
    maker: {
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
  watch: {
    ['activeCdp.ready']() {
      this.isReady();
    },
    async ['activeCdp.doUpdate'](val){
      if(val > 0){
        this.activeCdp = await this.activeCdp.update()
      }
    }
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
    }
  },
  async mounted() {
    this.cdpId = this.$route.params.cdpId;
    if (this.makerActive) {
      this.loaded = true;
      if (this.cdpId) {
        this.activeCdp = this.availableCdps[this.cdpId];
        // eslint-disable-next-line
        console.log('this.activeCdp', this.activeCdp); // todo remove dev item
      }
    }
  },
  methods: {
    async migrateCdpToProxy() {
      const migrate = await this.activeCdp.migrateCdpComplete();
    },
    showDeposit() {
      this.$refs.deposit.$refs.modal.show();
      // this.$refs.action.$refs.modal.show();
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
      this.$refs.closeCdp.$refs.modal.show();
    },
    showMove() {
      this.$refs.moveCdp.$refs.modal.show();
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3, round = true) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      if (round) return raw.toFixed(decimals, BigNumber.ROUND_DOWN).toString();
      return raw.toFixed(decimals).toString();
    },
    async isReady() {
      console.log('isReady', this.activeCdp); // todo remove dev item
      this.maxWithDraw = this.activeCdp.maxDaiDraw();
      this.maxWithDrawUSD = this.activeCdp.toUSD(this.maxWithDraw);
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

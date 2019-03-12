<template>
  <div>
    <deposit-collateral ref="deposit" :active-cdp="activeCdp"></deposit-collateral>
    <withdraw-collateral ref="withdraw" :active-cdp="activeCdp"></withdraw-collateral>
    <payback-dai ref="payback" :active-cdp="activeCdp"></payback-dai>
    <generate-dai ref="generate" :active-cdp="activeCdp"></generate-dai>
    <interface-container-title :title="'MAKER'" />
    <div class="container-maker">
      <div class="manage-container">
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
              <span class="blue-bold">{{ activeCdp.liqPrice }}</span>
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
                <b>{{ displayPercentValue(activeCdp.liquidationPenalty) }}%</b>
              </p>
            </div>
          </div>
          <div class="info-label-one-right">
            <p>{{ $t('dapps.collateralRatio') }}</p>
            <p class="blue-bold">
              {{ displayPercentValue(activeCdp.collatRatio) }}%
            </p>
          </div>
          <div class="info-content-one-right">
            <div class="info-content-one-inner-top">
              <p>{{ $t('dapps.minimumRatio') }}</p>
              <p>
                <b>{{ displayPercentValue(activeCdp.liquidationRatio) }}%</b>
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
                <b>{{ displayFixedValue(activeCdp.ethCollateral) }}</b> ETH
              </p>
              <p>
                <b>{{ displayFixedValue(activeCdp.pethCollateral) }}</b> PETH /
                <b>{{ displayFixedValue(activeCdp.usdCollateral, 2) }}</b> USD
              </p>
              <p><span @click="showDeposit">{{ $t('dapps.deposit') }}</span></p>
            </div>
            <div class="content-border">
              <div class="Line-8"></div>
            </div>
            <div class="content-one-inner-right">
              <p>{{ $t('dapps.maxWithDraw') }}</p>
              <p>
                <b>{{ displayFixedValue(maxWithDraw) }}</b> ETH
              </p>
              <p><b>{{ displayFixedValue(maxWithDraw) }}</b> PETH / <b>{{ displayFixedValue(maxWithDrawUSD, 2) }}</b> USD</p>
              <p><span @click="showWithdraw">{{ $t('dapps.withdraw') }}</span></p>
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
              <p><span @click="showPayback">{{ $t('dapps.payBack') }}</span></p>
            </div>
            <div class="content-border">
              <div class="Line-8"></div>
            </div>
            <div class="content-one-inner-right">
              <p>{{ $t('dapps.maxAvailable') }}</p>
              <p><b>{{ displayFixedValue(activeCdp.maxDaiDraw)}}</b> DAI</p>
              <p><b>{{ displayFixedValue(activeCdp.maxDaiDraw, 2)}}</b> USD</p>
              <p><span @click="showGenerate">{{ $t('dapps.generate') }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { mapGetters } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import GenerateDai from './components/GenerateDai'
import DepositeCollateral from './components/DepositCollateral'
import PaybackDai from './components/PaybackDai'
import WithdrawCollateral from './components/WithdrawCollateral'
import BigNumber from 'bignumber.js';
import { MIN_DEPOSIT, settings } from '../../config';
const KOVAN_SERVER_URL = 'https://sai-kovan.makerfoundation.com/v1';

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
    'generate-dai': GenerateDai,
    'deposit-collateral': DepositeCollateral,
    'payback-dai': PaybackDai,
    'withdraw-collateral': WithdrawCollateral,
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
    highestGas: {
      type: String,
      default: '0'
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
    calcMinCollatRatio: {
      type: Function,
      default: function() {}
    },
    calcDrawAmt: {
      type: Function,
      default: function() {}
    },
    calcCollatRatio: {
      type: Function,
      default: function() {}
    },
    calcLiquidationPrice: {
      type: Function,
      default: function() {}
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
      serverUrl: KOVAN_SERVER_URL,
      wethToPethRatio: 0,
      daiPrice: 0,
      priceFloor: 0,
      ethQty: 0,
      daiQty: 0,
      selectedCdp: '',
      cdpId: '',
      cdp: {},
      step: 1,
      eth: toBigNumber(0),
      skr: toBigNumber(0),
      dai: toBigNumber(0),
      debtValue: toBigNumber(0),
      collatRatio: toBigNumber(0),
      pethCollateral: toBigNumber(0),
      usdCollateral: toBigNumber(0),
      ethCollateral: toBigNumber(0),
      maxDaiAvail: null,
      liqPrice: null,
      ratio: null,
      error: false,
      isSafe: false,
      maxDaiDraw: toBigNumber(0),
      maxWithDraw: toBigNumber(0),
      maxWithDrawUSD: toBigNumber(0),
      maxPethDraw: toBigNumber(0),
      maxEthDraw: toBigNumber(0),

    };
  },
  watch: {
    ['activeCdp.ready']() {
      this.isReady();
    }
  },
  computed: {
    ...mapGetters({
      account: 'account',
      gasPrice: 'gasPrice',
      web3: 'web3',
      network: 'network',
      ens: 'ens'
    })
  },
  async mounted() {
    this.cdpId = this.$route.params.cdpId;
    if (this.makerActive) {
      this.loaded = true;
      // const cdpId = 5178;
      if (this.cdpId) {
        this.activeCdp = this.availableCdps[this.cdpId];
      }
    }
  },
  methods: {
    showDeposit(){
      this.$refs.deposit.$refs.modal.show();
    },
    showWithdraw(){
      this.$refs.withdraw.$refs.modal.show();
    },
    showPayback(){
      this.$refs.payback.$refs.modal.show();
    },
    showGenerate(){
      this.$refs.generate.$refs.modal.show();
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals).toString();
    },
    isReady() {
      this.maxWithDraw = this.activeCdp.maxWithDraw();
      this.maxWithDrawUSD = this.activeCdp.toUSD(this.maxWithDraw);
      console.log(this.maxWithDraw); // todo remove dev item
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageCDP';
</style>

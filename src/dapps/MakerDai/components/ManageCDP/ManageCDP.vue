<template>
  <div>
    <deposit-collateral
      ref="deposit"
      :active-cdp="activeCdp"
    ></deposit-collateral>
    <withdraw-collateral
      ref="withdraw"
      :active-cdp="activeCdp"
    ></withdraw-collateral>
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
                <b>{{ displayFixedValue(maxWithDraw) }}</b> ETH
              </p>
              <p>
                <b>{{ displayFixedValue(maxWithDraw) }}</b> PETH /
                <b>{{ displayFixedValue(maxWithDrawUSD, 2) }}</b> USD
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
                <b>{{ displayFixedValue(activeCdp.maxDaiDraw) }}</b> DAI
              </p>
              <p>
                <b>{{ displayFixedValue(activeCdp.maxDaiDraw, 2) }}</b> USD
              </p>
              <p>
                <span @click="showGenerate">{{ $t('dapps.generate') }}</span>
              </p>
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
import GenerateDai from './components/GenerateDai';
import DepositeCollateral from './components/DepositCollateral';
import PaybackDai from './components/PaybackDai';
import WithdrawCollateral from './components/WithdrawCollateral';
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
      if (this.cdpId) {
        this.activeCdp = this.availableCdps[this.cdpId];
      }
    }
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageCDP';
</style>

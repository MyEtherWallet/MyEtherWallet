<template>
  <div>
    <interface-container-title :title="'MAKER'" />
    <div class="container-maker">
      <div class="manage-container">
        <div class="content-container">
          <p class="cpd-title">{{$t('dapps.cdpPortal')}}</p>
          <p class="cdp-id">{{$t('dapps.positionLabel')}} #4831</p>
        </div>
        <div class="manage-container-info-block">
          <div class="info-label-one-left">
            <p>{{$t('dapps.liquidPrice')}} (ETH/USD)</p>
            <p>
              <span class="blue-bold">{{ liqPrice }}</span>
              <span class="liq-usd"> USD</span>
            </p>
          </div>
          <div class="info-content-one-left">
            <div class="info-content-one-inner-top">
              <p>{{$t('dapps.currentPrice')}}(ETH/USD)</p>
              <p>
                <b>{{ ethPrice.toString() }}</b> USD
              </p>
            </div>
            <div class="info-content-one-inner-bottom">
              <p>{{$t('dapps.liquidationPenalty')}}</p>
              <p>
                <b>{{ displayPercentValue(liquidationPenalty) }}%</b>
              </p>
            </div>
          </div>
          <div class="info-label-one-right">
            <p>{{$t('dapps.collateralRatio')}}</p>
            <p class="blue-bold">{{ displayPercentValue(collatRatio) }}%</p>
          </div>
          <div class="info-content-one-right">
            <div class="info-content-one-inner-top">
              <p>{{$t('dapps.minimumRatio')}}</p>
              <p>
                <b>{{ displayPercentValue(liquidationRatio) }}%</b>
              </p>
            </div>
            <div class="info-content-one-inner-bottom">
              <p>{{$t('dapps.stabilityFee')}}</p>
              <p>
                <b>{{ displayPercentValue(stabilityFee) }}%</b>
              </p>
            </div>
          </div>
        </div>
        <div class="manage-container-blocks">
          <div class="label-one-left">
            <p>{{$t('dapps.ethCollateral')}}</p>
          </div>
          <div class="content-one-left">
            <div class="content-one-inner-left">
              <p>{{$t('dapps.deposited')}}</p>
              <p><b>0.050</b> ETH</p>
              <p><b>0.048</b> PETH / <b>4.712</b> USD</p>
              <p>{{$t('dapps.deposit')}}</p>
            </div>
            <div class="content-border">
              <div class="Line-8"></div>
            </div>
            <div class="content-one-inner-right">
              <p>{{$t('dapps.maxWithDraw')}}</p>
              <p><b>0.050</b> ETH</p>
              <p><b>0.048</b> PETH / <b>4.712</b> USD</p>
              <p>{{$t('dapps.withdraw')}}</p>
            </div>
          </div>
        </div>
        <div class="manage-container-blocks">
          <div class="label-one-left">
            <p>{{$t('dapps.daiPosition')}}</p>
          </div>
          <div class="content-one-left">
            <div class="content-one-inner-left">
              <p>{{$t('dapps.generated')}}</p>
              <p><b>0.050</b> DAI</p>
              <p><b>4.712</b> USD</p>
              <p>{{$t('dapps.payBack')}}</p>
            </div>
            <div class="content-border">
              <div class="Line-8"></div>
            </div>
            <div class="content-one-inner-right">
              <p>{{$t('dapps.maxAvailable')}}</p>
              <p><b>0.050</b> ETH</p>
              <p><b>4.712</b> USD</p>
              <p>{{$t('dapps.generate')}}</p>
            </div>
          </div>
        </div>

        <!--      <label for="Collateral">Collateral</label>
        <input id="Collateral" v-model="ethQty" type="number" />
        <br />
        <label for="Generate">Generate</label>
        <input id="Generate" v-model="daiQty" type="number" />
        <br />
        <br />
        <ul>
          <li>
            <span>pethCollateral: {{ pethCollateral }}</span>
          </li>
          <li>
            <span>usdCollateral: {{ usdCollateral }}</span>
          </li>
          <li>
            <span>ethCollateral: {{ ethCollateral }}</span>
          </li>
          <li>
            <span>isSafe: {{ isSafe }}</span>
          </li>
          <li>
            <span>getDebtValue: {{ debtValue }}</span>
          </li>
          <li>
            <span>collatRatio: {{ collatRatio }}</span>
          </li>
          <li>
            Deposited:
            <ul>
              <li>{{ ethCollateral }} ETH</li>
              <li>{{ pethCollateral }} PETH / {{ usdCollateral }} USD</li>
            </ul>
          </li>
          <li>
            Max. available to withdraw:
            <ul>
              <li>{{ maxEthDraw }} ETH</li>
              <li>{{ maxPethDraw }} PETH / {{ maxDaiDraw }} USD</li>
            </ul>
          </li>
          <li>
             -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;
          </li>
          <li>{{ pethCollateral }}</li>
        </ul>-->
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
import BigNumber from 'bignumber.js';
// import * as unit from 'ethjs-unit';
// import utils from 'web3-utils';
// import { Toast, Misc } from '@/helpers';
import Maker from '@makerdao/dai';
import { MIN_DEPOSIT, settings } from '../../config';
const KOVAN_SERVER_URL = 'https://sai-kovan.makerfoundation.com/v1';
const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;

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
    maker: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      loaded: false,
      serverUrl: KOVAN_SERVER_URL,
      wethToPethRatio: 0,
      daiPrice: 0,
      priceFloor: 0,
      ethQty: 0,
      daiQty: 0,
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
      maxPethDraw: toBigNumber(0),
      maxEthDraw: toBigNumber(0)
    };
  },
  watch: {
    makerActive() {
      if (!this.loaded) {
        const cdpId = 5168;
        this.getCdp(cdpId);
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
    atSetFloor() {
      return this.calcMinCollatRatio(this.priceFloor);
    },
    liquidationPrice() {
      return this.calcLiquidationPrice(this.ethQty, this.daiQty);
    },
    minEthDeposit() {
      if (toBigNumber(this.usdCollateral).gt(new BigNumber(0))) return 0;
      return bnOver(
        this.liquidationRatio,
        this.usdCollateral,
        this.ethPrice
      ).toString();
    },
    atRisk() {
      if (this.calcCollatRatio(this.ethQty, this.daiQty).lte(2)) {
        return true;
      }
      return false;
    }
  },
  async mounted() {
    if (this.makerActive) {
      this.loaded = true;
      const cdpId = 5168;
      this.getCdp(cdpId);
    }
  },
  methods: {
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    async getCdp(id) {
      this.cdp = await this.maker.getCdp(id);
      const liqPrice = await this.cdp.getLiquidationPrice();
      this.liqPrice = liqPrice.toBigNumber().toFixed(2);
      this.isSafe = await this.cdp.isSafe();
      this.debtValue = (await this.cdp.getDebtValue()).toBigNumber();
      this.collatRatio = await this.cdp.getCollateralizationRatio();
      this.ethCollateral = (await this.cdp.getCollateralValue()).toBigNumber();
      this.pethCollateral = (await this.cdp.getCollateralValue(
        Maker.PETH
      )).toBigNumber();
      this.usdCollateral = (await this.cdp.getCollateralValue(
        Maker.USD
      )).toBigNumber();
      this.maxEthDraw = bnOver(
        this.liquidationRatio,
        this.usdCollateral,
        this.ethPrice
      ).toString();
      this.maxPethDraw = bnOver(
        this.pethPrice,
        this.pethCollateral,
        this.liquidationRatio
      ).toString();
      this.maxDaiDraw = bnOver(
        this.ethPrice,
        this.ethCollateral,
        this.liquidationRatio
      )
        .minus(this.debtValue)
        .toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageCDP';
</style>

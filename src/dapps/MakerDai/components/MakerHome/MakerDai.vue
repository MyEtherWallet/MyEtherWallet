<template>
  <div>
    <interface-container-title :title="'MAKER'" />

    <label for="Collateral">Collateral</label>
    <input id="Collateral" v-model="ethQty" type="number" />
    <br />
    <label for="Generate">Generate</label>
    <input id="Generate" v-model="daiQty" type="number" />
    <br />
    <br />

    <button @click="dothing">BUTTON</button>
    <div>
      <ul>
        <li>
          Max Dai: <span>{{ maxDaiDraw }}</span>
        </li>
        <li>
          Min Eth: <span>{{ minEthDeposit }}</span>
        </li>
        <li>Min ETH required: <span></span></li>
        <li>
          Liquidation price(ETH/USD): <span>{{ liquidationPrice }}</span>
        </li>
        <li>
          Current price information(ETH/USD): <span>{{ ethPrice }}</span>
        </li>
        <li>
          Liquidation penalty <span> {{ liquidationPenalty }}</span>
        </li>
        <li>
          Collateralization Ratio: <span>{{ collatRatio * 100 }}</span>
        </li>
        <li>
          Minimum Ratio
        </li>
        <li>
          Liquidation Ratio: <span>{{ liquidationRatio * 100 }}%</span>
        </li>
        <li>
          <p>Collateralization ratio that will achieve the given price floor</p>
          Collateralization Ratio: <span>{{ liquidationRatio * 100 }}%</span>
        </li>
      </ul>
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

const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
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
    highestGas: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      maker: {},
      priceService: {},
      cpdService: {},
      liquidationRatio: 0,
      liquidationPenalty: 0,
      stabilityFee: 0,
      ethPrice: 0,
      pethPrice: 0,
      wethToPethRatio: 0,
      daiPrice: 0,
      priceFloor: 0,
      ethQty: 0,
      daiQty: 0,
      makerVars: {
        step: 1,
        eth: toBigNumber(0),
        ethText: '',
        skr: toBigNumber(0),
        dai: toBigNumber(0),
        daiText: '',
        maxDaiAvail: null,
        minETHReqText: null,
        liqPrice: null,
        ratio: null,
        error: false,
        warning: false,
        submitEnabled: false,
        checkTerms: false,
        stepsExpanded: false
      }
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
    atSetFloor() {
      return this.calcMinCollatRatio(this.priceFloor);
    },
    collatRatio() {
      return this.calcCollatRatio(this.ethQty, this.daiQty);
    },
    liquidationPrice() {
      return this.calcLiquidationPrice(this.ethQty, this.daiQty);
    },
    maxDaiDraw() {
      if (this.ethQty <= 0) return 0;
      return (this.ethPrice * this.ethQty) / this.liquidationRatio;
    },
    minEthDeposit() {
      if (this.daiQty <= 0) return 0;
      return (this.liquidationRatio * this.daiQty) / this.ethPrice;
    }
  },
  async mounted() {
    this.maker = await Maker.create('http', {
      url: this.network.url,
      provider: {
        type: 'HTTP', // or 'TEST'
        network: 'kovan'
      },
      log: true
    });
    console.log(USD_DAI); // todo remove dev item
    await this.maker.authenticate();
    console.log('this.maker', this.maker); // todo remove dev item
    this.setup();
  },
  methods: {
    async dothing() {
      console.log(this.ethPrice); // todo remove dev item
      console.log(this.liquidationRatio); // todo remove dev item
    },
    async setup() {
      this.priceService = this.maker.service('price');
      this.cpdService = await this.maker.service('cdp');
      // this.ethPrice = (await this.priceService.getEthPrice()).toNumber();
      this.pethPrice = (await this.priceService.getPethPrice()).toNumber();
      this.ethPrice = 136.290;
      this.liquidationRatio = await this.cpdService.getLiquidationRatio();
      this.liquidationPenalty = await this.cpdService.getLiquidationPenalty();
      this.stabilityFee = await this.cpdService.getAnnualGovernanceFee();
    },
    calcMinCollatRatio(priceFloor) {
      return (this.ethPrice * this.liquidationRatio) / priceFloor;
    },
    calcDrawAmt(principal, collatRatio) {
      return Math.floor((principal * this.ethPrice) / collatRatio);
    },
    calcCollatRatio(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return 0;
      return (this.ethPrice * ethQty) / daiQty;
    },
    calcLiquidationPrice(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return 0;
      const getInt = parseInt(this.ethPrice);
      for (let i = getInt; i > 0; i--) {
        if ((i * ethQty) / daiQty <= this.liquidationRatio) {
          return i;
        }
      }
    },
    calcRatioForDraw() {},
    collecting() {
      // Liquidation price (ETH/USD):  { this.state.liqPrice ? printNumber(this.state.liqPrice) : "--" } USD
      // Current price information (ETH/USD): { printNumber(this.props.system.pip.val) } USD
      // Liquidation penalty: { printNumber(this.props.system.tub.axe.minus(WAD).times(100)) }%
      // Collateralization ratio: this.state.ratio ? printNumber(this.state.ratio.times(100)) : "--" }%
      // Stability fee: @{ printNumber(toWei(fromWei(this.props.system.tub.fee).pow(60 * 60 * 24 * 365)).times(100).minus(toWei(100)), 1, true, true) }%/year in MKR
      // Minimum ratio: { printNumber(this.props.system.tub.mat.times(100)) }%
      // calculate how much Dai we need to draw in order
      // to achieve the desired collateralization ratio
      // let drawAmt = Math.floor(principal * priceEth / collatRatio);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerDai';
</style>

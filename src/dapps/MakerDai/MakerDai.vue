<template>
  <div class="register-domain-container">
    <back-button />
    <button @click="gotoCreate">Create</button>
    <router-view
      :eth-price="ethPrice"
      :peth-price="pethPrice"
      :liquidation-penalty="liquidationPenalty"
      :stability-fee="stabilityFee"
      :liquidation-ratio="liquidationRatio"
      :calc-min-collat-ratio="calcMinCollatRatio"
      :calc-draw-amt="calcDrawAmt"
      :calc-collat-ratio="calcCollatRatio"
      :calc-liquidation-price="calcLiquidationPrice"
      :maker="maker"
      :price-service="priceService"
      :cdp-service="cdpService"
    />
  </div>
</template>

<script>
/* eslint-disable */

import { mapGetters } from 'vuex';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
import Maker from '@makerdao/dai';

const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
};

const bnOver = (one, two, three) =>{
  return (toBigNumber(one).times(toBigNumber(two))).div(toBigNumber(three));
}

const bnDiv = (one, two) =>{
  return toBigNumber(one).div(toBigNumber(two));
}
export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'back-button': BackButton
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
      cdpService: {},
      liquidationRatio: toBigNumber(0),
      liquidationPenalty: toBigNumber(0),
      stabilityFee: toBigNumber(0),
      ethPrice: toBigNumber(0),
      pethPrice: toBigNumber(0),
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
      return bnOver(this.ethPrice, this.ethQty, this.liquidationRatio)
      // return bnDiv(bnMult(this.ethPrice * this.ethQty), this.liquidationRatio);
    },
    minEthDeposit() {
      if (this.daiQty <= 0) return 0;
      return bnOver(this.liquidationRatio, this.daiQty, this.ethPrice)
      // return bnDiv(bnMult(this.liquidationRatio * this.daiQty), this.ethPrice);
      // return (this.liquidationRatio * this.daiQty) / this.ethPrice;
    },
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
    this.priceService = this.maker.service('price');
    this.cdpService = await this.maker.service('cdp');
    this.ethPrice = toBigNumber((await this.priceService.getEthPrice()).toNumber());
    this.pethPrice = toBigNumber((await this.priceService.getPethPrice()).toNumber());
    // // this.ethPrice = toBigNumber(136.290);
    this.liquidationRatio = toBigNumber((await this.cdpService.getLiquidationRatio()));
    this.liquidationPenalty = toBigNumber((await this.cdpService.getLiquidationPenalty()));
    this.stabilityFee = toBigNumber((await this.cdpService.getAnnualGovernanceFee()));
  },
  methods: {
    gotoCreate(){
      this.$router.push({
        path: 'maker-dai/create'
      });
    },
    calcMinCollatRatio(priceFloor) {
      return bnOver(this.ethPrice, this.liquidationRatio, priceFloor)
    },
    calcDrawAmt(principal, collatRatio) {
      return Math.floor(bnOver(principal, this.ethPrice, collatRatio).toNumber());
    },
    calcCollatRatio(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return 0;
      return bnOver(this.ethPrice, ethQty, daiQty)
    },
    calcLiquidationPrice(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return 0;
      const getInt = parseInt(this.ethPrice);
      for (let i = getInt; i > 0; i--) {
        const atValue = bnOver(i, ethQty, daiQty).lte(this.liquidationRatio)
        if(atValue){
          return i;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerDai.scss';
</style>

<template>
  <div class="register-domain-container">
    <back-button/>
    <button @click="gotoCreate">Create</button>
    <button @click="gotoImport">Manage</button>
    <router-view
      :maker-active="makerActive"
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
      :cdps="cdps"
      :available-cdps="availableCdps"
      :cdp-details-loaded="cdpDetailsLoaded"
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
import { toChecksumAddress } from '@/helpers/addressUtils';
import MakerCDP from './MakerCDP';
import MewPlugin from './dai-plugin-mew'

const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
};

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

const bnDiv = (one, two) => {
  return toBigNumber(one).div(toBigNumber(two));
};
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
      makerActive: false,
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
      cdps: [],
      availableCdps: {},
      cdpDetailsLoaded: false,
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
      return bnOver(this.ethPrice, this.ethQty, this.liquidationRatio);
      // return bnDiv(bnMult(this.ethPrice * this.ethQty), this.liquidationRatio);
    },
    minEthDeposit() {
      if (this.daiQty <= 0) return 0;
      return bnOver(this.liquidationRatio, this.daiQty, this.ethPrice);
      // return bnDiv(bnMult(this.liquidationRatio * this.daiQty), this.ethPrice);
      // return (this.liquidationRatio * this.daiQty) / this.ethPrice;
    },
    atRisk() {
      if (this.collatRatio.lte(2)) {
        return true;
      }
      return false;
    }
  },
  async mounted() {
    this.gotoHome();
    const MewMakerPlugin = MewPlugin(this.web3, this.account.address);
    console.log('provider', this.web3.currentProvider); // todo remove dev item
    // this.maker = new Maker({preset: {web3: {provider: this.web3.currentProvider}}})
    this.maker = await Maker.create('http', {
      url: this.network.url,
      provider: {
        type: 'HTTP', // or 'TEST'
        network: 'kovan'
      },
      plugins: [MewMakerPlugin],
      accounts: {
        myLedger1: { type: 'mew' }
      },
      log: true
    });
    console.log(USD_DAI); // todo remove dev item
    await this.maker.authenticate();
    console.log('this.maker', this.maker); // todo remove dev item
    this.priceService = this.maker.service('price');
    this.cdpService = await this.maker.service('cdp');

    // this.ethPrice = toBigNumber(
    //   (await this.priceService.getEthPrice()).toNumber()
    // );
    this.ethPrice = toBigNumber(136.290000000000000004);

    this.pethPrice = toBigNumber(
      (await this.priceService.getPethPrice()).toNumber()
    );
    this.liquidationRatio = toBigNumber(
      await this.cdpService.getLiquidationRatio()
    );
    this.liquidationPenalty = toBigNumber(
      await this.cdpService.getLiquidationPenalty()
    );
    this.stabilityFee = toBigNumber(
      await this.cdpService.getAnnualGovernanceFee()
    );
    console.log(this.cdpService); // todo remove dev item
    this.makerActive = true;
    console.log(toChecksumAddress(this.account.address)); // todo remove dev item
    const proxy = await this.maker
      .service('proxy')
      .getProxyAddress(this.account.address);
    let searchAddress;
    if (proxy) {
      searchAddress = proxy;
    } else {
      searchAddress = this.account.address;
    }
    console.log(proxy); // todo remove dev item
    const cdps = await this.maker.getCdpIds(
      searchAddress //proxy
    );
    this.cdps = cdps;
    if (this.cdps.length > 0) {
      const sysVars = {
        ethPrice: this.ethPrice,
        pethPrice: this.pethPrice,
        liquidationRatio: this.liquidationRatio,
        liquidationPenalty: this.liquidationPenalty,
        stabilityFee: this.stabilityFee
      };
      for (let i = 0; i < this.cdps.length; i++) {
        const makerCDP = new MakerCDP(this.cdps[i], this.maker, this.priceService, this.cdpService, sysVars);
        this.availableCdps[this.cdps[i]] = await makerCDP.init(this.cdps[i]);
        // this.availableCdps[this.cdps[i]] = await this.getCdp(this.cdps[i]);
        console.log(this.availableCdps); // todo remove dev item
      }
      this.cdpDetailsLoaded = true;
      this.gotoImport();
    } else {
      this.gotoCreate();
    }
    console.log('cdps', cdps); // todo remove dev item
  },
  methods: {
    gotoHome() {
      this.$router.push({
        name: 'Maker'
      });
    },
    gotoCreate() {
      this.$router.push({
        name: 'create'
      });
    },
    gotoImport() {
      if (this.cdps.length > 1) {
        this.$router.push({
          name: 'select'
        });
      } else if (this.cdps.length === 1) {
        this.$router.push({
          name: 'manage',
          params: {
            cdpId: this.cdps[0]
          }
        });
      }
    },
    calcMinCollatRatio(priceFloor) {
      return bnOver(this.ethPrice, this.liquidationRatio, priceFloor);
    },
    calcDrawAmt(principal, collatRatio) {
      return Math.floor(
        bnOver(principal, this.ethPrice, collatRatio).toNumber()
      );
    },
    calcCollatRatio(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return 0;
      return bnOver(this.ethPrice, ethQty, daiQty);
    },
    calcLiquidationPrice(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return 0;
      const getInt = parseInt(this.ethPrice);
      for (let i = getInt; i > 0; i--) {
        const atValue = bnOver(i, ethQty, daiQty).lte(this.liquidationRatio);
        if (atValue) {
          return i;
        }
      }
    },
    async getCdp(id) {
      const cdpDetails = {};
      const cdp = await this.maker.getCdp(id);
      const liqPrice = await cdp.getLiquidationPrice();
      cdpDetails.liqPrice = liqPrice.toBigNumber().toFixed(2);
      cdpDetails.isSafe = await cdp.isSafe();
      cdpDetails.debtValue = (await cdp.getDebtValue()).toBigNumber();
      console.log(cdpDetails.debtValue.toString()); // todo remove dev item
      cdpDetails.collatRatio = await cdp.getCollateralizationRatio();
      cdpDetails.ethCollateral = (await cdp.getCollateralValue()).toBigNumber();
      cdpDetails.pethCollateral = (await cdp.getCollateralValue(
        Maker.PETH
      )).toBigNumber();
      cdpDetails.usdCollateral = (await cdp.getCollateralValue(
        Maker.USD
      )).toBigNumber();
      cdpDetails.maxEthDraw = bnOver(
        this.liquidationRatio,
        cdpDetails.usdCollateral,
        this.ethPrice
      ).toString();
      cdpDetails.maxPethDraw = bnOver(
        this.pethPrice,
        cdpDetails.pethCollateral,
        this.liquidationRatio
      ).toString();
      cdpDetails.maxDaiDraw = bnOver(
        this.ethPrice,
        cdpDetails.ethCollateral,
        this.liquidationRatio
      )
        .minus(cdpDetails.debtValue)
        .toString();

      console.log(cdpDetails.maxDaiDraw.toString()); // todo remove dev item
      return cdpDetails;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerDai.scss';
</style>

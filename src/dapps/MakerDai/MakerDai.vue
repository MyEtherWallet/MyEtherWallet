<template>
  <div class="register-domain-container">
    <!--<back-button />-->
    <button @click="gotoCreate">Create</button>
    <button @click="gotoImport">Manage</button>
    <button @click="refresh">Refresh</button>
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
      :tokens-with-balance="tokensWithBalance"
      @cdpOpened="addCdp"
      @cdpClosed="removeCdp"
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
import MewPlugin from './dai-plugin-mew';

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
      targetPrice: 0,
      priceFloor: 0,
      ethQty: 0,
      daiQty: 0,
      cdps: [],
      availableCdps: {},
      cdpDetailsLoaded: false,
      makerCdp: {}
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
    },
    minEthDeposit() {
      if (this.daiQty <= 0) return 0;
      return bnOver(this.liquidationRatio, this.daiQty, this.ethPrice);
    }
  },
  async mounted() {
    this.gotoHome();
    const MewMakerPlugin = MewPlugin(
      this.web3,
      this.account.address,
      async () => {
        // eslint-disable-next-line
        console.log('do update'); // todo remove dev item
        let afterClose = false;
        for (let idProp in this.availableCdps) {
          if (this.availableCdps[idProp].needsUpdate) {
            if (this.availableCdps[idProp].closing) {
              afterClose = true;
              delete this.availableCdps[idProp];
              this.cdps = this.cdps.filter(item => item !== idProp);
            } else {
              console.log('UPDATE CDP', idProp); // todo remove dev item
              await this.availableCdps[idProp].update();
            }
          }
        }
        if (afterClose) {
          this.gotoImport();
        }
      }
    );
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
    await this.maker.authenticate();
    this.priceService = this.maker.service('price');
    this.cdpService = await this.maker.service('cdp');

    // this.ethPrice = toBigNumber(
    //   (await this.priceService.getEthPrice()).toNumber()
    // );
    this.ethPrice = toBigNumber(132.93);

    this.pethPrice = toBigNumber(
      (await this.priceService.getPethPrice()).toNumber()
    );

    this.targetPrice = toBigNumber(
      (await this.cdpService.getTargetPrice()).toNumber()
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

    this.wethToPethRatio = toBigNumber(
      await this.priceService.getWethToPethRatio()
    );

    this.cdps = await this.locateCdps();

    if (this.cdps.length > 0) {
      await this.loadCdpDetails();
      this.cdpDetailsLoaded = true;
      this.makerActive = true;
      if (this.$route.name !== 'create') {
        this.gotoImport();
      }
    } else {
      this.gotoCreate();
    }
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
        // eslint-disable-next-line
        console.log('go to select'); // todo remove dev item
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
    addCdp(vals) {
      this.availableCdps[vals.id] = vals.maker;
    },
    removeCdp(vals) {
      try {
        delete this.availableCdps[vals.id];
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    },
    async refresh() {
      this.cdps = await this.locateCdps();
      console.log(this.cdps); // todo remove dev item
      const newCdps = this.cdps.filter(
        item => !Object.keys(this.availableCdps).includes(item)
      );
      const sysVars = {
        ethPrice: this.ethPrice,
        pethPrice: this.pethPrice,
        targetPrice: this.targetPrice,
        liquidationRatio: this.liquidationRatio,
        liquidationPenalty: this.liquidationPenalty,
        stabilityFee: this.stabilityFee,
        wethToPethRatio: this.wethToPethRatio
      };
      for (let i = 0; i < newCdps.length; i++) {
        const makerCDP = new MakerCDP(
          newCdps[i],
          this.maker,
          this.priceService,
          this.cdpService,
          sysVars
        );
        this.availableCdps[newCdps[i]] = await makerCDP.init(newCdps[i]);
      }
      for (let idProp in this.availableCdps) {
        if (this.availableCdps[idProp].needsUpdate) {
          await this.availableCdps[idProp].update();
        }
      }
      this.gotoImport();
    },
    async locateCdps() {
      const directCdps = await this.maker.getCdpIds(
        this.account.address //proxy
      );
      console.log(directCdps); // todo remove dev item
      const proxy = await this.maker
        .service('proxy')
        .getProxyAddress(this.account.address);
      console.log(proxy); // todo remove dev item
      let searchAddress;
      if (proxy) {
        searchAddress = proxy;
      } else {
        searchAddress = this.account.address;
      }
      const cdps = await this.maker.getCdpIds(
        searchAddress //proxy
      );

      return cdps.concat(directCdps);
    },
    async loadCdpDetails() {
      const sysVars = {
        ethPrice: this.ethPrice,
        pethPrice: this.pethPrice,
        targetPrice: this.targetPrice,
        liquidationRatio: this.liquidationRatio,
        liquidationPenalty: this.liquidationPenalty,
        stabilityFee: this.stabilityFee,
        wethToPethRatio: this.wethToPethRatio
      };
      for (let i = 0; i < this.cdps.length; i++) {
        const makerCDP = new MakerCDP(
          this.cdps[i],
          this.maker,
          this.priceService,
          this.cdpService,
          sysVars
        );
        this.availableCdps[this.cdps[i]] = await makerCDP.init(this.cdps[i]);
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerDai.scss';
</style>

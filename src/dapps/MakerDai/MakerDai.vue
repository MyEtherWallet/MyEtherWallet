<template>
  <div class="container-maker">
    <interface-container-title :title="'MAKER'" />

    <!--<back-button />-->
    <!--<button @click="gotoCreate">Create</button>-->
    <!--<button @click="gotoImport">Manage</button>-->
    <!--<button @click="refresh">Refresh</button>-->
    <div v-show="makerActive" class="buttons-container">
      <div v-if="showCreate" class="dapps-button">
        <!--<img :src="supported ? icon : iconDisabled" />-->
        <div @click="gotoCreate">
          <h4>Create</h4>
        </div>
      </div>
      <div v-if="showManage" class="dapps-button">
        <!--<img :src="supported ? icon : iconDisabled" />-->
        <div @click="gotoImport">
          <h4>Manage</h4>
        </div>
      </div>
      <!--      <div class="dapps-button">
              &lt;!&ndash;<img :src="supported ? icon : iconDisabled" />&ndash;&gt;
              <div @click="gotoImport">
                <h4>Migrate</h4>
              </div>
            </div>-->
      <div v-if="showRefresh" class="dapps-button">
        <!--<img :src="supported ? icon : iconDisabled" />-->
        <div @click="refresh">
          <h4>Refresh</h4>
        </div>
      </div>
    </div>
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
      :proxy-service="proxyService"
      :cdps="cdps"
      :available-cdps="availableCdps"
      :cdp-details-loaded="cdpDetailsLoaded"
      :tokens-with-balance="tokensWithBalance"
      @cdpOpened="addCdp"
      @cdpClosed="removeCdp"
    >
    </router-view>
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
      proxyService: {},
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
      cdpsWithoutProxy: [],
      availableCdps: {},
      cdpDetailsLoaded: false,
      migrationInProgress: false,
      makerCdp: {}
    };
  },
  watch: {
    ['account.address']() {
      this.setup();
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
    },
    showManage() {
      return this.cdps.length > 1 || this.cdpsWithoutProxy.length > 1;
    },
    showRefresh() {
      return this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0;
    },
    showCreate() {
      return this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0;
    }
  },
  async mounted() {
    await this.setup();
  },
  methods: {
    async setup() {
      this.gotoHome();
      const MewMakerPlugin = MewPlugin(
        this.web3,
        this.account.address,
        async () => {
          // eslint-disable-next-line
          console.log('do update'); // todo remove dev item
          await this.doUpdate()
          // let afterClose = false;
          // for (let idProp in this.availableCdps) {
          //   if (this.availableCdps[idProp].needsUpdate) {
          //     if (this.availableCdps[idProp].closing) {
          //       afterClose = true;
          //       delete this.availableCdps[idProp];
          //       this.cdps = this.cdps.filter(item => item !== idProp);
          //     } else if(this.availableCdps[idProp].migrateCdpActive){
          //       await this.availableCdps[idProp].migrateCdpComplete()
          //     } else {
          //       console.log('UPDATE CDP', idProp); // todo remove dev item
          //       this.availableCdps[idProp] = await this.availableCdps[idProp].update();
          //     }
          //   }
          // }
          // if (afterClose) {
          //   this.gotoImport();
          // }
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
      this.proxyService = await this.maker.service('proxy');

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

      const { withProxy, withoutProxy } = await this.locateCdps();
      this.cdps = withProxy;
      this.cdpsWithoutProxy = withoutProxy;

      if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
        await this.loadCdpDetails();
        this.cdpDetailsLoaded = true;
        this.makerActive = true;
        console.log(this.$route); // todo remove dev item
        if (this.$route.name !== 'create' && this.$route.path.includes('maker-dai')) {
          this.gotoImport();
        }
      } else {
        this.gotoCreate();
      }
    },
    gotoHome() {
      this.$router.push({
        name: 'Maker'
      });
    },
    gotoCreate() {
      if(this.$route.path.includes('maker-dai')) {
        this.$router.push({
          name: 'create'
        });
      }
    },
    gotoImport() {
      if(this.$route.path.includes('maker-dai')){
        if (this.showManage) {
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
        } else if (this.cdpsWithoutProxy.length === 1) {
          this.$router.push({
            name: 'migrate',
            params: {
              cdpId: this.cdpsWithoutProxy[0]
            }
          });
        } else {
          this.gotoCreate();
        }
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
      console.log('refresh'); // todo remove dev item
      const { withProxy, withoutProxy } = await this.locateCdps();
      this.cdps = withProxy;

      const newCdps = this.cdps.filter(
        item => !Object.keys(this.availableCdps).includes(item)
      );
      for (let i = 0; i < newCdps.length; i++) {
        this.availableCdps[newCdps[i]] = await this.buildCdpObject(newCdps[i]);
      }
      console.log(withProxy.length, withoutProxy.length); // todo remove dev item
      if(withProxy.length > 0 || withoutProxy.length > 0){
        await this.doUpdate()
      } else {
        this.availableCdps = {};
        this.gotoCreate();
      }
    },
    async doUpdate(){
      console.log('updating'); // todo remove dev item
      let afterClose = false;
      this.migrationInProgress = false;
      for (let idProp in this.availableCdps) {
        if (this.availableCdps[idProp].needsUpdate) {
          if (this.availableCdps[idProp].closing) {
            afterClose = true;
            this.$delete(this.availableCdps, idProp);
            this.cdps = this.cdps.filter(item => item !== idProp);
          } else if(this.availableCdps[idProp].migrateCdpActive){
            this.migrationInProgress = true;
            await this.availableCdps[idProp].migrateCdpComplete();
          } else {
            console.log('UPDATE CDP', idProp); // todo remove dev item
            this.availableCdps[idProp] = await this.availableCdps[idProp].update();
          }
        }
      }
      if (afterClose) {
        console.log('after close or move'); // todo remove dev item
        const { withProxy, withoutProxy } = await this.locateCdps();
        this.cdps = withProxy;
        this.cdpsWithoutProxy = withoutProxy;
        this.gotoImport();
      }

      const cdpKeys = Object.keys(this.availableCdps);
      if(cdpKeys.length === 1){
        if(this.availableCdps[cdpKeys[0]].migrateCdpStage === 3){
          this.availableCdps[cdpKeys[0]].migrateCdpStage = 4;
          this.migrationInProgress = false;
          console.log('migrate to manage'); // todo remove dev item
          this.$router.push({
            name: 'manage',
            params: {
              cdpId: cdpKeys[0]
            }
          });
        }
      } else if(this.migrationInProgress){
        console.log('migrate to refresh to import'); // todo remove dev item
        this.migrationInProgress = false;
        await this.refresh();
        this.gotoImport();
      }
    },
    async locateCdpsWithoutProxy() {
      const directCdps = await this.maker.getCdpIds(
        this.account.address //proxy
      );
      const directCdpsCheckSum = await this.maker.getCdpIds(
        toChecksumAddress(this.account.address)
      );

      return directCdps.concat(directCdpsCheckSum);
    },
    async locateCdpsProxy() {
      const proxy = await this.maker
        .service('proxy')
        .getProxyAddress(this.account.address);

      return await this.maker.getCdpIds(
        proxy
      );
    },
    async locateCdps() {
      const directCdps = await this.locateCdpsWithoutProxy();
      console.log(directCdps); // todo remove dev item

      const cdps = await this.locateCdpsProxy();

      return { withProxy: cdps, withoutProxy: directCdps };
    },
    async loadCdpDetails() {

      for (let i = 0; i < this.cdps.length; i++) {
        this.availableCdps[this.cdps[i]] = await this.buildCdpObject(this.cdps[i]);
      }
      for (let i = 0; i < this.cdpsWithoutProxy.length; i++) {
        this.availableCdps[this.cdpsWithoutProxy[i]] = await this.buildCdpObject(this.cdpsWithoutProxy[i], { noProxy: true });
      }
    },
    async buildCdpObject(cdpId, options = {}) {
      const sysVars = {
        ethPrice: this.ethPrice,
        pethPrice: this.pethPrice,
        targetPrice: this.targetPrice,
        liquidationRatio: this.liquidationRatio,
        liquidationPenalty: this.liquidationPenalty,
        stabilityFee: this.stabilityFee,
        wethToPethRatio: this.wethToPethRatio,
        currentAddress: this.account.address,
        ...options
      };

      const services = {
        priceService:   this.priceService,
        cdpService: this.cdpService,
        proxyService: this.proxyService
      }

      const makerCDP = new MakerCDP(
        cdpId,
        this.maker,
        services,
        sysVars
      );
      return await makerCDP.init(cdpId);
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

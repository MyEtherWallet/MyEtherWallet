<template>
  <div class="container-maker">
    <interface-container-title :title="'MAKER'" />

    <div v-show="makerActive" class="buttons-container">
      <div v-if="showCreate" class="dapps-button">
        <div @click="gotoCreate">
          <h4>Create</h4>
        </div>
      </div>
      <div v-if="showManage">
        <div class="dapps-button" @click="goToManage">
          <h4>List All</h4>
        </div>
      </div>
      <div v-if="showRefresh">
        <div class="dapps-button" @click="refresh">
          <h4>Refresh</h4>
        </div>
      </div>
      <div v-if="!hasProxy && !onCreate">
        <div class="dapps-button" @click="buildProxy">
          <h4>Create Proxy</h4>
        </div>
      </div>
      <div v-if="showCdpMigrateButtons">
        <div v-for="(value, idx) in cdpsWithoutProxy" :key="idx + value">
          <div class="dapps-button">
            <div @click="migrateCdp(value)">
              <h4>Migrate CDP {{ value }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="makerActive" class="buttons-container">
      <div v-for="(value, idx) in cdps" :key="idx + value">
        <div class="dapps-button" @click="openManage(value)">
          <h4>CDP #{{ value }}</h4>
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
      :maker="maker"
      :price-service="priceService"
      :cdp-service="cdpService"
      :proxy-service="proxyService"
      :cdps="cdps"
      :available-cdps="availableCdps"
      :cdp-details-loaded="cdpDetailsLoaded"
      :tokens-with-balance="tokensWithBalance"
      :migration-in-progress="migrationInProgress"
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
      currentProxy: null,
      migrationInProgress: {},
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
    maxDaiDraw() {
      if (this.ethQty <= 0) return 0;
      return bnOver(this.ethPrice, this.ethQty, this.liquidationRatio);
    },
    minEthDeposit() {
      if (this.daiQty <= 0) return 0;
      return bnOver(this.liquidationRatio, this.daiQty, this.ethPrice);
    },
    showManage() {
      return (
        this.cdps.length > 1 ||
        this.cdpsWithoutProxy.length > 1 ||
        (this.cdps.length >= 1 && this.cdpsWithoutProxy.length >= 1)
      );
    },
    showRefresh() {
      return this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0;
    },
    showCreate() {
      return this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0;
    },
    onCreate() {
      return this.$route.name === 'create';
    },
    hasProxy() {
      return this.currentProxy !== null;
    },
    showCdpMigrateButtons() {
      return this.hasProxy && this.cdpsWithoutProxy.length >= 1;
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
          await this.doUpdate();
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
        // log: true
      });
      await this.maker.authenticate();
      this.priceService = this.maker.service('price');
      this.cdpService = await this.maker.service('cdp');
      this.proxyService = await this.maker.service('proxy');

      this.ethPrice = toBigNumber(
        (await this.priceService.getEthPrice()).toNumber()
      );
      // this.ethPrice = toBigNumber(132.93);

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

      this.currentProxy = await this.proxyService.currentProxy();

      const { withProxy, withoutProxy } = await this.locateCdps();
      this.cdps = withProxy;
      this.cdpsWithoutProxy = withoutProxy;

      if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
        await this.loadCdpDetails();
        this.cdpDetailsLoaded = true;
        this.makerActive = true;
        if (
          this.$route.name !== 'create' &&
          this.$route.path.includes('maker-dai')
        ) {
          this.goToManage();
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
      if (this.$route.path.includes('maker-dai')) {
        this.$router.push({
          name: 'create'
        });
      }
    },
    goToManage() {
      if (this.$route.path.includes('maker-dai')) {
        if (this.showManage) {
          // eslint-disable-next-line
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
    openManage(cdpId) {
      if (this.$route.path.includes('maker-dai')) {
        this.$router.push({
          name: 'manage',
          params: {
            cdpId: cdpId
          }
        });
      }
    },
    addCdp(vals) {
      this.availableCdps[vals.id] = vals.maker;
    },
    removeCdp(vals) {
      const cdpId = vals.id || vals;
      try {
        this.$delete(this.availableCdps, cdpId);
        // delete this.availableCdps[vals.id];
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    },
    async buildProxy() {
      const currentProxy = await this.proxyService.currentProxy();
      if (!currentProxy) {
        await this.proxyService.build();
        this.proxyAddress = await this.proxyService.currentProxy();
        return this.proxyAddress;
      }
      this.proxyAddress = await this.proxyService.currentProxy();
      return this.proxyAddress;
    },
    async migrateCdp(cdpId) {
      const currentProxy = await this.proxyService.currentProxy();
      if (currentProxy) {
        await this.cdpService.give(cdpId, currentProxy);
      }
    },
    async refresh() {
      const { withProxy, withoutProxy } = await this.locateCdps();
      this.cdps = withProxy;
      this.cdpsWithoutProxy = withoutProxy;

      const newCdps = this.cdps.filter(
        item => !Object.keys(this.availableCdps).includes(item)
      );

      const newCdpsWithoutProxy = this.cdpsWithoutProxy.filter(
        item => !Object.keys(this.availableCdps).includes(item)
      );

      for (let i = 0; i < newCdps.length; i++) {
        this.availableCdps[newCdps[i]] = await this.buildCdpObject(newCdps[i]);
      }

      for (let i = 0; i < newCdpsWithoutProxy.length; i++) {
        this.availableCdps[newCdpsWithoutProxy[i]] = await this.buildCdpObject(
          newCdpsWithoutProxy[i],
          { noProxy: true }
        );
      }

      if (withProxy.length > 0 || withoutProxy.length > 0) {
        await this.doUpdate();
        this.goToManage();
      } else {
        this.availableCdps = {};
        this.gotoCreate();
      }
    },
    async doUpdate(withRefresh = false) {
      this.proxyAddress = await this.proxyService.currentProxy();
      let afterClose = false;
      for (let idProp in this.availableCdps) {
        if (this.availableCdps[idProp].needsUpdate) {
          if (this.availableCdps[idProp].closing) {
            afterClose = true;
            this.removeCdp(idProp)
            // this.$delete(this.availableCdps, idProp);
            this.cdps = this.cdps.filter(item => item !== idProp);
          } else {
            console.log('UPDATE CDP', idProp); // todo remove dev item
            this.availableCdps[idProp] = await this.availableCdps[
              idProp
            ].update();
          }
        }
      }

      if (afterClose || this.migrationInProgress) {
        console.log('after close or move'); // todo remove dev item
        const { withProxy, withoutProxy } = await this.locateCdps();
        this.cdps = withProxy;
        this.cdpsWithoutProxy = withoutProxy;
        this.goToManage();
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

      return await this.maker.getCdpIds(proxy);
    },
    async locateCdps() {
      const directCdps = await this.locateCdpsWithoutProxy();
      console.log(directCdps); // todo remove dev item

      const cdps = await this.locateCdpsProxy();

      return { withProxy: cdps, withoutProxy: directCdps };
    },
    async loadCdpDetails() {
      for (let i = 0; i < this.cdps.length; i++) {
        this.availableCdps[this.cdps[i]] = await this.buildCdpObject(
          this.cdps[i]
        );
      }
      for (let i = 0; i < this.cdpsWithoutProxy.length; i++) {
        this.availableCdps[
          this.cdpsWithoutProxy[i]
        ] = await this.buildCdpObject(this.cdpsWithoutProxy[i], {
          noProxy: true
        });
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
        priceService: this.priceService,
        cdpService: this.cdpService,
        proxyService: this.proxyService
      };

      const makerCDP = new MakerCDP(cdpId, this.maker, services, sysVars);
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

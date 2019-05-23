<template>
  <div class="container-maker">
    <interface-container-title :title="'MAKER'">
      <template v-slot:right>
        <div style="padding-left: 20px; cursor: pointer;">
          <i
            v-show="showRefresh"
            class="fa fa-refresh"
            @click="refreshExternal"
          ></i>
        </div>
        <div v-if="showMoveOrClose" class="header-buttons-container">
          <div class="inner-container">
            <button class="move-btn" @click="showMove">
              <h4>Move CDP</h4>
            </button>
            <div v-if="!((!hasProxy && !onCreate) || showCdpMigrateButtons)">
              <button class="close-btn" @click="showClose">
                <h4>Close CDP</h4>
              </button>
            </div>
          </div>
        </div>
      </template>
    </interface-container-title>

    <div v-show="makerActive" class="buttons-container">
      <div v-if="!hasProxy && !onCreate">
        <i class="fa fa-question-circle"></i>
        <div class="dapps-button" @click="buildProxy">
          <h4>Create Proxy</h4>
        </div>
      </div>
      <div v-if="showCdpMigrateButtons">
        <i class="fa fa-question-circle"></i>
        <div v-for="(value, idx) in cdpsWithoutProxy" :key="idx + value">
          <div class="dapps-button">
            <div @click="migrateCdpExternal(value)">
              <h4>Migrate CDP {{ value }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="makerActive && listCdps" class="buttons-container">
      <div v-for="(value, idx) in cdps" :key="idx + value">
        <div class="dapps-button">
          <div @click="openManage(value)">
            <h4>CDP #{{ value }}</h4>
          </div>
        </div>
      </div>
    </div>
    <router-view
      :build-empty="buildEmpty"
      :maker-manager="makerManager"
      :maker-active="makerActive"
      :eth-price="ethPrice"
      :peth-price="pethPrice"
      :peth-min="pethMin"
      :weth-to-peth-ratio="wethToPethRatio"
      :liquidation-penalty="liquidationPenalty"
      :stability-fee="stabilityFee"
      :liquidation-ratio="liquidationRatio"
      :price-service="priceService"
      :cdp-service="cdpService"
      :proxy-service="proxyService"
      :cdps="cdps"
      :available-cdps="availableCdps"
      :cdp-details-loaded="cdpDetailsLoaded"
      :tokens-with-balance="tokensWithBalance"
      :migration-in-progress="migrationInProgress"
      :open-close-modal="openCloseModal"
      :open-move-modal="openMoveModal"
      :values-updated="valuesUpdated"
      :get-cdp="getCdp"
      :has-cdp="hasCdp"
      @cdpOpened="addCdp"
      @cdpClosed="removeCdp"
      @modalHidden="modalHidden"
      @managerUpdate="doUpdate"
    >
    </router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import CloseCdpModal from './components/CloseCdpModal';
import MoveCdpModal from './components/MoveCdpModal';
import BigNumber from 'bignumber.js';
import Maker from '@makerdao/dai';
import { Toast } from '@/helpers';
import MakerCDP from './MakerCDP';
import { toChecksumAddress } from '@/helpers/addressUtils';

// import MakerManager from './MakerManager';
import MewPlugin from 'mew-maker-plugin';
const { MKR, DAI } = Maker;

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
    blockie: Blockie,
    'back-button': BackButton,
    'close-cdp-modal': CloseCdpModal,
    'move-cdp-modal': MoveCdpModal
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
      afterUpdate: [],
      activeCdps: {},
      activeCdp: {},
      availableCdps: {},
      cdps: [],
      cdpsWithoutProxy: [],
      cdpService: {},
      cdpDetailsLoaded: false,
      currentProxy: null,
      creatingCdp: false,
      daiPrice: 0,
      daiQty: 0,
      ethPrice: toBigNumber(0),
      ethQty: 0,
      liquidationRatio: toBigNumber(0),
      liquidationPenalty: toBigNumber(0),
      makerActive: false,
      makerCdp: {},
      makerManager: {},
      migrationInProgress: {},
      openCloseModal: false,
      openMoveModal: false,
      proxyService: {},
      pethPrice: toBigNumber(0),
      pethMin: toBigNumber(0),
      priceService: {},
      priceFloor: 0,
      stabilityFee: toBigNumber(0),
      sysVars: {},
      sysServices: {},
      targetPrice: 0,
      valuesUpdated: 0,
      wethToPethRatio: toBigNumber(0)
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    maxDaiDraw() {
      if (this.ethQty <= 0) return 0;
      return bnOver(this.ethPrice, this.ethQty, this.liquidationRatio);
    },
    minEthDeposit() {
      if (this.daiQty <= 0) return 0;
      return bnOver(this.liquidationRatio, this.daiQty, this.ethPrice);
    },
    showMoveOrClose() {
      return this.$route.name === 'manage' || this.$route.name === 'migrate';
    },
    showManage() {
      return (
        this.listCdps ||
        (this.cdps.length >= 1 && this.cdpsWithoutProxy.length >= 1)
      );
    },
    showRefresh() {
      return this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0;
    },
    onCreate() {
      return this.$route.name === 'create';
    },
    showCdpMigrateButtons() {
      return this.hasProxy && this.cdpsWithoutProxy.length >= 1;
    },
    listCdps() {
      return this.cdps.length > 1 || this.cdpsWithoutProxy.length > 1;
    },
    hasProxy() {
      return this._proxyAddress !== null;
    }
  },
  watch: {
    ['account.address']() {
      this.makerActive = false;
      this.setup();
    }
  },
  destroyed() {
    this.maker.service('web3').disconnect();
    this.priceService = {};
    this.cdpService = {};
    this.proxyService = {};
    this.availableCdps = {};
    this.activeCdp = {};
    this.makerCdp = {};
    // this.makerManager = {};
    this.sysVars = {};
    this.sysServices = {};
  },
  async mounted() {
    await this.setup();
  },
  methods: {
    showClose() {
      this.openCloseModal = true;
    },
    showMove() {
      this.openMoveModal = true;
    },
    modalHidden() {
      this.openCloseModal = false;
      this.openMoveModal = false;
    },
    async setup() {
      const web3 = this.web3;
      const _self = this;
      this.gotoHome();
      const MewMakerPlugin = MewPlugin(
        web3,
        _self.account.address,
        async () => {
          if (_self.$route.path.includes('maker-dai')) {
            await _self.doUpdateExternal();
          }
        }
      );
      this.maker = await Maker.create('inject', {
        provider: { inject: web3.currentProvider },
        plugins: [MewMakerPlugin],
        accounts: {
          myLedger1: { type: 'mew' }
        }
      });

      await this.init();

      this.currentProxy = this.getProxy();
      if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
        this.cdpDetailsLoaded = true;
        this.makerActive = true;
        this.makerManager = this;
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
        if (this.cdps.length === 1) {
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
        } else if (this.showManage) {
          // eslint-disable-next-line
          this.$router.push({
            name: 'select'
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
    async buildEmpty() {
      // const services = {
      //   web3: this.web3
      // };
      // console.log(this.makerManager); // todo remove dev item
      return await this.buildCdpObject(null);
      // this.makerCDP = new MakerCDP(null, this.makerManager, services, {});
    },
    addCdp() {
      this.creatingCdp = true;
    },
    removeCdp(vals) {
      try {
        delete this.availableCdps[vals.id];
        Toast.responseHandler('CDP Closed', Toast.INFO);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    },
    async migrateCdpExternal(cdpId) {
      this.afterUpdate.push(this.goToManage);
      this.afterUpdate.push(() => {
        if (this.cdpsWithoutProxy.length === 0) {
          this.cdpsWithoutProxy = [];
        }
      });
      await this.migrateCdp(cdpId);
    },
    async runAfterUpdateActions() {
      for (let i = 0; i < this.afterUpdate.length; i++) {
        const item = this.afterUpdate[i];
        if (Array.isArray(item)) {
          const func = item.shift();
          await func.apply(this, item);
        } else {
          await item();
        }
      }
    },
    async refreshExternal() {
      // eslint-disable-next-line
      await this.doUpdateExternal();
    },
    async doUpdateExternal() {
      const complete = await this.doUpdate(this.$route.name);

      if (this.creatingCdp) {
        this.creatingCdp = false;
        await this.updateActiveCdp();
        Toast.responseHandler('CDP Created', Toast.INFO);
      }

      if (complete) {
        await this.runAfterUpdateActions();
        this.valuesUpdated++;
        Toast.responseHandler('CDP Updated', Toast.INFO);
      } else {
        this.valuesUpdated++;
        Toast.responseHandler('Update encountered an issue', Toast.INFO);
      }
    },
    //============================================================
    // prior in separate
    async init() {
      await this.maker.authenticate();
      this._priceService = this.maker.service('price');
      this._cdpService = await this.maker.service('cdp');
      this._proxyService = await this.maker.service('proxy');
      this._tokenService = await this.maker.service('token');

      this.pethMin = toBigNumber(0.005);

      this.ethPrice = toBigNumber(
        (await this._priceService.getEthPrice()).toNumber()
      );

      const pethPrice = await this._priceService.getPethPrice();
      const targetPrice = await this._priceService.getPethPrice();
      const liquidationRatio = await this._cdpService.getLiquidationRatio();
      const liquidationPenalty = await this._cdpService.getLiquidationPenalty();
      const stabilityFee = await this._cdpService.getAnnualGovernanceFee();
      const wethToPethRatio = await this._priceService.getWethToPethRatio();

      this._pethPrice = toBigNumber(pethPrice.toNumber());

      this._targetPrice = toBigNumber(targetPrice.toNumber());

      this.liquidationRatio = toBigNumber(liquidationRatio);
      this.liquidationPenalty = toBigNumber(liquidationPenalty);
      this.stabilityFee = toBigNumber(stabilityFee);

      this.wethToPethRatio = toBigNumber(wethToPethRatio);
      this._proxyAddress = await this._proxyService.currentProxy();

      this._daiToken = this._tokenService.getToken(DAI);
      this.daiBalance = (await this._daiToken.balance()).toBigNumber();
      this._mkrToken = this._tokenService.getToken(MKR);
      this.mkrBalance = (await this._mkrToken.balance()).toBigNumber();

      await this.checkAllowances();

      // this.services = {
      //   priceService: this._priceService,
      //   cdpService: this._cdpService,
      //   proxyService: this._proxyService,
      //   tokenService: this._tokenService
      // };
      //
      // this.values = {
      //   pethPrice: this._pethPrice,
      //
      // }

      const { withProxy, withoutProxy } = await this.locateCdps();
      this.cdps = withProxy;
      this.cdpsWithoutProxy = withoutProxy;

      if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
        await this.loadCdpDetails();
      }
    },

    async getProxy() {
      this._proxyAddress = await this._proxyService.currentProxy();
      if (!this._proxyAddress) {
        this._proxyAddress = await this._proxyService.getProxyAddress(
          this.account.address
        );
        if (this._proxyAddress) this.noProxy = false;
      }
      return this._proxyAddress;
    },

    hasCdp(cdpId) {
      return Object.keys(this.activeCdps).includes(
        toBigNumber(cdpId).toString()
      );
    },

    getCdp(cdpId) {
      return this.activeCdps[cdpId];
    },

    async refresh() {
      await this.doUpdate();
    },

    async updateActiveCdp() {
      console.log(this.cdps); // todo remove dev item
      console.log(Object.keys(this.activeCdps)); // todo remove dev item
      const currentCdpIds = Object.keys(this.activeCdps);
      await this.locateCdps();

      const newCdps = this.cdps.filter(
        item => !Object.keys(this.activeCdps).includes(item.toString())
      );
      console.log('should only include newly found cdps'); // todo remove dev item
      console.log(this.cdps.filter(
        item => !Object.keys(this.activeCdps).includes(item.toString())
      )); // todo remove dev item

      console.log('newCdps', newCdps); // todo remove dev item
      const newCdpsWithoutProxy = this.cdpsWithoutProxy.filter(
        item => !Object.keys(this.activeCdps).includes(item.toString())
      );

      console.log('newCdpsWithoutProxy', newCdpsWithoutProxy); // todo remove dev item
      const removedCdps = currentCdpIds.filter(
        item =>
          !(this.cdps.includes(item.toString()) || this.cdpsWithoutProxy.includes(item.toString()))
      );

      if (removedCdps.length > 0) {
        removedCdps.forEach(item => delete this.activeCdps[item]);
      }

      for (let i = 0; i < newCdps.length; i++) {
        this.activeCdps[newCdps[i]] = await this.buildCdpObject(newCdps[i]);
      }

      for (let i = 0; i < newCdpsWithoutProxy.length; i++) {
        this.activeCdps[newCdpsWithoutProxy[i]] = await this.buildCdpObject(
          newCdpsWithoutProxy[i],
          { noProxy: true }
        );
      }

      if (this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0) {
        this.gotoCreate();
      }
    },

    async doUpdate(route) {
      this._proxyAddress = await this.getProxy();
      let afterClose = false;
      const afterOpen = route === 'create';
      await this.updateActiveCdp();

      for (const idProp in this.activeCdps) {
        if (this.activeCdps[idProp].needsUpdate) {
          if (this.activeCdps[idProp].closing) {
            afterClose = true;
            delete this.activeCdps[idProp];
            this.cdps = this.cdps.filter(item => item !== idProp);
            this.cdpsWithoutProxy = this.cdpsWithoutProxy.filter(
              item => item !== idProp
            );
          } else if (this.activeCdps[idProp].opening) {
            await this.activeCdps[idProp].updateValues();
          } else {
            /*this.activeCdps[idProp] = */await this.activeCdps[idProp].update();
          }
        }
      }

      this.daiBalance = (await this._daiToken.balance()).toBigNumber();
      this.mkrBalance = (await this._mkrToken.balance()).toBigNumber();
      await this.checkAllowances();

      if (afterClose || afterOpen) {
        if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
          this.goToManage();
        } else {
          this.gotoCreate();
        }
      }
      return true;
    },

    async checkAllowances() {
      if (this._proxyAddress) {
        this._proxyAllowanceDai = (await this._daiToken.allowance(
          this.account.address,
          this._proxyAddress
        )).toBigNumber();

        this._proxyAllowanceMkr = (await this._mkrToken.allowance(
          this.account.address,
          this._proxyAddress
        )).toBigNumber();
      }
    },

    async locateCdps() {
      this.cdpsWithoutProxy = [];
      this.cdpsWithoutProxy = await this.locateCdpsWithoutProxy();
      this.cdps = [];
      this.cdps = await this.locateCdpsProxy();

      return { withProxy: this.cdps, withoutProxy: this.cdpsWithoutProxy };
    },

    async locateCdpsWithoutProxy() {
      const directCdps = await this._cdpService.getCdpIds(this.account.address);
      const directCdpsCheckSum = await this._cdpService.getCdpIds(
        toChecksumAddress(this.account.address)
      );
      return directCdps.concat(directCdpsCheckSum);
    },

    async locateCdpsProxy() {
      this._proxyAddress = await this.getProxy();
      return await this._cdpService.getCdpIds(this._proxyAddress);
    },

    async loadCdpDetails() {
      console.log('loadCdpDetails'); // todo remove dev item
      for (let i = 0; i < this.cdps.length; i++) {
        this.activeCdps[this.cdps[i]] = await this.buildCdpObject(this.cdps[i]);
      }
      for (let i = 0; i < this.cdpsWithoutProxy.length; i++) {
        this.activeCdps[this.cdpsWithoutProxy[i]] = await this.buildCdpObject(
          this.cdpsWithoutProxy[i],
          {
            noProxy: true
          }
        );
      }
    },

    async buildProxy() {
      this.creatingProxy = true;
      this._proxyAddress = await this.getProxy();
      if (!this._proxyAddress) {
        await this._proxyService.build();
        this._proxyAddress = await this._proxyService.currentProxy();
        return this._proxyAddress;
      }
      this._proxyAddress = await this._proxyService.currentProxy();
      return this._proxyAddress;
    },

    async migrateCdp(cdpId) {
      const currentProxy = await this.getProxy();
      if (currentProxy) {
        await this._cdpService.give(cdpId, currentProxy);
      }
    },

    async buildCdpObject(cdpId, options = {}) {
      console.log('buildCdpObject'); // todo remove dev item
      const sysVars = {
        ...options
      };

      const services = {
        makerManager: this,
        web3: this.web3
      };

      const makerCDP = new MakerCDP(cdpId, this, services, sysVars);
      if (cdpId) {
        return await makerCDP.init(cdpId);
      }
      return makerCDP;
    },

    // Calculations
    minEth() {
      if (this.wethToPethRatio) {
        return toBigNumber(this.pethMin).times(this.wethToPethRatio);
      }
      return '--';
    },
    toUSD(eth) {
      if (eth === undefined || eth === null) return toBigNumber(0);
      return this.ethPrice.times(toBigNumber(eth));
    },

    toPeth(eth) {
      if (!toBigNumber(eth).eq(0)) {
        return toBigNumber(eth).div(this.wethToPethRatio);
      }
      return toBigNumber(0);
    },

    calcDrawAmt(principal, collatRatio) {
      return Math.floor(
        bnOver(principal, this.ethPrice, collatRatio).toNumber()
      );
    },

    calcMinCollatRatio(priceFloor) {
      return bnOver(this.ethPrice, this.liquidationRatio, priceFloor);
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

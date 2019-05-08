<template>
  <div class="container-maker">
    <interface-container-title :title="'MAKER'">
      <template v-slot:right>
        <div style="padding-left: 20px; cursor: pointer;">
          <i v-show="showRefresh" class="fa fa-refresh" @click="refresh"></i>
        </div>
        <div v-if="showMoveOrClose" class="header-buttons-container">
          <div class="inner-container">
            <button class="move-btn" @click="showMove">
              <h4>Move CDP</h4>
            </button>
            <button class="close-btn" @click="showClose">
              <h4>Close CDP</h4>
            </button>
          </div>
        </div>
      </template>
    </interface-container-title>

    <div v-show="makerActive" class="buttons-container">
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
      :maker-manager="makerManager"
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
      :open-close-modal="openCloseModal"
      :open-move-modal="openMoveModal"
      :values-updated="valuesUpdated"
      @cdpOpened="addCdp"
      @cdpClosed="removeCdp"
      @modalHidden="modalHidden"
    >
    </router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
import MakerManager from './MakerManager';
import MewPlugin from 'mew-maker-plugin';

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
      creatingCdp: false,
      openCloseModal: false,
      openMoveModal: false,
      migrationInProgress: {},
      activeCdp: {},
      makerCdp: {},
      makerManager: {},
      sysVars: {},
      sysServices: {},
      afterUpdate: [],
      valuesUpdated: 0
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
    hasProxy() {
      return this.currentProxy !== null;
    },
    showCdpMigrateButtons() {
      return this.hasProxy && this.cdpsWithoutProxy.length >= 1;
    },
    listCdps() {
      return this.cdps.length > 1 || this.cdpsWithoutProxy.length > 1;
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
    this.maker = {};
    this.priceService = {};
    this.cdpService = {};
    this.proxyService = {};
    this.availableCdps = {};
    this.activeCdp = {};
    this.makerCdp = {};
    this.makerManager = {};
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
      this.gotoHome();
      const MewMakerPlugin = MewPlugin(
        this.web3,
        this.account.address,
        async () => {
          if (this.$route.path.includes('maker-dai')) {
            await this.doUpdate();
          }
        }
      );

      this.maker = await Maker.create('http', {
        url: this.network.url,
        provider: {
          type: 'HTTP',
          url: this.network.url
        },
        plugins: [MewMakerPlugin],
        accounts: {
          myLedger1: { type: 'mew' }
        }
        // web3: {
        //   statusTimerDelay: 10000,
        //   pollingInterval: 10000000000
        // }
        // log: true
      });

      this.makerManager = new MakerManager({
        account: this.account,
        maker: this.maker,
        routeHandlers: {
          home: this.gotoHome,
          create: this.gotoCreate,
          manage: this.goToManage
        }
      });

      await this.makerManager.init();

      this.cdps = this.makerManager.cdps;
      this.cdpsWithoutProxy = this.makerManager.cdpsWithoutProxy;
      this.availableCdps = this.makerManager.availableCdps;
      this.sysVarsFunc = this.makerManager.getSysVars;
      if (this.sysVarsFunc) {
        this.sysVars = this.makerManager.getSysVars();
        this.ethPrice = this.sysVars.ethPrice;
        this.pethPrice = this.sysVars.pethPrice;
        this.liquidationRatio = this.sysVars.liquidationRatio;
        this.liquidationPenalty = this.sysVars.liquidationPenalty;
        this.stabilityFee = this.sysVars.stabilityFee;
        this.wethToPethRatio = this.sysVars.wethToPethRatio;
        this.currentAddress = this.account.address;
      } /*else {
        throw Error('Could Not Setup Maker');
      }*/

      this.sysServicesFunc = this.makerManager.getSysServices;
      if (this.sysServicesFunc) {
        this.sysServices = this.makerManager.getSysServices();
        this.priceService = this.sysServices.priceService;
        this.cdpService = this.sysServices.cdpService;
        this.proxyService = this.sysServices.proxyService;
      } /*else {
        throw Error('Could Not Setup Maker');
      }*/

      this.currentProxy = this.makerManager.proxy;
      if (
        this.makerManager.cdps.length > 0 ||
        this.makerManager.cdpsWithoutProxy.length > 0
      ) {
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
        if (this.makerManager.cdps.length === 1) {
          this.$router.push({
            name: 'manage',
            params: {
              cdpId: this.makerManager.cdps[0]
            }
          });
        } else if (this.makerManager.cdpsWithoutProxy.length === 1) {
          this.$router.push({
            name: 'migrate',
            params: {
              cdpId: this.makerManager.cdpsWithoutProxy[0]
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
    async buildProxy() {
      await this.makerManager.buildProxy();
    },
    async migrateCdp(cdpId) {
      this.afterUpdate.push(this.goToManage);
      this.afterUpdate.push(() => {
        if (this.makerManager.cdpsWithoutProxy.length === 0) {
          this.cdpsWithoutProxy = [];
        }
      });
      await this.makerManager.migrateCdp(cdpId);
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
    async refresh() {
      // eslint-disable-next-line
      await this.doUpdate();
    },
    async doUpdate() {
      const complete = await this.makerManager.doUpdate(this.$route.name);

      if (this.creatingCdp) {
        this.creatingCdp = false;
        await this.makerManager.updateActiveCdp();
        Toast.responseHandler('CDP Created', Toast.INFO);
      }

      if (complete) {
        this.currentProxy = this.makerManager.currentProxy;
        this.availableCdps = this.makerManager.availableCdps;
        this.cdps = this.makerManager.cdpsWithProxy;
        this.cdpsWithoutProxy = this.makerManager.cdpsNoProxy;
        await this.runAfterUpdateActions();
        this.valuesUpdated++;
        Toast.responseHandler('CDP Updated', Toast.INFO);
      } else {
        this.valuesUpdated++;
        Toast.responseHandler('Update encountered an issue', Toast.INFO);
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

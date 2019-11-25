<template>
  <div class="container-maker">
    <deposit-modal
      ref="deposit"
      :values="activeValues"
      :calc-collat-ratio-dai-chg="calcCollatRatioDaiChg"
      :calc-collat-ratio-eth-chg="calcCollatRatioEthChg"
      :calc-liquidation-price-eth-chg="calcLiquidationPriceEthChg"
      :calc-liquidation-price-dai-chg="calcLiquidationPriceDaiChg"
      :get-value-or-function="getValueOrFunction"
      :active-cdp-id="activeCdpId"
      :tokens-with-balance="tokensWithBalance"
      @lockEth="lockEth"
    ></deposit-modal>
    <generate-modal
      ref="generate"
      :values="activeValues"
      :calc-collat-ratio-dai-chg="calcCollatRatioDaiChg"
      :calc-collat-ratio-eth-chg="calcCollatRatioEthChg"
      :calc-liquidation-price-eth-chg="calcLiquidationPriceEthChg"
      :calc-liquidation-price-dai-chg="calcLiquidationPriceDaiChg"
      :get-value-or-function="getValueOrFunction"
      :active-cdp-id="activeCdpId"
      :tokens-with-balance="tokensWithBalance"
      @drawDai="drawDai"
    ></generate-modal>
    <withdraw-modal
      ref="withdraw"
      :values="activeValues"
      :calc-collat-ratio-dai-chg="calcCollatRatioDaiChg"
      :calc-collat-ratio-eth-chg="calcCollatRatioEthChg"
      :calc-liquidation-price-eth-chg="calcLiquidationPriceEthChg"
      :calc-liquidation-price-dai-chg="calcLiquidationPriceDaiChg"
      :get-value-or-function="getValueOrFunction"
      :active-cdp-id="activeCdpId"
      :tokens-with-balance="tokensWithBalance"
      @approveDai="approveDai"
      @approveMkr="approveMkr"
      @freeEth="freeEth"
    ></withdraw-modal>
    <payback-modal
      ref="payback"
      :values="activeValues"
      :calc-collat-ratio-dai-chg="calcCollatRatioDaiChg"
      :calc-collat-ratio-eth-chg="calcCollatRatioEthChg"
      :calc-liquidation-price-eth-chg="calcLiquidationPriceEthChg"
      :calc-liquidation-price-dai-chg="calcLiquidationPriceDaiChg"
      :get-value-or-function="getValueOrFunction"
      :active-cdp-id="activeCdpId"
      :tokens-with-balance="tokensWithBalance"
      @approveDai="approveDai"
      @approveMkr="approveMkr"
      @wipeDai="wipeDai"
    ></payback-modal>
    <close-cdp-modal
      ref="closeCdp"
      :values="activeValues"
      :calc-collat-ratio-dai-chg="calcCollatRatioDaiChg"
      :calc-collat-ratio-eth-chg="calcCollatRatioEthChg"
      :calc-liquidation-price-eth-chg="calcLiquidationPriceEthChg"
      :calc-liquidation-price-dai-chg="calcLiquidationPriceDaiChg"
      :get-value-or-function="getValueOrFunction"
      :active-cdp-id="activeCdpId"
      :tokens-with-balance="tokensWithBalance"
      @approveDai="approveDai"
      @approveMkr="approveMkr"
      @closeCdp="closeCdp"
    >
    </close-cdp-modal>
    <move-cdp-modal
      ref="moveCdp"
      :values="activeValues"
      :calc-collat-ratio-dai-chg="calcCollatRatioDaiChg"
      :calc-collat-ratio-eth-chg="calcCollatRatioEthChg"
      :calc-liquidation-price-eth-chg="calcLiquidationPriceEthChg"
      :calc-liquidation-price-dai-chg="calcLiquidationPriceDaiChg"
      :get-value-or-function="getValueOrFunction"
      :active-cdp-id="activeCdpId"
      :dest-address-has-proxy="destAddressHasProxy"
      :dest-address-proxy="destAddressProxy"
      :tokens-with-balance="tokensWithBalance"
      @moveCdp="moveCdp"
      @checkForProxy="checkIfDestAddressHasProxy"
    >
    </move-cdp-modal>
    <back-button :path="backPath()">
      <div class="back-bar-container">
        <div v-if="showMoveOrClose" class="header-buttons-container">
          <div class="inner-container">
            <button class="move-btn" @click="showMove">
              <h4>{{ $t('dappsMaker.moveTitle') }}</h4>
            </button>
            <div v-if="!((!hasProxy && !onCreate) || showCdpMigrateButtons)">
              <button class="close-btn" @click="showClose">
                <h4>{{ $t('dappsMaker.closeTitle') }}</h4>
              </button>
            </div>
          </div>
        </div>
      </div>
    </back-button>
    <div v-if="makerActive" class="buttons-container">
      <div v-if="showCreateProxy">
        <div class="dapps-button" @click="buildProxy">
          <h4>{{ $t('dappsMaker.createProxy') }}</h4>
        </div>
      </div>
      <div v-if="showCreateProxy" class="proxy-container">
        {{ $t('dappsMaker.proxyInstructions') }}
      </div>
      <div v-if="showCdpMigrateButtons">
        <div v-for="(value, idx) in cdpsWithoutProxy" :key="idx + value">
          <div class="dapps-button">
            <div @click="migrateCdpExternal(value)">
              <h4>
                {{ $t('dappsMaker.migrateCdp', { value: value }) }}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showCdpMigrateButtons" class="proxy-container">
        {{ $t('dappsMaker.migrateInstructions') }}
      </div>
    </div>
    <div v-show="makerActive" class="buttons-container">
      <div v-if="showCreateProxy && cdpsWithoutProxy.length > 1">
        <div v-for="(value, idx) in cdpsWithoutProxy" :key="idx + value">
          <div
            :class="[
              'dapps-button',
              activeValues.cdpId === value ? 'active' : ''
            ]"
          >
            <div @click="openMigrate(value)">
              <h4>CDP #{{ value }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="makerActive && listCdps" class="buttons-container">
      <div v-for="(value, idx) in cdps" :key="idx + value">
        <div
          :class="[
            'dapps-button',
            activeValues.cdpId === value ? 'active' : ''
          ]"
        >
          <div @click="openManage(value)">
            <h4>CDP #{{ value }}</h4>
          </div>
        </div>
      </div>
    </div>

    <router-view
      :active-cdp-id="activeCdpId"
      :loading-state="curentlyLoading"
      :build-empty="buildEmpty"
      :maker-active="makerActive"
      :eth-price="ethPrice"
      :liquidation-penalty="liquidationPenalty"
      :stability-fee="stabilityFee"
      :liquidation-ratio="liquidationRatio"
      :price-service="priceService"
      :cdp-service="cdpService"
      :proxy-service="proxyService"
      :cdps="cdps"
      :cdps-without-proxy="cdpsWithoutProxy"
      :cdp-details-loaded="cdpDetailsLoaded"
      :tokens-with-balance="tokensWithBalance"
      :migration-in-progress="migrationInProgress"
      :open-close-modal="openCloseModal"
      :open-move-modal="openMoveModal"
      :values-updated="valuesUpdated"
      :values="activeValues"
      :get-collateral-options="getCollateralOptions"
      :get-value-or-function="getValueOrFunction"
      :get-cdp="getCdp"
      :has-cdp="hasCdp"
      @activeCdpId="setupCdpManageFunc"
      @cdpOpened="addCdp"
      @cdpClosed="removeCdp"
      @modalHidden="modalHidden"
      @managerUpdate="doUpdate"
      @showWithdraw="showWithdraw"
      @showPayback="showPayback"
      @showGenerate="showGenerate"
      @showDeposit="showDeposit"
      @migrateCdp="migrateCdpExternal"
      @proceedtoCreateOrManage="proceedtoCreateOrManage"
      @approveCurrency="approveCurrency"
      @setActiveCdpId="setActiveCdpId"
      @setAfterLoadPage="setAfterLoadPage"
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
import GenerateModal from './components/GenerateModal';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import PaybackModal from './components/PaybackModal';
import Maker from '@makerdao/dai';
import McdPlugin, {
  ETH,
  REP,
  ZRX,
  OMG,
  BAT,
  GNT,
  DGD,
  MDAI,
  MKR
} from '@makerdao/dai-plugin-mcd';
import configPlugin from '@makerdao/dai-plugin-config';
import {getCdpIds} from './MakerCDP/chainCalls'
import { Toast } from '@/helpers';
import MakerCDP from './MakerCDP';
import { toChecksumAddress } from '@/helpers/addressUtils';
import {
  CdpNum,
  locateCdps,
  setupPriceAndRatios,
  setupServices,
  getDetailsForTokens,
  checkAllowances,
  checkAllowanceFor,
  collateralOptions,
  setupCdpManage,
  updateActiveCdp,
  loadCdpDetails,
  buildEmpty,
  loadCdpDetail,
  doUpdate,
  toBigNumber,
  ProxyContract
} from './makerHelpers';

import MewPlugin from 'mew-maker-plugin';
import { GetCdps, ProxyRegistry, CdpManager } from './makerHelpers';
import addresses from './makerHelpers/addresses';

const { DAI } = Maker;

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

const afterLoadShow = {
  MANAGE: 'MANAGE',
  CREATE: 'CREATE',
  HOME: 'HOME'
};

const ServiceRoles = {
  CDP_MANAGER: 'mcd:cdpManager',
  CDP_TYPE: 'mcd:cdpType',
  AUCTION: 'mcd:auction',
  SYSTEM_DATA: 'mcd:systemData',
  QUERY_API: 'mcd:queryApi',
  SAVINGS: 'mcd:savings'
};
export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'generate-modal': GenerateModal,
    'deposit-modal': DepositModal,
    'withdraw-modal': WithdrawModal,
    'payback-modal': PaybackModal,
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
      activeCdpId: 0,
      curentlyLoading: '',
      destAddressProxy: '',
      destAddressHasProxy: false,
      afterUpdate: [],
      allCdpIds: [],
      activeCdp: {},
      activeValues: {
        maxEthDraw: toBigNumber(0),
        maxUsdDraw: toBigNumber(0),
        ethCollateral: toBigNumber(0),
        usdCollateral: toBigNumber(0),
        debtValue: toBigNumber(0),
        maxDai: toBigNumber(0),
        collateralRatio: toBigNumber(0),
        minEth: toBigNumber(0),
        cdpId: '--',
        proxyAllowances: {}
      },
      availableCdps: {},
      cdps: [],
      cdpsWithoutProxy: [],
      cdpService: {},
      showLoading: false,
      cdpDetailsLoaded: false,
      currentProxy: null,
      currentCdpId: '',
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
      proxyAddress: null,
      priceService: {},
      priceFloor: 0,
      stabilityFee: toBigNumber(0),
      sysVars: {},
      sysServices: {},
      targetPrice: 0,
      valuesUpdated: 0,
      currentPath: '/interface/dapps/',
      afterLoadShow: 'HOME'
      // MCD
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
    showCreateProxy() {
      if (this.showCdpMigrateButtons) {
        return false;
      }
      return !this.hasProxy && !this.onCreate;
    },
    showCdpMigrateButtons() {
      return this.hasProxy && this.cdpsWithoutProxy.length >= 1;
    },
    listCdps() {
      return this.cdps.length > 1 || this.cdpsWithoutProxy.length > 1;
    },
    hasProxy() {
      return this.proxyAddress !== null;
    },
    currentProxyAddress() {
      return this.proxyAddress;
    }
  },
  watch: {
    ['account.address']() {
      this.makerActive = false;
      this.setup();
    },
    $route(to) {
      this.currentPath = to.name;
    }
  },
  destroyed() {
    this.maker = {};
    this.priceService = {};
    this.cdpService = {};
    this.proxyService = {};
    this.availableCdps = {};
    this.activeCdp = {};
    this.makerCdp = {};
    this.sysVars = {};
    this.sysServices = {};
  },
  async mounted() {
    this.container = {};
    this.mcdCurrencies = {};
    await this.setup();
  },
  methods: {
    backPath() {
      switch (this.$route.name) {
        case 'Maker':
        case 'makerLoading':
          return '/interface/dapps/';
        default:
          return '/interface/dapps/maker-dai';
      }
    },
    getValueOrFunction(base, prop) {
      if (this[base]) {
        if (this[base][prop]) {
          return this[base][prop];
        }
        return this[base];
      }
      return undefined;
    },
    getCollateralOptions() {
      return this.mcdCurrencies;
    },
    setAfterLoadPage(page) {
      this.afterLoadShow = afterLoadShow[page];
    },
    async setupMCD() {
      try {
        this.curentlyLoading = 'Loading: Multi Collateral Operations';
        await this.maker.service('proxy').ensureProxy();
        this._typeService = this.maker.service(ServiceRoles.CDP_TYPE);
        this.curentlyLoading = 'Loading: Multi Collateral Types';
        this.mcdCurrencies = this._typeService.cdpTypes.reduce((acc, entry) => {
          acc[entry.currency.symbol] = entry;
          acc[entry.currency.symbol].symbol = entry.currency.symbol;
          return acc;
        }, {});

        this.collateralList = collateralOptions(this.mcdCurrencies);
      } catch (e) {
        console.error(e);
      }
    },
    getType(baseCurrency, ilk) {
      return this._typeService.cdpTypes.find(
        entry => entry.currency.symbol === baseCurrency && entry.ilk === ilk
      );
    },
    async setup() {
      this.activeCdps = {};
      this.currentCdp = {};
      const web3 = this.web3;
      const _self = this;
      if (!this.showLoading) {
        this.gotoHome();
      } else {
        this.gotoLoading();
      }

      this.curentlyLoading = 'Loading: wallet details';
      const MewMakerPlugin = MewPlugin(
        web3,
        _self.account.address,
        async () => {
          if (_self.$route.path.includes('maker-dai')) {
            await _self.doUpdate();
          }
        }
      );

      this.maker = await Maker.create('inject', {
        provider: { inject: web3.currentProvider },
        plugins: [
          [
            McdPlugin,
            {
              network: 'kovan',
              prefetch: true
            }
          ],
          MewMakerPlugin
        ],
        log: false,
        web3: {
          pollingInterval: null
        },
        accounts: {
          myLedger1: { type: 'mew' }
        }
      });
      await this.maker.service('proxy').ensureProxy();

      this.setupMCD();
      // -------------------------------------------------
      try {
        await this.maker.authenticate();
        this.curentlyLoading = 'Loading: System Values';
        await setupServices(this, this.maker);

        await setupPriceAndRatios(this, this._priceService, this._cdpService);

        this.proxyAddress = await this._proxyService.currentProxy();

        await getDetailsForTokens(this, this._typeService.cdpTypes);
        await checkAllowances(this, this.account.address, this.proxyAddress);
        console.log(
          this._mcdManager._serviceManager
            .dependency('smartContract')
            .getContract('GET_CDPS')
        ); // todo remove dev item

        // TODO update usages to use the balances and tokens objects
        this.daiToken = this.tokens['DAI'];
        this.daiBalance = this.balances['DAI'];
        this.mkrToken = this.tokens['MKR'];
        this.mkrBalance = this.balances['MKR'];

        this.minEth = toBigNumber(0.05);
        this.systemValues = {
          stabilityFee: this.stabilityFee,
          minEth: this.minEth,
          liquidationRatio: this.liquidationRatio,
          liquidationPenalty: this.liquidationPenalty,
          targetPrice: this._targetPrice
        };

        const proxyReg = new this.web3.eth.Contract(
          ProxyRegistry,
          addresses.PROXY_REGISTRY
        );

        let proxy = await proxyReg.methods.proxies(this.account.address).call();
        if (proxy === '0x0000000000000000000000000000000000000000') {
          proxy = null;
        }
        console.log('proxy', proxy); // todo remove dev item

        this.curentlyLoading = 'Checking For CDPs';
        try {
          const { withType, withProxy, withoutProxy } = await locateCdps(
            this,
            this._mcdManager
          );
          this.cdpsWithType = withType;
          this.cdps = withProxy;
          this.cdpsWithoutProxy = withoutProxy;
        } catch (e) {
          console.error(e);
        }

        this.currentProxy = await this.getProxy();

        if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
          this.curentlyLoading = 'Loading: Current CDPs';
          await this.loadCdpDetails(this.cdps, this.cdpsWithoutProxy);
        }
      } catch (e) {
        console.error(e);
      }

      if (this.showLoading) {
        if (this.afterLoadShow === 'CREATE') {
          this.makerActive = true;
          this.gotoCreate();
        } else {
          if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
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
        }
      } else {
        this.cdpDetailsLoaded = true;
        this.makerActive = true;
      }
    },

    async buildEmpty() {
      return await buildEmpty(this);
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
      await this.migrateCdp(cdpId);
    },
    async refreshExternal() {
      await this.doUpdate();
    },
    async refresh() {
      await this.doUpdate();
    },
    async doUpdate() {
      await doUpdate(this, Toast);
    },
    async generateProxyTx(address, abi) {
      new this.web3.eth.Contract(ProxyContract, this.proxyAddress).methods
        .execute(
          addresses.MIGRATION_PROXY_ACTIONS,
          this.fixImproperEncoding(
            new this.web3.eth.Contract(MigrationProxyActions).methods
              .migrate(
                addresses.MIGRATION,
                '0x' + toBigNumber(cdpId).toString(16)
              )
              .encodeABI(),
            cdpId
          )
        )
        .encodeABI();
    },
    async checkAllowances() {
      await checkAllowances(this, this.account.address, this.proxyAddress);
    },
    async checkBalances() {
      await getDetailsForTokens(this, this._typeService.cdpTypes);
    },
    async setupCdpManageFunc(cdpId) {
      cdpId = CdpNum(cdpId);
      await setupCdpManage(this, cdpId);
      this.setActiveCdpId(cdpId);
    },
    async updateActiveCdp() {
      await updateActiveCdp(this);
      console.log('updating'); // todo remove dev item
      if (this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0) {
        this.gotoCreate();
      }
    },
    async loadCdpDetail(cdpId) {
      return loadCdpDetail(this, cdpId);
    },
    // TODO doulble check the vue object observer bug isn't back
    async loadCdpDetails(
      cdps = this.cdps,
      cdpsWithoutProxy = this.cdpsWithoutProxy
    ) {
      return await loadCdpDetails(this, cdps, cdpsWithoutProxy);
    },
    async getProxy() {
      this.proxyAddress = await this._proxyService.currentProxy();
      if (!this.proxyAddress) {
        this.proxyAddress = await this._proxyService.getProxyAddress(
          this.account.address
        );
        if (this.proxyAddress) this.noProxy = false;
      }
      return this.proxyAddress;
    },

    lockEth(val) {
      this.currentCdp.lockEth(...val);
    },
    wipeDai(val) {
      this.currentCdp.wipeDai(val);
    },
    freeEth(val) {
      if (val[1] === null) {
        this.currentCdp.freeEth(val[0]);
      } else {
        this.currentCdp.freeEth(val[0], val[1]);
      }
    },
    drawDai(val) {
      if (val[1] === null) {
        this.currentCdp.drawDai(val[0]);
      } else {
        this.currentCdp.drawDai(val[0], val[1]);
      }
    },
    closeCdp() {
      this.currentCdp.closeCdp();
    },
    checkIfDestAddressHasProxy(val) {
      this.currentCdp
        .checkIfDestAddressHasProxy(val)
        .then(result => {
          this.destAddressProxy = result;
          this.destAddressHasProxy = result !== null;
        })
        .catch(err => {
          throw err;
        });
    },
    moveCdp(val) {
      this.currentCdp.moveCdp(val);
    },

    calcCollatRatioDaiChg(daiQty) {
      return toBigNumber(
        this.currentCdp.calcCollatRatio(this.currentCdp.ethCollateral, daiQty)
      );
    },

    calcCollatRatioEthChg(ethQty) {
      return toBigNumber(
        this.currentCdp.calcCollatRatio(ethQty, this.currentCdp.debtValue)
      );
    },

    calcLiquidationPriceDaiChg(daiQty) {
      return toBigNumber(
        this.currentCdp.calcLiquidationPrice(
          this.currentCdp.ethCollateral,
          daiQty
        )
      );
    },

    calcLiquidationPriceEthChg(ethQty) {
      return toBigNumber(
        this.currentCdp.calcLiquidationPrice(ethQty, this.currentCdp.debtValue)
      );
    },
    async approveCurrency(currency) {
      await this._tokenService
        .getToken(this.mcdCurrencies[currency])
        .approveUnlimited(this.proxyAddress);
    },
    async approveDai() {
      await this._tokenService
        .getToken(DAI)
        .approveUnlimited(this.proxyAddress);
    },
    async approveMkr() {
      this._tokenService.getToken(MKR).approveUnlimited(this.proxyAddress);
    },
    hasCdp(cdpId) {
      return Object.keys(this.activeCdps).includes(
        toBigNumber(CdpNum(cdpId)).toString()
      );
    },

    getCdp(cdpId) {
      // could be a string.  use type cohesion to convert to number
      if (!this.activeCdps) return false;
      return this.activeCdps[cdpId];
    },

    async getMakerCdp(cdpId) {
      cdpId = CdpNum(cdpId);
      if (cdpId === null) return;
      if (this.cdpsWithoutProxy.includes(cdpId)) {
        return await this._mcdManager.getCdp(cdpId, false);
      } else if (this.cdps.includes(cdpId) && this.proxyAddress) {
        return await this._mcdManager.getCdp(cdpId, this.proxyAddress);
      } else if (this.proxyAddress) {
        return await this._mcdManager.getCdp(cdpId, this.proxyAddress);
      }
      return await this._mcdManager.getCdp(cdpId, false);
    },

    async buildProxy() {
      this.proxyAddress = await this.getProxy();
      if (!this.proxyAddress) {
        await this._proxyService.build();
        this.proxyAddress = await this._proxyService.currentProxy();
        return this.proxyAddress;
      }
      this.proxyAddress = await this._proxyService.currentProxy();
      return this.proxyAddress;
    },

    async migrateCdp(cdpId) {
      const currentProxy = await this.getProxy();
      if (currentProxy) {
        await this._cdpService.give(cdpId, currentProxy);
      }
    },

    // Calculations
    toUSD(eth) {
      if (eth === undefined || eth === null) return toBigNumber(0);
      return this.ethPrice.times(toBigNumber(eth));
    },
    modalHidden() {
      this.openCloseModal = false;
      this.openMoveModal = false;
    },
    setActiveCdpId(id) {
      this.activeCdpId = id;
    },
    gotoHome() {
      this.$router.push({
        name: 'Maker'
      });
    },
    gotoLoading() {
      this.$router.push({
        name: 'makerLoading'
      });
    },
    gotoCreate() {
      if (this.$route.path.includes('maker-dai')) {
        this.activeValues = this.systemValues;
        this.$router.push({
          name: 'create'
        });
      }
    },
    migrateDai() {
      if (this.$route.path.includes('maker-dai')) {
        this.$router.push({
          name: 'migrateDAI'
        });
      }
    },
    goToManage() {
      if (this.$route.path.includes('maker-dai')) {
        if (this.showLoading) {
          this.gotoLoading();
        }
        if (this.cdps.length === 1) {
          this.setActiveCdpId(this.cdps[0]);
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
          // The listing screen may not work and can be removed
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
        this.setupCdpManageFunc(cdpId);
        this.$router.push({
          name: 'manage',
          params: {
            cdpId: cdpId
          }
        });
      }
    },
    openMigrate(cdpId) {
      if (this.$route.path.includes('maker-dai')) {
        if (typeof cdpId !== 'number') cdpId = cdpId.id;
        this.setupCdpManageFunc(cdpId);
        this.$router.push({
          name: 'migrate',
          params: {
            cdpId: cdpId
          }
        });
      }
    },
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
    showClose() {
      this.$refs.closeCdp.$refs.modal.$on('hidden', () => {
        this.$emit('modalHidden');
      });
      this.$refs.closeCdp.$refs.modal.show();
    },
    showMove() {
      this.$refs.moveCdp.$refs.modal.$on('hidden', () => {
        this.$emit('modalHidden');
      });
      this.destAddressHasProxy = false;
      this.$refs.moveCdp.$refs.modal.show();
    },
    proceedtoCreateOrManage() {
      this.showLoading = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerDai.scss';
</style>

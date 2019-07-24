<template>
  <div class="container-maker">
    <deposit-modal
      ref="deposit"
      :values="activeValues"
      :calc-collat-ratio-dai-chg="calcCollatRatioDaiChg"
      :calc-collat-ratio-eth-chg="calcCollatRatioEthChg"
      :calc-liquidation-price-eth-chg="calcLiquidationPriceEthChg"
      :calc-liquidation-price-dai-chg="calcLiquidationPriceDaiChg"
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
      :tokens-with-balance="tokensWithBalance"
      @moveCdp="moveCdp"
    >
    </move-cdp-modal>
    <back-button>
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
            <h4>{{ $t('dappsMaker.moveTitle') }}</h4>
          </button>
          <div v-if="!((!hasProxy && !onCreate) || showCdpMigrateButtons)">
            <button class="close-btn" @click="showClose">
              <h4>{{ $t('dappsMaker.closeTitle') }}</h4>
            </button>
          </div>
        </div>
      </div>
    </back-button>
    <div v-show="makerActive" class="buttons-container">
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
      :build-empty="buildEmpty"
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
      :cdp-details-loaded="cdpDetailsLoaded"
      :tokens-with-balance="tokensWithBalance"
      :migration-in-progress="migrationInProgress"
      :open-close-modal="openCloseModal"
      :open-move-modal="openMoveModal"
      :values-updated="valuesUpdated"
      :values="activeValues"
      :get-cdp="getCdp"
      :has-cdp="hasCdp"
      @activeCdpId="setupCdpManage"
      @cdpOpened="addCdp"
      @cdpClosed="removeCdp"
      @modalHidden="modalHidden"
      @managerUpdate="doUpdate"
      @showWithdraw="showWithdraw"
      @showPayback="showPayback"
      @showGenerate="showGenerate"
      @showDeposit="showDeposit"
      @migrateCdp="migrateCdpExternal"
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
import BigNumber from 'bignumber.js';
import Maker from '@makerdao/dai';
import { Toast } from '@/helpers';
import MakerCDP from './MakerCDP';
import { toChecksumAddress } from '@/helpers/addressUtils';

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
      afterUpdate: [],
      allCdpIds: [],
      activeCdp: {},
      activeValues: {
        maxPethDraw: toBigNumber(0),
        maxEthDraw: toBigNumber(0),
        maxUsdDraw: toBigNumber(0),
        ethCollateral: toBigNumber(0),
        pethCollateral: toBigNumber(0),
        usdCollateral: toBigNumber(0),
        debtValue: toBigNumber(0),
        maxDai: toBigNumber(0),
        collateralRatio: toBigNumber(0),
        minEth: toBigNumber(0),
        cdpId: '--'
      },
      availableCdps: {},
      cdps: [],
      cdpsWithoutProxy: [],
      cdpService: {},
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
    }
  },
  destroyed() {
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
    await this.setup();
  },
  methods: {
    modalHidden() {
      this.openCloseModal = false;
      this.openMoveModal = false;
    },
    gotoHome() {
      this.$router.push({
        name: 'Maker'
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
        this.setupCdpManage(cdpId);
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
        this.setupCdpManage(cdpId);
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
      this.$refs.moveCdp.$refs.modal.show();
    },
    async setup() {
      this.activeCdps = {};
      this.currentCdp = {};
      const web3 = this.web3;
      const _self = this;
      this.gotoHome();
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
        plugins: [MewMakerPlugin],
        accounts: {
          myLedger1: { type: 'mew' }
        }
      });

      await this.maker.authenticate();
      this._priceService = this.maker.service('price');
      this._cdpService = await this.maker.service('cdp');
      this._proxyService = await this.maker.service('proxy');
      this._tokenService = await this.maker.service('token');

      this.pethMin = toBigNumber(0.005);

      this.ethPrice = toBigNumber(
        (await this._priceService.getEthPrice()).toNumber()
      );

      this.pethPrice = toBigNumber(
        (await this._priceService.getPethPrice()).toNumber()
      );

      this._targetPrice = toBigNumber(
        (await this._priceService.getPethPrice()).toNumber()
      );

      this.liquidationRatio = toBigNumber(
        await this._cdpService.getLiquidationRatio()
      );
      this.liquidationPenalty = toBigNumber(
        await this._cdpService.getLiquidationPenalty()
      );
      this.stabilityFee = toBigNumber(
        await this._cdpService.getAnnualGovernanceFee()
      );

      this.wethToPethRatio = toBigNumber(
        await this._priceService.getWethToPethRatio()
      );
      this.proxyAddress = await this._proxyService.currentProxy();

      this.daiToken = this._tokenService.getToken(DAI);
      this.daiBalance = (await this.daiToken.balance()).toBigNumber();
      this.mkrToken = this._tokenService.getToken(MKR);
      this.mkrBalance = (await this.mkrToken.balance()).toBigNumber();

      const minEth = toBigNumber(this.pethMin).times(this.wethToPethRatio);
      this.systemValues = {
        stabilityFee: this.stabilityFee,
        minEth: minEth,
        liquidationRatio: this.liquidationRatio,
        wethToPethRatio: this.wethToPethRatio,
        liquidationPenalty: this.liquidationPenalty,
        targetPrice: this._targetPrice,
        pethPrice: this.pethPrice
      };

      await this.checkAllowances();

      const { withProxy, withoutProxy } = await this.locateCdps();
      this.cdps = withProxy;
      this.cdpsWithoutProxy = withoutProxy;

      if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
        await this.loadCdpDetails();
      }

      this.currentProxy = this.getProxy();
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
    },

    async buildEmpty() {
      return await this.buildCdpObject(null);
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
      this.proxyAddress = await this.getProxy();
      let afterClose = false;
      const afterOpen = this.$route.name === 'create';
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
            this.activeCdps[idProp] = await this.activeCdps[idProp].update();
          }
        }
        if (idProp === this.currentCdpId) {
          await this.currentCdp.update();
          await this.setupCdpManage(this.currentCdpId);
        }
      }

      this.daiBalance = (await this.daiToken.balance()).toBigNumber();
      this.mkrBalance = (await this.mkrToken.balance()).toBigNumber();
      await this.checkAllowances();

      if (!Object.keys(this.activeCdps).includes(this.currentCdpId)) {
        await this.loadCdpDetails();
        await this.setupCdpManage(this.currentCdpId);
      } else {
        await this.setupCdpManage(this.currentCdpId);
      }

      const runAfterUpdate = () => {
        if (this.afterUpdate.length > 0) {
          const fn = this.afterUpdate.pop();
          fn();
          runAfterUpdate();
        }
      };
      runAfterUpdate();
      if (afterClose || afterOpen || this.creatingCdp) {
        if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
          this.goToManage();
        } else {
          this.gotoCreate();
        }
      }
      if (this.creatingCdp) {
        this.creatingCdp = false;
        await this.updateActiveCdp();
        Toast.responseHandler('CDP Created', Toast.INFO);
      } else {
        this.valuesUpdated++;
        Toast.responseHandler('CDP Updated', Toast.INFO);
      }
    },

    async checkAllowances() {
      if (this.proxyAddress) {
        this._proxyAllowanceDai = (await this.daiToken.allowance(
          this.account.address,
          this.proxyAddress
        )).toBigNumber();

        this._proxyAllowanceMkr = (await this.mkrToken.allowance(
          this.account.address,
          this.proxyAddress
        )).toBigNumber();
      }
    },
    async setupCdpManage(cdpId) {
      if (!this.allCdpIds.includes(cdpId) && this.allCdpIds.length > 0) {
        cdpId = this.allCdpIds[0];
      }
      if (this.allCdpIds.length === 0) {
        this.activeValues = this.systemValues;
      } else {
        this.currentCdpId = cdpId;
        this.activeValues = await this.getValuesForManage(cdpId);
      }
    },
    async getValuesForManage(cdpId) {
      const currentCdp = this.activeCdps[cdpId];
      this.currentCdp = currentCdp;
      const _proxyAllowanceDai = this._proxyAllowanceDai;
      const _proxyAllowanceMkr = this._proxyAllowanceMkr;
      const toPeth = this.toPeth;
      const systemValues = this.systemValues;
      return {
        ...systemValues,
        cdpId: cdpId,
        maxPethDraw: currentCdp.maxPethDraw,
        maxEthDraw: currentCdp.maxEthDraw,
        maxUsdDraw: currentCdp.maxUsdDraw,
        ethCollateral: currentCdp.ethCollateral,
        pethCollateral: currentCdp.pethCollateral,
        usdCollateral: currentCdp.usdCollateral,
        debtValue: currentCdp.debtValue,
        maxDai: currentCdp.maxDai,
        collateralRatio: currentCdp.collatRatio,
        liquidationPrice: currentCdp.liquidationPrice,
        minEth: currentCdp.minEth,
        isSafe: false,
        governanceFeeOwed: currentCdp.governanceFeeOwed,
        ethCollateralNum: currentCdp.ethCollateralNum,
        toPeth: toPeth,
        proxyAllowanceDai: _proxyAllowanceDai,
        proxyAllowanceMkr: _proxyAllowanceMkr,
        zeroDebt: currentCdp.zeroDebt
      };
    },
    async locateCdps() {
      this.cdpsWithoutProxy = [];
      this.cdpsWithoutProxy = await this.locateCdpsWithoutProxy();
      this.cdps = [];
      this.cdps = await this.locateCdpsProxy();

      this.allCdpIds = [...this.cdpsWithoutProxy, ...this.cdps];

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
      this.proxyAddress = await this.getProxy();
      return await this._cdpService.getCdpIds(this.proxyAddress);
    },
    async updateActiveCdp() {
      const currentCdpIds = Object.keys(this.activeCdps);
      await this.locateCdps();

      const newCdps = this.cdps.filter(
        item => !Object.keys(this.activeCdps).includes(item.toString())
      );

      const newCdpsWithoutProxy = this.cdpsWithoutProxy.filter(
        item => !Object.keys(this.activeCdps).includes(item.toString())
      );

      const removedCdps = currentCdpIds.filter(
        item =>
          !(
            this.cdps.includes(item.toString()) ||
            this.cdpsWithoutProxy.includes(item.toString())
          )
      );

      if (removedCdps.length > 0) {
        removedCdps.forEach(item => delete this.activeCdps[item]);
      }

      if (newCdps.length > 0) {
        for (let i = 0; i < newCdps.length; i++) {
          this.activeCdps[newCdps[i]] = await this.buildCdpObject(newCdps[i]);
        }
      }

      if (newCdpsWithoutProxy.length > 0) {
        for (let i = 0; i < newCdpsWithoutProxy.length; i++) {
          this.activeCdps[newCdpsWithoutProxy[i]] = await this.buildCdpObject(
            newCdpsWithoutProxy[i],
            { noProxy: true }
          );
        }
      }

      if (this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0) {
        this.gotoCreate();
      }
    },
    async loadCdpDetails() {
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
    async buildCdpObject(cdpId, options = {}) {
      const sysVars = {
        ...options,
        _proxyAddress: this.proxyAddress,
        liquidationPenalty: this.liquidationPenalty,
        stabilityFee: this.stabilityFee,
        ethPrice: this.ethPrice,
        _pethPrice: this.pethPrice,
        wethToPethRatio: this.wethToPethRatio,
        _targetPrice: this._targetPrice,
        liquidationRatio: this.liquidationRatio,
        proxyAllowanceDai: this.proxyAllowanceDai,
        proxyAllowanceMkr: this.proxyAllowanceMkr,
        _daiToken: this._daiToken,
        daiBalance: this.daiBalance,
        _mkrToken: this._mkrToken,
        mkrBalance: this.mkrBalance,
        minEth: this.minEth,
        pethMin: this.pethMin
      };

      if (this.cdpsWithoutProxy.includes(cdpId)) {
        this.cdp = await this.getMakerCdp(cdpId, false);
      } else if (this.cdps.includes(cdpId)) {
        this.cdp = await this.getMakerCdp(cdpId, this.proxyAddress);
      } else {
        this.cdp = await this.getMakerCdp(cdpId, false);
      }

      const services = {
        _proxyService: this._proxyService,
        priceService: this.priceService,
        _cdpService: this._cdpService,
        doUpdate: this.doUpdate,
        getProxy: this.getProxy,
        hasProxy: this.hasProxy,
        getCdp: this.getMakerCdp,
        toPeth: this.toPeth,
        toUSD: this.toUSD,
        _proxyAddress: this.proxyAddress,
        liquidationPenalty: this.liquidationPenalty,
        stabilityFee: this.stabilityFee,
        ethPrice: this.ethPrice,
        _pethPrice: this.pethPrice,
        wethToPethRatio: this.wethToPethRatio,
        _targetPrice: this._targetPrice,
        liquidationRatio: this.liquidationRatio,
        proxyAllowanceDai: this.proxyAllowanceDai,
        proxyAllowanceMkr: this.proxyAllowanceMkr,
        _daiToken: this._daiToken,
        daiBalance: this.daiBalance,
        _mkrToken: this._mkrToken,
        mkrBalance: this.mkrBalance,
        minEth: this.minEth,
        pethMin: this.pethMin
      };

      const makerCDP = new MakerCDP(cdpId, this.web3, services, sysVars);
      if (cdpId) {
        return await makerCDP.init(cdpId);
      }
      return makerCDP;
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
      this.currentCdp.lockEth(val);
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
        toBigNumber(cdpId).toString()
      );
    },

    getCdp(cdpId) {
      return this.activeCdps[cdpId];
    },

    async getMakerCdp(cdpId) {
      if (cdpId === null) return;
      if (this.cdpsWithoutProxy.includes(cdpId)) {
        return await this.maker.getCdp(cdpId, false);
      } else if (this.cdps.includes(cdpId) && this.proxyAddress) {
        return await this.maker.getCdp(cdpId, this.proxyAddress);
      } else if (this.proxyAddress) {
        return await this.maker.getCdp(cdpId, this.proxyAddress);
      }
      return await this.maker.getCdp(cdpId, false);
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerDai.scss';
</style>

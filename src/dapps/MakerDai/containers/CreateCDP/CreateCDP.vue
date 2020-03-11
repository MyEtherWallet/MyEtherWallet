<template>
  <div class="container-maker">
    <dai-confirmation-modal
      ref="daiconfirmation"
      :opencdp="openCdp"
      :txinfo="txInfo"
      :liquidation-price="liquidationPrice"
      :collat-ratio="displayFixedPercent(collatRatio)"
      :liquidation-penalty="displayPercentValue(liquidationPenalty)"
      :min-ratio="displayPercentValue(liquidationRatio)"
      :current-price="displayFixedValue(getCurrentPrice, 2)"
      :collateral="ethQty.toString()"
      :generate="daiQty.toString()"
      :currency="selectedCurrency.symbol"
    />
    <loading-overlay
      v-if="loading"
      :loadingmessage="$t('dappsMCDMaker.creating-message')"
    />
    <div class="manage-container">
      <h3 class="mb-3 ">{{ $t('dappsMCDMaker.maker_title') }}</h3>
      <div class="mb-5">{{ $t('dappsMCDMaker.create-instruct') }}</div>

      <div class="currency-ops-new">
        <div class="currency-picker-container">
          <div class="interface__block-title">
            {{ $t('dappsMCDMaker.collateral') }}
          </div>
          <currency-picker
            :currencies="collateralOptions"
            @selectedCurrency="selectedCurrency = $event"
          ></currency-picker>
          <input
            v-model="ethQty"
            :class="[
              !hasEnoughEth ? 'red-border' : '',
              'currency-picker-container',
              'dropdown-text-container',
              'dropdown-container'
            ]"
          />
          <div class="input-block-message">
            <p v-if="!hasEnoughEth" class="red-text">
              {{ $t('dappsMCDMaker.not-enough-funds') }}
            </p>
            <p>
              {{ $t('dappsMCDMaker.min-collat') }}
              <b>{{ displayFixedValue(minDeposit, 6) }}</b>
              {{ selectedCurrency.symbol }}
            </p>
          </div>
        </div>
        <div class="arrow">
          <img :src="arrowImage" />
        </div>
        <div>
          <div class="interface__block-title">
            {{ $t('dappsMCDMaker.generate') }}
          </div>
          <div class="dropdown-text-container dropdown-container">
            <p>
              <span class="cc DAI cc-icon cc-icon-dai currency-symbol" />
              {{ $t('dappsMCDMaker.dai') }}
              <span class="subname">- Maker DAI</span>
            </p>
          </div>
          <input
            v-model="daiQty"
            :class="[
              veryRisky ? 'red-border' : '',
              risky && !veryRisky ? 'orange-border' : '',
              'currency-picker-container',
              'dropdown-text-container',
              'dropdown-container'
            ]"
          />
          <div class="input-block-message">
            <p>
              {{ $t('dappsMCDMaker.min-generate') }}
              <b>{{ displayFixedValue(minCreate, 6) }}</b>
              {{ $t('dappsMCDMaker.dai') }}
            </p>
            <p>
              {{ $t('dappsMCDMaker.max-generate') }}
              <b>{{ displayFixedValue(maxDaiDraw, 6) }}</b>
              {{ $t('dappsMCDMaker.dai') }}
            </p>
          </div>
        </div>
      </div>

      <div class="cdp-info-block cdp-info-entry">
        <ul>
          <li>
            <p>
              {{
                $t('dappsMCDMaker.min-required', {
                  value: selectedCurrency ? selectedCurrency.symbol : 'ETH'
                })
              }}
            </p>
            <p>
              {{ displayFixedValue(minDeposit, 6) }}
              {{ selectedCurrency.symbol }}
            </p>
          </li>
          <li>
            <p>{{ $t('dappsMCDMaker.liquid-price') }}</p>
            <p>
              <b>{{ liquidationPrice }}</b>
              {{ $t('common.currency.usd') }}
            </p>
          </li>
          <li>
            <p>{{ $t('dappsMCDMaker.current-price-info') }}</p>
            <p>
              {{ displayFixedValue(getCurrentPrice, 2) }}
              {{ $t('common.currency.usd') }}
            </p>
          </li>
          <li>
            <p>{{ $t('dappsMCDMaker.liquidation-penalty') }}</p>
            <p>{{ displayPercentValue(liquidationPenalty) }}%</p>
          </li>
          <li>
            <p>{{ $t('dappsMCDMaker.collateral-ratio') }}</p>
            <p
              :class="[
                veryRisky ? 'red-text' : '',
                risky && !veryRisky ? 'orange-text' : ''
              ]"
            >
              <b>{{ displayFixedPercent(collatRatio) }}%</b>
            </p>
          </li>
          <li>
            <p>{{ $t('dappsMCDMaker.minimum-ratio') }}</p>
            <p>{{ displayPercentValue(liquidationRatio) }}%</p>
          </li>
        </ul>
      </div>
      <div class="cdp-info-block cdp-info-entry">
        <ul>
          <li>
            <p>
              {{
                $t('dappsMCDMaker.stability-fee-in-mkr', {
                  value: displayFixedPercent(stabilityFee).toString()
                })
              }}
            </p>
          </li>
        </ul>
      </div>
      <div v-if="!hasProxy" class="buttons-container">
        <div
          class="submit-button large-round-button-green-filled"
          @click="BuildProxy()"
        >
          Create Proxy
        </div>
      </div>
      <div
        v-if="selectedCurrency.symbol !== 'ETH' && !hasEnoughAllowance()"
        class="buttons-container"
      >
        <div
          class="submit-button large-round-button-green-filled"
          @click="approveCurrency"
        >
          Set Allowance
        </div>
      </div>
      <div class="buttons-container">
        <div
          :class="[
            validInputs ? '' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
          @click="openDaiConfirmation"
        >
          {{ $t('dappsMCDMaker.collat-and-generate-vault') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CurrencyPicker from '../../components/CurrencyPicker';
import DaiConfirmationModal from '../../components/DaiConfirmationModal';
import LoadingOverlay from '@/components/LoadingOverlay';
import {
  displayFixedValue,
  displayPercentValue,
  displayFixedPercent,
  toBigNumber
} from '../../makerHelpers';
import BigNumber from 'bignumber.js';
import Arrow from '@/assets/images/etc/single-arrow.svg';

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

export default {
  components: {
    'dai-confirmation-modal': DaiConfirmationModal,
    'loading-overlay': LoadingOverlay,
    'currency-picker': CurrencyPicker
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
    },
    ethPrice: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    liquidationPenalty: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    stabilityFee: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    priceService: {
      type: Object,
      default: function() {
        return {};
      }
    },
    cdpService: {
      type: Object,
      default: function() {
        return {};
      }
    },
    proxyService: {
      type: Object,
      default: function() {
        return {};
      }
    },
    buildEmpty: {
      type: Function,
      default: function() {}
    },
    getCollateralOptions: {
      type: Function,
      default: function() {}
    },
    getValueOrFunction: {
      type: Function,
      default: function() {}
    },
    makerActive: {
      type: Boolean,
      default: false
    },
    values: {
      type: Object,
      default: function() {
        return {
          maxEthDraw: '',
          maxUsdDraw: '',
          ethCollateral: '',
          usdCollateral: '',
          debtValue: '',
          maxDai: '',
          collateralRatio: '',
          cdpId: '',
          stabilityFee: '',
          minEth: '',
          liquidationRatio: '',
          liquidationPenalty: '',
          targetPrice: ''
        };
      }
    }
  },
  data() {
    return {
      emptyMakerCreated: false,
      arrowImage: Arrow,
      daiPrice: 0,
      priceFloor: 0,
      ethQty: 0,
      daiQty: 0,
      txInfo: {},
      loading: false,
      selectedCurrency: { symbol: 'ETH', name: 'ETH-A' }
    };
  },
  computed: {
    ...mapState('main', ['account', 'gasPrice', 'web3', 'network', 'ens']),
    validInputs() {
      if (!this.hasProxy) return false;
      if (toBigNumber(this.ethQty).isNaN() || toBigNumber(this.daiQty).isNaN())
        return false;
      if (toBigNumber(this.ethQty).gt(0)) {
        if (toBigNumber(this.ethQty).lte(this.values.minEth)) return false;
        if (this.emptyMakerCreated) {
          if (toBigNumber(this.makerCDP.minDai).gt(this.daiQty)) return false;
        } else if (toBigNumber(20).gt(this.daiQty)) return false;
        if (toBigNumber(this.maxDaiDraw).lte(toBigNumber(this.daiQty)))
          return false;
        if (this.emptyMakerCreated) {
          if (toBigNumber(this.collatRatio).lte(this.makerCDP.liquidationRatio))
            return false;
        } else if (toBigNumber(this.collatRatio).lte(1.501)) return false;
        return this.hasEnoughEth;
      }
      return false;
    },
    hasProxy() {
      return this.getValueOrFunction('proxyAddress');
    },
    hasEnoughEth() {
      if (this.emptyMakerCreated) {
        return this.hasEnough();
      }
      return true;
    },
    minInSelectedCurrency() {
      return this.minDeposit;
    },
    atSetFloor() {
      if (this.priceFloor <= 0) return 0;
      return bnOver(this.ethPrice, this.liquidationRatio, this.priceFloor);
    },
    collatRatio() {
      if (this.daiQty <= 0 || this.ethQty <= 0) return 0;
      return this.calcCollatRatio(this.ethQty, this.daiQty);
    },
    liquidationPrice() {
      if (this.daiQty <= 0 || this.ethQty <= 0) return 0;
      return this.calcLiquidationPrice(this.ethQty, this.daiQty);
    },
    liquidationRatio() {
      if (this.emptyMakerCreated) {
        return this.makerCDP.liquidationRatio;
      }
      return null;
    },
    maxDaiDraw() {
      if (this.ethQty <= 0) return 0;
      const bufferVal = this.calcDaiDraw(this.ethQty).times(0.01);
      return toBigNumber(this.calcDaiDraw(this.ethQty)).minus(bufferVal);
    },
    risky() {
      const collRatio = this.collatRatio;
      if (toBigNumber(collRatio).gt(0)) {
        return toBigNumber(collRatio).lte(2);
      }
      return false;
    },
    veryRisky() {
      const collRatio = this.collatRatio;
      if (toBigNumber(collRatio).gt(0)) {
        return toBigNumber(collRatio).lte(1.75);
      }
      return false;
    },
    minEth() {
      if (this.emptyMakerCreated) {
        return toBigNumber(this.getValueOrFunction('minEth'));
      }
      return null;
    },
    collateralOptions() {
      const mcdCollateralOptions = this.getValueOrFunction('mcdCurrencies');
      if (mcdCollateralOptions) {
        return Object.keys(mcdCollateralOptions).reduce((acc, entry) => {
          acc.push({
            symbol: entry,
            name: mcdCollateralOptions[entry].ilk
          });
          return acc;
        }, []);
      }
      return [{ symbol: 'ETH', name: 'ETH-A' }];
    },
    getCurrentPrice() {
      if (this.emptyMakerCreated) {
        return this.makerCDP.getCurrentPriceFor(this.selectedCurrency.symbol);
      }
      return NaN;
    },
    minDeposit() {
      if (this.emptyMakerCreated) {
        return this.makerCDP.minDepositFor(this.selectedCurrency.symbol);
      }
      return null;
    },
    minCreate() {
      return 20;
    }
  },
  watch: {
    selectedCurrency(val) {
      if (this.emptyMakerCreated) {
        this.makerCDP.setType(val);
      }
    },
    makerActive() {
      if (!this.emptyMakerCreated) {
        this.buildEmptyInstance();
      }
    }
  },
  beforeDestroy() {
    this.makerCDP = {};
  },
  destroyed() {
    this.makerCDP = {};
  },
  async mounted() {
    if (this.makerActive) {
      this.buildEmptyInstance();
    }
  },
  methods: {
    getCurrentPriceFor(symbol) {
      if (!symbol) return 0;
      if (this.getValueOrFunction('mcdCurrencies')) {
        if (this.getValueOrFunction('mcdCurrencies')[symbol]) {
          return this.getValueOrFunction('mcdCurrencies')[
            symbol
          ].price._amount.toString();
        }
      }
      return 0;
    },
    getAllowanceFor(symbol) {
      if (!symbol) return 0;
      const allowances = this.getValueOrFunction('proxyAllowances');
      if (allowances) {
        return allowances[symbol];
      }
      return 0;
    },
    getBalanceFor(symbol) {
      if (!symbol) return 0;
      const balances = this.getValueOrFunction('balances');
      if (balances) {
        return balances[symbol];
      }
      return 0;
    },
    async buildEmptyInstance() {
      this.makerCDP = await this.buildEmpty();
      this.$forceUpdate();
      this.emptyMakerCreated = true;
    },
    BuildProxy() {
      if (this.emptyMakerCreated) {
        this.getValueOrFunction('getProxy')().then(proxy => {
          this.proxyAddress = proxy;
          if (!this.proxyAddress) {
            this.getValueOrFunction('_proxyService')
              .build()
              .then(() => {
                return this.getValueOrFunction('_proxyService').currentProxy();
              })
              .then(res => {
                this.proxyAddress = res;
              });
          }
        });
      }
    },
    displayPercentValue,
    displayFixedValue,
    displayFixedPercent,
    async openCdp() {
      this.loading = true;

      if (this.ethQty <= 0) return 0;
      setTimeout(() => {
        this.loading = false;
      }, 5000);

      // [Note from David to Steve] This should be implemented on TX core.
      // Close DAI confirmation modal
      this.$eventHub.$on('showTxConfirmModal', () => {
        this.$emit('cdpOpened');
        if (this.loading) {
          this.$refs.daiconfirmation.$refs.modal.hide();
          this.loading = false;
        }
      });

      await this.makerCDP.openCdp(
        this.getValueOrFunction('mcdCurrencies')[this.selectedCurrency.symbol],
        this.ethQty,
        this.daiQty
      );
    },
    openDaiConfirmation() {
      this.$refs.daiconfirmation.$refs.modal.show();
    },
    toUSD(eth) {
      if (eth === undefined || eth === null) return toBigNumber(0);
      const toUsd = toBigNumber(this.getCurrentPrice).times(toBigNumber(eth));
      if (toUsd.lt(0)) {
        return toBigNumber(0);
      }
      return toUsd;
    },
    hasEnough() {
      if (this.makerCDP) {
        return this.makerCDP.hasEnough(
          this.ethQty,
          this.selectedCurrency.symbol,
          this.account.balance
        );
      }
      return true;
    },
    hasEnoughAllowance() {
      if (this.emptyMakerCreated) {
        return this.makerCDP.hasEnoughAllowance(
          this.ethQty,
          this.selectedCurrency.symbol
        );
      }
    },
    calcMinCollatRatio(priceFloor) {
      return bnOver(this.ethPrice, this.liquidationRatio, priceFloor);
    },
    calcDaiDraw(
      ethQty,
      ethPrice = this.getCurrentPrice,
      liquidationRatio = this.liquidationRatio
    ) {
      if (ethQty <= 0) return 0;
      return bnOver(ethPrice, toBigNumber(ethQty), liquidationRatio);
    },
    calcCollatRatio(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return 0;
      return bnOver(this.getCurrentPrice, ethQty, daiQty);
    },

    calcLiquidationPrice(ethQty, daiQty) {
      return this.makerCDP.calcLiquidationPrice(
        ethQty,
        daiQty,
        this.selectedCurrency.symbol
      );
    },
    approveCurrency() {
      return this.makerCDP.approveProxyFor(this.selectedCurrency.symbol);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateCDP';
</style>

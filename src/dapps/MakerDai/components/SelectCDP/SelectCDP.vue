<template>
  <div>
    <interface-container-title :title="'MAKER'" />
    <div class="container-maker">
      <div class="manage-container">
        <div class="content-container">
          <p class="cpd-title">{{ $t('dapps.cdpPortal') }}</p>
          <div class="cdp-id">
            <p>
              {{ $t('dapps.currentPrice') }}:
              <b>{{ ethPrice.toString() }}</b> USD
            </p>
          </div>
        </div>
        <div v-if="!cdpDetailsLoaded">
          Loading CDP Details
        </div>
        <div v-if="cdpDetailsLoaded">
          <div v-for="(cdp, idx) in cdps" :key="cdp + idx">
            <!--availableCdps-->
            <div class="manage-container-blocks">
              <div class="label-one-left">
                <div class="select-label">
                  <p>Collateralized debt position #{{ cdp }}</p>

                  <p>
                    <span class="standard-button__green-border">
                      <button class="the-button-box" @click="openManage(cdp)">
                        Manage
                      </button>
                    </span>
                  </p>
                </div>
              </div>
              <div class="content-one-left">
                <div class="content-one-inner-left">
                  <p>{{ $t('dapps.deposited') }}</p>
                  <p>
                    <b>{{
                      availableCdps[cdp]
                        ? displayFixedValue(availableCdps[cdp].ethCollateral)
                        : 0
                    }}</b>
                    ETH
                  </p>
                  <p>
                    <b>{{
                      availableCdps[cdp]
                        ? displayFixedValue(availableCdps[cdp].pethCollateral)
                        : 0
                    }}</b>
                    PETH /
                    <b>{{
                      availableCdps[cdp]
                        ? displayFixedValue(availableCdps[cdp].usdCollateral, 2)
                        : 0
                    }}</b>
                    USD
                  </p>
                  <br />
                  <p>{{ $t('dapps.liquidPrice') }} (ETH/USD)</p>
                  <p>
                    <span class="blue-bold">{{
                      availableCdps[cdp]
                        ? displayFixedValue(availableCdps[cdp].liqPrice, 2)
                        : 0
                    }}</span>
                    <span class="liq-usd"> USD</span>
                  </p>
                </div>
                <div class="content-border">
                  <div class="Line-8"></div>
                </div>
                <div class="content-one-inner-right">
                  <p>{{ $t('dapps.generated') }}</p>
                  <p>
                    <b>{{
                      availableCdps[cdp] ? availableCdps[cdp].debtValue : 0
                    }}</b>
                    DAI
                  </p>
                  <p>
                    <b>{{
                      availableCdps[cdp]
                        ? displayFixedValue(availableCdps[cdp].debtValue, 2)
                        : 0
                    }}</b>
                    USD
                  </p>
                  <br />
                  <p>{{ $t('dapps.collateralRatio') }}</p>
                  <p class="blue-bold">
                    {{
                      availableCdps[cdp]
                        ? displayPercentValue(availableCdps[cdp].collatRatio)
                        : 0
                    }}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { mapGetters } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
// import * as unit from 'ethjs-unit';
// import utils from 'web3-utils';
// import { Toast, Misc } from '@/helpers';
import Maker from '@makerdao/dai';
import { MIN_DEPOSIT, settings } from '../../config';
const KOVAN_SERVER_URL = 'https://sai-kovan.makerfoundation.com/v1';
const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;

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
    blockie: Blockie
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
    makerActive: {
      type: Boolean,
      default: false
    },
    highestGas: {
      type: String,
      default: '0'
    },
    ethPrice: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    pethPrice: {
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
    liquidationRatio: {
      type: BigNumber,
      default: toBigNumber(0)
    },
    calcMinCollatRatio: {
      type: Function,
      default: function() {}
    },
    calcDrawAmt: {
      type: Function,
      default: function() {}
    },
    calcCollatRatio: {
      type: Function,
      default: function() {}
    },
    calcLiquidationPrice: {
      type: Function,
      default: function() {}
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
    cdps: {
      type: Array,
      default: function() {
        return [];
      }
    },
    availableCdps: {
      type: Object,
      default: function() {
        return {};
      }
    },
    cdpDetailsLoaded: {
      type: Boolean,
      default: false
    },
    maker: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      loaded: false,
      // cdpDetailsLoaded: false,
      serverUrl: KOVAN_SERVER_URL,
      wethToPethRatio: 0,
      daiPrice: 0,
      priceFloor: 0,
      ethQty: 0,
      daiQty: 0,
      selectedCdp: '',
      // availableCdps: {},
      cdp: {},
      step: 1,
      eth: toBigNumber(0),
      skr: toBigNumber(0),
      dai: toBigNumber(0),
      debtValue: toBigNumber(0),
      collatRatio: toBigNumber(0),
      pethCollateral: toBigNumber(0),
      usdCollateral: toBigNumber(0),
      ethCollateral: toBigNumber(0),
      maxDaiAvail: null,
      liqPrice: null,
      ratio: null,
      error: false,
      isSafe: false,
      maxDaiDraw: toBigNumber(0),
      maxPethDraw: toBigNumber(0),
      maxEthDraw: toBigNumber(0)
    };
  },
  watch: {
    async cdps() {
      // console.log('cdps'); // todo remove dev item
      // const cdpId = 5178;
      // for (let i = 0; i < this.cdps.length; i++) {
      //   this.availableCdps[this.cdps[i]] = await this.getCdp(this.cdps[i]);
      //   console.log(this.availableCdps); // todo remove dev item
      // }
      // if (!this.loaded) {
      //   if (this.makerActive) {
      //     this.loaded = true;
      //     const cdpId = 5178;
      //     for (let i = 0; i < this.cdps.length; i++) {
      //       this.availableCdps[this.cdps[i]] = await this.getCdp(this.cdps[i]);
      //     }
      //   }
      // }
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
    liquidationPrice() {
      return this.calcLiquidationPrice(this.ethQty, this.daiQty);
    },
    minEthDeposit() {
      if (toBigNumber(this.usdCollateral).gt(new BigNumber(0))) return 0;
      return bnOver(
        this.liquidationRatio,
        this.usdCollateral,
        this.ethPrice
      ).toString();
    },
    atRisk() {
      if (this.calcCollatRatio(this.ethQty, this.daiQty).lte(2)) {
        return true;
      }
      return false;
    }
  },
  async mounted() {
    if (!this.makerActive) {
      this.$router.push({
        name: 'Maker'
      });
    }
  },
  methods: {
    openManage(cdp) {
      this.$router.push({
        name: 'manage',
        params: {
          cdpId: cdp
        }
      });
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals).toString();
    },
    maxWithDraw() {
      const tl = this.ethPrice.times(this.ethCollateral);
      const tr = this.debtValue.times(this.liquidationRatio);
      return tl.minus(tr).div(this.ethPrice);
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
@import 'SelectCDP';
</style>

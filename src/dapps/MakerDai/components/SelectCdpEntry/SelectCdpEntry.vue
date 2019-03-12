<template>
  <div>
    <div class="container-maker">
      <div class="manage-container">
        <div class="manage-container-blocks">
          <div class="label-one-left">
            <div class="select-label">
              <p>Collateralized debt position #{{ cdpId }}</p>

              <p>
                <span class="standard-button__green-border">
                  <button class="the-button-box" @click="openManage(cdpId)">
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
                <b>{{ aCdp ? displayFixedValue(aCdp.ethCollateral) : 0 }}</b>
                ETH
              </p>
              <p>
                <b>{{ aCdp ? displayFixedValue(aCdp.pethCollateral) : 0 }}</b>
                PETH /
                <b>{{ aCdp ? displayFixedValue(aCdp.usdCollateral, 2) : 0 }}</b>
                USD
              </p>
              <br />
              <p>{{ $t('dapps.liquidPrice') }} (ETH/USD)</p>
              <p>
                <span class="blue-bold">{{
                  aCdp ? displayFixedValue(aCdp.liqPrice, 2) : 0
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
                <b>{{ aCdp ? aCdp.debtValue : 0 }}</b>
                DAI
              </p>
              <p>
                <b>{{ aCdp ? displayFixedValue(aCdp.debtValue, 2) : 0 }}</b>
                USD
              </p>
              <br />
              <p>{{ $t('dapps.collateralRatio') }}</p>
              <p class="blue-bold">
                {{ aCdp ? displayPercentValue(aCdp.collatRatio) : 0 }}%
              </p>
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
    cdpId: {
      type: Number,
      default: 0
    },
    aCdp: {
      type: Object,
      function() {
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
  watch: {},
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
        this._ethPrice
      ).toString();
    },
    atRisk() {
      if (this.calcCollatRatio(this.ethQty, this.daiQty).lte(2)) {
        return true;
      }
      return false;
    }
  },
  async mounted() {},
  methods: {
    openManage(cdp) {
      console.log(cdp); // todo remove dev item
      this.$router.push({
        name: 'manage',
        params: {
          cdpId: this.cdpId
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
      const tl = this.aCdp._ethPrice.times(this.aCdp.ethCollateral);
      const tr = this.aCdp.debtValue.times(this.aCdp.liquidationRatio);
      return tl.minus(tr).div(this.aCdp._ethPrice);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SelectCdpEntry';
</style>

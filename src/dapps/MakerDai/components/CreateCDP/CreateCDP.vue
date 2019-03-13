<template>
  <div class="container-maker">
    <interface-container-title :title="'MAKER'" />
    <div class="manage-container">
      <p class="top-title">
        <b>{{ $t('dapps.maker_title') }}</b>
      </p>
      <p class="top-title">
        Please text something here, please text something here, please text
        something.
      </p>
      <div class="currency-ops">
        <div class="left-top">
          <p class="currency-label">
            <b>{{ $t('dapps.collateral') }}</b>
          </p>
          <div class="currency-picker-container">
            <div>
              <div class="dropdown-text-container dropdown-container">
                <p>
                  <span class="cc ETH cc-icon currency-symbol" />
                  ETH
                  <span class="subname">- Ethereum </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="left-bottom">
          <input
            v-model="ethQty"
            class="currency-picker-container dropdown-text-container dropdown-container"
          />
          <p>{{ $t('dapps.minCollat') }} <b>0.0TODO</b> ETH</p>
          <p>0.00TODO PETH</p>
        </div>
        <div class="arrow">
          <img :src="arrowImage" />
        </div>
        <div class="right-top">
          <p class="currency-label">
            <b>{{ $t('dapps.generate') }}</b>
          </p>
          <div class="currency-picker-container">
            <div>
              <div class="dropdown-text-container dropdown-container">
                <p>
                  <span class="cc DAI cc-icon currency-symbol" />
                  DAI
                  <span class="subname">- Maker DAI </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="right-bottom">
          <input
            v-model="daiQty"
            :class="[
              risky ? 'red-border' : '',
              'currency-picker-container',
              'dropdown-text-container',
              'dropdown-container'
            ]"
          />
          <p>
            {{ $t('dapps.maxGenerate') }} <b>{{ maxDaiDraw }}</b> DAI
          </p>
        </div>
      </div>
      <div class="cdp-info-block cdp-info-entry">
        <ul>
          <li>
            <p>{{ $t('dapps.minEthReq') }}</p>
            <p>0TODO ETH</p>
          </li>
          <li>
            <p>{{ $t('dapps.liquidPrice') }}</p>
            <p>
              <b>{{ liquidationPrice }}</b> USD
            </p>
          </li>
          <li>
            <p>{{ $t('dapps.currentPriceInfo') }}</p>
            <p>{{ ethPrice }} USD</p>
          </li>
          <li>
            <p>{{ $t('dapps.liquidationPenalty') }}</p>
            <p>{{ displayPercentValue(liquidationPenalty) }}%</p>
          </li>
          <li>
            <p>{{ $t('dapps.collateralRatio') }}</p>
            <p>
              <b>{{ displayPercentValue(collatRatio) }}%</b>
            </p>
          </li>
          <li>
            <p>{{ $t('dapps.minimumRatio') }}</p>
            <p>{{ displayPercentValue(liquidationRatio) }}%</p>
          </li>
        </ul>
      </div>
      <div class="cdp-info-block cdp-info-entry">
        <ul>
          <li>
            <p>
              {{
                $t('dapps.stabilityFeeInMkr', {
                  value: displayPercentValue(stabilityFee)
                })
              }}
            </p>
          </li>
        </ul>
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
import Arrow from '@/assets/images/etc/single-arrow.svg';

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
    maker: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      arrowImage: Arrow,
      minEth: 0, // TODO
      wethToPethRatio: 0,
      daiPrice: 0,
      priceFloor: 0,
      ethQty: 0,
      daiQty: 0,
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
    },
    risky() {
      const collRatio = this.collatRatio;
      if (toBigNumber(collRatio).gt(0)) {
        return toBigNumber(collRatio).lte(2);
      }
      return false;
    }
  },
  async mounted() {},
  methods: {
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw
        .times(100)
        .toFixed(2)
        .toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals).toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateCDP';
</style>

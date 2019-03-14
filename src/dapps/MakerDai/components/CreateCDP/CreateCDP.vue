<template>
  <div class="container-maker">
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
            <p>{{ makerCDP.ethPrice }} USD</p>
          </li>
          <li>
            <p>{{ $t('dapps.liquidationPenalty') }}</p>
            <p>{{ displayPercentValue(makerCDP.liquidationPenalty) }}%</p>
          </li>
          <li>
            <p>{{ $t('dapps.collateralRatio') }}</p>
            <p>
              <b>{{ displayPercentValue(collatRatio) }}%</b>
            </p>
          </li>
          <li>
            <p>{{ $t('dapps.minimumRatio') }}</p>
            <p>{{ displayPercentValue(makerCDP.liquidationRatio) }}%</p>
          </li>
        </ul>
      </div>
      <div class="cdp-info-block cdp-info-entry">
        <ul>
          <li>
            <p>
              {{
                $t('dapps.stabilityFeeInMkr', {
                  value: displayPercentValue(makerCDP.stabilityFee).toString()
                })
              }}
            </p>
          </li>
        </ul>
      </div>

      <div class="buttons-container">
        <div
          :class="[
            validInputs ? '' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
          @click="openCdp"
        >
          Collateralize & Generate
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { mapGetters } from 'vuex';
import ethUnit from 'ethjs-unit';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import MakerCDP from '../../MakerCDP';

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
      makerCDP: {}
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
    validInputs() {
      if (toBigNumber(this.ethQty).gt(0)) {
        console.log(ethUnit.toWei(this.ethQty, 'ether').toString()); // todo remove dev item
        console.log(this.account.balance); // todo remove dev item
        return toBigNumber(ethUnit.toWei(this.ethQty, 'ether').toString()).lte(
          this.account.balance
        );
      }
      return false;
    },
    atSetFloor() {
      if (this.priceFloor <= 0) return 0;
      return this.makerCDP.calcMinCollatRatio(this.priceFloor);
    },
    collatRatio() {
      if (this.daiQty <= 0 || this.ethQty <= 0) return 0;
      return this.makerCDP.calcCollatRatio(this.ethQty, this.daiQty);
    },
    liquidationPrice() {
      if (this.daiQty <= 0 || this.ethQty <= 0) return 0;
      return this.makerCDP.calcLiquidationPrice(this.ethQty, this.daiQty);
    },
    maxDaiDraw() {
      if (this.ethQty <= 0) return 0;
      return this.makerCDP.calcDaiDraw(this.ethQty);
    },
    minEthDeposit() {
      if (this.daiQty <= 0) return 0;
      return this.makerCDP.calcMinEthDeposit(this.daiQty);
    },
    risky() {
      const collRatio = this.collatRatio;
      if (toBigNumber(collRatio).gt(0)) {
        return toBigNumber(collRatio).lte(2);
      }
      return false;
    }
  },
  async mounted() {
    this.buildEmpty();
  },
  methods: {
    buildEmpty() {
      const sysVars = {
        ethPrice: this.ethPrice,
        pethPrice: this.pethPrice,
        liquidationRatio: this.liquidationRatio,
        liquidationPenalty: this.liquidationPenalty,
        stabilityFee: this.stabilityFee,
        wethToPethRatio: this.wethToPethRatio
      };
      this.makerCDP = new MakerCDP(
        null,
        this.maker,
        this.priceService,
        this.cdpService,
        sysVars
      );
    },
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
    },
    async openCdp() {
      if (this.ethQty <= 0) return 0;
      const newCdp = await this.makerCDP.openCdp(this.ethQty, this.daiQty);
      console.log(newCdp); // todo remove dev item
      await this.makerCDP.init(newCdp.id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateCDP';
</style>

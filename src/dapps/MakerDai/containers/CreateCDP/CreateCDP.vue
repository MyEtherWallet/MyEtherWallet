<template>
  <div class="container-maker">
    <dai-confirmation-modal
      ref="daiconfirmation"
      :opencdp="openCdp"
      :txinfo="txInfo"
    />
    <loading-overlay v-if="loading" loadingmessage="Creating CDP..." />
    <div class="manage-container">
      <p class="top-title">
        {{ $t('dapps.maker_title') }}
      </p>
      <p class="top-title-sub">
        Please set a value of ETH for collateral, to determine how much DAI you
        would like to generate.
      </p>

      <div class="currency-ops-new">
        <div class="currency-picker-container">
          <div class="interface__block-title">{{ $t('dapps.collateral') }}</div>
          <div class="dropdown-text-container dropdown-container">
            <p>
              <span class="cc ETH cc-icon currency-symbol" />
              ETH
              <span class="subname">- Ethereum </span>
            </p>
          </div>
          <input
            v-model="ethQty"
            class="currency-picker-container dropdown-text-container dropdown-container"
          />
          <div class="input-block-message">
            <p>{{ $t('dapps.minCollat') }} <b>0.0TODO</b> ETH</p>
            <p>{{ depositInPeth }} PETH</p>
          </div>
        </div>
        <div class="arrow"><img :src="arrowImage" /></div>
        <div>
          <div class="interface__block-title">{{ $t('dapps.generate') }}</div>
          <div class="dropdown-text-container dropdown-container">
            <p>
              <span class="cc DAI cc-icon cc-icon-dai currency-symbol" />
              DAI
              <span class="subname">- Maker DAI </span>
            </p>
          </div>
          <input
            v-model="daiQty"
            :class="[
              risky ? 'red-border' : '',
              'currency-picker-container',
              'dropdown-text-container',
              'dropdown-container'
            ]"
          />
          <div class="input-block-message">
            <p>
              {{ $t('dapps.maxGenerate') }} <b>{{ maxDaiDraw }}</b> DAI
            </p>
          </div>
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
          @click="openDaiConfirmation"
        >
          Collateralize & Generate
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ethUnit from 'ethjs-unit';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import MakerCDP from '../../MakerCDP';
import DaiConfirmationModal from '../../components/DaiConfirmationModal';
import LoadingOverlay from '@/components/LoadingOverlay';
import { displayFixedValue, displayPercentValue } from '../../helpers';

import BigNumber from 'bignumber.js';
import Arrow from '@/assets/images/etc/single-arrow.svg';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'dai-confirmation-modal': DaiConfirmationModal,
    'loading-overlay': LoadingOverlay
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
    maker: {
      type: Object,
      default: function() {
        return {};
      }
    },
    makerManager: {
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
      makerCDP: {},
      txInfo: {},
      loading: false
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
        // eslint-disable-next-line
        // eslint-disable-next-line
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
    },
    depositInPeth() {
      if (this.ethQty <= 0) return 0;
      return this.makerCDP.toPeth(this.ethQty);
    }
  },
  async mounted() {
    this.buildEmpty();
  },
  methods: {
    buildEmpty() {
      const sysVars = {
        ethPrice: this.makerManager.ethPrice,
        pethPrice: this.makerManager.pethPrice,
        liquidationRatio: this.makerManager.liquidationRatio,
        liquidationPenalty: this.makerManager.liquidationPenalty,
        stabilityFee: this.makerManager.stabilityFee,
        wethToPethRatio: this.makerManager.wethToPethRatio,
        currentAddress: this.account.address
      };

      const services = {
        priceService: this.priceService,
        cdpService: this.cdpService,
        proxyService: this.proxyService
      };

      this.makerCDP = new MakerCDP(null, this.maker, services, sysVars);
    },
    displayPercentValue,
    displayFixedValue,
    async openCdp() {
      this.loading = true;

      if (this.ethQty <= 0) return 0;
      this.$emit('cdpOpened');

      // [Note from David to Steve] This should be implemented on TX core.
      // Close DAI confirmation modal
      this.$eventHub.$on('showTxConfirmModal', () => {
        if (this.loading) {
          this.$refs.daiconfirmation.$refs.modal.hide();
          this.loading = false;
        }
      });

      await this.makerCDP.openCdp(this.ethQty, this.daiQty);
    },
    openDaiConfirmation() {
      this.$refs.daiconfirmation.$refs.modal.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateCDP';
</style>

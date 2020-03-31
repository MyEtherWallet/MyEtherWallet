<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMCDMaker.generate-title')"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
      static
      lazy
    >
      <div class="contents">
        <div class="inputs">
          <div class="interface__block-title">
            {{ $t('dappsMCDMaker.generate-question') }}
          </div>
          <div class="top-buttons">
            <p class="total">
              <span>{{ $t('dappsMCDMaker.total') }}</span>
              {{ displayFixedValue(newTotal, 10) }}
              <!--              {{ newTotal }}-->
              DAI
            </p>
            <p class="max" @click="maxDai">
              {{ $t('dappsMCDMaker.max-available') }}
            </p>
          </div>
          <div :class="['input-box', allOk ? '' : 'danger']">
            <input v-model="amount" />
            <p class="input-unit">{{ $t('dappsMCDMaker.dai') }}</p>
          </div>
          <div class="sub-text">
            <p v-if="!canGenerateDaiAmount" class="above-max">
              {{ $t('dappsMCDMaker.above-max-dai') }}
            </p>
            <p>
              {{
                $t('dappsMCDMaker.collateral-ratio-val', {
                  value: displayFixedPercent(newCollateralRatio())
                })
              }}
            </p>
          </div>
        </div>
        <expanding-option title="Details">
          <div class="detail-container">
            <div class="grid-block">
              <p>{{ $t('dappsMCDMaker.max-generate-available') }}</p>
              <p>
                <b>{{
                  values.maxDai ? displayFixedValue(values.maxDai) : 0
                }}</b>
                {{ $t('dappsMCDMaker.dai') }}
              </p>
            </div>
            <div class="grid-block">
              <p>
                {{
                  $t('dappsMCDMaker.projectedLiquidation', {
                    currency: currentCdpType
                  })
                }}
              </p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice(), 2) }}</b>
                {{ fiatCurrency }}
              </p>
            </div>
            <div class="grid-block">
              <p>{{ $t('dappsMCDMaker.projected-collat-ratio') }}</p>
              <p>
                <b>{{ displayFixedPercent(newCollateralRatio()) }}%</b>
              </p>
            </div>
          </div>
        </expanding-option>

        <div
          v-if="!newCollateralRatioSafe() && notZero(amount)"
          class="warning-confirmation"
        >
          <div class="grid-block">
            <div class="sign">⚠️</div>
            <div class="text-content">
              <p class="title">{{ $t('dappsMCDMaker.caution') }}</p>
              <p class="warning-details">
                {{
                  $t('dappsMCDMaker.liquidation-risk-multi', {
                    value: displayFixedPercent(newCollateralRatio())
                  })
                }}
              </p>
              <check-box @changeStatus="checkBoxClicked">
                <template v-slot:terms>
                  <p class="checkbox-label">
                    {{ $t('dappsMCDMaker.understand-and-agree') }}
                  </p>
                </template>
              </check-box>
            </div>
          </div>
        </div>

        <div class="buttons">
          <standard-button
            :options="{
              title: $t('common.cancel'),
              buttonStyle: 'green-border',
              noMinWidth: true
            }"
            :click-function="closeModal"
          />
          <standard-button
            :options="{
              title: $t('dappsMCDMaker.generate'),
              buttonStyle: 'green',
              noMinWidth: true
            }"
            :button-disabled="canProceed ? false : true"
            :click-function="submitBtn"
          />
        </div>
        <help-center-button />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ethUnit from 'ethjs-unit';
import ExpandingOption from '@/components/ExpandingOption';
import StandardButton from '@/components/Buttons/StandardButton';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import CheckBox from '../CheckBox';
import BigNumber from 'bignumber.js/bignumber.js';
import {
  displayFixedValue,
  displayPercentValue,
  displayFixedPercent
} from '../../helpers';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'help-center-button': HelpCenterButton,
    'check-box': CheckBox,
    'expanding-option': ExpandingOption,
    'standard-button': StandardButton
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function () {
        return [];
      }
    },
    action: {
      type: String,
      default: ''
    },
    values: {
      type: Object,
      default: function () {
        return {
          maxEthDraw: '',
          maxUsdDraw: '',
          ethCollateral: '',
          usdCollateral: '',
          debtValue: '',
          maxDai: '',
          collateralRatio: '',
          cdpId: ''
        };
      }
    },
    calcCollatRatioEthChg: {
      type: Function,
      default: function () {}
    },
    calcLiquidationPriceEthChg: {
      type: Function,
      default: function () {}
    },
    calcCollatRatioDaiChg: {
      type: Function,
      default: function () {}
    },
    calcLiquidationPriceDaiChg: {
      type: Function,
      default: function () {}
    },
    activeCdpId: {
      type: Number,
      default: 0
    },
    makerActive: {
      type: Boolean,
      default: false
    },
    getValueOrFunction: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      riskyBypass: false,
      modalDetailInformation: false,
      textValues: {},
      fiatCurrency: 'USD',
      digitalCurrency: 'ETH',
      currentCdpType: 'ETH'
    };
  },
  computed: {
    ...mapState('main', ['account', 'gasPrice', 'web3', 'network', 'ens']),
    amountPresent() {
      return (
        (this.amount || this.amount !== '') && !toBigNumber(this.amount).lte(0)
      );
    },
    canCompute() {
      return this.values && this.amountPresent;
    },
    allOk() {
      if (this.amountPresent) {
        return this.newCollateralRatioSafe && this.canGenerateDaiAmount;
      }
      return true;
    },
    showWarning() {
      return (
        !this.newCollateralRatioInvalid &&
        this.canGenerateDaiAmount &&
        this.riskyBypass
      );
    },
    newTotal() {
      return toBigNumber(this.values.debtValue).plus(this.amount);
    },
    hasEnoughEth() {
      if (this.canCompute) {
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    canGenerateDaiAmount() {
      if (this.canCompute && !toBigNumber(this.amount).isNaN()) {
        return toBigNumber(this.amount).lte(toBigNumber(this.values.maxDai));
      }
      return true;
    },
    canProceed() {
      if (this.canCompute) {
        if (toBigNumber(this.amount).lte(0)) return false;
        return (
          (this.newCollateralRatioSafe && this.canGenerateDaiAmount) ||
          (!this.newCollateralRatioInvalid &&
            this.canGenerateDaiAmount &&
            this.riskyBypass)
        );
      }
      return false;
    }
  },
  mounted() {
    this.$refs.modal.$on('shown', () => {
      this.cdpId = this.$route.params.cdpId;
      this.isVisible = true;
      this.amount = 0;
      this.getActiveCdp();
    });

    this.$refs.modal.$on('hidden', () => {
      this.isVisible = false;
    });

    if (this.makerActive) {
      this.getActiveCdp();
    }
  },
  methods: {
    getActiveCdp() {
      if (this.cdpId > 0) {
        this.currentCdp = this.getValueOrFunction('getCdp')(this.cdpId);
        this.currentCdpType = this.currentCdp.cdpCollateralType;
        this.$forceUpdate();
      }
    },
    submitBtn() {
      if (!this.canProceed) return;
      this.drawDai();
    },
    checkBoxClicked(checked) {
      this.riskyBypass = checked;
    },
    displayPercentValue,
    displayFixedValue,
    displayFixedPercent,
    notZero(val) {
      return toBigNumber(val).gt(0);
    },
    maxDai() {
      this.amount = toBigNumber(this.values.maxDai).minus(
        toBigNumber(this.values.maxDai).times(0.01)
      );
      this.$forceUpdate();
    },
    currentDai() {
      this.amount = this.values.debtValue;
    },
    async drawDai() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        if (this.newCollateralRatioSafe) {
          this.currentCdp.drawDai(this.amount, this.riskyBypass);
        } else {
          this.currentCdp.drawDai(this.amount, this.riskyBypass);
        }
      }
    },
    closeModal() {
      this.$refs.modal.hide();
    },
    delayCloseModal() {
      setTimeout(() => {
        this.closeModal();
      }, 200);
    },
    collateralAmount() {
      if (this.currentCdp) {
        return this.currentCdp.collateralAmount;
      }
    },
    newCollateralRatio() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp.calcCollatRatioDaiChg(
          toBigNumber(this.amount),
          true
        );
      } else if (this.currentCdp) {
        return this.currentCdp.collateralizationRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp
          .calcCollatRatioDaiChg(toBigNumber(this.amount), true)
          .gte(2);
      } else if (this.currentCdp) {
        return toBigNumber(this.currentCdp.collateralizationRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp
          .calcCollatRatioDaiChg(toBigNumber(this.amount), true)
          .lte(1.5);
      } else if (this.currentCdp) {
        return toBigNumber(this.currentCdp.collateralizationRatio).lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp.calcLiquidationPriceDaiChg(
          toBigNumber(this.amount),
          true
        );
      } else if (this.currentCdp) {
        return this.currentCdp.liquidationPrice;
      }
      return 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'GenerateModal';
</style>

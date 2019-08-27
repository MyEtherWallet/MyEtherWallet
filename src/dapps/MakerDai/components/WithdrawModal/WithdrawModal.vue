<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMaker.withdrawTitle')"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
      static="true"
      lazy="true"
    >
      <div class="modal-content-container">
        <div class="inputs-container">
          <div class="input-container">
            <p class="message">
              {{ $t('dappsMaker.withdrawNotice') }}
            </p>
            <label> {{ $t('dappsMaker.withdrawQuestion') }}</label>
            <div class="top-buttons">
              <p class="max-withdraw" @click="maxWithdraw">
                {{ $t('dappsMaker.maxWithdraw') }}
              </p>
            </div>
            <div :class="['input-box', newCollateralRatioSafe ? '' : 'danger']">
              <input v-model="amount" />
              <span class="input-unit">{{ digitalCurrency }}</span>
            </div>
            <div class="sub-text">
              <p v-if="canWithdrawEthNotice" class="above-max">
                {{ $t('dappsMaker.overMaxWithdraw') }}
              </p>
              <div class="peth">
                <p class="peth-value">
                  {{
                    values.toPeth
                      ? displayFixedValue(values.toPeth(amount), 5, false)
                      : 0
                  }}
                  PETH
                </p>
                <popover :popcontent="$t('dappsMaker.pethPopover')" />
              </div>
            </div>
          </div>
        </div>

        <expending-option title="Detail Information">
          <div class="padding-container">
            <div class="grid-block">
              <p>{{ $t('dappsMaker.maxWithdrawAvailable') }}</p>
              <p>
                <b>{{
                  values.maxDai ? displayFixedValue(values.maxEthDraw, 5) : 0
                }}</b>
                {{ digitalCurrency }}
              </p>
            </div>

            <div class="grid-block">
              <p>{{ $t('dappsMaker.projectedLiquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice, 2) }}</b>
                {{ fiatCurrency }}
              </p>
            </div>
            <div class="grid-block">
              <p>{{ $t('dappsMaker.projectedCollatRatio') }}</p>
              <p>
                <b
                  >{{
                    displayFixedValue(
                      displayPercentValue(newCollateralRatio),
                      3
                    )
                  }}%</b
                >
              </p>
            </div>
          </div>
        </expending-option>

        <div
          v-if="!newCollateralRatioSafe && notZero(amount)"
          class="warning-confirmation"
        >
          <div class="grid-block">
            <div class="sign">⚠️</div>
            <div class="text-content">
              <p class="title">{{ $t('dappsMaker.caution') }}</p>
              <p class="warning-details">
                {{
                  $t('dappsMaker.liquidationRisk', {
                    value: displayFixedValue(
                      displayPercentValue(newCollateralRatio)
                    )
                  })
                }}
              </p>
              <check-box @changeStatus="checkBoxClicked">
                <template v-slot:terms>
                  <p class="checkbox-label">
                    {{ $t('dappsMaker.understandAndAgree') }}
                  </p>
                </template>
              </check-box>
            </div>
          </div>
        </div>

        <div class="buttons">
          <standard-button
            :options="cancelButton"
            :click-function="closeModal"
          />
          <standard-button
            :options="submitButton"
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
import ExpendingOption from '@/components/ExpendingOption';
import StandardButton from '@/components/Buttons/StandardButton';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import CheckBox from '../CheckBox';
import BigNumber from 'bignumber.js/bignumber.js';
import { displayFixedValue, displayPercentValue } from '../../helpers';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'help-center-button': HelpCenterButton,
    'check-box': CheckBox,
    'expending-option': ExpendingOption,
    'standard-button': StandardButton
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    action: {
      type: String,
      default: ''
    },
    values: {
      type: Object,
      default: function() {
        return {
          maxPethDraw: '',
          maxEthDraw: '',
          maxUsdDraw: '',
          ethCollateral: '',
          pethCollateral: '',
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
      default: function() {}
    },
    calcLiquidationPriceEthChg: {
      type: Function,
      default: function() {}
    },
    calcCollatRatioDaiChg: {
      type: Function,
      default: function() {}
    },
    calcLiquidationPriceDaiChg: {
      type: Function,
      default: function() {}
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
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        noMinWidth: true
      },
      submitButton: {
        title: 'Submit',
        buttonStyle: 'green',
        noMinWidth: true
      }
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    amountPresent() {
      return (
        (this.amount || this.amount !== '') && !toBigNumber(this.amount).lte(0)
      );
    },
    canCompute() {
      return this.values && this.amountPresent;
    },
    canWithdrawEthNotice() {
      if (this.amountPresent) {
        return !toBigNumber(this.amount).lte(
          toBigNumber(this.values.maxEthDraw)
        );
      }
      return false;
    },
    canWithdrawEthAmount() {
      if (this.amountPresent) {
        return toBigNumber(this.amount).lte(
          toBigNumber(this.values.ethCollateral)
        );
      }
      return false;
    },
    canProceed() {
      if (this.amountPresent) {
        if (toBigNumber(this.amount).lte(0)) return false;
        return (
          (this.newCollateralRatioSafe && this.canWithdrawEthAmount) ||
          (!this.newCollateralRatioInvalid &&
            this.canWithdrawEthAmount &&
            this.riskyBypass)
        );
      }
      return false;
    },
    calcCollateralRatio() {
      if (this.canCompute) {
        return this.calcCollatRatioDaiChg(
          toBigNumber(this.values.debtValue).plus(this.amount)
        );
      }
      if (this.values) {
        return this.values.collateralRatio;
      }
    },
    newCollateralRatio() {
      if (this.canCompute) {
        return this.calcCollatRatioEthChg(
          toBigNumber(this.values.ethCollateral).minus(this.amount)
        );
      } else if (this.values) {
        return this.values.collatRatio;
      }
      return '--';
    },
    newCollateralRatioSafe() {
      if (this.canCompute) {
        if (this.values.zeroDebt) return true;
        return this.newCollateralRatio.gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.canCompute) {
        if (this.values.zeroDebt) return false;
        return this.newCollateralRatio.lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.canCompute) {
        return this.calcLiquidationPriceEthChg(
          toBigNumber(this.values.ethCollateral).minus(this.amount)
        );
      } else if (this.values) {
        return this.values.liquidationPrice;
      }
      return 0;
    }
  },
  watch: {},
  mounted() {
    this.$refs.modal.$on('shown', () => {
      this.amount = 0;
    });
    this.$refs.modal.$on('hidden', () => {
      this.amount = 0;
    });
  },
  methods: {
    submitBtn() {
      if (!this.canProceed) return;
      this.freeEth();
    },
    checkBoxClicked(checked) {
      this.riskyBypass = checked;
    },
    displayPercentValue,
    displayFixedValue,
    notZero(val) {
      return toBigNumber(val).gt(0);
    },
    maxWithdraw() {
      this.amount = this.values.maxEthDraw;
      this.$forceUpdate();
    },
    currentDai() {
      this.amount = this.values.debtValue;
    },
    async freeEth() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        if (this.newCollateralRatioSafe) {
          this.$emit('freeEth', [this.amount, null]);
        } else {
          this.$emit('freeEth', [this.amount, this.riskyBypass]);
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WithdrawModal';
</style>

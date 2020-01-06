<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMCDMaker.withdraw-title')"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
      static
      lazy
    >
      <div class="modal-content-container">
        <div class="inputs-container">
          <div class="input-container">
            <p class="message">{{ $t('dappsMCDMaker.withdraw-notice') }}</p>
            <label>
              {{
                $t('dappsMCDMaker.withdraw-question-mcd', {
                  currency: currentCdpType
                })
              }}
            </label>
            <div class="top-buttons">
              <p class="max-withdraw" @click="maxWithdraw">
                {{ $t('dappsMCDMaker.max-available') }}
              </p>
            </div>
            <div
              :class="['input-box', newCollateralRatioSafe() ? '' : 'danger']"
            >
              <input v-model="amount" />
              <span class="input-unit">{{ digitalCurrency }}</span>
            </div>
            <div class="sub-text">
              <p v-if="canWithdrawEthNotice" class="above-max">
                {{ $t('dappsMCDMaker.over-max-withdraw') }}
              </p>
            </div>
          </div>
        </div>

        <expanding-option :title="$t('dappsMCDMaker.detail-information')">
          <div class="padding-container">
            <div class="grid-block">
              <p>{{ $t('dappsMCDMaker.max-available') }}</p>
              <p>
                <b>
                  {{
                    values.maxDai ? displayFixedValue(values.maxEthDraw, 5) : 0
                  }}
                </b>
                {{ digitalCurrency }}
              </p>
            </div>

            <div class="grid-block">
              <p>{{ $t('dappsMCDMaker.projected-liquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice(), 2) }}</b>
                {{ fiatCurrency }}
              </p>
            </div>
            <div class="grid-block">
              <p>{{ $t('dappsMCDMaker.projected-collat-ratio') }}</p>
              <p>
                <b>
                  {{
                    displayFixedValue(
                      displayPercentValue(newCollateralRatio()),
                      3
                    )
                  }}%
                </b>
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
                    value: displayFixedValue(
                      displayPercentValue(newCollateralRatio())
                    )
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
              title: $t('common.submit'),
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
import ExpandingOption from '@/components/ExpandingOption';
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
    'expanding-option': ExpandingOption,
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
      currentCdpType: 'ETH'
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
      return this.values && this.amountPresent && this.currentCdp;
    },
    canWithdrawEthNotice() {
      if (this.amountPresent && this.currentCdp) {
        return !toBigNumber(this.amount).lte(
          toBigNumber(this.currentCdp.maxEthDraw)
        );
      }
      return false;
    },
    canWithdrawEthAmount() {
      if (this.amountPresent && this.currentCdp) {
        return toBigNumber(this.amount).lte(
          toBigNumber(this.currentCdp.collateralValue)
        );
      }
      return false;
    },
    canProceed() {
      if (this.amountPresent && this.currentCdp) {
        if (toBigNumber(this.amount).lte(0)) return false;
        return (
          (this.newCollateralRatioSafe() && this.canWithdrawEthAmount) ||
          (!this.newCollateralRatioInvalid() &&
            this.canWithdrawEthAmount &&
            this.riskyBypass)
        );
      }
      return false;
    },
    calcCollateralRatio() {
      if (this.canCompute && this.currentCdp) {
        return this.calcCollatRatioEthChg(
          toBigNumber(this.currentCdp.debtValue).plus(this.amount)
        );
      }
      if (this.values) {
        return this.values.collateralRatio;
      }
      return null;
    }
  },
  watch: {},
  mounted() {
    this.$refs.modal.$on('shown', () => {
      this.cdpId = this.$route.params.cdpId;
      this.isVisible = true;
      this.amount = 0;
      this.getActiveCdp();
    });
    this.$refs.modal.$on('hidden', () => {
      this.amount = 0;
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
    collateralAmount() {
      if (this.currentCdp) {
        return this.currentCdp.collateralAmount;
      }
    },
    newCollateralRatio() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp.calcCollatRatioEthChg(
          toBigNumber(this.currentCdp.collateralAmount).minus(this.amount)
        );
      } else if (this.currentCdp) {
        return this.currentCdp.collateralizationRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.currentCdp && this.amount > 0) {
        if (
          this.currentCdp
            .calcCollatRatioEthChg(
              toBigNumber(this.currentCdp.collateralAmount).minus(this.amount)
            )
            .eq(0)
        ) {
          return true;
        }
        return this.currentCdp
          .calcCollatRatioEthChg(
            toBigNumber(this.currentCdp.collateralAmount).minus(this.amount)
          )
          .gte(2);
      } else if (this.currentCdp) {
        return toBigNumber(this.currentCdp.collateralizationRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.currentCdp && this.amount > 0) {
        if (
          this.currentCdp
            .calcCollatRatioEthChg(
              toBigNumber(this.currentCdp.collateralAmount).minus(this.amount)
            )
            .eq(0)
        ) {
          return false;
        }
        return this.currentCdp
          .calcCollatRatioEthChg(
            toBigNumber(this.currentCdp.collateralAmount).minus(this.amount)
          )
          .lte(1.5);
      } else if (this.currentCdp) {
        return toBigNumber(this.currentCdp.collateralizationRatio).lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp.calcLiquidationPriceEthChg(
          toBigNumber(this.currentCdp.collateralAmount).minus(
            toBigNumber(this.amount)
          )
        );
      } else if (this.currentCdp) {
        return this.currentCdp.liquidationPrice;
      }
      return 0;
    },
    getProxyAllowances() {
      const allowances = this.getValueOrFunction('proxyAllowances');
      if (allowances) {
        return allowances;
      }
      return {};
    },
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
      this.amount = this.currentCdp.maxEthDraw;
      this.$forceUpdate();
    },
    async freeEth() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        if (this.newCollateralRatioSafe()) {
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

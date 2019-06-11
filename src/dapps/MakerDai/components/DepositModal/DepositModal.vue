<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMaker.depositTitle')"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
    >
      <div class="modal-content-container">
        <div class="inputs-container">
          <div class="input-container">
            <div class="interface__block-title">
              {{ $t('dappsMaker.depositQuestion') }}
            </div>
            <div :class="['input-box', hasEnoughEth ? '' : 'danger']">
              <input v-model="amount" />
              <span class="input-unit">{{ digitalCurrency }}</span>
            </div>
            <div class="sub-text">
              <p v-if="!hasEnoughEth" class="above-max">{{ $t('dappsMaker.notEnoughEth') }}</p>
              <div class="peth">
                <p>
                  {{
                  values.toPeth
                  ? displayFixedValue(values.toPeth(amount), 5, false)
                  : 0
                  }}
                  PETH
                </p>
                <popover popcontent="$t('dappsMaker.pethPopover')" />
              </div>
            </div>
          </div>
        </div>

        <div class="detail-info">
          <div class="info">
            <h4>{{ $t('dappsMaker.DetailInfo') }}</h4>
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  type="checkbox"
                  @click="modalDetailInformation = !modalDetailInformation"
                />
                <span class="slider round" />
              </label>
            </div>
          </div>
          <div
            :class="modalDetailInformation && 'expended-info-open'"
            class="expended-info"
          >
            <div class="padding-container">
              <div class="grid-block">
                <p>{{ $t('dappsMaker.currentlyDeposited') }}</p>
                <p>
                  <b>{{ displayFixedValue(values.ethCollateral, 5) }}</b>
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
import ethUnit from 'ethjs-unit';
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
    hasEnoughEth() {
      if (this.amount || this.amount !== '') {
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    canWithdrawEthAmount() {
      if (this.amount || this.amount !== '') {
        return toBigNumber(this.amount).lte(
          toBigNumber(this.values.ethCollateral)
        );
      }
      return false;
    },
    canProceed() {
      if (toBigNumber(this.amount).lte(0)) return false;
      const ratio = toBigNumber(this.newCollateralRatio);
      const ratioOk = ratio.gt(1.5) || ratio.eq(0);
      return this.hasEnoughEth && (ratioOk || this.riskyBypass);
    },
    newCollateralRatio() {
      if (this.values && this.amount > 0) {
        return this.calcCollatRatioEthChg(
          toBigNumber(this.values.ethCollateral).plus(this.amount)
        );
      } else if (this.values) {
        return this.values.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.values && this.amount > 0) {
        return this.calcCollatRatioEthChg(
          toBigNumber(this.values.ethCollateral).plus(this.amount)
        ).gte(2);
      } else if (this.values) {
        return toBigNumber(this.values.collatRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.values && this.amount > 0) {
        return this.calcCollatRatioEthChg(
          toBigNumber(this.values.ethCollateral).plus(this.amount)
        ).lte(1.5);
      } else if (this.values) {
        return toBigNumber(this.values.collatRatio).lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.values && this.amount > 0) {
        return this.calcLiquidationPriceEthChg(
          toBigNumber(this.values.ethCollateral).plus(toBigNumber(this.amount))
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
  },
  methods: {
    submitBtn() {
      if (!this.canProceed) return;
      this.lockEth();
    },
    checkBoxClicked() {
      this.riskyBypass = !this.riskyBypass;
    },
    displayPercentValue,
    displayFixedValue,
    notZero(val) {
      return toBigNumber(val).gt(0);
    },
    currentDai() {
      this.amount = this.values.debtValue;
    },
    async lockEth() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        this.$emit('lockEth', this.amount);
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
@import 'DepositModal';
</style>

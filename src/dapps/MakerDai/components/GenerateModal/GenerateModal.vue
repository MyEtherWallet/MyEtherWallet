<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMaker.generateTitle')"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
    >
      <div class="contents">
        <div class="inputs">
          <div class="interface__block-title">
            {{ $t('dappsMaker.generateQuestion') }}
          </div>
          <div class="top-buttons">
            <p class="total">
              <span>{{ $t('dappsMaker.total') }}</span>
              {{ activeCdp.maxDai ? displayFixedValue(activeCdp.maxDai) : 0 }}
              DAI
            </p>
            <p class="max" @click="maxDai">
              {{ $t('dappsMaker.maxBalance') }}
            </p>
          </div>
          <div :class="['input-box', allOk ? '' : 'danger']">
            <input v-model="amount" />
            <p class="input-unit">DAI</p>
          </div>
          <div class="sub-text">
            <p> {{ $t('dappsMaker.collateralRatioVal', {value: newCollateralRatio}) }} </p>
            <p v-if="!canGenerateDaiAmount" class="above-max">
              {{ $t('dappsMaker.aboveMaxDai') }}
            </p>
          </div>
        </div>
        <expending-option title="Details">
          <!-- Generate Dai -->
          <div v-if="action === 'generate'" class="detail-container">
            <div class="grid-block">
              <p>{{ $t('dappsMaker.maxGenerateAvailable') }}</p>
              <p>
                <b>
                  {{
                    activeCdp.maxDai ? displayFixedValue(activeCdp.maxDai) : 0
                  }}
                </b>
                DAI
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
                <b>{{ newCollateralRatio }}%</b>
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
              <p class="title">{{ $t('dappsMaker.Caution') }}</p>
              <p class="warning-details">
                {{
                  $t('dappsMaker.liquidationRisk', {
                    value: newCollateralRatio
                  })
                }}
              </p>
              <check-box @changeStatus="checkBoxClicked">
                <template v-slot:terms
                  ><p class="checkbox-label">
                    {{ $t('dappsMaker.understandAndAgree') }}
                  </p></template
                >
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
            :options="generateButton"
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
import { mapGetters } from 'vuex';
import ethUnit from 'ethjs-unit';
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
    activeCdp: {
      type: Object,
      default: function() {
        return {};
      }
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
      generateButton: {
        title: 'Generate',
        buttonStyle: 'green',
        noMinWidth: true
      }
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      account: 'account'
    }),
    amountPresent() {
      return (
        (this.amount || this.amount !== '') && !toBigNumber(this.amount).lte(0)
      );
    },
    canCompute() {
      return this.activeCdp && this.amountPresent;
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
    hasEnoughEth() {
      if (this.canCompute) {
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    hasEnoughDai() {
      // TODO Figure out how to learn how much dai a user has (the code below should work)
      if (this.canCompute) {
        // const daiToken = this.tokensWithBalance.find(item => {
        //   return item.symbol.toUpperCase() === 'DAI';
        // });
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    canGenerateDaiAmount() {
      if (this.canCompute) {
        return toBigNumber(this.amount).lte(toBigNumber(this.activeCdp.maxDai));
      }
      return true;
    },
    canProceed() {
      if (this.canCompute) {
        if (toBigNumber(this.amount).lte(0)) return false;
        // if (!ratioOk) return false;
        return (
          (this.newCollateralRatioSafe && this.canGenerateDaiAmount) ||
          (!this.newCollateralRatioInvalid &&
            this.canGenerateDaiAmount &&
            this.riskyBypass)
        );
      }
      return false;
    },
    newCollateralRatio() {
      if (this.canCompute) {
        return this.displayFixedValue(
          this.displayPercentValue(
            this.activeCdp.calcCollatRatioDaiChg(
              this.activeCdp.debtValue.plus(this.amount)
            )
          )
        );
      }
      return '--';
    },
    newCollateralRatioSafe() {
      if (this.canCompute) {
        return this.activeCdp
          .calcCollatRatioDaiChg(this.activeCdp.debtValue.plus(this.amount))
          .gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.canCompute) {
        return this.activeCdp
          .calcCollatRatioDaiChg(this.activeCdp.debtValue.plus(this.amount))
          .lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.canCompute) {
        return this.activeCdp.calcLiquidationPriceDaiChg(
          this.activeCdp.debtValue.plus(this.amount)
        );
      } else if (this.activeCdp) {
        return this.activeCdp.liquidationPrice;
      }
      return 0;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    submitBtn() {
      if (!this.canProceed) return;
      this.drawDai();
    },
    checkBoxClicked(checked) {
      this.riskyBypass = checked; //!this.riskyBypass;
    },
    displayPercentValue,
    displayFixedValue,
    notZero(val) {
      return toBigNumber(val).gt(0);
    },
    maxDai() {
      this.amount = this.activeCdp.maxDai.minus(
        this.activeCdp.maxDai.times(0.01)
      );
      this.$forceUpdate();
    },
    currentDai() {
      this.amount = this.activeCdp.debtValue;
    },
    async drawDai() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        if (this.newCollateralRatioSafe) {
          await this.activeCdp.drawDai(this.amount);
        } else {
          await this.activeCdp.drawDai(this.amount, this.riskyBypass);
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
@import 'GenerateModal';
</style>

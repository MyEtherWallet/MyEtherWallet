<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="getTitleText()"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
    >
      <div class="modal-content-container">
        <div class="inputs-container">
          <!-- Withdraw ETH -->
          <div class="input-container">
            <p class="message">
              <!-- TODO FOR TRANSLATE -->
              You might be requested to sign up to three trasactions if there is
              not enough allowance in DAI and/or MKR to complete this
              transaction.
            </p>
            <label
              >How much {{ digitalCurrency }} would you like to withdraw?</label
            ><!-- TODO FOR TRANSLATE -->
            <div class="top-buttons">
              <!-- TODO FOR TRANSLATE -->
              <p class="max-withdraw" @click="maxWithdraw">
                Max withdraw amount
              </p>
            </div>
            <div :class="['input-box', newCollateralRatioSafe ? '' : 'danger']">
              <input v-model="amount" />
              <span class="input-unit">{{ digitalCurrency }}</span>
            </div>
            <div class="sub-text">
              <!--            <p v-if="!canGenerateDaiAmount">Above Max Dai Amount</p>-->
              <!-- TODO FOR TRANSLATE -->
              <div class="peth">
                <p class="peth-value">
                  {{
                    activeCdp.toPeth
                      ? displayFixedValue(activeCdp.toPeth(amount), 5, false)
                      : 0
                  }}
                  PETH
                </p>
                <popover
                  popcontent="Pooled ETH, which means it joins a large pool of Ethereum that is the collateral for all Dai created."
                />
              </div>
            </div>
          </div>
        </div>

        <expending-option title="Detail Information">
          <!-- Withdraw ETH -->
          <div v-if="action === 'withdraw'" class="padding-container">
            <div class="grid-block">
              <p>Max Available to Withdraw</p>
              <!-- TODO FOR TRANSLATE -->
              <p>
                <b>{{
                  activeCdp.maxDaiDraw
                    ? displayFixedValue(activeCdp.maxDaiDraw(), 3)
                    : 0
                }}</b>
                {{ digitalCurrency }}
              </p>
            </div>

            <div class="grid-block">
              <p>{{ $t('dapps.projectedLiquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice, 2) }}</b>
                {{ fiatCurrency }}
              </p>
            </div>
            <div class="grid-block">
              <p>{{ $t('dapps.projectedCollatRatio') }}</p>
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
              <p class="title">Caution</p>
              <p class="warning-details">
                Your new collateral ratio of
                {{
                  displayFixedValue(displayPercentValue(newCollateralRatio))
                }}% may place CDP at risk of liquidation.
              </p>
              <check-box @changeStatus="checkBoxClicked">
                <template v-slot:terms
                  ><p class="checkbox-label">
                    I understand and agree with it.
                  </p></template
                >
                <!-- TODO FOR TRANSLATE -->
              </check-box>
            </div>
          </div>
        </div>

        <div class="buttons">
          <standard-button :options="cancelButton" @click="closeModal" />
          <standard-button
            :options="submitButton"
            :button-disabled="canProceed ? false : true"
            :click-function="submitBtn"
          />
        </div>

        <help-center-button />
      </div>
      <!-- .modal-content-container -->
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ExpendingOption from '@/components/ExpendingOption';
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
      submitButton: {
        title: 'Submit',
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
    hasEnoughEth() {
      if (this.amountPresent) {
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    hasEnoughDai() {
      // TODO Figure out how to learn how much dai a user has (the code below should work)
      if (this.amountPresent) {
        // const daiToken = this.tokensWithBalance.find(item => {
        //   return item.symbol.toUpperCase() === 'DAI';
        // });
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    canWithdrawEthAmount() {
      if (this.amountPresent) {
        return toBigNumber(this.amount).lte(
          toBigNumber(this.activeCdp.ethCollateral)
        );
      }
      return false;
    },
    canGenerateDaiAmount() {
      if (this.amountPresent) {
        return toBigNumber(this.amount).lte(toBigNumber(this.activeCdp.maxDai));
      }
      return true;
    },
    canProceed() {
      if (this.amountPresent) {
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
        return this.activeCdp.calcCollatRatioEthChg(
          this.activeCdp.ethCollateral.minus(this.amount)
        );
      } else if (this.activeCdp) {
        return this.activeCdp.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.canCompute) {
        return this.activeCdp
          .calcCollatRatioEthChg(
            this.activeCdp.ethCollateral.minus(this.amount)
          )
          .gte(2);
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.canCompute) {
        return this.activeCdp
          .calcCollatRatioEthChg(
            this.activeCdp.ethCollateral.minus(this.amount)
          )
          .lte(1.5);
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.canCompute) {
        return this.activeCdp.calcLiquidationPriceEthChg(
          this.activeCdp.ethCollateral.minus(this.amount)
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
      this.amount = this.activeCdp.maxEthDraw.minus(
        this.activeCdp.maxEthDraw.times(0.0001)
      );
      this.$forceUpdate();
    },
    currentDai() {
      this.amount = this.activeCdp.debtValue;
    },
    async freeEth() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        await this.activeCdp.freeEth(this.amount);
      }
    },
    getTitleText() {
      return 'Withdraw Collateral';
      // <!-- TODO FOR TRANSLATE -->
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

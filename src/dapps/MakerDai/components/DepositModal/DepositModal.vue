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
          <!-- Deposit ETH -->
          <div v-if="action === 'deposit'" class="input-container">
            <div class="interface__block-title">
              {{ $t('dappsMaker.depositQuestion') }}
            </div>
            <div :class="['input-box', hasEnoughEth ? '' : 'danger']">
              <input v-model="amount" />
              <span class="input-unit">{{ digitalCurrency }}</span>
            </div>
            <div class="sub-text">
              <!--            <p class="btn" @click="maxDeposit">Max</p>-->
              <!-- TODO FOR TRANSLATE -->
              <p>
                {{
                  activeCdp.toPeth
                    ? displayFixedValue(activeCdp.toPeth(amount), 5, false)
                    : 0
                }}
                PETH
              </p>
              <popover popcontent="$t('dappsMaker.pethPopover')" />
              <p v-if="!hasEnoughEth">{{ $t('dappsMaker.notEnoughEth') }}</p>
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
            <!-- Deposit ETH -->
            <div v-if="action === 'deposit'" class="padding-container">
              <div class="grid-block">
                <p>{{ $t('dappsMaker.currentlyDeposited') }}</p>
                <p>
                  <b>{{ displayFixedValue(activeCdp.ethCollateralNum, 2) }}</b>
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
        <!--        <div v-if="!newCollateralRatioSafe && notZero(amount)">
          <check-box @changeStatus="checkBoxClicked">
            <template v-slot:terms>
              <span v-if="!newCollateralRatioInvalid">
                I understand the new collateral ratio of
                {{
                  displayFixedValue(displayPercentValue(newCollateralRatio))
                }}% may place my cdp at risk of liquidation.
                &lt;!&ndash; TODO FOR TRANSLATE &ndash;&gt;
              </span>
              <span v-if="newCollateralRatioInvalid" style="color: red;">
                I understand the new collateral ratio of
                {{
                  displayFixedValue(displayPercentValue(newCollateralRatio))
                }}% WILL place my cdp at risk of liquidation.
              </span>
            </template>
            &lt;!&ndash; TODO FOR TRANSLATE &ndash;&gt;
          </check-box>
        </div>-->
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
import { mapGetters } from 'vuex';
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
          toBigNumber(this.activeCdp.ethCollateral)
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
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp.calcCollatRatioEthChg(
          this.activeCdp.ethCollateral.plus(this.amount)
        );
      } else if (this.activeCdp) {
        return this.activeCdp.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp
          .calcCollatRatioEthChg(this.activeCdp.ethCollateral.plus(this.amount))
          .gte(2);
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp
          .calcCollatRatioEthChg(this.activeCdp.ethCollateral.plus(this.amount))
          .lte(1.5);
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp.calcLiquidationPriceEthChg(
          this.activeCdp.ethCollateral.plus(toBigNumber(this.amount))
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
    maxDeposit() {
      // this.amount = this.activeCdp.maxDai.minus(
      //   this.activeCdp.maxDai.times(0.01)
      // );
    },
    currentDai() {
      this.amount = this.activeCdp.debtValue;
    },
    async lockEth() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        await this.activeCdp.lockEth(this.amount);
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

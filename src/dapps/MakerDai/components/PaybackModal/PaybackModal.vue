<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="getTitleText()"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
    >
      <div class="contents">
        <p class="top-message">
          You might be requested to sign up to three trasactions if there is not
          enough allowance in DAI and/or MKR to complete this transaction.
        </p>

        <div v-if="action === 'payback'" class="input-container">
          <div class="interface__block-title">
            How much DAI would you like to payback?
          </div>
          <div class="dai-amount">
            <input v-model="amount" />
            <p class="floating-text">DAI</p>
            <p class="btn" @click="currentDai">Set Max</p>
          </div>
        </div>

        <expending-option title="Detail Information">
          <ul class="details">
            <li>
              <p>Outstanding Dai Generated<!-- TODO FOR TRANSLATE --></p>
              <p>
                <b>{{
                  activeCdp.debtValue
                    ? displayFixedValue(activeCdp.debtValue, 3)
                    : 0
                }}</b>
                DAI
              </p>
            </li>
            <li>
              <p>Stability Fee Owed<!-- TODO FOR TRANSLATE --></p>
              <p><b>0.00%</b> MKR</p>
            </li>
            <li>
              <p>{{ $t('dapps.projectedLiquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice, 2) }}</b>
                {{ fiatCurrency }}
              </p>
            </li>
            <li>
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
            </li>
          </ul>
        </expending-option>

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
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ethUnit from 'ethjs-unit';
import ExpendingOption from '@/components/ExpendingOption';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import CheckBox from '../CheckBox';
import BigNumber from 'bignumber.js/bignumber.js';
import { displayFixedValue, displayPercentValue } from '../../helpers';
import StandardButton from '@/components/Buttons/StandardButton';

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
        noMinWidth: true,
        fullWidth: true
      },
      submitButton: {
        title: 'Submit',
        buttonStyle: 'green',
        noMinWidth: true,
        fullWidth: true
      }
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      account: 'account'
    }),
    hasEnoughEth() {
      if (this.amount || this.amount !== '') {
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    hasEnoughDai() {
      // TODO Figure out how to learn how much dai a user has (the code below should work)
      if (this.amount || this.amount !== '') {
        // const daiToken = this.tokensWithBalance.find(item => {
        //   return item.symbol.toUpperCase() === 'DAI';
        // });
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
    canGenerateDaiAmount() {
      if (this.amount || this.amount !== '') {
        return toBigNumber(this.amount).lte(toBigNumber(this.activeCdp.maxDai));
      }
      return true;
    },
    canProceed() {
      if (toBigNumber(this.amount).lte(0)) return false;
      const ratio = toBigNumber(this.newCollateralRatio);
      const ratioSafe = ratio.gt(2) || ratio.eq(0);
      const ratioOk = ratio.gt(1.5) || ratio.eq(0);
      if (!ratioOk) return false;
      return (
        (this.canWithdrawEthAmount && ratioSafe) ||
        (this.canWithdrawEthAmount && ratioOk && this.riskyBypass)
      );
    },
    newCollateralRatio() {
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp.calcCollatRatioDaiChg(
          this.activeCdp.debtValue.minus(this.amount)
        );
      } else if (this.activeCdp) {
        return this.activeCdp.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.activeCdp && this.amount > 0) {
        const ratio = this.activeCdp.calcCollatRatioDaiChg(
          this.activeCdp.debtValue.minus(this.amount)
        );
        if (ratio.lte(new BigNumber(0.000009))) {
          return true;
        }
        return ratio.gte(2);
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.activeCdp && this.amount > 0) {
        const ratio = this.activeCdp.calcCollatRatioDaiChg(
          this.activeCdp.debtValue.minus(this.amount)
        );
        console.log(ratio.toString()); // todo remove dev item
        if (ratio.lte(new BigNumber(0.000009))) {
          return true;
        }
        return ratio.gte(1.5);
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp.calcLiquidationPriceDaiChg(
          this.activeCdp.debtValue.minus(this.amount)
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
      this.wipeDai();
    },
    checkBoxClicked() {
      this.riskyBypass = !this.riskyBypass;
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
    },
    currentDai() {
      this.amount = this.activeCdp.debtValue;
    },
    async wipeDai() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        await this.activeCdp.wipeDai(this.amount);
      }
    },

    getTitleText() {
      return 'Payback DAI';
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
@import 'PaybackModal';
</style>

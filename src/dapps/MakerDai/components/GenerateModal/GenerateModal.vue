<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="getTitleText()"
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      hide-footer
    >
      <div class="inputs-container">
        <!-- Generate Dai -->
        <div v-if="action === 'generate'" class="input-container">
          <label>How much DAI would you like to generate?</label
          ><!-- TODO FOR TRANSLATE -->
          <div
            :class="[
              'input-box',
              newCollateralRatioSafe && canGenerateDaiAmount ? '' : 'danger'
            ]"
          >
            <input v-model="amount" /> <span class="input-unit">DAI</span>
          </div>
          <div class="sub-text">
            <p v-if="!canGenerateDaiAmount">Above Max Dai Amount</p>
            <!-- TODO FOR TRANSLATE -->
            <p class="btn" @click="maxDai">Max</p>
            <!-- TODO FOR TRANSLATE -->
            <p>{{ newCollateralRatio }}%</p>
          </div>
        </div>
      </div>

      <div class="detail-info">
        <div class="info">
          <h4>Detail Information</h4>
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
          <!-- Generate Dai -->
          <div v-if="action === 'generate'" class="padding-container">
            <div class="grid-block">
              <p>Max Available to Generate</p>
              <!-- TODO FOR TRANSLATE -->
              <p>
                <b>{{
                  activeCdp.maxDai ? displayFixedValue(activeCdp.maxDai) : 0
                }}</b>
                DAI
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
                <b>{{ newCollateralRatio }}%</b>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!newCollateralRatioSafe && notZero(amount)">
        <check-box @changeStatus="checkBoxClicked">
          <template v-slot:terms>
            <span v-if="!newCollateralRatioInvalid">
              I understand the new collateral ratio of
              {{ newCollateralRatio }}% may place my cdp at risk of liquidation.
            </span>
            <span v-if="newCollateralRatioInvalid" style="color: red;">
              I understand the new collateral ratio of
              {{ newCollateralRatio }}% WILL place my cdp at risk of
              liquidation.
            </span> </template
          ><!-- TODO FOR TRANSLATE -->
        </check-box>
      </div>
      <div class="buttons-container">
        <div
          :class="['cancel-btn', canProceed ? '' : 'disable']"
          @click="closeModal"
        >
          Cancel<!-- TODO FOR TRANSLATE -->
        </div>
        <div
          :class="['submit-btn', canProceed ? '' : 'disable']"
          @click="submitBtn"
        >
          Submit<!-- TODO FOR TRANSLATE -->
        </div>
      </div>
      <help-center-button />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ethUnit from 'ethjs-unit';

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
    'check-box': CheckBox
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
      digitalCurrency: 'ETH'
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
      const ratioOk = ratio.gt(1.5) || ratio.eq(0);
      return this.canGenerateDaiAmount && (ratioOk || this.riskyBypass);
    },
    newCollateralRatio() {
      if (this.activeCdp && this.amount > 0) {
        return this.displayFixedValue(
          this.displayPercentValue(
            this.activeCdp.calcCollatRatioDaiChg(
              this.activeCdp.debtValue.plus(this.amount)
            )
          )
        );
      } else if (this.activeCdp) {
        return this.displayFixedValue(
          this.displayPercentValue(this.activeCdp.collatRatio)
        );
      }
      return '--';
    },
    newCollateralRatioSafe() {
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp
          .calcCollatRatioDaiChg(this.activeCdp.debtValue.plus(this.amount))
          .gte(2);
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.activeCdp && this.amount > 0) {
        return this.activeCdp
          .calcCollatRatioDaiChg(this.activeCdp.debtValue.plus(this.amount))
          .lte(1.5);
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.activeCdp && this.amount > 0) {
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
      this.$forceUpdate();
    },
    currentDai() {
      this.amount = this.activeCdp.debtValue;
    },
    async drawDai() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        await this.activeCdp.drawDai(this.amount);
      }
    },
    getTitleText() {
      return 'Generate DAI';
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

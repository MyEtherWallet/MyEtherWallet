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
        <!-- Deposit ETH -->
        <div v-if="action === 'deposit'" class="input-container">
          <label>How much ETH would you like to deposit?</label
          ><!-- TODO FOR TRANSLATE -->
          <div :class="['input-box', hasEnoughEth ? '' : 'danger']">
            <input v-model="amount" />
            <span class="input-unit">{{ digitalCurrency }}</span>
          </div>
          <div class="sub-text">
            <p v-if="!hasEnoughEth">Not Enough Balance</p>
            <!-- TODO FOR TRANSLATE -->
            <p>
              {{
                activeCdp.toPeth
                  ? displayFixedValue(activeCdp.toPeth(amount), 5, false)
                  : 0
              }}
              PETH
            </p>
          </div>
        </div>
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
            <p>
              {{ displayFixedValue(displayPercentValue(newCollateralRatio)) }}%
            </p>
            <div v-if="!newCollateralRatioSafe && notZero(amount)">
              <check-box>
                <template v-slot:terms>
                  I understand the new collateral ratio of
                  {{
                    displayFixedValue(displayPercentValue(newCollateralRatio))
                  }}% may place my cdp at risk of liquidation. </template
                ><!-- TODO FOR TRANSLATE -->
              </check-box>
            </div>
          </div>
        </div>
        <!-- Withdraw ETH -->
        <div v-if="action === 'withdraw'" class="input-container">
          <p>
            <!-- TODO FOR TRANSLATE -->
            You might be requested to sign up to three trasactions if there is
            not enough allowance in DAI and/or MKR to complete this transaction.
          </p>
          <label
            >How much {{ digitalCurrency }} would you like to withdraw?</label
          ><!-- TODO FOR TRANSLATE -->
          <div :class="['input-box', newCollateralRatioSafe ? '' : 'danger']">
            <input v-model="amount" />
            <span class="input-unit">{{ digitalCurrency }}</span>
          </div>
          <div class="sub-text">
            <p>
              {{
                activeCdp.toPeth
                  ? displayFixedValue(activeCdp.toPeth(amount), 5, false)
                  : 0
              }}
              PETH
            </p>
          </div>
        </div>
        <!-- Payback DAI -->
        <div v-if="action === 'payback'" class="input-container">
          <label>How much DAI would you like to payback?</label
          ><!-- TODO FOR TRANSLATE -->
          <div class="input-box">
            <input v-model="amount" /> <span class="input-unit">DAI</span>
          </div>
          <div class="sub-text">
            <p class="btn" @click="currentDai">Set Max</p>
            <!-- TODO FOR TRANSLATE -->
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
          <!-- Deposit ETH -->
          <div v-if="action === 'deposit'" class="padding-container">
            <div class="grid-block">
              <p>Currently Deposited</p>
              <!-- TODO FOR TRANSLATE -->
              <p>
                <b>{{ displayFixedValue(activeCdp.ethCollateralNum, 2) }}</b>
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
          <!-- Payback DAI-->
          <div v-if="action === 'payback'" class="padding-container">
            <div class="grid-block">
              <p>Outstanding Dai Generated<!-- TODO FOR TRANSLATE --></p>
              <p>
                <b>{{
                  activeCdp.debtValue
                    ? displayFixedValue(activeCdp.debtValue, 3)
                    : 0
                }}</b>
                DAI
              </p>
            </div>
            <div class="grid-block">
              <p>Stability Fee Owed<!-- TODO FOR TRANSLATE --></p>
              <p><b>0.00%</b> MKR</p>
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
        </div>
      </div>
      <div v-if="!newCollateralRatioSafe && notZero(amount)">
        <check-box @changeStatus="checkBoxClicked">
          <template v-slot:terms>
            <span v-if="!newCollateralRatioInvalid">
              I understand the new collateral ratio of
              {{ displayFixedValue(displayPercentValue(newCollateralRatio)) }}%
              may place my cdp at risk of liquidation.
            </span>
            <span v-if="newCollateralRatioInvalid" style="color: red;">
              I understand the new collateral ratio of
              {{ displayFixedValue(displayPercentValue(newCollateralRatio)) }}%
              WILL place my cdp at risk of liquidation.
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
import {displayFixedValue, displayPercentValue} from '../../helpers'


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
        const daiToken = this.tokensWithBalance.find(item => {
          return item.symbol.toUpperCase() === 'DAI';
        });
        console.log('daiToken', daiToken); // todo remove dev item
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    canWithdrawEthAmount() {
      if (this.amount || this.amount !== '') {
        console.log(this.activeCdp.ethCollateral.toString()); // todo remove dev item
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
      switch (this.action) {
        case 'deposit':
          return this.hasEnoughEth && (ratioOk || this.riskyBypass);
        case 'generate':
          return this.canGenerateDaiAmount && (ratioOk || this.riskyBypass);
        case 'withdraw':
          return this.canWithdrawEthAmount && (ratioOk || this.riskyBypass);
        case 'payback':
          return this.hasEnoughDai && (ratioOk || this.riskyBypass);
        default:
          return false;
      }
    },
    newCollateralRatio() {
      if (this.activeCdp && this.amount > 0) {
        switch (this.action) {
          case 'deposit':
            return this.activeCdp.calcCollatRatioEthChg(
              this.activeCdp.ethCollateral.plus(this.amount)
            );
          case 'generate':
            console.log(this.activeCdp.debtValue.plus(this.amount).toString()); // todo remove dev item
            return this.activeCdp.calcCollatRatioDaiChg(
              this.activeCdp.debtValue.plus(this.amount)
            );
          case 'withdraw':
            return this.activeCdp.calcCollatRatioEthChg(
              this.activeCdp.ethCollateral.minus(this.amount)
            );
          case 'payback':
            return this.activeCdp.calcCollatRatioDaiChg(
              this.activeCdp.debtValue.minus(this.amount)
            );
          default:
            return 0;
        }
      } else if (this.activeCdp) {
        return this.activeCdp.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.activeCdp && this.amount > 0) {
        switch (this.action) {
          case 'deposit':
            return this.activeCdp
              .calcCollatRatioEthChg(
                this.activeCdp.ethCollateral.plus(this.amount)
              )
              .gte(2);
          case 'generate':
            return this.activeCdp
              .calcCollatRatioDaiChg(this.activeCdp.debtValue.plus(this.amount))
              .gte(2);
          case 'withdraw':
            return this.activeCdp
              .calcCollatRatioEthChg(
                this.activeCdp.ethCollateral.minus(this.amount)
              )
              .gte(2);
          case 'payback':
            return this.activeCdp
              .calcCollatRatioDaiChg(
                this.activeCdp.debtValue.minus(this.amount)
              )
              .gte(2);
          default:
            return true;
        }
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.activeCdp && this.amount > 0) {
        switch (this.action) {
          case 'deposit':
            return this.activeCdp
              .calcCollatRatioEthChg(
                this.activeCdp.ethCollateral.plus(this.amount)
              )
              .lte(1.5);
          case 'generate':
            return this.activeCdp
              .calcCollatRatioDaiChg(this.activeCdp.debtValue.plus(this.amount))
              .lte(1.5);
          case 'withdraw':
            return this.activeCdp
              .calcCollatRatioEthChg(
                this.activeCdp.ethCollateral.minus(this.amount)
              )
              .lte(1.5);
          case 'payback':
            return this.activeCdp
              .calcCollatRatioDaiChg(
                this.activeCdp.debtValue.minus(this.amount)
              )
              .lte(1.5);
          default:
            return true;
        }
      } else if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.activeCdp && this.amount > 0) {
        switch (this.action) {
          case 'deposit':
            return this.activeCdp.calcLiquidationPriceEthChg(
              this.activeCdp.ethCollateral.plus(toBigNumber(this.amount))
            );
          case 'generate':
            return this.activeCdp.calcLiquidationPriceDaiChg(
              this.activeCdp.debtValue.plus(this.amount)
            );
          case 'withdraw':
            return this.activeCdp.calcLiquidationPriceEthChg(
              this.activeCdp.ethCollateral.minus(this.amount)
            );
          case 'payback':
            return this.activeCdp.calcLiquidationPriceDaiChg(
              this.activeCdp.debtValue.minus(this.amount)
            );
          default:
            return 0;
        }
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
      switch (this.action) {
        case 'deposit':
          this.lockEth();
          break;
        case 'generate':
          this.drawDai();
          break;
        case 'withdraw':
          this.freeEth();
          break;
        case 'payback':
          this.wipeDai();
          break;
        default:
          return {};
      }
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
    async lockEth() {
      console.log('lockEth'); // todo remove dev item
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        await this.activeCdp.lockEth(this.amount);
      }
    },
    async drawDai() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        await this.activeCdp.drawDai(this.amount);
      }
    },
    async freeEth() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        await this.activeCdp.freeEth(this.amount);
      }
    },
    async wipeDai() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        await this.activeCdp.wipeDai(this.amount);
      }
    },

    getTitleText() {
      switch (this.action) {
        case 'deposit':
          return 'Deposit Collateral';
        case 'generate':
          return 'Generate DAI';
        case 'withdraw':
          return 'Withdraw Collateral';
        case 'payback':
          return 'Payback DAI';
        default:
          return '';
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
@import 'ActionsModal';
</style>

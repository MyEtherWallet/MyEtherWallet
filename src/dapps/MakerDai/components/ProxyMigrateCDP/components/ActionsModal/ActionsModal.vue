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
        <div v-if="action === 'deposit'" class="input-container">
          <label>How much ETH would you like to deposit?</label>
          <div class="input-box">
            <input v-model="amount" /> <span class="input-unit">ETH</span>
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
        <div v-if="action === 'generate'" class="input-container">
          <label>How much DAI would you like to generate?</label>
          <div :class="['input-box', newCollateralRatioSafe ? '' : 'danger']">
            <input v-model="amount" /> <span class="input-unit">DAI</span>
          </div>
          <div class="sub-text">
            <p class="btn" @click="maxDai">Max</p>
            <p>
              {{ displayFixedValue(displayPercentValue(newCollateralRatio)) }}%
            </p>
          </div>
        </div>
        <div v-if="action === 'withdraw'" class="input-container">
          <p>
            You might be requested to sign up to three trasactions if there is
            not enough allowance in DAI and/or MKR to complete this transaction.
          </p>
          <label>How much ETH would you like to withdraw?</label>
          <div :class="['input-box', newCollateralRatioSafe ? '' : 'danger']">
            <input v-model="amount" /> <span class="input-unit">ETH</span>
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
        <div v-if="action === 'payback'" class="input-container">
          <label>How much DAI would you like to payback?</label>
          <div class="input-box">
            <input v-model="amount" /> <span class="input-unit">DAI</span>
          </div>
          <div class="sub-text">
            <p class="btn" @click="currentDai">Set Max</p>
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
          <div v-if="action === 'deposit'" class="padding-container">
            <div class="grid-block">
              <p>{{ $t('dapps.projectedLiquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice, 2) }}</b> USD
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
          <div v-if="action === 'generate'" class="padding-container">
            <div class="grid-block">
              <p>Max Available to Generate</p>
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
                <b>{{ displayFixedValue(newLiquidationPrice, 2) }}</b> USD
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
          <div v-if="action === 'withdraw'" class="padding-container">
            <div class="grid-block">
              <p>Max Available to Withdraw</p>
              <p>
                <b>{{
                  activeCdp.maxDaiDraw
                    ? displayFixedValue(activeCdp.maxDaiDraw(), 3)
                    : 0
                }}</b>
                ETH
              </p>
            </div>
            <div class="grid-block">
              <p>{{ $t('dapps.projectedLiquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice, 2) }}</b> USD
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
          <div v-if="action === 'payback'" class="padding-container">
            <div class="grid-block">
              <p>
                Outstanding Dai Generated
              </p>
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
              <p>
                Stability Fee Owed
              </p>
              <p><b>0.00%</b> MKR</p>
            </div>
            <div class="grid-block">
              <p>{{ $t('dapps.projectedLiquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice, 2) }}</b> USD
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
      <div class="buttons-container">
        <button class="cancel-btn">
          Cancel
        </button>
        <button class="submit-btn" @click="submitBtn">
          Submit
        </button>
      </div>
      <help-center-button />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import BigNumber from 'bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'help-center-button': HelpCenterButton
  },
  props: {
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
      modalDetailInformation: false,
      textValues: {}
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network'
    }),
    newCollateralRatio() {
      if (this.activeCdp && this.amount > 0) {
        switch (this.action) {
          case 'deposit':
            return this.activeCdp.calcCollatRatioEthChg(
              this.activeCdp.ethCollateral.plus(this.amount)
            );
          case 'generate':
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
    newLiquidationPrice() {
      if (this.activeCdp && this.amount > 0) {
        switch (this.action) {
          case 'deposit':
            return this.activeCdp.calcLiquidationPriceEthChg(
              this.activeCdp.ethCollateral.plus(this.amount)
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
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals, BigNumber.ROUND_DOWN).toString();
    },
    maxDai() {
      this.amount = this.activeCdp.maxDai;
    },
    currentDai() {
      this.amount = this.activeCdp.debtValue;
    },
    async lockEth() {
      if (toBigNumber(this.amount).gte(0)) {
        await this.activeCdp.lockEth(this.amount);
        this.closeModal();
      }
    },
    async drawDai() {
      if (toBigNumber(this.amount).gte(0)) {
        await this.activeCdp.drawDai(this.amount);
        this.closeModal();
      }
    },
    async freeEth() {
      if (toBigNumber(this.amount).gte(0)) {
        await this.activeCdp.freeEth(this.amount);
        this.closeModal();
      }
    },
    async wipeDai() {
      if (toBigNumber(this.amount).gte(0)) {
        await this.activeCdp.wipeDai(this.amount);
        this.closeModal();
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ActionsModal.scss';
</style>

<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMCDMaker.deposit-title')"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
      static
      lazy
    >
      <div class="modal-content-container">
        <div class="inputs-container">
          <div class="input-container">
            <div class="interface__block-title">
              {{
                $t('dappsMCDMaker.deposit-question-mcd', {
                  currency: currentCdpType
                })
              }}
            </div>
            <div :class="['input-box', hasEnoughEth ? '' : 'danger']">
              <input v-model="amount" />
              <span class="input-unit">{{ currentCdpType }}</span>
            </div>
            <div class="sub-text">
              <p v-if="!hasEnoughEth" class="above-max">
                {{
                  $t('dappsMCDMaker.not-enough-token', {
                    symbol: currentCdpType
                  })
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="detail-info">
          <div class="info">
            <h4>{{ $t('dappsMCDMaker.detail-info') }}</h4>
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
                <p>{{ $t('dappsMCDMaker.currently-deposited') }}</p>
                <p>
                  <b>{{ displayFixedValue(collateralAmount(), 5) }}</b>
                  {{ currentCdpType }}
                </p>
              </div>
              <div class="grid-block">
                <p>
                  {{
                    $t('dappsMCDMaker.projected-liquidation', {
                      currency: currentCdpType
                    })
                  }}
                </p>
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
import StandardButton from '@/components/Buttons/StandardButton';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import BigNumber from 'bignumber.js/bignumber.js';

import { displayFixedValue, displayPercentValue } from '../../helpers';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'help-center-button': HelpCenterButton,
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
      cdpId: 0,
      isVisible: false,
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      riskyBypass: false,
      modalDetailInformation: false,
      textValues: {},
      fiatCurrency: 'USD',
      digitalCurrency: 'ETH',
      selectedCurrency: { symbol: 'ETH', name: 'Ethereum' },
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
    hasEnoughEth() {
      if (this.amount || this.amount !== '') {
        if (this.currentCdp) {
          return this.currentCdp.hasEnough(
            this.amount,
            this.currentCdp.cdpCollateralType,
            this.account.balance
          );
        }
        return true;
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
      const ratio = toBigNumber(this.newCollateralRatio());
      const ratioOk = ratio.gt(1.5) || ratio.eq(0);
      return this.hasEnoughEth && (ratioOk || this.riskyBypass);
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
      this.isVisible = false;
    });

    if (this.makerActive) {
      this.getActiveCdp();
    }
  },
  methods: {
    collateralAmount() {
      if (this.currentCdp) {
        return this.currentCdp.collateralAmount;
      }
    },
    newCollateralRatio() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp.calcCollatRatioEthChg(
          toBigNumber(this.currentCdp.collateralAmount).plus(this.amount)
        );
      } else if (this.currentCdp) {
        return this.currentCdp.collateralizationRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp
          .calcCollatRatioEthChg(
            toBigNumber(this.currentCdp.collateralAmount).plus(this.amount)
          )
          .gte(2);
      } else if (this.currentCdp) {
        return toBigNumber(this.currentCdp.collateralizationRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp
          .calcCollatRatioEthChg(
            toBigNumber(this.currentCdp.collateralAmount).plus(this.amount)
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
          toBigNumber(this.currentCdp.collateralAmount).plus(
            toBigNumber(this.amount)
          )
        );
      } else if (this.currentCdp) {
        return this.currentCdp.liquidationPrice;
      }
      return 0;
    },
    getActiveCdp() {
      if (this.cdpId > 0) {
        this.currentCdp = this.getValueOrFunction('getCdp')(this.cdpId);
        this.currentCdpType = this.currentCdp.cdpCollateralType;
        this.$forceUpdate();
      }
    },
    hasEnough() {
      if (this.currentCdp) {
        return this.currentCdp.hasEnough(
          this.amount,
          this.currentCdpType,
          this.account.balance
        );
      }
      return true;
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
        if (this.currentCdp) {
          this.currentCdp.lockEth(this.amount);
        } else {
          this.$emit('lockEth', this.amount);
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
@import 'DepositModal';
</style>

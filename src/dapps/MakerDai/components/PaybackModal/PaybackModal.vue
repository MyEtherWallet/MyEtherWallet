<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMCDMaker.payback-title')"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
      static
      lazy
    >
      <div class="contents">
        <p class="top-message">{{ $t('dappsMCDMaker.payback-notice') }}</p>
        <div class="input-container">
          <div class="top-buttons">
            <p @click="currentDai">{{ $t('dappsMCDMaker.max-available') }}</p>
          </div>
          <div :class="['dai-amount', hasEnoughDai ? '' : 'danger']">
            <input v-model="amount" />
            <p class="floating-text">{{ $t('dappsMCDMaker.dai') }}</p>
          </div>
        </div>

        <expanding-option :title="$t('dappsMCDMaker.detail-information')">
          <ul class="details">
            <li>
              <p>{{ $t('dappsMCDMaker.outstanding-dai') }}</p>
              <p>
                <b>
                  {{
                    values.debtValue
                      ? displayFixedValue(values.debtValue, 3)
                      : 0
                  }}
                </b>
                {{ $t('dappsMCDMaker.dai') }}
              </p>
            </li>
            <li>
              <p>{{ $t('dappsMCDMaker.projected-liquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice(), 2) }}</b>
                {{ fiatCurrency }}
              </p>
            </li>
            <li>
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
            </li>
          </ul>
        </expanding-option>
        <div class="buttons">
          <div v-if="needsDaiApprove()">
            <standard-button
              :options="{
                title: $t('dappsMCDMaker.approve-dai'),
                buttonStyle: 'green-border',
                fullWidth: true,
                noMinWidth: true
              }"
              :click-function="approveDai"
            />
          </div>
          <div v-if="needsMkrApprove()">
            <standard-button
              :options="{
                title: $t('dappsMCDMaker.approve-maker'),
                buttonStyle: 'green-border',
                fullWidth: true,
                noMinWidth: true
              }"
              :click-function="approveMkr"
            />
          </div>
        </div>
        <div class="buttons">
          <standard-button
            :options="{
              title: $t('common.cancel'),
              buttonStyle: 'green-border',
              noMinWidth: true,
              fullWidth: true
            }"
            :click-function="closeModal"
          />
          <div>
            <standard-button
              v-if="max"
              :options="{
                title: $t('dappsMCDMaker.submit-max'),
                buttonStyle: 'green',
                noMinWidth: true,
                fullWidth: true
              }"
              :button-disabled="canProceed ? false : true"
              :click-function="submitBtn"
            />
            <standard-button
              v-if="!max"
              :options="{
                title: $t('common.submit'),
                buttonStyle: 'green',
                noMinWidth: true,
                fullWidth: true
              }"
              :button-disabled="canProceed ? false : true"
              :click-function="submitBtn"
            />
          </div>
        </div>
        <help-center-button />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ethUnit from 'ethjs-unit';
import ExpandingOption from '@/components/ExpandingOption';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import {
  displayFixedValue,
  displayPercentValue,
  toBigNumber
} from '../../makerHelpers';
import StandardButton from '@/components/Buttons/StandardButton';

export default {
  components: {
    'help-center-button': HelpCenterButton,
    'expanding-option': ExpandingOption,
    'standard-button': StandardButton
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function () {
        return [];
      }
    },
    action: {
      type: String,
      default: ''
    },
    values: {
      type: Object,
      default: function () {
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
      default: function () {}
    },
    calcLiquidationPriceEthChg: {
      type: Function,
      default: function () {}
    },
    calcCollatRatioDaiChg: {
      type: Function,
      default: function () {}
    },
    calcLiquidationPriceDaiChg: {
      type: Function,
      default: function () {}
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
      default: function () {}
    }
  },
  data() {
    return {
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      mkrToken: {},
      daiToken: {},
      max: false,
      riskyBypass: false,
      modalDetailInformation: false,
      textValues: {},
      fiatCurrency: 'USD',
      digitalCurrency: 'ETH',
      suppliedFrom: {
        symbol: 'ETH',
        name: 'Ethereum'
      },
      suppliedTo: {
        symbol: 'MKR',
        name: 'Maker'
      },
      suppliedToAmount: 0,
      destAddress: ''
    };
  },
  computed: {
    ...mapState('main', ['account', 'gasPrice', 'web3', 'network', 'ens']),
    amountPresent() {
      return (
        (this.amount || this.amount !== '') && !toBigNumber(this.amount).lte(0)
      );
    },
    canCompute() {
      return this.values && this.amountPresent && this.currentCdp;
    },
    allOk() {
      if (this.amountPresent) {
        return this.newCollateralRatioSafe() && this.canGenerateDaiAmount;
      }
      return true;
    },
    hasEnoughEth() {
      if (this.canCompute) {
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    paybackFee() {
      if (this.canCompute) {
        return toBigNumber(this.amount)
          .div(this.values.debtValue)
          .times(this.values.governanceFeeOwed);
      }
      return 0;
    },
    hasEnoughMkr() {
      if (this.canCompute) {
        return toBigNumber(this.mkrBalance).gte(toBigNumber(this.paybackFee));
      }
      return true;
    },
    hasEnoughDai() {
      if (this.canCompute) {
        return this.currentCdp.hasEnough(this.amount, 'MDAI');
      }
      return true;
    },
    canWithdrawEthAmount() {
      if (this.canCompute) {
        return toBigNumber(this.amount).lte(
          toBigNumber(this.values.ethCollateral)
        );
      }
      return false;
    },
    canGenerateDaiAmount() {
      if (this.canCompute) {
        return toBigNumber(this.amount).lte(toBigNumber(this.values.maxDai));
      }
      return true;
    },
    canProceed() {
      return this.hasEnoughDai;
    },
    calcCollateralRatio() {
      if (this.canCompute) {
        return this.calcCollatRatioDaiChg(
          toBigNumber(this.values.debtValue).minus(this.amount)
        );
      }
      if (this.values) {
        return this.values.collateralRatio;
      }
      return '--';
    },
    mkrBalance() {
      if (this.mkrToken) {
        return this.mkrToken.balance;
      }
      return 0;
    }
  },
  watch: {
    amount() {
      if (!toBigNumber(this.amount).gte(this.currentCdp.debtValue.minus(1))) {
        this.max = false;
      }
    }
  },
  mounted() {
    this.$refs.modal.$on('shown', () => {
      this.cdpId = this.$route.params.cdpId;
      this.isVisible = true;
      this.amount = 0;
      this.getActiveCdp();
      this.getBalances();
      this.max = false;
    });

    this.$refs.modal.$on('hidden', () => {
      this.isVisible = false;
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
    governanceFeeOwed() {
      if (this.currentCdp) {
        return this.currentCdp.governanceFeeOwed;
      }
    },
    collateralAmount() {
      if (this.currentCdp) {
        return this.currentCdp.collateralAmount;
      }
    },
    newCollateralRatio() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp.calcCollatRatioDaiChg(
          toBigNumber(this.amount).negated(),
          true
        );
      } else if (this.currentCdp) {
        return this.currentCdp.collateralizationRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.currentCdp && this.amount > 0) {
        return this.newCollateralRatio().gte(2);
      } else if (this.currentCdp) {
        return this.newCollateralRatio().gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.currentCdp && this.amount > 0) {
        return this.newCollateralRatio().lte(1.5);
      } else if (this.currentCdp) {
        return this.newCollateralRatio().lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.currentCdp && this.amount > 0) {
        return this.currentCdp.calcLiquidationPriceDaiChg(
          toBigNumber(this.amount).negated(),
          true
        );
      } else if (this.currentCdp) {
        return this.currentCdp.liquidationPrice;
      }
      return 0;
    },
    daiBalance() {
      if (this.currentCdp) {
        return this.currentCdp.getBalanceOf('MDAI');
      }
      return 0;
    },
    needsDaiApprove() {
      if (this.currentCdp) {
        if (toBigNumber(this.amount).gt(0)) {
          return !this.currentCdp.hasEnoughAllowance(this.amount, 'MDAI');
        }
      }
      return false;
    },
    needsMkrApprove() {
      return false;
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
      this.amount = toBigNumber(this.values.maxDai).minus(
        toBigNumber(this.values.maxDai).times(0.01)
      );
      this.max = true;
    },
    currentDai() {
      if (this.currentCdp.hasEnough(this.currentCdp.debtValue, 'MDAI')) {
        this.amount = this.currentCdp.debtValue;
      } else {
        this.amount = this.currentCdp.getBalanceOf('MDAI');
      }
      this.max = true;
    },
    async wipeDai() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        this.currentCdp.wipeDai(this.amount, this.max);
      }
    },
    getBalances() {
      this.mkrToken = this.tokensWithBalance.find(item => {
        return item.symbol === 'MKR';
      });
      this.daiToken = this.tokensWithBalance.find(item => {
        return item.symbol === 'DAI';
      });
    },
    getMkr() {
      const mkrNeeded = this.paybackFee;
      if (toBigNumber(this.mkrBalance).lt(mkrNeeded)) {
        this.suppliedToAmount = toBigNumber(mkrNeeded)
          .minus(toBigNumber(this.mkrBalance))
          .plus(toBigNumber(mkrNeeded).times(0.01))
          .toNumber();
        if (toBigNumber(this.suppliedToAmount).lt(0.000001)) {
          this.suppliedToAmount = 0.000001;
        }
        this.suppliedFrom = {
          symbol: 'ETH',
          name: 'Ethereum'
        };
        this.suppliedTo = {
          symbol: 'MKR',
          name: 'Maker'
        };
        this.$eventHub.$emit(
          'showSwapWidgetTo',
          this.account.address,
          this.suppliedFrom,
          this.suppliedTo,
          this.suppliedToAmount
        );
      }
    },
    closeModal() {
      this.$refs.modal.hide();
    },
    delayCloseModal() {
      setTimeout(() => {
        this.closeModal();
      }, 200);
    },
    async approveDai() {
      if (this.currentCdp) {
        this.currentCdp.approveProxyFor('MDAI');
        this.closeModal();
      }
    },
    async approveMkr() {
      if (this.currentCdp) {
        this.currentCdp.approveProxyFor('MKR');
        this.closeModal();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PaybackModal';
</style>

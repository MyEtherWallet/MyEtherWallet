<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMaker.paybackTitle')"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
    >
      <swap-widget
        ref="swapWidget"
        :supplied-from="suppliedFrom"
        :supplied-to="suppliedTo"
        :supplied-to-amount="suppliedToAmount"
        :dest-address="account.address"
      ></swap-widget>
      <div class="contents">
        <p class="top-message">
          {{ $t('dappsMaker.paybackNotice') }}
        </p>
        <div v-if="!hasEnoughMkr">
          <div class="value-block">
            <p>
              <b>{{ $t('dappsMaker.mkrBalance') }}</b>
            </p>
            <p>
              <b>{{ mkrBalance }} MKR</b>
            </p>
          </div>
          <p class="get-mkr" @click="getMkr()">
            {{ $t('dappsMaker.getMkr') }}
          </p>
        </div>
        <div class="input-container">
          <div class="top-buttons">
            <p @click="currentDai">{{ $t('dappsMaker.setMax') }}</p>
          </div>
          <div :class="['dai-amount', hasEnoughDai ? '' : 'danger']">
            <input v-model="amount" />
            <p class="floating-text">DAI</p>
          </div>
        </div>

        <expending-option title="Detail Information">
          <ul class="details">
            <li>
              <p>{{ $t('dappsMaker.outstandingDai') }}</p>
              <p>
                <b>{{
                  values.debtValue ? displayFixedValue(values.debtValue, 3) : 0
                }}</b>
                DAI
              </p>
            </li>
            <li>
              <p>{{ $t('dappsMaker.stabilityFeeOwed') }}</p>
              <p>
                <b>{{ values.governanceFeeOwed }}</b> MKR
              </p>
              <!-- TODO: fix-->
            </li>
            <li>
              <p>{{ $t('dappsMaker.projectedLiquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice, 2) }}</b>
                {{ fiatCurrency }}
              </p>
            </li>
            <li>
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
            </li>
          </ul>
        </expending-option>
        <div class="buttons">
          <div v-if="needsDaiApprove">
            <standard-button
              :options="approveDaiButton"
              @click.native="approveDai"
            />
          </div>
          <div v-if="needsMkrApprove">
            <standard-button
              :options="approveMkrButton"
              @click.native="approveMkr"
            />
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
import ExpendingOption from '@/components/ExpendingOption';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import CheckBox from '../CheckBox';
import BigNumber from 'bignumber.js/bignumber.js';
import { displayFixedValue, displayPercentValue } from '../../helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import SwapWidget from '@/components/SwapWidget';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'swap-widget': SwapWidget,
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
      mkrToken: {},
      daiToken: {},
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
      },
      approveMkrButton: {
        title: 'Approve Maker',
        buttonStyle: 'green-border',
        fullWidth: true,
        noMinWidth: true
      },
      approveDaiButton: {
        title: 'Approve Dai',
        buttonStyle: 'green-border',
        fullWidth: true,
        noMinWidth: true
      },
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
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    amountPresent() {
      return (
        (this.amount || this.amount !== '') && !toBigNumber(this.amount).lte(0)
      );
    },
    canCompute() {
      return this.values && this.amountPresent;
    },
    allOk() {
      if (this.amountPresent) {
        return this.newCollateralRatioSafe && this.canGenerateDaiAmount;
      }
      return true;
    },
    hasEnoughEth() {
      if (this.amount || this.amount !== '') {
        const asEth = ethUnit.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }
      return true;
    },
    paybackFee() {
      if (this.amount || this.amount !== '') {
        return toBigNumber(this.amount)
          .div(this.values.debtValue)
          .times(this.values.governanceFeeOwed);
      }
      return 0;
    },
    hasEnoughMkr() {
      if (this.amount || this.amount !== '') {
        return toBigNumber(this.mkrBalance).gte(toBigNumber(this.paybackFee));
      }
      return true;
    },
    hasEnoughDai() {
      // TODO Figure out how to learn how much dai a user has (the code below should work)
      if (this.canCompute) {
        const daiToken = this.tokensWithBalance.find(item => {
          return item.symbol.toUpperCase() === 'DAI';
        });
        if (daiToken === undefined) return true;
        return toBigNumber(this.amount).lte(toBigNumber(daiToken));
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
    canGenerateDaiAmount() {
      if (this.amount || this.amount !== '') {
        return toBigNumber(this.amount).lte(toBigNumber(this.values.maxDai));
      }
      return true;
    },
    canProceed() {
      return this.canCompute;
      // if (toBigNumber(this.amount).lte(0)) return false;
      // const ratio = toBigNumber(this.newCollateralRatio);
      // const ratioSafe = ratio.gt(2) || ratio.eq(0);
      // const ratioOk = ratio.gt(1.5) || ratio.eq(0);
      // if (!ratioOk) return false;
      // return (
      //   (this.canWithdrawEthAmount && ratioSafe) ||
      //   (this.canWithdrawEthAmount && ratioOk && this.riskyBypass)
      // );
    },
    newCollateralRatio() {
      if (this.values.debtValue && this.amount > 0) {
        return this.calcCollatRatioDaiChg(
          this.values.debtValue.minus(this.amount)
        );
      } else if (this.values) {
        return this.values.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.values.debtValue && this.amount > 0) {
        const ratio = this.calcCollatRatioDaiChg(
          this.values.debtValue.minus(this.amount)
        );
        if (ratio.lte(new BigNumber(0.000009))) {
          return true;
        }
        return ratio.gte(2);
      } else if (this.values) {
        return toBigNumber(this.values.collatRatio).gte(2);
      }
      return true;
    },
    newCollateralRatioInvalid() {
      if (this.values.debtValue && this.amount > 0) {
        const ratio = this.calcCollatRatioDaiChg(
          this.values.debtValue.minus(this.amount)
        );
        if (ratio.lte(new BigNumber(0.000009))) {
          return true;
        }
        return ratio.gte(1.5);
      } else if (this.values) {
        return toBigNumber(this.values.collatRatio).lte(1.5);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.values.debtValue && this.amount > 0) {
        return this.calcLiquidationPriceDaiChg(
          this.values.debtValue.minus(this.amount)
        );
      } else if (this.values.liquidationPrice) {
        return this.values.liquidationPrice;
      }
      return 0;
    },
    mkrBalance() {
      if (this.mkrToken) {
        return this.mkrToken.balance;
      }
      return 0;
    },
    daiBalance() {
      if (this.daiToken) {
        return this.daiToken.balance;
      }
      return 0;
    },
    needsDaiApprove() {
      if (toBigNumber(this.values.proxyAllowanceDai).gt(0)) {
        if (
          toBigNumber(this.values.proxyAllowanceDai).lt(this.values.debtValue)
        ) {
          return true;
        }
      }
      return toBigNumber(this.values.proxyAllowanceDai).eq(0);
    },
    needsMkrApprove() {
      if (toBigNumber(this.values.proxyAllowanceMkr).gt(0)) {
        if (
          toBigNumber(this.values.proxyAllowanceMkr).lt(
            this.values.governanceFeeOwed
          )
        ) {
          return true;
        }
      }
      return toBigNumber(this.values.proxyAllowanceMkr).eq(0);
    }
  },
  watch: {},
  mounted() {
    this.$refs.modal.$on('shown', () => {
      this.amount = 0;
      this.getBalances();
    });
  },
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
      this.amount = this.values.maxDai.minus(this.values.maxDai.times(0.01));
    },
    currentDai() {
      this.amount = this.values.debtValue;
    },
    async wipeDai() {
      if (toBigNumber(this.amount).gte(0)) {
        this.delayCloseModal();
        this.$emit('wipeDai', this.amount);
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
        // this.destAddress = this.proxyAddress;
        // this.$refs.swapWidget.$refs.modal.show();
        this.$nextTick(() => {
          this.$refs.swapWidget.$refs.modal.show();
        });
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
    },
    async approveDai() {
      this.$emit('approveDai');
      // await this.activeCdp.approveDai();
    },
    async approveMkr() {
      this.$emit('approveMkr');
      // await this.activeCdp.approveMkr();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PaybackModal';
</style>

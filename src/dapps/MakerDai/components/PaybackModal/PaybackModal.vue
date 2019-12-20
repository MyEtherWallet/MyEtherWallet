<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMaker.payback-title')"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
      static
      lazy
    >
      <div class="contents">
        <p class="top-message">{{ $t('dappsMaker.payback-notice') }}</p>
        <div class="input-container">
          <div class="top-buttons">
            <p @click="currentDai">{{ $t('dappsMaker.set-max') }}</p>
          </div>
          <div :class="['dai-amount', hasEnoughDai ? '' : 'danger']">
            <input v-model="amount" />
            <p class="floating-text">{{ $t('dappsMaker.dai') }}</p>
          </div>
        </div>

        <expanding-option title="Detail Information">
          <ul class="details">
            <li>
              <p>{{ $t('dappsMaker.outstanding-dai') }}</p>
              <p>
                <b>{{ displayFixedValue(debtValue(), 3) }}</b>
                {{ $t('dappsMaker.dai') }}
              </p>
            </li>
            <li>
              <p>{{ $t('dappsMaker.projected-liquidation') }}</p>
              <p>
                <b>{{ displayFixedValue(newLiquidationPrice(), 2) }}</b>
                {{ fiatCurrency }}
              </p>
            </li>
            <li>
              <p>{{ $t('dappsMaker.projected-collat-ratio') }}</p>
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
              :options="approveDaiButton"
              :click-function="approveDai"
            />
          </div>
        </div>
        <div class="buttons">
          <standard-button
            :options="cancelButton"
            :click-function="closeModal"
          />
          <div>
            <standard-button
              v-if="max"
              :options="submitMaxButton"
              :button-disabled="canProceed ? false : true"
              :click-function="submitBtn"
            />
            <standard-button
              v-if="!max"
              :options="submitButton"
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
      default: function() {
        return [];
      }
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
      amount: 0,
      mkrToken: {},
      daiToken: {},
      max: false,
      currentCdpLoaded: false,
      fiatCurrency: 'USD',
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
      submitMaxButton: {
        title: 'Submit Max',
        buttonStyle: 'green',
        noMinWidth: true,
        fullWidth: true
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
      suppliedToAmount: 0
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
      return this.amountPresent && this.currentCdpLoaded;
    },
    hasEnoughDai() {
      if (this.canCompute) {
        return toBigNumber(this.amount).lte(this.daiBalance());
      }
      return true;
    },
    canProceed() {
      return this.hasEnoughDai;
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
    displayPercentValue,
    displayFixedValue,
    getActiveCdp() {
      if (this.cdpId > 0) {
        this.currentCdp = this.getValueOrFunction('getCdp')(this.cdpId);
        this.currentCdpType = this.currentCdp.cdpCollateralType;
        this.currentCdpLoaded = true;
        this.$forceUpdate();
      }
    },
    governanceFeeOwed() {
      if (this.currentCdp) {
        return this.currentCdp.governanceFeeOwed;
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
    debtValue() {
      if (this.currentCdp) {
        return this.currentCdp.debtValue;
      }
      return '--';
    },
    daiBalance() {
      if (this.currentCdp) {
        return this.currentCdp.getBalanceOf('DAI');
      }
      return 0;
    },
    needsDaiApprove() {
      if (this.currentCdp) {
        if (toBigNumber(this.amount).gt(0)) {
          return !this.currentCdp.hasEnoughAllowance(this.amount, 'DAI');
        }
      }
      return false;
    },
    submitBtn() {
      if (!this.canProceed) return;
      this.wipeDai();
    },
    maxDai() {
      if (this.currentCdp) {
        this.amount = toBigNumber(this.currentCdp.maxDai);
        this.max = true;
      }
    },
    currentDai() {
      if (this.currentCdp.hasEnough(this.currentCdp.debtValue, 'DAI')) {
        this.amount = this.currentCdp.debtValue;
      } else {
        this.amount = this.currentCdp.getBalanceOf('DAI');
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
    // TODO: change to get dai
    /*    getMkr() {
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
    },*/
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
        this.currentCdp.approveProxyFor('DAI');
        this.closeModal();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PaybackModal';
</style>

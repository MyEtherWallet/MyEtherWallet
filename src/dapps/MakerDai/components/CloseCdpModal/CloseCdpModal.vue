<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMaker.closeTitle')"
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
        <div v-if="!enoughMkr" class="message-container">
          {{ $t('dappsMaker.notEnoughMkrClose') }}
        </div>
        <div v-if="!enoughDai" class="message-container">
          {{ $t('dappsMaker.notEnoughDaiClose') }}
        </div>
        <p class="top-text">
          {{ $t('dappsMaker.closingNotice') }}
        </p>

        <div class="value-table-container">
          <div class="value-table mkr-balance">
            <div class="value-block">
              <p>
                <b>{{ $t('dappsMaker.mkrBalance') }}</b>
              </p>
              <p>
                <b>{{ mkrBalance }} MKR</b>
              </p>
            </div>
            <p v-show="!enoughDai" class="get-mkr" @click="getMkr()">
              {{ $t('dappsMaker.getMkr') }}
            </p>
          </div>

          <div class="value-table mkr-balance">
            <div class="value-block">
              <p>
                <b>{{ $t('dappsMaker.daiBalance') }}</b>
              </p>
              <p>
                <b>{{ daiBalance }} DAI</b>
              </p>
            </div>
            <p v-show="!enoughMkr" class="get-mkr" @click="getDai()">
              {{ $t('dappsMaker.getDai') }}
            </p>
          </div>
          <div class="value-table other-values">
            <div class="value-block">
              <p>{{ $t('dappsMaker.outstandingDai') }}</p>
              <p>
                <b>{{ values.debtValue }} DAI</b>
              </p>
            </div>
            <div class="value-block">
              <p>
                {{
                  $t('dappsMaker.stabilityFeeInMkr', {
                    value: displayFixedValue(
                      displayPercentValue(values.stabilityFee)
                    )
                  })
                }}
              </p>
              <p>
                <b>{{ getfeeOwed }} MKR</b>
              </p>
            </div>
          </div>
        </div>
        <!-- TODO: work these into the user flow.  Batch transaction would be better, but an initial try brought the browser crashing issue back -->
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
          <standard-button :options="cancelButton" @click.native="closeModal" />
          <standard-button
            :options="closeButton"
            :button-disabled="canClose ? false : true"
            :click-function="closeCdp"
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
import SwapWidget from '@/components/SwapWidget';
import BigNumber from 'bignumber.js/bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'swap-widget': SwapWidget,
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
    makerManager: {
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
      govFee: 0,
      closable: false,
      modalDetailInformation: false,
      textValues: {},
      mkrToken: {},
      daiToken: {},
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
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        fullWidth: true,
        noMinWidth: true
      },
      closeButton: {
        title: 'Close',
        buttonStyle: 'green',
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
    getfeeOwed() {
      const result = this.values.governanceFeeOwed;
      return this.displayFixedValue(result, 8);
    },
    newCollateralRatio() {
      if (this.values) {
        return this.values.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.values) {
        return toBigNumber(this.values.collatRatio).gte(2);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.values) {
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
    enoughMkr() {
      const mkrNeeded = this.values.governanceFeeOwed;
      if (mkrNeeded) {
        return toBigNumber(this.mkrBalance)
          .minus(mkrNeeded)
          .gte(0);
      }
      return false;
    },
    enoughDai() {
      if (this.values.zeroDebt) return true;
      const daiNeeded = this.values.debtValue;
      if (daiNeeded) {
        return toBigNumber(this.daiBalance)
          .minus(daiNeeded)
          .gte(0);
      }
      return false;
    },
    needsDaiApprove() {
      if (toBigNumber(this.values.proxyAllowanceDai).gt(0)) {
        if (
          toBigNumber(this.values.proxyAllowanceDai).lte(this.values.debtValue)
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
    },
    canClose() {
      return (
        this.enoughMkr &&
        this.enoughDai &&
        !this.needsDaiApprove &&
        !this.needsMkrApprove
      );
    }
  },
  watch: {
    tokensWithBalance() {
      this.getBalances();
    }
  },
  async mounted() {
    this.destAddress = this.account.address;
    this.getBalances();
    this.$refs.modal.$on('shown', async () => {
      this.getBalances();
    });
  },
  methods: {
    closeModal() {
      this.$refs.modal.hide();
    },
    delayCloseModal() {
      setTimeout(() => {
        this.closeModal();
      }, 200);
    },
    async closeCdp() {
      this.delayCloseModal();
      this.$emit('closeCdp');
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
      this.amount = this.values.maxDai;
    },
    currentDai() {
      this.amount = this.values.debtValue;
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
      const mkrNeeded = this.getfeeOwed;
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
        this.$nextTick(() => {
          this.$refs.swapWidget.$refs.modal.show();
        });
      }
    },
    getDai() {
      const daiNeeded = this.values.debtValue;
      if (toBigNumber(this.daiBalance).lt(daiNeeded)) {
        this.suppliedToAmount = toBigNumber(daiNeeded)
          .minus(toBigNumber(this.daiBalance))
          .toNumber();
        if (toBigNumber(this.suppliedToAmount).lt(0.000001)) {
          this.suppliedToAmount = 0.000001;
        }
        this.suppliedFrom = {
          symbol: 'ETH',
          name: 'Ethereum'
        };
        this.suppliedTo = {
          symbol: 'DAI',
          name: 'Dai'
        };
        this.$nextTick(() => {
          this.$refs.swapWidget.$refs.modal.show();
        });
      }
    },

    async approveDai() {
      this.$emit('approveDai');
    },
    async approveMkr() {
      this.$emit('approveMkr');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CloseCdpModal';
</style>

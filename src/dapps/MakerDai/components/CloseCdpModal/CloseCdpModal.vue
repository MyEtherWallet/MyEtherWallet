<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMCDMaker.close-title')"
      centered
      class="bootstrap-modal nopadding"
      static
      lazy
      hide-footer
    >
      <div class="contents">
        <div v-if="!enoughMkr" class="message-container">
          {{ $t('dappsMCDMaker.not-enough-mkr-close') }}
        </div>
        <div v-if="!enoughDai" class="message-container">
          {{ $t('dappsMCDMaker.not-enough-dai-close') }}
        </div>
        <p class="top-text">
          {{ $t('dappsMCDMaker.closing-notice') }}
        </p>

        <div class="value-table-container">
          <div class="value-table mkr-balance">
            <div class="value-block">
              <p>
                <b>{{ $t('dappsMCDMaker.mkr-balance') }}</b>
              </p>
              <p>
                <b>{{ mkrBalance }} {{ $t('dappsMCDMaker.mkr') }}</b>
              </p>
            </div>
            <p v-show="!enoughMkr" class="get-mkr" @click="getMkr()">
              {{ $t('dappsMCDMaker.get-mkr') }}
            </p>
          </div>

          <div class="value-table mkr-balance">
            <div class="value-block">
              <p>
                <b>{{ $t('dappsMCDMaker.dai-balance') }}</b>
              </p>
              <p>
                <b>{{ daiBalance }} {{ $t('dappsMCDMaker.dai') }}</b>
              </p>
            </div>
            <p v-show="!enoughDai" class="get-mkr" @click="getDai()">
              {{ $t('dappsMCDMaker.get-dai') }}
            </p>
          </div>
          <div class="value-table other-values">
            <div class="value-block">
              <p>{{ $t('dappsMCDMaker.outstanding-dai') }}</p>
              <p>
                <b>{{ values.debtValue }} {{ $t('dappsMCDMaker.dai') }}</b>
              </p>
            </div>
            <div class="value-block">
              <p>
                {{
                  $t('dappsMCDMaker.stability-fee-in-mkr', {
                    value: displayFixedValue(
                      displayPercentValue(values.stabilityFee)
                    )
                  })
                }}
              </p>
              <p>
                <b>{{ getfeeOwed }} {{ $t('dappsMCDMaker.mkr') }}</b>
              </p>
            </div>
          </div>
        </div>
        <!-- TODO: work these into the user flow.  Batch transaction would be better, but an initial try brought the browser crashing issue back -->
        <div class="buttons">
          <div v-if="needsDaiApprove">
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
          <div v-if="needsMkrApprove">
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
              title: $('common.cancel'),
              buttonStyle: 'green-border',
              fullWidth: true,
              noMinWidth: true
            }"
            :click-function="closeModal"
          />
          <standard-button
            :options="{
              title: $t('common.close'),
              buttonStyle: 'green',
              fullWidth: true,
              noMinWidth: true
            }"
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
import BigNumber from 'bignumber.js/bignumber.js';

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
    makerManager: {
      type: Object,
      default: function() {
        return {};
      }
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
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      govFee: 0,
      closable: false,
      modalDetailInformation: false,
      textValues: {},
      mkrToken: {},
      daiToken: {},
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
      if (toBigNumber(this.getProxyAllowances()['DAI']).gt(0)) {
        if (
          toBigNumber(this.getProxyAllowances()['DAI']).lte(
            this.values.debtValue
          )
        ) {
          return true;
        }
      }
      return toBigNumber(this.getProxyAllowances()['DAI']).eq(0);
    },
    needsMkrApprove() {
      if (toBigNumber(this.getProxyAllowances()['MKR']).gt(0)) {
        if (
          toBigNumber(this.getProxyAllowances()['MKR']).lt(
            this.values.governanceFeeOwed
          )
        ) {
          return true;
        }
      }
      return toBigNumber(this.getProxyAllowances()['MKR']).eq(0);
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
    this.$refs.modal.$on('shown', () => {
      this.cdpId = this.$route.params.cdpId;
      this.isVisible = true;
      this.amount = 0;
      this.getActiveCdp();
      this.getBalances();
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
    getProxyAllowances() {
      const allowances = this.getValueOrFunction('proxyAllowances');
      if (allowances) {
        return allowances;
      }
      return {};
    },
    getSystemValues(name) {
      const vals = this.getValueOrFunction('systemValues');
      if (vals) {
        return vals[name];
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
    async closeCdp() {
      if (this.currentCdp) {
        this.delayCloseModal();
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
        this.$eventHub.$emit(
          'showSwapWidgetTo',
          this.account.address,
          this.suppliedFrom,
          this.suppliedTo,
          this.suppliedToAmount
        );
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

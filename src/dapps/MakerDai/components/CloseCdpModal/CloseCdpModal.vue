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
            <p class="get-mkr" @click="getMkr()">
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
            <p class="get-mkr" @click="getDai()">
              {{ $t('dappsMaker.getDai') }}
            </p>
          </div>
          <div class="value-table other-values">
            <div class="value-block">
              <p>{{ $t('dappsMaker.outstandingDai') }}</p>
              <p>
                <b>{{ activeCdp.debtValue }} DAI</b>
              </p>
            </div>
            <div class="value-block">
              <p>
                {{
                  $t('dappsMaker.stabilityFeeInMkr', {
                    value: displayFixedValue(
                      displayPercentValue(activeCdp.stabilityFee)
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
import { mapGetters } from 'vuex';
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
    activeCdp: {
      type: Object,
      default: function() {
        return {};
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
    ...mapGetters({
      account: 'account',
      web3: 'web3',
      network: 'network'
    }),
    getfeeOwed() {
      const result = this.activeCdp.governanceFeeOwed;
      return this.displayFixedValue(result, 8);
    },
    newCollateralRatio() {
      if (this.activeCdp) {
        return this.activeCdp.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).gte(2);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.activeCdp) {
        return this.activeCdp.liquidationPrice;
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
      const mkrNeeded = this.activeCdp.governanceFeeOwed;
      if (mkrNeeded) {
        return toBigNumber(this.mkrBalance).gte(mkrNeeded);
      }
      return false;
    },
    enoughDai() {
      const daiNeeded = this.activeCdp.debtValue;
      if (daiNeeded) {
        return toBigNumber(this.daiBalance).gte(daiNeeded);
      }
      return false;
    },
    canClose() {
      return this.enoughMkr && this.enoughDai;
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
      if (this.activeCdp) {
        this.closable = await this.activeCdp.canCloseCdp();
        return this.closable;
      }
      this.closable = false;
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
      await this.activeCdp.closeCdp();
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
    getBalances() {
      // console.log(this.tokensWithBalance); // todo remove dev item
      this.mkrToken = this.tokensWithBalance.find(item => {
        return item.symbol === 'MKR';
      });
      this.daiToken = this.tokensWithBalance.find(item => {
        return item.symbol === 'DAI';
      });
      // console.log(this.daiToken); // todo remove dev item
    },
    getMkr() {
      const mkrNeeded = this.getfeeOwed;
      console.log(mkrNeeded); // todo remove dev item
      if (toBigNumber(this.mkrBalance).lt(mkrNeeded)) {
        this.suppliedToAmount = toBigNumber(mkrNeeded)
          .minus(toBigNumber(this.mkrBalance))
          .plus(toBigNumber(mkrNeeded).times(0.01))
          .toNumber();
        this.suppliedFrom = {
          symbol: 'ETH',
          name: 'Ethereum'
        };
        this.suppliedTo = {
          symbol: 'MKR',
          name: 'Maker'
        };
        // this.destAddress = this.proxyAddress;
        this.$refs.swapWidget.$refs.modal.show();
      }
    },
    getDai() {
      const daiNeeded = this.activeCdp.debtValue;
      if (toBigNumber(this.daiBalance).lt(daiNeeded)) {
        this.suppliedToAmount = toBigNumber(daiNeeded)
          .minus(toBigNumber(this.daiBalance))
          .toNumber();
        this.suppliedFrom = {
          symbol: 'ETH',
          name: 'Ethereum'
        };
        this.suppliedTo = {
          symbol: 'DAI',
          name: 'Dai'
        };
        this.destAddress = this.activeCdp.proxyAddress;
        this.$refs.swapWidget.$refs.modal.show();
      }
    },
    getApprovals() {
      const addres = [];
      if (this.daiToken) {
        addres.push(this.daiToken.address);
      }
      if (this.mkrToken) {
        addres.push(this.mkrToken.address);
      }
      const datas = this.makerManager.approveTokens(...addres);
      console.log(datas); // todo remove dev item
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CloseCdpModal';
</style>

<template>
  <div class="mew-component--swap">
    <swap-confirmation
      :to="confirmInfo.to"
      :from="confirmInfo.from"
      :from-img="confirmInfo.fromImg"
      :from-type="confirmInfo.fromType"
      :to-type="confirmInfo.toType"
      :to-img="confirmInfo.toImg"
      :show="confirmInfo.show"
      :back-func="backFunction"
      :from-val="confirmInfo.fromVal"
      :to-val="confirmInfo.toVal"
      :valid-until="confirmInfo.validUntil"
      :send="executeTrade"
    />

    <mew6-white-sheet>
      <mew-module
        :has-elevation="true"
        :has-indicator="true"
        class="d-flex flex-grow-1 pt-6"
        title="Swap"
      >
        <template #moduleBody>
          <!--
            =====================================================================================
              From / Amount to Swap / To / Amount to Recieve
            =====================================================================================
            -->
          <v-row class="align-center justify-space-between">
            <v-col cols="12" sm="5" class="pb-0 pb-sm-3">
              <mew-select
                :value="fromTokenType"
                :items="fromTokens"
                label="From"
                @input="setFromToken"
              />
              <mew-input
                label="you'll send"
                placeholder=""
                :value="tokenInValue"
                type="number"
                @input="setTokenInValue"
              />
            </v-col>
            <v-col cols="12" sm="2" class="pt-0 pt-sm-3">
              <div class="d-flex align-center justify-center">
                <img :src="swapIcon" height="35" />
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <mew-select
                ref="toToken"
                :value="toTokenType"
                :items="toTokens"
                label="To"
                @input="setToToken"
              />
              <mew-input
                label="you'll receive"
                placeholder=""
                type="number"
                disabled
                :value="tokenOutValue"
              />
            </v-col>
          </v-row>
          <!--
            =====================================================================================
              Address Book
            =====================================================================================
            -->
          <module-address-book @setAddress="setToAddress" />
          <!--
            =====================================================================================
             Providers List
            =====================================================================================
            -->
          <swap-providers-list
            :step="step"
            :available-quotes="availableQuotes"
            :set-provider="setProvider"
            :to-token-symbol="toTokenType.symbol"
            :to-token-icon="toTokenType.img"
            :message="providersMessage"
          />

          <mew-expand-panel
            v-show="step >= 2"
            is-toggle
            has-dividers
            :panel-items="exPannel"
            class="mt-4 mb-10 swap-expend"
          >
            <template #panelBody1>
              <mew-input
                label="Gas Price"
                placeholder=" "
                right-label="Gwei"
                :value="gasPriceGwei"
                disabled
              />
              <mew-input
                label="Total Gas Limit"
                placeholder=" "
                right-label="Wei"
                disabled
                :value="totalGasLimit"
              />
            </template>
          </mew-expand-panel>

          <div v-show="step >= 2" class="text-center">
            <mew-button
              title="Swap"
              :has-full-width="false"
              btn-size="xlarge"
              @click.native="showConfirm()"
            />
          </div>
        </template>
      </mew-module>
    </mew6-white-sheet>
  </div>
</template>

<script>
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import SwapConfirmation from '@/modules/swap/components/SwapConfirmation';
import SwapIcon from '@/assets/images/icons/icon-swap.svg';
import SwapProvidersList from './components/SwapProvidersList.vue';
import Swapper from './handlers/handlerSwap';
import utils, { toBN, fromWei } from 'web3-utils';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';
const AMT = '0.1';
export default {
  name: 'ModuleSwapRates',
  components: {
    ModuleAddressBook,
    SwapConfirmation,
    SwapProvidersList
  },
  props: {
    fromToken: {
      type: String,
      default: ETH_TOKEN
    },
    toToken: {
      type: String,
      default: DAI_TOKEN
    },
    amount: {
      type: String,
      default: AMT
    }
  },
  data() {
    return {
      step: 0,
      confirmInfo: {
        to: '',
        from: '',
        fromImg: '',
        toImg: '',
        fromType: '',
        toType: '',
        validUntil: 0,
        show: false
      },
      swapper: null,
      toTokenType: {},
      fromTokenType: {},
      tokenInValue: this.amount,
      tokenOutValue: null,
      availableTokens: [],
      availableQuotes: [],
      currentTrade: null,
      allTrades: [],
      isLoading: false,
      defaults: {
        fromToken: this.fromToken,
        toToken: this.toToken
      },
      exPannel: [
        {
          name: 'Transaction Fee',
          subtext: '$0.00',
          tooltip:
            'Transaction fee is automatically caculated. If you want to customize the Transaction fee, you can do it from here.'
        }
      ],
      swapIcon: SwapIcon,
      fromTokens: [],
      toTokens: [],
      providersMessage: ''
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('global', ['network', 'gasPrice']),
    totalFees() {
      return toBN(this.totalGasLimit).mul(toBN(this.gasPrice)).toString();
    },
    gasPriceGwei() {
      return fromWei(this.gasPrice, 'gwei');
    },
    totalGasLimit() {
      if (this.currentTrade) {
        let totalGas = toBN(0);
        this.currentTrade.transactions.forEach(tx => {
          totalGas = totalGas.add(toBN(tx.gas));
        });
        return totalGas.toString();
      }
      return '0';
    }
  },
  watch: {
    defaults: {
      handler: function () {
        this.setDefaults();
      },
      deep: true,
      immediate: true
    }
  },
  beforeMount() {
    if (Object.keys(this.$route.query).length > 0) {
      const { fromToken, toToken, amount } = this.$route.query;
      this.defaults = {
        fromToken,
        toToken
      };
      this.tokenInValue = `${amount}`;
    }
  },
  mounted() {
    this.isLoading = true;
    this.swapper = new Swapper(this.web3);
    this.swapper
      .getAllTokens()
      .then(tokens => {
        this.availableTokens = tokens;
      })
      .then(() => {
        this.setDefaults();
        this.isLoading = false;
      });
  },
  methods: {
    getTokenFromAddress(address) {
      if (!this.availableTokens.toTokens) return {};
      for (const t of this.availableTokens.toTokens) {
        if (t.contract_address === address) return t;
      }
      return {};
    },
    setDefaults() {
      this.fromTokens = this.availableTokens.fromTokens;
      this.toTokens = this.availableTokens.toTokens;
      setImmediate(() => {
        this.fromTokenType = this.getTokenFromAddress(this.defaults.fromToken);
        this.toTokenType = this.getTokenFromAddress(this.defaults.toToken);
        this.setTokenInValue(this.tokenInValue);
      });
    },
    setToAddress(value) {
      this.addressValue = value;
    },
    setFromToken(value) {
      this.fromTokenType = value;
      this.setTokenInValue(this.tokenInValue);
    },
    setToToken(value) {
      this.toTokenType = value;
      this.setTokenInValue(this.tokenInValue);
    },
    setTokenInValue: utils._.debounce(function (value) {
      if (!value || this.isLoading) return;
      this.availableQuotes = [];
      this.allTrades = [];
      this.step = 0;
      this.tokenInValue = value;
      this.providersMessage = '';
      this.swapper
        .getAllQuotes({
          fromT: this.fromTokenType,
          toT: this.toTokenType,
          fromAmount: new BigNumber(this.tokenInValue).times(
            new BigNumber(10).pow(new BigNumber(this.fromTokenType.decimals))
          )
        })
        .then(quotes => {
          quotes = quotes.map(q => {
            q.rate = new BigNumber(q.amount)
              .dividedBy(new BigNumber(this.tokenInValue))
              .toString();
            q.isSelected = false;
            return q;
          });
          this.availableQuotes = quotes;
          if (quotes.length) {
            this.tokenOutValue = quotes[0].amount;
            this.step = 1;
          } else {
            this.providersMessage =
              'There are no available Providers at this time, please try another pair.';
          }
        });
    }, 500),
    setProvider(idx) {
      this.availableQuotes.forEach((q, _idx) => {
        if (_idx === idx) {
          q.isSelected = event;
          this.tokenOutValue = q.amount;
          this.getTrade(idx);
        }
      });
    },
    getTrade: utils._.debounce(function (idx) {
      this.step = 1;
      if (this.allTrades[idx]) {
        this.currentTrade = this.allTrades[idx];
        this.exPannel[0].subtext = `${fromWei(this.totalFees)} ${
          this.network.type.name
        }`;
        this.step = 2;
        return;
      }
      this.swapper
        .getTrade({
          fromAddress: this.address,
          toAddress: this.addressValue.address,
          provider: this.availableQuotes[idx].provider,
          fromT: this.fromTokenType,
          toT: this.toTokenType,
          quote: this.availableQuotes[idx],
          fromAmount: new BigNumber(this.tokenInValue).times(
            new BigNumber(10).pow(new BigNumber(this.fromTokenType.decimals))
          )
        })
        .then(trade => {
          this.currentTrade = trade;
          this.exPannel[0].subtext = `${fromWei(this.totalFees)} ${
            this.network.type.name
          }`;
          this.allTrades[idx] = trade;
          this.step = 2;
        });
    }, 500),
    showConfirm() {
      this.confirmInfo = {
        from: this.address,
        to: this.addressValue.address,
        fromType: this.fromTokenType.symbol,
        toType: this.toTokenType.symbol,
        fromImg: this.fromTokenType.img,
        toImg: this.toTokenType.img,
        fromVal: this.tokenInValue,
        toVal: this.tokenOutValue,
        validUntil: new Date().getTime() + 10 * 60 * 1000,
        show: true
      };
    },
    backFunction() {
      this.confirmInfo.show = false;
    },
    executeTrade() {
      this.confirmInfo.show = false;
      this.swapper.executeTrade(this.currentTrade);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input--selection-controls {
  padding: 0;
  margin: 0;
}

.invert {
  filter: invert(100%);
}

.border-radius--10px::before {
  border-radius: 10px !important;
}
</style>

<style lang="scss">
.mew-component--swap {
  width: 100%;
  .swap-expend {
    .v-application .white {
      background-color: transparent !important;
    }
  }
  .v-skeleton-loader__chip {
    width: 100% !important;
  }
}
</style>

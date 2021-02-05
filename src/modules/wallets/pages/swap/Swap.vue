<template>
  <div class="mew-component--swap">
    <Loading
      :show="step < 1"
      timer
      message="We are loading supported coins list and swap providers..."
    />
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
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Swap">
            <div class="d-flex">
              <div>
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
              </div>
              <div class="px-6 mb-8 d-flex align-center">
                <img :src="swapIcon" height="35" />
              </div>
              <div>
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
              </div>
            </div>
            <mew-address-select
              class="mt-5"
              copy-tooltip="Copy"
              save-tooltip="Save"
              :enable-save-address="true"
              label="To address"
              :items="addresses"
              placeholder="Please enter an address"
              success-toast="Success"
              :is-valid-address="false"
              :value="address"
              @input="setToAddress"
            />

            <div v-show="step >= 1" class="mt-5">
              <div class="mew-heading-3">Select a provider</div>
              <v-row>
                <v-col
                  v-for="(quote, idx) in availableQuotes"
                  :key="`quote-${idx}`"
                  cols="6"
                  lg="6"
                  sm="12"
                >
                  <v-card flat color="tableHeader" class="pa-6">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <img
                        :class="$vuetify.theme.dark ? 'invert' : ''"
                        :src="quote.exchangeInfo.img"
                        :alt="quote.exchangeInfo.name"
                        height="35"
                      />
                      <mew-checkbox
                        :value="quote.isSelected"
                        @input="setProvider($event, idx)"
                      />
                    </div>
                    <div class="font-weight-medium">
                      1 {{ fromTokenType.symbol }} = {{ quote.rate }}
                      {{ toTokenType.symbol }}
                    </div>
                    <div>{{ quote.exchangeInfo.name }}</div>
                  </v-card>
                </v-col>
              </v-row>
            </div>

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
          </interface-wrap>
        </mew6-white-sheet>
      </div>
      <div class="pa-4"></div>
      <div>
        <network />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>
  </div>
</template>

<script>
import Network from '@/modules/wallets/components/network/Network';
import Swap from '@/modules/wallets/components/swap/Swap';
import SwapConfirmation from './components/SwapConfirmation';
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import SwapIcon from '@/assets/images/icons/icon-swap.svg';
import KyberNetwork from '@/assets/images/icons/icon-kyber-network.svg';
import Changelly from '@/assets/images/icons/icon-changelly.png';
import Simplex from '@/assets/images/icons/icon-simplex.png';
import Bity from '@/assets/images/icons/icon-bity.png';
import Swapper from '@/modules/swap';
import utils, { toBN, fromWei } from 'web3-utils';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import Loading from '@/components/loading/Loading';
const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';
export default {
  components: {
    SwapConfirmation,
    network: Network,
    swap: Swap,
    'interface-wrap': InterfaceWrap,
    Loading
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
      toTokenType: null,
      fromTokenType: null,
      tokenInValue: '0.1',
      tokenOutValue: null,
      availableTokens: [],
      availableQuotes: [],
      currentTrade: null,
      allTrades: [],
      isLoading: false,
      defaults: {
        fromToken: ETH_TOKEN,
        toToken: DAI_TOKEN
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
      kyber: KyberNetwork,
      changelly: Changelly,
      simplex: Simplex,
      bity: Bity,
      addresses: [
        {
          address: '0x8c08079b06f83b7e04781c290a375e9572f9a90c',
          currency: 'ETH',
          nickname: 'My Address',
          resolverAddr: '0x8c08079b06f83b7e04781c290a375e9572f9a90c'
        },
        {
          address: '0x43689531907482BEE7e650D18411E284A7337A66',
          currency: 'ETH',
          nickname: 'nickname',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ],
      fromTokens: [],
      toTokens: []
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),
    ...mapState('global', ['gasPrice']),
    ...mapGetters('global', ['network']),
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
          }
        });
    }, 500),
    setProvider(event, idx) {
      this.availableQuotes.forEach((q, _idx) => {
        if (_idx === idx) {
          q.isSelected = event;
          if (event) {
            this.tokenOutValue = q.amount;
            this.getTrade(idx);
          }
        } else q.isSelected = false;
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
</style>

<style lang="scss">
.mew-component--swap {
  .swap-expend {
    .v-application .white {
      background-color: transparent !important;
    }
  }
}
</style>

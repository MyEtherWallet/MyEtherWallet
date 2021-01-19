<template>
  <div class="mew-component--swap">
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
              label="label"
              :items="addresses"
              placeholder="Please enter an address"
              success-toast="Success"
              :is-valid-address="false"
              @input="getSelectedValue"
            />

            <div class="mt-5">
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
                        :src="quote.dexInfo.img"
                        :alt="quote.dexInfo.name"
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
                    <div>{{ quote.dexInfo.name }}</div>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <mew-expand-panel
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
                  disabled
                />
                <mew-input
                  label="Total Gas Limit"
                  placeholder=" "
                  right-label="Wei"
                  disabled
                />
              </template>
            </mew-expand-panel>

            <div class="text-center">
              <mew-button
                title="Swap"
                :has-full-width="false"
                btn-size="xlarge"
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

import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import SwapIcon from '@/assets/images/icons/icon-swap.svg';
import KyberNetwork from '@/assets/images/icons/icon-kyber-network.svg';
import Changelly from '@/assets/images/icons/icon-changelly.png';
import Simplex from '@/assets/images/icons/icon-simplex.png';
import Bity from '@/assets/images/icons/icon-bity.png';
import Swapper from '@/modules/swap';
import utils from 'web3-utils';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';
export default {
  components: {
    network: Network,
    swap: Swap,
    'interface-wrap': InterfaceWrap
  },
  data() {
    return {
      swapper: null,
      toTokenType: null,
      fromTokenType: null,
      tokenInValue: '1',
      tokenOutValue: null,
      availableTokens: [],
      availableQuotes: [],
      isLoading: false,
      defaults: {
        fromToken: ETH_TOKEN,
        toToken: DAI_TOKEN
      },
      exPannel: [
        {
          name: 'Transaction Fee',
          subtext: '$0.077',
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
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'My Address',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
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
    ...mapState('wallet', ['web3', 'gasPrice', 'address'])
  },
  mounted() {
    this.isLoading = true;
    this.swapper = new Swapper(this.web3);
    this.swapper
      .getAllTokens()
      .then(tokens => {
        this.availableTokens = tokens.map(t => {
          t.img = t.icon;
          return t;
        });
      })
      .then(() => {
        this.setDefaults();
        this.isLoading = false;
      });
  },
  methods: {
    removeOneToken(token) {
      return this.availableTokens.filter(
        t => t.contract_address !== token.contract_address
      );
    },
    getTokenFromAddress(address) {
      for (const t of this.availableTokens) {
        if (t.contract_address === address) return t;
      }
      return {};
    },
    setDefaults() {
      this.fromTokens = this.availableTokens;
      this.toTokens = this.availableTokens;
      setImmediate(() => {
        this.fromTokenType = this.getTokenFromAddress(this.defaults.fromToken);
        this.toTokenType = this.getTokenFromAddress(this.defaults.toToken);
        this.setTokenInValue(this.tokenInValue);
      });
    },
    getSelectedValue(value) {
      console.log(value);
      this.addressValue = value;
    },
    setFromToken(value) {
      this.fromTokenType = value;
    },
    setToToken(value) {
      this.toTokenType = value;
    },
    setTokenInValue: utils._.debounce(function (value) {
      if (!value || this.isLoading) return;
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
          this.tokenOutValue = quotes[0].amount;
        });
    }, 500),
    setProvider(event, idx) {
      this.availableQuotes.forEach((q, _idx) => {
        if (_idx === idx) {
          q.isSelected = event;
          if (event) this.getTrade(idx);
        } else q.isSelected = false;
      });
    },
    getTrade: utils._.debounce(function (idx) {
      console.log(idx, 'get trade', this.addressValue);
      this.swapper
        .getTrade({
          fromAddress: this.address,
          toAddress: this.addressValue,
          provider: this.availableQuotes[idx].provider,
          fromT: this.fromTokenType,
          toT: this.toTokenType,
          dex: this.availableQuotes[idx].dex,
          fromAmount: new BigNumber(this.tokenInValue).times(
            new BigNumber(10).pow(new BigNumber(this.fromTokenType.decimals))
          )
        })
        .then(console.log);
    }, 500)
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

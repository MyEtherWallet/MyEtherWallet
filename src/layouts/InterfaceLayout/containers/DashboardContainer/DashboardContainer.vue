<template>
  <div class="dashboard-container">
    <div class="container--flex container--top">
      <div class="container--card block--actions">
        <div class="title">
          <h4>Actions</h4>
        </div>
        <div class="margin--top--auto buttons">
          <img
            class="clickable"
            src="@/assets/images/buttons/send-tx.png"
            @click="goTo('send-transaction')"
          />
          <img
            class="clickable"
            src="@/assets/images/buttons/nft-manager.png"
            @click="goTo('interact-with-contract')"
          />
        </div>
      </div>

      <div class="container--card block--swap">
        <div class="flex--row--align-center title">
          <h4>Swap</h4>
          <button
            class="title-button prevent-user-select"
            @click="goTo('swap')"
          >
            More...
          </button>
        </div>
        <p>
          MEW has partnered with Bity, Kyber Network, and Simplex to allow users
          to swap fiat to crypto, ETH and BTC, ETH and ERC-20.
        </p>
        <div class="margin--top--auto swap-info">
          <div v-for="pair in swapPairs" :key="pair.from + pair.to">
            <div class="swap-to" @click="showSwapWidget(pair)">
              <p class="monospace">
                {{ pair.amt }} {{ pair.from }} / {{ pair.rate }} {{ pair.to }}
              </p>
              <div class="margin--left--auto flex--row--align-center">
                <span
                  :class="['currency-symbol', 'cc', pair.from, 'cc-icon']"
                ></span>
                <img src="@/assets/images/icons/swap.svg" />
                <span
                  :class="['currency-symbol', 'cc', pair.to, 'cc-icon']"
                ></span>
              </div>
            </div>
          </div>
          <!--          <div class="swap-to">
            <p class="monospace">0.026 BTC / 1 ETH</p>
            <div class="margin&#45;&#45;left&#45;&#45;auto flex&#45;&#45;row&#45;&#45;align-center">
              <span class="currency-symbol cc ETH cc-icon"></span>
              <img src="@/assets/images/icons/swap.svg" />
              <span class="currency-symbol cc BTC cc-icon"></span>
            </div>
          </div>

          <div class="swap-to">
            <p class="monospace">351.24 USD / 1 ETH</p>
            <div class="margin&#45;&#45;left&#45;&#45;auto flex&#45;&#45;row&#45;&#45;align-center">
              <span class="currency-symbol cc ETH cc-icon"></span>
              <img src="@/assets/images/icons/swap.svg" />
              <span class="currency-symbol cc USD cc-icon"></span>
            </div>
          </div>

          <div class="swap-to">
            <p class="monospace">32.116 XMR / 1 ETH</p>
            <div class="margin&#45;&#45;left&#45;&#45;auto flex&#45;&#45;row&#45;&#45;align-center">
              <span class="currency-symbol cc ETH cc-icon"></span>
              <img src="@/assets/images/icons/swap.svg" />
              <span class="currency-symbol cc XMR cc-icon"></span>
            </div>
          </div>-->
        </div>
      </div>
    </div>

    <div class="container--card bottom--buttons">
      <div class="block--dapps">
        <div class="flex--row--align-center title">
          <h4>MEW Dapps</h4>
          <button
            class="title-button prevent-user-select"
            @click="goTo('dapps')"
          >
            Vuew All
          </button>
        </div>
        <div class="block--container">
          <dapp-buttons
            v-for="dapp in sortedObject"
            :key="dapp.title"
            :title="$t(dapp.title)"
            :icon="dapp.icon"
            :icon-disabled="dapp.iconDisabled"
            :desc="$t(dapp.desc)"
            :param="dapp.route"
            :supported-networks="dapp.supportedNetworks"
            class="dapp"
          />
        </div>
      </div>
    </div>
    <swap-widget
      ref="swapWidget"
      :supplied-from="suppliedFrom"
      :supplied-to="suppliedTo"
      :supplied-from-amount="suppliedFromAmount"
      :dest-address="account.address"
    ></swap-widget>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import CurrencyPicker from '../../components/CurrencyPicker';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import tabsConfig from '../../components/InterfaceSideMenu/InterfaceSideMenu.config';
import DappButtons from '../../components/DappButtons';
import dapps from '@/dapps';
import SwapWidget from '@/components/SwapWidget';

import {
  SwapProviders,
  providers
  // bestProviderForQuantity,
  // bestRateForQuantity,
  // isValidEntry,
  // providerNames,
  // supportedProviders,
  // BASE_CURRENCY,
  // fiat,
  // MIN_SWAP_AMOUNT,
  // ERC20
} from '@/partners';
// import { Transaction } from 'ethereumjs-tx';
// import { Misc, Toast } from '@/helpers';
// import BigNumber from 'bignumber.js';
// import ethUnit from 'ethjs-unit';
// import utils from 'web3-utils';
// import fetch from 'node-fetch';
import BigNumber from 'bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'currency-picker': CurrencyPicker,
    'dapp-buttons': DappButtons,
    'swap-widget': SwapWidget
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    getBalance: {
      type: Function,
      default: function() {}
    },
    highestGas: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      dappsToShow: ['maker', 'manageEns', 'scheduleTransaction'],
      tabData: tabsConfig.tabs,
      advancedExpand: false,
      isValidAddress: false,
      hexAddress: '',
      address: '',
      value: '0',
      gasLimit: '21000',
      data: '',
      selectedCurrency: '',
      ethPrice: 0,
      swapPairs: [
        { from: 'ETH', to: 'BTC', amt: 1, rate: 0 },
        { from: 'ETH', to: 'EUR', amt: 1, rate: 0 },
        { from: 'ETH', to: 'KNC', amt: 1, rate: 0 },
        { from: 'BAT', to: 'ETH', amt: 1, rate: 0 },
        { from: 'ETH', to: 'DAI', amt: 1, rate: 0 }
      ],
      swap: new SwapProviders(
        providers,
        {
          network: this.$store.state.network.type.name,
          web3: this.$store.state.web3,
          getRateForUnit: false
        },
        { tokensWithBalance: this.tokensWithBalance }
      ),
      rateUpdater: null,
      updatingRates: false,
      suppliedFrom: {
        symbol: 'ETH',
        name: 'Ethereum'
      },
      suppliedTo: {
        symbol: 'BTC',
        name: 'Bitcoin'
      },
      suppliedFromAmount: 0
    };
  },

  computed: {
    ...mapState([
      'account',
      'gasPrice',
      'web3',
      'network',
      'linkQuery',
      'online'
    ]),
    sortedObject() {
      const arrayedDapp = [];
      Object.keys(dapps).forEach(dapp => {
        if (this.dappsToShow.includes(dapp)) {
          arrayedDapp.push(dapps[dapp]);
        }
      });

      return arrayedDapp.sort((a, b) => {
        if (
          a.supportedNetworks.includes(this.network.type.name) ||
          b.supportedNetworks.includes(this.network.type.name)
        )
          return 1;
        return 0;
      });
    }
  },
  watch: {
    ['swap.haveProviderRates']() {
      this.haveProviderRates = this.swap.haveProviderRates;
      this.setupSwap();
    }
  },
  mounted() {
    if (this.online && this.network.type.name === 'ETH') {
    } else {
      console.log('no swap'); // todo remove dev item;
    }
  },
  beforeDestroy() {
    clearInterval(this.rateUpdater);
  },
  methods: {
    goTo(page) {
      let childIndex = -1;
      const pageInfo = this.tabData.find(entry => {
        if (entry.name === page) {
          return true;
        } else if (entry.children.length > 0) {
          const found = entry.children.findIndex(child => child.name === page);
          if (found >= 0) {
            childIndex = found;
            return true;
          }
        }
        return false;
      });
      if (childIndex >= 0) {
        this.$router.push({ path: pageInfo.children[childIndex].routes[0] });
      } else {
        this.$router.push({ path: pageInfo.routes[0] });
      }
    },
    async setupSwap() {
      for (let i = 0; i < this.swapPairs.length; i++) {
        // swapPairs
        const swappers = await this.swap.standAloneRateEstimate(
          this.swapPairs[i].from,
          this.swapPairs[i].to,
          this.swapPairs[i].amt
        );
        this.swapPairs[i].rate = toBigNumber(swappers[0].rate).toFixed(4);
        console.log(swappers); // todo remove dev item
      }
      this.rateUpdate();
      // const swappers = await this.swap.standAloneRateEstimate('ETH', 'BTC', 1);
      console.log(this.swapPairs); // todo remove dev item
    },
    async rateUpdate() {
      if (this.rateUpdater === null) {
        this.rateUpdater = setInterval(async () => {
          this.updatingRates = true;
          await this.setupSwap();
          this.updatingRates = false;
        }, 30000);
      }
    },
    showSwapWidget(vals) {
      this.suppliedFromAmount = vals.amt;
      this.suppliedFrom = {
        symbol: vals.from,
        name: ''
      };
      this.suppliedTo = {
        symbol: vals.to,
        name: ''
      };
      this.$nextTick(() => {
        this.$refs.swapWidget.$refs.modal.show();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DashboardContainer.scss';
</style>

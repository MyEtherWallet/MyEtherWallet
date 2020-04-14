<template>
  <div class="dashboard-container">
    <div class="container--flex container--top">
      <div class="container--card block--actions">
        <div class="title">
          <h4>{{ $t('interface.actions') }}</h4>
        </div>
        <div class="buttons">
          <button-send-tx :go-to="goTo" class="clickable" />
          <button-nft-manager
            :disabled="!isOnlineAndEth"
            :go-to="goTo"
            class="clickable"
          />
        </div>
      </div>

      <div class="container--card block--swap">
        <div class="flex--row--align-center title">
          <h4>{{ $t('common.swap') }}</h4>
          <button
            class="title-button prevent-user-select"
            @click="goTo('swap')"
          >
            {{ $t('common.more') }}
          </button>
        </div>
        <p class="section-description">
          {{ $t('interface.dashboard-swap') }}
        </p>
        <div class="swap-info">
          <div v-for="pair in swapPairs" :key="pair.from + pair.to">
            <div
              :class="isOnlineAndEth ? 'swap-enabled' : 'swap-disabled'"
              class="swap-to clickable"
              @click.prevent="showSwapWidget(pair)"
            >
              <p class="monospace">
                {{ pair.amt }} {{ pair.from }} / {{ pair.rate }} {{ pair.to }}
              </p>
              <div class="margin--left--auto flex--row--align-center">
                <span v-if="!getIcon(pair.from)" class="currency-symbol">
                  <img :src="iconFetcher(pair.from)" class="icon-image" />
                </span>
                <span
                  v-if="getIcon(pair.from)"
                  :class="['currency-symbol', 'cc', pair.from, 'cc-icon']"
                ></span>
                <img src="@/assets/images/icons/swap-widget.svg" alt />
                <span v-if="!getIcon(pair.to)" class="currency-symbol">
                  <img :src="iconFetcher(pair.to)" class="icon-image" />
                </span>
                <span
                  v-if="getIcon(pair.to)"
                  :class="['currency-symbol', 'cc', pair.to, 'cc-icon']"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container--card bottom--buttons">
      <div class="block--dapps">
        <div class="flex--row--align-center title">
          <h4>{{ $t('common.dapps') }}</h4>
          <button
            class="title-button prevent-user-select"
            @click="goTo('dapps')"
          >
            {{ $t('interface.view-all') }}
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
            :release-date="dapp.releaseDate"
            :supported-networks="dapp.supportedNetworks"
            class="dapp"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import tabsConfig from '../../components/InterfaceSideMenu/InterfaceSideMenu.config';
import DappButtons from '../../components/DappButtons';
import dapps from '@/dapps';
import ButtonNftManager from './components/ButtonNftManager';
import ButtonSendTx from './components/ButtonSendTx';
import { hasIcon } from '@/partners';

import { SwapProviders, providers } from '@/partners';
import BigNumber from 'bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'dapp-buttons': DappButtons,
    'button-nft-manager': ButtonNftManager,
    'button-send-tx': ButtonSendTx
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function () {
        return [];
      }
    },
    getBalance: {
      type: Function,
      default: function () {}
    },
    highestGas: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      showSwapValues: true,
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
          network: this.$store.state.main.network.type.name,
          web3: this.$store.state.main.web3,
          getRateForUnit: false
        },
        {
          tokensWithBalance: this.tokensWithBalance,
          online: this.$store.state.main.online
        }
      ),
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
    ...mapState('main', ['account', 'web3', 'network', 'online']),
    sortedObject() {
      const arrayedDapp = [];
      const actualReturnedDapp = [];
      Object.keys(dapps).forEach(dapp => {
        if (dapp === 'manageEns' || dapp === 'maker')
          actualReturnedDapp.push(dapps[dapp]);
        arrayedDapp.push(dapps[dapp]);
      });
      const newestDapp = arrayedDapp.sort((a, b) => {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      })[0];
      actualReturnedDapp.push(newestDapp);
      return actualReturnedDapp;
    },
    isOnlineAndEth() {
      return this.online && this.network.type.name === 'ETH';
    }
  },
  watch: {
    ['swap.haveProviderRates']() {
      if (this.isOnlineAndEth) {
        this.haveProviderRates = this.swap.haveProviderRates;
        this.setupSwap();
      }
    },
    network() {
      setTimeout(() => {
        this.swap = new SwapProviders(
          providers,
          {
            network: this.network.type.name,
            web3: this.web3,
            getRateForUnit: false
          },
          {
            tokensWithBalance: this.tokensWithBalance,
            online: this.$store.state.main.online
          }
        );
      }, 500);
    }
  },
  mounted() {
    if (this.online && this.network.type.name === 'ETH') {
      this.showSwapValues = true;
    } else {
      this.showSwapValues = false;
    }
  },
  methods: {
    iconFetcher(currency) {
      let icon;
      try {
        // eslint-disable-next-line
        icon = require(`@/assets/images/currency/coins/AllImages/${currency}.svg`);
      } catch (e) {
        // eslint-disable-next-line
        return require(`@/assets/images/icons/web-solution.svg`);
      }
      return icon;
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    goTo(page, disabled) {
      if (disabled) return;
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
        if (this.online || !pageInfo.children[childIndex].onlineOnly) {
          this.$router.push({ path: pageInfo.children[childIndex].routes[0] });
        }
      } else {
        if (this.online || !pageInfo.onlineOnly) {
          this.$router.push({ path: pageInfo.routes[0] });
        }
      }
    },
    async setupSwap() {
      if (this.isOnlineAndEth) {
        for (let i = 0; i < this.swapPairs.length; i++) {
          const swappers = await this.swap.standAloneRateEstimate(
            this.swapPairs[i].from,
            this.swapPairs[i].to,
            this.swapPairs[i].amt
          );
          if (this.isOnlineAndEth) {
            if (swappers) {
              this.$set(
                this.swapPairs[i],
                'rate',
                toBigNumber(swappers[0].rate).toFixed(4)
              );
            }
          }
        }
      }
    },
    showSwapWidget(vals) {
      if (this.isOnlineAndEth) {
        this.$eventHub.$emit(
          'showSwapWidget',
          this.account.address,
          vals.from,
          vals.to,
          vals.amt
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DashboardContainer.scss';
</style>

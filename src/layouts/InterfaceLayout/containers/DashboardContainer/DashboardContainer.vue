<template>
  <div class="dashboard-container">
    <div class="container--flex container--top">
      <div class="container--card block--actions">
        <div class="title">
          <h4>{{ $t('common.actions') }}</h4>
        </div>
        <div class="buttons">
          <button-send-tx
            class="clickable"
            @click.native="goTo('send-transaction')"
          />
          <button-nft-manager
            class="clickable"
            @click.native="goTo('nft-manager')"
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
          {{ $t('interface.dashboardSwap') }}
        </p>
        <div class="swap-info">
          <div v-for="pair in swapPairs" :key="pair.from + pair.to">
            <div class="swap-to clickable" @click.prevent="showSwapWidget(pair)">
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
            {{ $t('common.viewAll') }}
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
import ButtonNftManager from './components/ButtonNftManager';
import ButtonSendTx from './components/ButtonSendTx';

import { SwapProviders, providers } from '@/partners';
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
    'swap-widget': SwapWidget,
    'button-nft-manager': ButtonNftManager,
    'button-send-tx': ButtonSendTx
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
          network: this.$store.state.network.type.name,
          web3: this.$store.state.web3,
          getRateForUnit: false
        },
        {
          tokensWithBalance: this.tokensWithBalance,
          online: this.$store.state.online
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
    ...mapState(['account', 'web3', 'network', 'online']),
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
      if (this.showSwapValues) {
        this.haveProviderRates = this.swap.haveProviderRates;
        this.setupSwap();
      }
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
      if (this.showSwapValues) {
        for (let i = 0; i < this.swapPairs.length; i++) {
          const swappers = await this.swap.standAloneRateEstimate(
            this.swapPairs[i].from,
            this.swapPairs[i].to,
            this.swapPairs[i].amt
          );
          this.$set(
            this.swapPairs[i],
            'rate',
            toBigNumber(swappers[0].rate).toFixed(4)
          );
        }
      }
    },
    showSwapWidget(vals) {
      if (this.showSwapValues) {
        this.$eventHub.$emit('showSwapWidget', this.account.address, vals.from, vals.to, vals.amt)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DashboardContainer.scss';
</style>

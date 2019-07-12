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
          <div class="swap-to">
            <p class="monospace">0.026 BTC / 1 ETH</p>
            <div class="margin--left--auto flex--row--align-center">
              <span class="currency-symbol cc ETH cc-icon"></span>
              <img src="@/assets/images/icons/swap.svg" />
              <span class="currency-symbol cc BTC cc-icon"></span>
            </div>
          </div>

          <div class="swap-to">
            <p class="monospace">351.24 USD / 1 ETH</p>
            <div class="margin--left--auto flex--row--align-center">
              <span class="currency-symbol cc ETH cc-icon"></span>
              <img src="@/assets/images/icons/swap.svg" />
              <span class="currency-symbol cc USD cc-icon"></span>
            </div>
          </div>

          <div class="swap-to">
            <p class="monospace">32.116 XMR / 1 ETH</p>
            <div class="margin--left--auto flex--row--align-center">
              <span class="currency-symbol cc ETH cc-icon"></span>
              <img src="@/assets/images/icons/swap.svg" />
              <span class="currency-symbol cc XMR cc-icon"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container--card bottom--buttons">
      <div class="block--dapps">
        <div class="flex--row--align-center title">
          <h4>MEW Dapps</h4>
          <button class="title-button prevent-user-select" @click="goTo('dapps')">
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
<!--      <div class="flex&#45;&#45;row&#45;&#45;align-center title">
        <h4>MEW Dapps</h4>
        <button class="title-button prevent-user-select" @click="goTo('dapps')">
          View All
        </button>
      </div>
      <div class="button-container">
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
        &lt;!&ndash;        <horizontal-button-group :buttons="buttons" />&ndash;&gt;
      </div>-->
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
// import { Transaction } from 'ethereumjs-tx';
// import { Misc, Toast } from '@/helpers';
// import BigNumber from 'bignumber.js';
// import ethUnit from 'ethjs-unit';
// import utils from 'web3-utils';
// import fetch from 'node-fetch';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'currency-picker': CurrencyPicker,
    'dapp-buttons': DappButtons
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
      ethPrice: 0
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
  watch: {},
  mounted() {
    if (this.online && this.network.type.name === 'ETH')
      console.log('set up swappables'); // todo remove dev item;
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DashboardContainer.scss';
</style>

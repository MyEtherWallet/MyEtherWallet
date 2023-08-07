<template>
  <div class="module-network-switch full-width">
    <v-row
      v-if="!isSwapPage && hasNetworks"
      class="align-end justify-center justify-sm-space-between pa-0"
    >
      <!-- ===================================================================================== -->
      <!-- Toggle: Main/Test/All -->
      <!-- ===================================================================================== -->
      <div
        class="align-center align-sm-end justify-center pr-sm-3 pb-sm-3 order-sm-2 mt-10 mt-sm-0"
      >
        <v-btn-toggle
          v-model="toggleType"
          mandatory
          active-class="buttonToggleDark white--text alig-end"
        >
          <v-btn small>Main</v-btn>
          <v-btn small>Test</v-btn>
          <v-btn small>All</v-btn>
        </v-btn-toggle>
      </div>

      <!-- ===================================================================================== -->
      <!-- Search Data -->
      <!-- ===================================================================================== -->
      <v-col cols="12" sm="7" class="order-sm-1">
        <mew-search
          placeholder="Find Network"
          :value="searchInput"
          @input="setSearch"
        />
      </v-col>
    </v-row>

    <!-- ===================================================================================== -->
    <!-- Empty Search Message -->
    <!-- ===================================================================================== -->
    <app-user-msg-block
      v-if="showEmptySearch || isSwapPage"
      :message="emptySearchMes"
      :is-alert="isSwapPage"
      class="mt-5"
    />

    <!-- ===================================================================================== -->
    <!-- Networks -->
    <!-- ===================================================================================== -->
    <v-radio-group
      v-model="networkSelected"
      :class="networks.length > 10 ? 'network-container' : ''"
    >
      <v-container
        v-for="(network, i) in networks"
        :key="network.name"
        :class="[
          { 'network-border-first': i === 0 },
          { 'network-border-last': i + 1 === networks.length },
          'py-4 px-5 network-border'
        ]"
      >
        <v-row class="pa-0 mew-body align-center justify-start">
          <!-- ===================================================================================== -->
          <!-- Icon -->
          <!-- ===================================================================================== -->
          <mew-token-container :img="network.icon" size="24px" />
          <!-- ===================================================================================== -->
          <!-- Symbol/Name -->
          <!-- ===================================================================================== -->
          <div class="textDark--text Capitalize pl-3">
            {{ network.name }}
          </div>
          <div class="px-2 textLight--text">-</div>
          <div class="textLight--text">
            {{ network.name_long }}
          </div>
          <v-spacer />

          <!-- ===================================================================================== -->
          <!-- Radio -->
          <!-- ===================================================================================== -->
          <v-radio
            :value="network.name"
            :class="['py-2 mb-0']"
            :disabled="networkLoading"
          >
          </v-radio>
        </v-row>
      </v-container>
    </v-radio-group>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { debounce } from 'lodash';

import * as nodes from '@/utils/networks/nodes';
import * as types from '@/utils/networks/types';
import { Toast, SUCCESS, ERROR } from '@/modules/toast/handler/handlerToast';

import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

export default {
  name: 'NetworkSwitch',
  components: {
    AppUserMsgBlock: () => import('@/core/components/AppUserMsgBlock')
  },
  mixins: [handlerAnalytics],
  props: {
    isWallet: { type: Boolean, default: true },
    /** Set this prop to pass specific networks to be displayed */
    filterTypes: { type: Array, default: () => [] },
    /** Set this prop to false if device does not support networks */
    hasNetworks: { type: Boolean, default: true },
    isSwapPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      networkSelectedBefore: null,
      networkSelected: null,
      nodes: nodes,
      toggleType: 0,
      searchInput: '',
      networkLoading: false
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('global', ['validNetwork']),
    ...mapState('wallet', ['identifier', 'instance', 'isOfflineApp']),
    /**
     * Property returns sorted network names alphabetically in this order: ETH, main and then test networks
     * @returns {string[]}
     */
    typeNames() {
      if (this.hasNetworks) {
        const unsorted =
          this.filterTypes.length > 0
            ? [...this.filterTypes]
            : Object.keys(types);
        unsorted.splice(unsorted.indexOf('ETH'), 1);
        unsorted.sort();
        const test = unsorted.filter(item => {
          return types[item].isTestNetwork;
        });
        const main = unsorted.filter(item => {
          return !types[item].isTestNetwork;
        });
        const sorted = main.concat(test);
        sorted.unshift('ETH');
        return sorted;
      }
      return [];
    },
    /**
     * Property returns filter networks list based on search input and toggle  type
     * @returns {object[]}
     */
    networks() {
      let allNetworks = [];
      this.typeNames.forEach(item => {
        allNetworks.push(types[item]);
      });
      if (this.isSwapPage || this.identifier === WALLET_TYPES.MEW_WALLET) {
        allNetworks = allNetworks.filter(
          item =>
            item.name === types.ETH.name ||
            item.name === types.BSC.name ||
            item.name === types.MATIC.name
        );
      }
      if (this.searchInput && this.searchInput !== '') {
        return allNetworks.filter(item =>
          this.hasString(item.name, item.name_long)
        );
      }
      if (this.toggleType === 0) {
        return allNetworks.filter(item => !item.isTestNetwork);
      }
      if (this.toggleType === 1) {
        return allNetworks.filter(item => item.isTestNetwork);
      }
      return allNetworks;
    },
    /**
     * Property shows invalid search if user included input and networks length is 0
     * @returns {boolean}
     */
    showEmptySearch() {
      return (
        this.searchInput &&
        this.searchInput !== '' &&
        this.networks.length === 0
      );
    },
    /**
     * Property shows search input string
     * @returns {object}
     */
    emptySearchMes() {
      if (this.isSwapPage && this.typeNames.length === 0) {
        return {
          title: 'Swap is not supported on your device',
          subtitle: ''
        };
      }
      if (this.typeNames.length === 0) {
        return {
          title: 'Changing a network is not supported on your device',
          subtitle: ''
        };
      }
      return {
        title: this.isSwapPage
          ? 'Swap is only available on these networks'
          : '',
        subtitle: this.isSwapPage
          ? 'Select different feature to see all networks.'
          : 'We do not have a network with this name.'
      };
    }
  },
  watch: {
    networkSelected(value) {
      if (!!value && (value !== this.network.type.name || !this.validNetwork)) {
        this.networkLoading = true;
        this.setNetworkDebounced(value);
      }
    },
    searchInput(newVal, oldVal) {
      /**
       * Set current network to prevent undefined networkSelected value
       */
      if (this.networks.length > 0) {
        this.networkSelected = this.networkSelectedBefore;
      }

      if (newVal != oldVal && (!oldVal || oldVal === '')) {
        this.toggleType = 2;
      }
    },
    validNetwork(val) {
      this.networkSelected = val ? this.network.type.name : null;
    },
    /**
     * Set networkSelected on toggle change, if network is in the list
     */
    toggleType() {
      if (!this.networkSelected) {
        if (
          this.networks.filter(item => item.name === this.network.type.name)
            .length > 0
        ) {
          this.networkSelected = this.validNetwork
            ? this.network.type.name
            : '';
        }
      }
    }
  },
  mounted() {
    this.networkSelected = this.validNetwork ? this.network.type.name : '';
    this.networkSelectedBefore = this.networkSelected;
  },
  methods: {
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork', 'setValidNetwork']),
    ...mapActions('external', ['setTokenAndEthBalance']),
    /**
     * Method checks whether symbol or name has searchInput substring
     * @returns {boolean}
     */
    hasString(symbol, name) {
      return (
        symbol.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    },
    /**
     * Method sets SearchInout on mew-search input event
     * @returns {boolean}
     */
    setSearch(newVal) {
      this.searchInput = newVal;
    },
    /**
     * Debounce network switch from user input
     * @return {void}
     */
    setNetworkDebounced: debounce(function (value) {
      this.savePreviousNetwork();

      const found = Object.values(this.nodes).filter(item => {
        if (item.type.name === value) {
          return item;
        }
      });
      this.setValidNetwork(true);
      this.setNetwork({
        network: found[0],
        walletType: this.instance?.identifier || ''
      })
        .then(() => {
          if (this.isWallet) {
            this.networkSelected = this.validNetwork
              ? this.network.type.name
              : '';
            this.networkLoading = false;
            const setNetworkCall =
              this.identifier === WALLET_TYPES.WEB3_WALLET
                ? this.setWeb3Instance(window.ethereum)
                : this.setWeb3Instance();
            setNetworkCall.then(() => {
              Toast(`Switched network to: ${found[0].type.name}`, {}, SUCCESS);
              this.trackNetworkSwitch(found[0].type.name);
              this.setTokenAndEthBalance();
              this.$emit('newNetwork');
            });
          }
        })
        .catch(e => {
          this.setValidNetwork(false);
          this.networkSelected = this.validNetwork
            ? this.network.type.name
            : '';
          this.networkLoading = false;
          Toast(e, {}, ERROR);
        });
    }, 1000),
    /**
     * Backup current network value
     */
    savePreviousNetwork() {
      if (this.networkSelected) {
        this.networkSelectedBefore = this.networkSelected;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$borderNetwork: 1px solid #ececec;

.network-container {
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.network-border {
  border-bottom: $borderNetwork;
  border-right: $borderNetwork;
  border-left: $borderNetwork;
}

.network-border-first {
  border-top: $borderNetwork;
  border-radius: 4px 4px 0px 0px;
}

.network-border-last {
  border-radius: 0px 0px 4px 4px;
}

.mint-me-color {
  filter: brightness(0) saturate(100%) invert(90%) sepia(3%) saturate(5171%)
    hue-rotate(348deg) brightness(92%) contrast(63%);
}
</style>

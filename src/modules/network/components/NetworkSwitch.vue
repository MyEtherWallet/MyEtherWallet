<template>
  <mew-overlay
    :show-overlay="open"
    title="Select Network"
    left-btn-text=""
    right-btn-text="Close"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <v-sheet color="white" max-width="740px" width="100%" class="mx-auto">
        <v-sheet
          color="transparent"
          max-width="516px"
          width="100%"
          class="mx-auto pb-2 pb-am-8 px-3 pt-3 px-sm-0"
        >
          <v-row
            class="
              align-end
              justify-center justify-sm-space-between
              px-0
              pt-5 pt-3
            "
          >
            <!--
            =====================================================================================
              Toggle: Main/Test/All
            =====================================================================================
            -->
            <div
              class="
                align-center align-sm-end
                justify-center
                pr-sm-3
                pb-sm-3
                order-sm-2
              "
            >
              <v-btn-toggle
                v-model="toggleType"
                mandatory
                active-class="titlePrimary white--text alig-end"
              >
                <v-btn small>Main</v-btn>
                <v-btn small>Test</v-btn>
                <v-btn small>All</v-btn>
              </v-btn-toggle>
            </div>
            <!--
            =====================================================================================
              Search Data
            =====================================================================================
            -->
            <v-col cols="12" sm="7" class="order-sm-1">
              <mew-search
                placeholder="Find Network"
                :value="searchInput"
                @input="setSearch"
              />
            </v-col>
          </v-row>
          <!--
          =====================================================================================
            Empty Search Message
          =====================================================================================
          -->
          <app-user-msg-block
            v-if="showEmptySearch"
            :message="emptySearchMes"
            :is-alert="false"
            class="mt-5"
          />
          <!--
          =====================================================================================
            Networks
          =====================================================================================
          -->
          <v-radio-group v-model="networkSelected" class="networks-container">
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
                <!--
                =====================================================================================
                  Incon
                =====================================================================================
                -->
                <v-img
                  :src="network.icon"
                  :lazy-src="
                    require('@/assets/images/currencies/icon-eth-grey.svg')
                  "
                  contain
                  max-height="24px"
                  max-width="24px"
                />
                <!--
                =====================================================================================
                  Symbol/Namte
                =====================================================================================
                -->
                <div class="titlePrimary--text Capitalize pl-3">
                  {{ network.name }}
                </div>
                <div class="px-2 textSecondary--text">-</div>
                <div class="textSecondary--text">
                  {{ network.name_long }}
                </div>
                <v-spacer />
                <!--
                =====================================================================================
                  Radio
                =====================================================================================
                -->
                <v-radio :value="network.name" :class="['py-2 mb-0']">
                </v-radio>
              </v-row>
            </v-container>
          </v-radio-group>
        </v-sheet>
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import * as nodes from '@/utils/networks/nodes';
import * as types from '@/utils/networks/types';
import { mapActions, mapGetters } from 'vuex';
import { Toast, SUCCESS, ERROR } from '@/modules/toast/handler/handlerToast';
import AppUserMsgBlock from '@/core/components/AppUserMsgBlock';
import { _ } from 'web3-utils';

export default {
  name: 'NetworkSwitch',
  components: { AppUserMsgBlock },
  props: {
    open: { type: Boolean, default: false },
    close: { type: Function, default: () => {} }
  },
  data() {
    return {
      networkSelected: null,
      types: types,
      nodes: nodes,
      toggleType: 0,
      searchInput: ''
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    /**
     * Property returns sorted network names alphabeticaly in this order: ETH, main and then test networks
     * @returns {string[]}
     */
    typeNames() {
      const unsorted = Object.keys(types);
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
    },
    /**
     * Property returns filter networks list based on search input and toggle  type
     * @returns {object[]}
     */
    networks() {
      const allNetworks = [];
      this.typeNames.forEach(item => {
        allNetworks.push(types[item]);
      });
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
     * Property shows invalid search if user inlcuded input and networks length is 0
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
      return {
        title: '',
        subtitle: 'We do not have a network with this name.'
      };
    }
  },
  watch: {
    networkSelected(value) {
      if (value && value !== this.network.type.name) {
        this.setNetworkDebounced(value);
      }
    },
    searchInput(newVal, oldVal) {
      if (newVal != oldVal && (!oldVal || oldVal === '')) {
        this.toggleType = 2;
      }
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
          this.networkSelected = this.network.type.name;
        }
      }
    }
  },
  mounted() {
    this.networkSelected = this.network.type.name;
  },
  methods: {
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork']),
    /**
     * Method checks whther symbol or name has searchInput substring
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
    setNetworkDebounced: _.debounce(function (value) {
      const found = Object.values(this.nodes).filter(item => {
        if (item.type.name === value) {
          return item;
        }
      });
      try {
        this.setNetwork(found[0]).then(() => {
          this.setWeb3Instance();
          Toast(
            `Switched network to: ${found[0].type.name} - ${found[0].service}`,
            {},
            SUCCESS
          );
          this.close();
        });
      } catch (e) {
        Toast(`Could not switch network`, {}, ERROR);
      }
    }, 1000)
  }
};
</script>
<style lang="scss" scoped>
$borderNetwork: 1px solid #ececec;
.networks-container {
  max-width: 516px;
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
</style>

<template>
  <div class="bgWalletBlock moon-pay-token-select" :class="open ? 'open' : ''">
    <div class="py-8">
      <div class="px-5 d-flex align-center">
        <v-btn icon @click.native="close">
          <v-icon color="textDark">mdi-arrow-left</v-icon>
        </v-btn>
        <div class="ml-4 mew-heading-2 textDark--text">Select Token</div>
      </div>
      <div class="px-8 mt-8">
        <mew-select
          v-model="selectedNetwork"
          :items="fetchedNetworks"
          filter-placeholder="Select Network"
          label="Network"
          class="mt-1"
          has-filter
          is-custom
        />
        <v-text-field
          v-model="searchValue"
          class="mt-2"
          outlined
          label="Search"
          prepend-inner-icon="mdi-magnify"
          hide-details
        ></v-text-field>

        <div v-if="searchedCurrencyItems.length > 0" class="mt-5">
          <div v-for="(token, idx) in searchedCurrencyItems" :key="idx">
            <v-btn
              v-if="token.name"
              color="buttonGrayLight"
              :class="
                token.name == selectedCurrency.name ? 'selected-button' : ''
              "
              width="100%"
              text
              dpressed
              class="d-flex align-center py-6"
              @click.native="tokenSelected(token)"
            >
              <mew-token-container size="30px" :img="token.img" />
              <div class="mew-heading-3 textDark--text ml-4">
                {{ token.symbol }}
              </div>
              <div class="textDark--text ml-1">- {{ token.name }}</div>
              <div class="textDark--text ml-auto">{{ token.pricef }}</div>
            </v-btn>
          </div>
        </div>
        <div v-else class="mt-5 mew-heading-4 ml-4">No tokens found</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { isEmpty } from 'lodash';

import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import * as nodes from '@/utils/networks/nodes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { ETH } from '@/utils/networks/types';

export default {
  name: 'BuySellTokenSelect',
  mixins: [handlerAnalytics],
  props: {
    currencyItems: {
      type: Array,
      default: () => []
    },
    selectedCurrency: {
      type: Object,
      default: () => {}
    },
    setCurrency: {
      type: Function,
      default: () => {}
    },
    open: {
      type: Boolean,
      default: false
    },
    inWallet: {
      type: Boolean,
      default: false
    },
    isSell: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchValue: '',
      nodes: nodes,
      fetchedNetworks: [],
      selectedNetwork: {},
      currencyCopy: []
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'Networks']),
    ...mapState('wallet', ['instance', 'identifier']),
    ...mapState('external', ['selectedEIP6963Provider']),
    searchedCurrencyItems() {
      if (this.searchValue) {
        const found = this.currencyCopy.filter(element => {
          return (
            element.name
              .toLowerCase()
              .includes(this.searchValue.toLowerCase()) ||
            element.subtext
              .toLowerCase()
              .includes(this.searchValue.toLowerCase())
          );
        });
        return found;
      }
      return this.currencyCopy;
    }
  },
  watch: {
    currencyItems: {
      handler(val) {
        this.currencyCopy = val;
      },
      immediate: true,
      deep: true
    },
    selectedNetwork(newVal, oldVal) {
      // actual check whether the value was changed or just initially set
      if (newVal && !isEmpty(newVal) && oldVal && !isEmpty(oldVal)) {
        this.setNewNetwork(newVal);
      }
    },
    open(val) {
      this.searchValue = '';
      if (val) {
        const currNetwork = this.fetchedNetworks.find(network => {
          if (network.value === this.network.type.name) return network;
        });
        this.selectedNetwork = currNetwork;
      }
    }
  },
  mounted() {
    this.fetchNetworks();
  },
  methods: {
    ...mapActions('global', ['setNetwork']),
    ...mapActions('external', ['setTokenAndEthBalance']),
    ...mapActions('wallet', ['setWeb3Instance']),
    fetchNetworks() {
      const networkList = Object.values(this.Networks).filter(network => {
        if (this.isSell) {
          if (network[0].type.name === ETH.name) {
            return network;
          }
        } else {
          if (network[0].type.canBuy) {
            return network;
          }
        }
      });
      this.fetchedNetworks = networkList.map(network => {
        return {
          img: network[0].type?.icon,
          name: network[0].type?.name_long,
          value: network[0].type?.name,
          subtext: network[0].type?.currencyName
        };
      });
    },
    setNewNetwork(network) {
      if (network.value === this.network.type.name) return;
      const found = Object.values(this.nodes).filter(item => {
        if (item.type.name === network.value) {
          return item;
        }
      });
      this.setNetwork({
        network: found[0],
        walletType: this.instance?.identifier || ''
      })
        .then(() => {
          if (this.inWallet) {
            const provider =
              this.identifier === WALLET_TYPES.WEB3_WALLET
                ? this.setWeb3Instance(this.selectedEIP6963Provider)
                : this.setWeb3Instance();
            if (!this.isOfflineApp) {
              provider.then(() => {
                this.setTokenAndEthBalance();
              });
            }
          } else {
            this.setWeb3Instance();
          }
          Toast(`Switched network to: ${network.name}`, {}, SUCCESS);
          this.$emit('newNetwork');
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    tokenSelected(token) {
      this.setCurrency(token);
      this.close();
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.moon-pay-token-select {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0%;
  width: 100%;
  overflow: hidden;
  transition: height 0.25s ease;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  &.open {
    height: 100%;
  }
}
.selected-button {
  background-color: var(--v-buttonGrayLightSelected-base);
}
</style>

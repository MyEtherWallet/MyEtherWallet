<template>
  <div class="white moon-pay-token-select" :class="open ? 'open' : ''">
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
          label="Network"
          class="mt-1"
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

        <div class="mt-5">
          <div v-for="token in searchedCurrencyItems" :key="token.name">
            <v-btn
              v-if="token.name"
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
                {{ token.name }}
              </div>
              <div class="textDark--text ml-3">- {{ token.subtext }}</div>
              <div class="textDark--text ml-auto">{{ token.price }}</div>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import get from 'lodash/get';
import { mapActions } from 'vuex';
import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { mapGetters } from 'vuex';
import * as nodes from '@/utils/networks/nodes';

export default {
  name: 'MoonpayTokenSelect',
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
    }
  },
  data() {
    return {
      searchValue: '',
      nodes: nodes,
      fetchedNetworks: [],
      selectedNetwork: {}
      // selectItems: [],
      // search: ''
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'Networks']),
    searchedCurrencyItems() {
      const currencyItems = this.currencyItems.slice();
      currencyItems.shift();

      if (this.searchValue) {
        const found = currencyItems.filter(element =>
          element.name.toLowerCase().includes(this.searchValue.toLowerCase())
        );
        return found;
      }
      return this.currencyItems;
    }
  },
  watch: {
    selectedNetwork() {
      if (this.selectedNetwork) {
        this.setNewNetwork(this.selectedNetwork);
      }
    }
  },
  mounted() {
    this.fetchNetworks();
  },
  methods: {
    ...mapActions('global', ['setNetwork']),
    fetchNetworks() {
      const networksObj = Object.values(this.Networks);
      const networkList = networksObj.map(network => {
        return {
          img: network[0].type?.icon,
          name: network[0].type?.name_long,
          symbol: network[0].type?.name
        };
      });
      const returnedArray = [
        {
          img: this.network.type.icon,
          name: this.network.type.name_long,
          symbol: this.network.type.name
        },
        ...networkList
      ];
      this.fetchedNetworks = returnedArray;
    },
    setNewNetwork(network) {
      const found = Object.values(this.nodes).filter(item => {
        if (item.type.name === network.symbol) {
          return item;
        }
      });
      this.setNetwork({
        network: found[0],
        walletType: this.instance?.identifier || ''
      })
        .then(() => {
          if (this.isWallet) {
            this.networkSelected = this.validNetwork
              ? this.network[0].type.name
              : '';
            const provider =
              this.identifier === WALLET_TYPES.WEB3_WALLET
                ? this.setWeb3Instance(window.ethereum)
                : this.setWeb3Instance();
            if (!this.isOfflineApp) {
              provider.then(() => {
                this.setTokenAndEthBalance();
              });
            }
            Toast(`Switched network to: ${network.type.name}`, {}, SUCCESS);
            this.trackNetworkSwitch(network.type.name);
            this.$emit('newNetwork');
          }
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
  background-color: var(--v-greyLight-base);
}
</style>

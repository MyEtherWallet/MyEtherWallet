<template lang="html">
  <div v-click-outside="openDropdown" class="currency-picker-container">
    <div>
      <div
        :class="[
          open ? 'open' : '',
          'dropdown-container',
          token ? 'dropdown-text-container' : 'dropdown-text-container-white'
        ]"
        @click="openDropdown"
      >
        <p></p>
        <div v-if="!selectedCurrency.icon" class="name-and-icon-container">
          <span
            :class="[
              'cc',
              getIcon(selectedCurrency.symbol),
              'cc-icon',
              'currency-symbol'
            ]"
          />
          <span class="pad-it">{{ selectedCurrency.symbol }} </span>
          <span class="subname">- {{ selectedCurrency.name }}</span>
        </div>
        <div v-if="selectedCurrency.icon" class="name-and-icon-container">
          <div class="token-icon">
            <img
              v-lazy-load
              :src="selectedCurrency.icon"
              @error="iconFallback"
            />
          </div>
          <span class="pad-it">{{ selectedCurrency.symbol }} </span>
          <span class="subname">- {{ selectedCurrency.name }}</span>
        </div>
        <i
          v-if="selectable"
          :class="['fa', open ? 'fa-angle-up' : 'fa-angle-down']"
        />
      </div>
      <div
        v-if="selectable"
        :class="[open ? 'open' : 'hide', 'dropdown-item-container']"
      >
        <div class="dropdown-search-container">
          <input v-model="search" :placeholder="$t('common.search')" />
          <i class="fa fa-search" />
        </div>
        <div class="item-container">
          <div
            v-for="(curr, idx) in localCurrencies"
            :key="
              token ? curr.name + curr.symbol + page : curr.name + page + idx
            "
            :class="[
              token
                ? selectedCurrency.symbol === curr.symbol
                  ? 'selected'
                  : ''
                : selectedCurrency.name === curr.name
                ? 'selected'
                : '',
              'item'
            ]"
            @click="selectCurrency(curr)"
          >
            <p></p>
            <div v-if="!curr.icon" class="name-and-icon-container">
              <span
                v-if="!curr.icon"
                :class="['cc', getIcon(curr.symbol), 'cc-icon']"
                class="currency-symbol"
              />
              <span class="pad-it">{{ curr.symbol }} </span>
              <span class="subname">- {{ curr.name }}</span>
            </div>
            <div v-if="curr.icon" class="name-and-icon-container">
              <figure v-lazy-load class="token-icon">
                <img :data-url="curr.icon" @error="iconFallback" />
              </figure>

              <span class="pad-it">{{ curr.symbol }} </span>
              <span class="subname">- {{ curr.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import { hasIcon } from '@/partners';
import masterFile from '@/_generated/master-file.json';
import { toChecksumAddress } from '@/helpers/addressUtils';
import { mapState } from 'vuex';

export default {
  props: {
    currencies: {
      type: Array,
      default: function () {
        return [];
      }
    },
    page: {
      type: String,
      default: ''
    },
    token: {
      type: Boolean,
      default: true
    },
    fromSource: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: true
    },
    swapTokenAddress: {
      type: Function,
      default: function () {}
    },
    defaultValue: {
      type: Object,
      default: function () {
        return {};
      }
    },
    overrideCurrency: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      icon: '',
      localCurrencies: [],
      selectedCurrency: {},
      open: false,
      search: '',
      abi: '',
      address: ''
    };
  },
  computed: {
    ...mapState('main', ['network', 'web3', 'online']),
    networkTokens() {
      const newTokenObj = {};
      const matchedNetwork = masterFile.filter(item => {
        return (
          item.network.toLowerCase() === this.network.type.name.toLowerCase()
        );
      });
      matchedNetwork.forEach(item => {
        newTokenObj[toChecksumAddress(item.contract_address)] = item;
      });

      return newTokenObj;
    }
  },
  watch: {
    overrideCurrency(newVal) {
      this.selectedCurrency = newVal;
    },
    selectedCurrency(newVal) {
      this.$emit('selectedCurrency', newVal, this.fromSource ? 'to' : 'from');
    },
    currencies(newVal) {
      this.rebuildLocalCurrencyList(newVal);
    },
    search(newVal) {
      if (newVal !== '') {
        this.localCurrencies = this.currencies.filter(curr => {
          if (curr.name && curr.symbol) {
            if (
              curr.name.toLowerCase().includes(newVal.toLowerCase()) ||
              curr.symbol.toLowerCase().includes(newVal.toLowerCase())
            ) {
              return curr;
            }
          }
        });
      } else {
        this.rebuildLocalCurrencyList(this.currencies);
      }
    }
  },
  mounted() {
    if (this.currencies) {
      this.rebuildLocalCurrencyList(this.currencies);
    }
    if (this.defaultValue.symbol && this.defaultValue.name) {
      this.selectedCurrency = this.defaultValue;
    } else if (typeof this.fromSource === 'boolean') {
      if (this.fromSource) {
        this.selectedCurrency = { name: 'Ether', symbol: 'ETH' };
      } else {
        this.selectedCurrency = { name: 'Bitcoin', symbol: 'BTC' };
      }
    }
  },
  methods: {
    rebuildLocalCurrencyList(values) {
      this.localCurrencies = [];
      values.forEach(curr => {
        curr.icon = this.iconFetcher(curr.symbol);
        this.localCurrencies.push(curr);
      });
    },
    iconFallback(evt) {
      evt.target.src = this.network.type.icon;
    },
    iconFetcher(tok) {
      try {
        if (tok === 'ETH') return false;
        const address = this.swapTokenAddress(tok);
        if (!address) {
          try {
            // eslint-disable-next-line
            return require(`@/assets/images/currency/coins/AllImages/${tok}.svg`);
          } catch (e) {
            if (this.getIcon(tok)) {
              return false;
            }
            // eslint-disable-next-line
            return require(`@/assets/images/icons/web-solution.svg`);
          }
        }
        const token = this.networkTokens[toChecksumAddress(address)];
        if (token) {
          const tokenSrc =
            token.icon_png !== ''
              ? `https://img.mewapi.io/?image=${token.icon_png}&width=50&height=50&fit=scale-down`
              : token.icon !== ''
              ? `https://img.mewapi.io/?image=${token.icon}&width=50&height=50&fit=scale-down`
              : this.network.type.icon;
          return tokenSrc;
        }
        return this.network.type.icon;
      } catch (e) {
        return this.network.type.icon;
      }
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    openDropdown() {
      if (this.selectable) {
        this.open = !this.open;
      }
    },
    selectCurrency(currency) {
      this.openDropdown();
      this.selectedCurrency = currency;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapCurrencyPicker.scss';
</style>

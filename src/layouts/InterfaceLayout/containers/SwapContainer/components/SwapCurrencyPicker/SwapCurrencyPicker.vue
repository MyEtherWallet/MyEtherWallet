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
        <p>
          <div v-if="!iconFetcher(selectedCurrency.symbol)"
             class="name-and-icon-container">
                <span
                  :class="['cc', getIcon(selectedCurrency.symbol), 'cc-icon']"
                  class="currency-symbol"
                />
        {{ selectedCurrency.symbol }}
        <span class="subname">- {{ selectedCurrency.name }}</span>
      </div>
          <div
        v-if="iconFetcher(selectedCurrency.symbol)"
        class="name-and-icon-container"
          >
            <figure class="token-icon" v-lazy-load>
              <img
                :data-url="iconFetcher(selectedCurrency.symbol)"
                @error="iconFallback"
              />
            </figure>
            {{ selectedCurrency.symbol }}
            <span class="subname">- {{ selectedCurrency.name }}</span>
          </div>
        </p>
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
            <p>
              <div  v-if="!iconFetcher(curr.symbol)" class="name-and-icon-container">
                <span
                  v-if="!iconFetcher(curr.symbol)"
                  :class="['cc', getIcon(curr.symbol), 'cc-icon']"
                  class="currency-symbol"
                />
            <span class="pad-it">{{ curr.symbol }} </span>
            <span class="subname">- {{ curr.name }}</span>
          </div>
            <div
              v-if="iconFetcher(curr.symbol)"
              class="name-and-icon-container"
            >
              <figure class="token-icon" v-lazy-load>
                <img
                  :data-url="iconFetcher(curr.symbol)"
                  @error="iconFallback"
                />
              </figure>

            <span class="pad-it">{{ curr.symbol }} </span>
            <span class="subname">- {{ curr.name }}</span>
            </div>

            </p>
            <p />
            <p v-show="!token">{{ curr.name }}</p>
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
import {mapState} from 'vuex';

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
      default: function () {
      }
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
  watch: {
    overrideCurrency(newVal) {
      this.selectedCurrency = newVal;
    },
    selectedCurrency(newVal) {
      this.$emit('selectedCurrency', newVal, this.fromSource ? 'to' : 'from');
    },
    currencies(newVal) {
      this.localCurrencies = [];
      newVal.forEach(curr => this.localCurrencies.push(curr));
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
        this.localCurrencies = [];
        this.currencies.forEach(curr => this.localCurrencies.push(curr));
      }
    }
  },
  mounted() {
    if (this.currencies) {
      this.currencies.forEach(curr => this.localCurrencies.push(curr));
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
  methods: {
    iconFallback(evt) {
      evt.target.src = this.network.type.icon;
    },
    iconFetcher(tok) {
      try{
        if(tok === 'ETH') return false;
        const address = this.swapTokenAddress(tok);
        if(!address) {
            try {
              // eslint-disable-next-line
             return require(`@/assets/images/currency/coins/AllImages/${tok}.svg`);
            } catch (e) {
              if(this.getIcon(tok)){
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
      } catch (e){
        console.log(e)
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

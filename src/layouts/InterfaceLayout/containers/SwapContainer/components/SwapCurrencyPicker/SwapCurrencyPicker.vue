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
          <span
            :class="[
              'cc',
              selectedCurrency.symbol,
              'alt-' + selectedCurrency.symbol,
              'cc-icon'
            ]"
            class="currency-symbol"
          />
          {{ selectedCurrency.symbol }}
          <span class="subname">- {{ selectedCurrency.name }}</span>
        </p>
        <p v-show="!token">{{ selectedCurrency.name }}</p>
        <i :class="['fa', open ? 'fa-angle-up' : 'fa-angle-down']" />
      </div>
      <div :class="[open ? 'open' : 'hide', 'dropdown-item-container']">
        <div class="dropdown-search-container">
          <input v-model="search" :placeholder="$t('interface.search')" />
          <i class="fa fa-search" />
        </div>
        <div class="item-container">
          <div
            v-for="(curr, idx) in localCurrencies"
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
            :key="
              token ? curr.name + curr.symbol + page : curr.name + page + idx
            "
            @click="selectCurrency(curr)"
          >
            <p>
              <i :class="['cc', curr.symbol, 'cc-icon']" /> {{ curr.symbol }}
              <span class="subname">- {{ curr.name }}</span>
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
export default {
  props: {
    currencies: {
      type: Array,
      default: function() {
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
    defaultValue: {
      type: Object,
      default: function() {
        return {};
      }
    },
    overrideCurrency: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      localCurrencies: [],
      selectedCurrency: { name: 'Select an item', abi: '', address: '' },
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
      this.$emit('selectedCurrency', newVal);
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
  methods: {
    openDropdown() {
      this.open = !this.open;
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

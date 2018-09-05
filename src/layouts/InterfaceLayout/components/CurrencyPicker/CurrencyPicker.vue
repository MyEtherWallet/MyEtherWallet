<template lang="html">
  <div class="currency-picker-container">
    <div>
      <div 
        :class="[open? 'open':'','dropdown-container']" 
        class="dropdown-text-container" 
        @click="openDropdown">
        <p v-show="token"> {{ selectedCurrency.symbol }} <span class="subname">- {{ selectedCurrency.name }}</span></p>
        <p v-show="!token"> {{ selectedCurrency.name }} </p>
        <i :class="['fa', open ? 'fa-angle-up':'fa-angle-down']"/>
      </div>
      <div :class="[open? 'open':'hide', 'dropdown-item-container']">
        <div class="dropdown-search-container">
          <input 
            v-model="search" 
            placeholder="Search">
          <i class="fa fa-search"/>
        </div>
        <div class="item-container">
          <div 
            v-for="curr in localCurrency" 
            :class="[token ? selectedCurrency.symbol === curr.symbol ? 'selected': '' : selectedCurrency.name === curr.name? 'selected': '','item']" 
            :key="token?curr.name+curr.symbol + page: curr.name + page" 
            @click="selectCurrency(curr)">
            <p v-show="token">{{ curr.symbol }} <span class="subname">- {{ curr.name }}</span></p><p/><p v-show="!token">{{ curr.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currency", "page", "token"],
  data() {
    return {
      localCurrency:
        this.token === true
          ? [
              { name: "Ether", symbol: "ETH" },
              {
                name: "Ayyyyyy Love Me Angel Orangutans",
                symbol: "AYLMAO",
                addr: "0xe22B83879001D43866656D28C64d353F8e6378F1"
              }
            ]
          : [{ name: "Select an item" }],
      selectedCurrency:
        this.token === true
          ? { name: "Ether", symbol: "ETH" }
          : { name: "Select an item" },
      open: false,
      search: ""
    };
  },
  watch: {
    selectedCurrency(newVal) {
      this.$emit("selectedCurrency", newVal);
    },
    currency(newVal) {
      if (this.token) {
        this.localCurrency = [
          { name: "Ether", symbol: "ETH" },
          {
            name: "Ayyyyyy Love Me Angel Orangutans",
            symbol: "AYLMAO",
            addr: "0xe22B83879001D43866656D28C64d353F8e6378F1"
          }
        ];
      } else {
        this.localCurrency = [{ name: "Select an item" }];
      }
      newVal.forEach(curr => this.localCurrency.push(curr));
    },
    search(newVal) {
      if (newVal !== "") {
        this.localCurrency = this.localCurrency.filter(curr => {
          if (curr.name.toLowerCase().includes(newVal.toLowerCase())) {
            return curr;
          }
        });
      } else {
        if (this.token) {
          this.localCurrency = [
            { name: "Ether", symbol: "ETH" },
            {
              name: "Ayyyyyy Love Me Angel Orangutans",
              symbol: "AYLMAO",
              addr: "0xe22B83879001D43866656D28C64d353F8e6378F1"
            }
          ];
        } else {
          this.localCurrency = [{ name: "Select an item" }];
        }
        this.currency.forEach(curr => this.localCurrency.push(curr));
      }
    }
  },
  mounted() {
    if (this.currency) {
      this.currency.forEach(curr => this.localCurrency.push(curr));
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
@import "CurrencyPicker.scss";
</style>

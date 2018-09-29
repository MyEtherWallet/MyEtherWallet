<template>
  <div class="drop-down-address-selector">
    <div
      :class="dropdownOpen ? 'dropdown-open' : ''"
      class="dropdown-input-box" 
      @click="dropdownOpen = !dropdownOpen">
      
      <div class="selected-coin">
        <img src="~@/assets/images/currency/eth.svg">ETH - <span>Ethereum</span>
      </div>
      <div
        class="dropdown-open-button">
        <i
          v-if="!dropdownOpen"
          class="fa fa-chevron-down"
          aria-hidden="true"/>
        <i
          v-if="dropdownOpen"
          class="fa fa-chevron-up"
          aria-hidden="true"/>
      </div>
    </div>
    <div
      :class="dropdownOpen ? 'show-dropdown' : ''"
      class="dropdown-list-box">
      <ul>
        <li><img src="~@/assets/images/currency/eth.svg">ETH - <span>Ethereum</span></li>
        <li><img src="~@/assets/images/currency/btc.svg">BTC - <span>Bitcoin</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdownOpen: false
    };
  },
  beforeMount() {
    // Detect all clicks on the document
    document.addEventListener('click', this.clickEvent, false);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickEvent, false);
  },
  methods: {
    clickEvent: function(event) {
      for (let count = 0; count < event.path.length; count++) {
        if (event.path[count].className === 'drop-down-address-selector') {
          return;
        }
      }
      this.dropdownOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DropDownCoinSelector.scss';
</style>

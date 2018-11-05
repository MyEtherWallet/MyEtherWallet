<template>
  <div class="transactions-dropdown-menu">
    
    <div 
      class="transactions-dropdown-menu__title" 
      @click="dropdownOpen = !dropdownOpen">
      <p>Transactions</p>
      <i 
        class="fa fa-angle-down" 
        aria-hidden="true"/>
    </div>

    <div 
      :class="dropdownOpen ? 'dropdown-open' : ''" 
      class="transactions-menu__content transactions-click-safe-zone"/>

  </div>
</template>

<script>
export default {
  props: {},
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
        if (event.path[count].className === 'transactions-click-safe-zone') {
          return;
        }
      }
      this.dropdownOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'TransactionsDropdownMenu.scss';
</style>

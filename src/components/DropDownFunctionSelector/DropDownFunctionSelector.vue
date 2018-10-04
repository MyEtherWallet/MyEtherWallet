<template>
  <div class="dropdown-contract-selector">
    <div 
      :class="dropdownOpen ? 'dropdown-open' : ''" 
      class="user-interface-block"
      @click="dropdownOpen = !dropdownOpen">
      <p class="choose-contract-message">
        Function
      </p>      
      <i
        v-if="!dropdownOpen" 
        class="fa fa-angle-down" 
        aria-hidden="true"/>
      <i
        v-if="dropdownOpen" 
        class="fa fa-angle-up" 
        aria-hidden="true"/>
    </div>
    <div 
      :class="dropdownOpen ? 'show-dropdown' : ''" 
      class="dropdown-container">
      
      <div class="search-block">
        <input 
          type="text" 
          name=""
          placeholder="Search" 
        >
        <img src="~@/assets/images/icons/magnifier.svg">
      </div>

      <div class="list-block">
        <ul>
          <li><p>name</p></li>
          <li><p>approve</p></li>
          <li><p>totalSupply</p></li>
          <li><p>transferFrom</p></li>
          <li><p>decimals</p></li>
          <li><p>_totalSupply</p></li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
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
    openDropdownFocustToSearchInput: function() {
      // Focus user input to the seach input.
      //console.log('Worked!!!!!!!!!!!!!!');
      this.dropdownOpen = !this.dropdownOpen;
      document.querySelector('.coin-selector-search-input').focus();
    },
    clickEvent: function(event) {
      for (let count = 0; count < event.path.length; count++) {
        if (event.path[count].className === 'dropdown-contract-selector') {
          return;
        }
      }
      this.dropdownOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DropDownFunctionSelector.scss';
</style>

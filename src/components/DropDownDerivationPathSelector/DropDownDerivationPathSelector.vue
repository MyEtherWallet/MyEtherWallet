<template>
  <div class="drop-down-coin-selector">
    <div 
      v-if="options.title" 
      class="form-title-container">
      <div class="title">{{ options.title }}</div>
    </div>

    <div class="coin-selector-click-safe-zone">
      <div
        :class="dropdownOpen ? 'dropdown-open' : ''"
        class="dropdown-input-box" 
        @click="openDropdownFocustToSearchInput">
        <div class="selected-network">
          Network
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
          <li>m/44'/60'/0'/0</li>
          <li>m/44'/60'/0'/0</li>
          <li>m/44'/60'/0'/0</li>
          <li>m/44'/60'/0'/0</li>
          <li>m/44'/60'/0'/0</li>

          <li class="custom-path-button">Add Custom Path</li>
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
      this.dropdownOpen = !this.dropdownOpen;
    },
    clickEvent: function(event) {
      for (let count = 0; count < event.path.length; count++) {
        if (event.path[count].className === 'coin-selector-click-safe-zone') {
          return;
        }
      }
      this.dropdownOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DropDownDerivationPathSelector.scss';
</style>

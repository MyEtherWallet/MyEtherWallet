<template>
  <div class="drop-down-address-selector">
    
    <div class="input-title-container">
      <div class="input-title-and-helper">
        <p class="input-title">{{ options.title }}</p>
        <popover 
          v-if="options.popover" 
          :popcontent="options.popover"/>
      </div>

      <div class="the-button-container">
        <div 
          v-if="options.buttonClear == true" 
          class="the-button clean">Clear</div>
        <div 
          v-if="options.buttonCopy == true" 
          class="the-button copy">Copy</div>
      </div>
    </div>


    <div
      :class="dropdownOpen ? 'dropdown-open' : ''"
      class="address-dropdown-input-box">
      <input
        :class="options.inputDisabled ? 'input-disabled' : ''"
        :placeholder="options.placeholder"
        :disabled="options.inputDisabled"
        v-model="selectedAddress"
        type="text"
        @focus="dropdownOpen = false">
      <div
        v-if="!validAddress"
        class="blockie-place-holder-image"/>
      <div
        v-if="validAddress"
        class="selected-address-blockie">
        <blockie
          :address="selectedAddress"
          width="30px"
          height="30px"/>
      </div>
      <div
        v-if="!options.inputDisabled"
        class="dropdown-open-button"
        @click="dropdownOpen = !dropdownOpen">
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
        <li
          v-for="addr in addresses"
          :key="addr.key"
          @click="listedAddressClick(addr)">
          <div class="list-blockie">
            <blockie
              :address="addr"
              width="30px"
              height="30px"/>
          </div>
          <p 
            v-if="$mq === 'lg'" 
            class="listed-address">{{ addr }}</p>
          <p 
            v-if="$mq !== 'lg'" 
            class="listed-address">{{ shortenAddress(addr) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import web3 from 'web3';

export default {
  components: {
    blockie: Blockie
  },
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
      selectedAddress: this.options.value,
      validAddress: false,
      dropdownOpen: false,
      addresses: [
        '0x7545566a4339daf3fad6979208b2042f06e8c881',
        '0x7545196a7339daf3fad6979208b2042f06e8c882',
        '0x7545193a4339daf3fad6979208b2042f06e8c883',
        '0x7515196a4339daf3fad6979208b2042f06e8c884',
        '0x7545296a4339daf3fad6979208b2042f06e8c885'
      ]
    };
  },
  watch: {
    selectedAddress: function(address) {
      if (web3.utils.isAddress(address)) {
        this.validAddress = true;
      } else {
        this.validAddress = false;
      }
    }
  },
  mounted() {
    if (web3.utils.isAddress(this.selectedAddress)) {
      this.validAddress = true;
    } else {
      this.validAddress = false;
    }
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
        if (event.path[count].className === 'address-dropdown-input-box') {
          return;
        }
      }
      this.dropdownOpen = false;
    },
    listedAddressClick: function(address) {
      this.dropdownOpen = !this.dropdownOpen;
      this.selectedAddress = address;
    },
    shortenAddress: function(address) {
      const front = address.slice(0, 15);
      const end = address.slice(-4);
      return front + '...' + end;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DropDownAddressSelector.scss';
</style>

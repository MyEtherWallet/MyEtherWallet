<template>
  <div class="drop-down-address-selector">
    <div class="dropdown-input-box" :class="dropdownOpen ? 'dropdown-open' : ''">
      <input type="text" placeholder="Please enter the address" v-on:focus="dropdownOpen = false" v-model="selectedAddress">
      <div class="blockie-place-holder-image" v-if="!validAddress">
      </div>
      <div class="selected-address-blockie" v-if="validAddress">
        <blockie :address="selectedAddress" width="30px" height="30px"/>
      </div>
      <div class="dropdown-open-button" v-on:click="dropdownOpen = !dropdownOpen">
        <i v-if="!dropdownOpen" class="fa fa-chevron-down" aria-hidden="true"></i>
        <i v-if="dropdownOpen" class="fa fa-chevron-up" aria-hidden="true"></i>
      </div>
    </div>
    <div class="dropdown-list-box" v-if="dropdownOpen">
      <ul>
        <li v-for="addr in addresses" v-bind:key="addr.key" v-on:click="listedAddressClick(addr)">
          <div class="list-blockie">
            <blockie :address="addr" width="30px" height="30px"/>
          </div>
          <p class="listed-address">{{addr}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie'
import web3 from 'web3'

export default {
  props: [],
  components: {
    'blockie': Blockie
  },
  methods: {
    listedAddressClick: function (address) {
      this.dropdownOpen = !this.dropdownOpen
      this.selectedAddress = address
    }
  },
  data () {
    return {
      selectedAddress: '',
      validAddress: false,
      dropdownOpen: false,
      addresses: [
        '0x7545566a4339daf3fad6979208b2042f06e8c881',
        '0x7545196a7339daf3fad6979208b2042f06e8c882',
        '0x7545193a4339daf3fad6979208b2042f06e8c883',
        '0x7515196a4339daf3fad6979208b2042f06e8c884',
        '0x7545296a4339daf3fad6979208b2042f06e8c885'
      ]
    }
  },
  watch: {
    selectedAddress: function (address) {
      if (web3.utils.isAddress(address)) {
        this.validAddress = true
      } else {
        this.validAddress = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "DropDownAddressSelector.scss";
</style>

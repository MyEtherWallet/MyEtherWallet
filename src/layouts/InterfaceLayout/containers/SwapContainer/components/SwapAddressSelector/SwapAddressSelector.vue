<template>
  <div class="drop-down-address-selector">
    <div
      :class="dropdownOpen ? 'dropdown-open' : ''"
      class="dropdown-input-box">
      <input
        v-model="selectedAddress"
        type="text"
        placeholder="Please enter the address"
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
      v-if="dropdownOpen"
      class="dropdown-list-box">
      <ul>
        <li
          v-for="addr in addresses"
          :key="addr.key"
          @click="listedAddressClick(addr.address)">
          <div class="list-blockie">
            <blockie
              :address="addr.address"
              width="30px"
              height="30px"/>
          </div>
          <p class="listed-address">
            {{ addr.address }}
            <span
              v-if="addr.address === currentAddress"
              class="address-note">Your Address</span>
            <span
              v-if="addr.address !== currentAddress && addr.currency !== 'ETH'"
              class="address-note">{{ addr.currency }} Address</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import debugLogger from 'debug';
import WAValidator from 'wallet-address-validator';
import web3 from 'web3';
import Blockie from '@/components/Blockie';

const logger = debugLogger('v5:swapAddressSelector');
const errorLogger = debugLogger('v5:error');

export default {
  components: {
    blockie: Blockie
  },
  props: {
    currentAddress: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      default: 'ETH'
    }
  },
  data() {
    return {
      selectedAddress: '',
      validAddress: false,
      dropdownOpen: false,
      addresses: [
        { address: '1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9', currency: 'BTC' },
        {
          address: '0x7545566a4339daf3fad6979208b2042f06e8c881',
          currency: 'ETH'
        },
        {
          address: '0x7545196a7339daf3fad6979208b2042f06e8c882',
          currency: 'ETH'
        },
        {
          address: '0x7545193a4339daf3fad6979208b2042f06e8c883',
          currency: 'ETH'
        },
        {
          address: '0x7515196a4339daf3fad6979208b2042f06e8c884',
          currency: 'ETH'
        },
        {
          address: '0x7545296a4339daf3fad6979208b2042f06e8c885',
          currency: 'ETH'
        }
      ]
    };
  },
  watch: {
    currentAddress(address) {
      if (this.addresses.findIndex(addr => addr.address === address) === -1) {
        this.addresses = [
          {
            address: address,
            currency: 'ETH'
          },
          ...this.addresses
        ];
      }
    },
    selectedAddress(address) {
      this.validateAddress(address);
    },
    currency() {
      this.validateAddress(this.selectedAddress);
    }
  },
  methods: {
    listedAddressClick(address) {
      this.dropdownOpen = !this.dropdownOpen;
      this.selectedAddress = address;
    },
    validateAddress(addr) {
      if (this.selectedAddress !== '') {
        const checkAddress = addr.address ? addr.address : addr;
        try {
          this.validAddress = WAValidator.validate(checkAddress, this.currency);
        } catch (e) {
          logger(
            'validateAddress initial validation faild. could be a token. tying to validate as eth address'
          );
          errorLogger(e);
          this.validAddress = web3.utils.isAddress(checkAddress);
        }
        if (this.validAddress) {
          this.$emit('toAddress', checkAddress);
        } else {
          this.$emit('toAddress', '');
        }
      } else {
        this.validAddress = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapAddressSelector';
</style>

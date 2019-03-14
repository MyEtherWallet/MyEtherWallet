<template>
  <div class="drop-down-address-selector">
    <div class="dropdown--title">
      <h4>{{ title }}</h4>
      <button
        class="title-button prevent-user-select"
        @click="copyToClipboard($refs.addressInput)"
      >
        {{ $t('common.copy') }}
      </button>
    </div>
    <div class="dropdown--content">
      <div
        :class="dropdownOpen ? 'dropdown-open' : ''"
        class="dropdown-input-box"
      >
        <input
          ref="addressInput"
          v-model="selectedAddress"
          type="text"
          placeholder="Please enter the address"
          @focus="dropdownOpen = false"
        />
        <div v-if="!validAddress" class="blockie-place-holder-image" />
        <div v-if="validAddress" class="selected-address-blockie">
          <blockie :address="selectedAddress" width="30px" height="30px" />
          <div v-if="isToken(currency)">
            <img class="currency-icon" src="@/assets/images/currency/eth.svg" />
          </div>
          <div v-else>
            <i
              :class="['currency-icon', 'as-font', 'cc', currency, 'cc-icon']"
            />
          </div>
        </div>
        <div class="dropdown-open-button" @click="dropdownOpen = !dropdownOpen">
          <i
            v-if="!dropdownOpen"
            class="fa fa-chevron-down"
            aria-hidden="true"
          />
          <i v-if="dropdownOpen" class="fa fa-chevron-up" aria-hidden="true" />
        </div>
      </div>
      <div v-if="dropdownOpen" class="dropdown-list-box">
        <ul>
          <li
            v-for="addr in addresses"
            :key="addr.key"
            @click="listedAddressClick(addr.address)"
          >
            <div class="list-blockie">
              <blockie :address="addr.address" width="30px" height="30px" />
              <img
                class="currency-icon"
                src="@/assets/images/currency/eth.svg"
              />
            </div>
            <div class="address-block">
              <p class="listed-address">
                {{ addr.address }}
                <!-- Address book feature
                <span
                  v-if="addr.address !== currentAddress && addr.currency !== 'ETH'"
                  class="address-note"
                  >{{ addr.currency }} {{ $t('interface.addr') }}</span
                >
                -->
              </p>
            </div>
            <p v-if="addr.address === currentAddress" class="address-note">
              {{ $t('interface.myAddr') }}
            </p>
            <i
              v-if="toAddressCheckMark"
              aria-hidden="true"
              class="fa fa-check-circle good-button"
            />
          </li>
        </ul>
      </div>
    </div>
    <!-- .dropdown--content -->
  </div>
</template>

<script>
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import debugLogger from 'debug';
import WAValidator from 'wallet-address-validator';
import Blockie from '@/components/Blockie';
import { EthereumTokens, BASE_CURRENCY } from '@/partners';

const errorLogger = debugLogger('v5:error');

export default {
  components: {
    blockie: Blockie
  },
  props: {
    title: {
      type: String,
      default: ''
    },
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
      addresses: [],
      toAddressCheckMark: false
    };
  },
  watch: {
    currentAddress(address) {
      if (this.addresses.findIndex(addr => addr.address === address) === -1) {
        this.addresses = [
          {
            address: address,
            currency: BASE_CURRENCY
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
    copyToClipboard(ref) {
      ref.select();
      document.execCommand('copy');
    },
    isToken(symbol) {
      return typeof EthereumTokens[symbol] !== 'undefined';
    },
    listedAddressClick(address) {
      this.toAddressCheckMark = true;
      this.dropdownOpen = !this.dropdownOpen;
      this.selectedAddress = address;
    },
    validateAddress(addr) {
      if (this.selectedAddress !== '') {
        const checkAddress = addr.address ? addr.address : addr;
        if (EthereumTokens[this.currency]) {
          this.validAddress = WAValidator.validate(checkAddress, 'ETH');
        } else {
          try {
            this.validAddress = WAValidator.validate(
              checkAddress,
              this.currency
            );
          } catch (e) {
            errorLogger(e);
            this.validAddress = false;
          }
        }

        if (this.validAddress) {
          this.$emit('toAddress', checkAddress);
          this.$emit('validAddress', true);
        } else {
          this.$emit('toAddress', '');
          this.$emit('validAddress', false);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DropDownAddressSelector';
</style>

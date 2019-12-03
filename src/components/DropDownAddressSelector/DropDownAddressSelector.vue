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
        <div>
          <input
            v-addr-resolver="'selectedAddress'"
            ref="addressInput"
            v-model="selectedAddress"
            :placeholder="$t('common.enter-addr')"
            type="text"
            autocomplete="off"
            @focus="dropdownOpen = false"
          />
        </div>

        <i
          :class="[
            isValidAddress && hexAddress.length !== 0 ? '' : 'not-good',
            hasMessage ? 'resolver-err-icon' : '',
            'fa fa-check-circle good-button address-check'
          ]"
          aria-hidden="true"
        />
        <div v-if="!isValidAddress" class="blockie-place-holder-image" />
        <div v-if="isValidAddress" class="selected-address-blockie">
          <blockie :address="hexAddress" width="30px" height="30px" />
          <div v-if="isToken(currency)">
            <img
              :alt="$t('common.currency.ethereum')"
              class="currency-icon"
              src="@/assets/images/currency/eth.svg"
            />
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
                :alt="$t('common.currency.ethereum')"
                class="currency-icon"
                src="@/assets/images/currency/eth.svg"
              />
            </div>
            <div class="address-block">
              <p class="listed-address">
                {{ addr.address }}
                <span
                  v-if="
                    addr.address !== currentAddress &&
                      addr.currency !== 'ETH' &&
                      addr.currency
                  "
                  class="address-note"
                  >{{ addr.currency }} {{ $t('interface.addr') }}</span
                >
              </p>
            </div>
            <p v-if="addr.address === currentAddress" class="address-note">
              {{ $t('common.my-addr') }}
            </p>
            <p v-if="addr.address !== currentAddress" class="address-note">
              {{ addr.nickname }}
            </p>
            <i
              v-if="toAddressCheckMark"
              aria-hidden="true"
              class="fa fa-check-circle good-button"
            />
          </li>
          <li
            v-show="addressBook.length < 10"
            class="add-addr"
            @click="addAddress()"
          >
            + {{ $t('interface.address-book.add-addr') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import Blockie from '@/components/Blockie';
import { EthereumTokens, BASE_CURRENCY } from '@/partners';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      default: 'ETH'
    },
    clearAddress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedAddress: '',
      isValidAddress: false,
      dropdownOpen: false,
      addresses: [],
      toAddressCheckMark: false,
      hexAddress: '',
      currentAddress: ''
    };
  },
  computed: {
    ...mapState(['addressBook', 'account']),
    hasMessage() {
      return (
        (!this.isValidAddress && this.selectedAddress.length > 0) ||
        (this.selectedAddress !== '' && this.isValidAddress)
      );
    }
  },
  watch: {
    clearAddress() {
      this.selectedAddress = '';
      this.isValidAddress = false;
      this.hexAddress = '';
    },
    currentAddress(address) {
      if (this.addresses.findIndex(addr => addr.address === address) === -1) {
        this.updateAddresses(address);
      }
    },
    addressBook() {
      this.updateAddresses(this.currentAddress);
    },
    hexAddress() {
      this.validateAddress();
    },
    currency() {
      this.validateAddress(this.selectedAddress);
    }
  },
  mounted() {
    this.currentAddress = this.account.address;
  },
  methods: {
    addAddress() {
      const alreadyExists = Object.keys(this.addressBook).some(key => {
        return this.addressBook[key].address === this.selectedAddress;
      });

      if (!this.selectedAddress) {
        Toast.responseHandler(
          this.$t('interface.address-book.cannot-add'),
          Toast.ERROR
        );
        return;
      } else if (!this.isValidAddress) {
        Toast.responseHandler(
          this.$t('ens.addr-resolver.invalid-eth-addr'),
          Toast.ERROR
        );
        return;
      } else if (alreadyExists) {
        Toast.responseHandler(
          this.$t('interface.address-book.already-exists'),
          Toast.ERROR
        );
        return;
      }

      this.addressBook.push({
        address: this.selectedAddress,
        currency: 'ETH',
        nickname: this.addressBook.length + 1
      });

      this.$store.dispatch('setAddressBook', this.addressBook);

      Toast.responseHandler(
        this.$t('interface.address-book.successfully-added'),
        Toast.SUCCESS
      );
    },
    updateAddresses(address) {
      this.addresses = address
        ? [
            {
              address: address,
              currency: BASE_CURRENCY
            },
            ...this.addressBook
          ]
        : [...this.addressBook];
    },
    copyToClipboard(ref) {
      ref.select();
      document.execCommand('copy');
      Toast.responseHandler(this.$t('common.copied'), Toast.INFO);
    },
    isToken(symbol) {
      return typeof EthereumTokens[symbol] !== 'undefined';
    },
    listedAddressClick(address) {
      this.toAddressCheckMark = true;
      this.dropdownOpen = !this.dropdownOpen;
      this.selectedAddress = address;
    },
    validateAddress() {
      if (this.isValidAddress) {
        this.$emit('toAddress', { address: this.hexAddress, valid: true });
        this.$emit('validAddress', true);
      } else {
        this.$emit('toAddress', { address: '', valid: false });
        this.$emit('validAddress', false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DropDownAddressSelector';
</style>

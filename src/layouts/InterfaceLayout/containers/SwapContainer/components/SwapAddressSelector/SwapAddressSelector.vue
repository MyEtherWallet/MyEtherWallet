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
            <img
              class="currency-icon"
              src="@/assets/images/currency/eth.svg"
              alt
            />
          </div>
          <div v-else>
            <i
              :class="[
                'currency-icon',
                'as-font',
                'cc',
                getIcon(currency),
                'cc-icon'
              ]"
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
                alt
              />
            </div>
            <div class="address-block">
              <p class="listed-address">
                {{ addr.address }}
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
    <div v-show="validityState === 2" class="error-message-container">
      <p>{{ $t('interface.notValidAddr', { currency: currency }) }}</p>
    </div>
    <div v-show="validityState === 3" class="warn-message-container">
      <p>
        {{
          $t('interface.unableToValidateAddress', {
            currency: currency
          })
        }}
      </p>
    </div>
    <div v-show="validityState === 4" class="warn-message-container">
      <p>
        {{ EnsAddress }}
      </p>
    </div>
  </div>
</template>

<script>
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import { mapState } from 'vuex';
import debugLogger from 'debug';
import WAValidator from 'wallet-address-validator';
import MAValidator from 'multicoin-address-validator';
import Blockie from '@/components/Blockie';
import { EthereumTokens, BASE_CURRENCY, hasIcon } from '@/partners';
import { canValidate } from '@/partners/helpers';
import getMultiCoinAddress from '@/helpers/ENSMultiCoin.js';

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
    },
    preFill: {
      type: Boolean,
      default: false
    },
    preFillAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      validityState: 0,
      EnsAddress: '',
      validEnsAddress: false,
      EthereumTokens: EthereumTokens,
      selectedAddress: '',
      validAddress: false,
      dropdownOpen: false,
      unableToValidate: false,
      addresses: [],
      toAddressCheckMark: false
    };
  },
  computed: {
    ...mapState(['ens'])
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
  mounted() {
    if (this.preFill) {
      this.selectedAddress =
        this.preFillAddress !== '' ? this.preFillAddress : '';
    }
  },
  methods: {
    getIcon(currency) {
      return hasIcon(currency);
    },
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
    async checkForEns(address) {
      if (address.includes('.')) {
        const currency =
          this.currency === 'ETH'
            ? 'ETH'
            : this.isToken(this.currency)
            ? 'ETH'
            : this.currency;
        try {
          const nativeAddress = await getMultiCoinAddress(
            this.ens,
            address,
            currency
          );
          this.validityResult('VALID_ENS');
          this.EnsAddress = nativeAddress;
          return nativeAddress;
        } catch (e) {
          this.validityResult('INVALID_ENS');
          return address;
        }
      } else {
        this.validityResult('INVALID_ENS');
        return address;
      }
    },
    validityResult(state) {
      const validityStates = {
        VALID: 1,
        INVALID: 2,
        MAYBE_VALID: 3,
        VALID_ENS: 4,
        INVALID_ENS: 5
      };
      const validStates = [1, 3, 4];
      if (typeof state === 'undefined') {
        return validStates.includes(this.validityState);
      } else if (typeof state === 'boolean') {
        if (state) {
          if (this.validityState !== 4) {
            this.validityState = validityStates['VALID'];
          }
        } else {
          this.validityState = validityStates['INVALID'];
        }
      } else {
        this.validityState = validityStates[state];
      }
    },
    async validateAddress(addr) {
      if (this.selectedAddress !== '') {
        this.validAddress = false;
        this.unableToValidate = false;
        let checkAddress = addr.address ? addr.address : addr;
        checkAddress = await this.checkForEns(checkAddress);
        if (EthereumTokens[this.currency]) {
          this.validAddress = WAValidator.validate(checkAddress, 'ETH');
          this.validityResult(this.validAddress);
        } else {
          try {
            this.validAddress = WAValidator.validate(
              checkAddress,
              this.currency
            );
            this.validityResult(this.validAddress);
          } catch (e) {
            if (canValidate(this.currency)) {
              try {
                this.validAddress = MAValidator.validate(
                  checkAddress,
                  this.currency
                );
                this.validityResult(this.validAddress);
              } catch (e) {
                errorLogger(e);
                this.validityResult('INVALID');
                this.validAddress = false;
              }
            } else {
              this.validityResult('MAYBE_VALID');
              this.validAddress = true;
              this.unableToValidate = true;
            }
          }
        }

        if (this.validityResult()) {
          this.$emit('toAddress', checkAddress);
        } else {
          this.$emit('toAddress', '');
        }
      } else if (this.validityState !== 0) {
        this.validityResult('INVALID');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapAddressSelector';
</style>

<template>
  <div>
    <dropdown-address-selector
      :title="$t('sendTx.to-addr')"
      @toAddress="getToAddress($event)"
    />
    <!-- .dropdown--content -->
    <div v-show="validityState === 2" class="error-message-container">
      <p>{{ $t('swap.warning.not-valid-addr-src', { currency: currency }) }}</p>
    </div>
    <div v-show="validityState === 3" class="warn-message-container">
      <p>
        {{
          $t('swap.warning.unable-validate-addr', {
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
import { EthereumTokens, hasIcon } from '@/partners';
import { canValidate } from '@/partners/helpers';
import getMultiCoinAddress from '@/helpers/ENSMultiCoin.js';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';

const errorLogger = debugLogger('v5:error');

export default {
  components: {
    blockie: Blockie,
    'dropdown-address-selector': DropDownAddressSelector
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
    },
    clearAddress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      validityState: 0,
      EnsAddress: '',
      EthereumTokens: EthereumTokens,
      selectedAddress: '',
      validAddress: false,
      unableToValidate: false
    };
  },
  computed: {
    ...mapState(['ens'])
  },
  watch: {
    currency() {
      this.validateAddress(this.selectedAddress);
    },
    clearAddress() {
      this.selectedAddress = '';
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
    async getToAddress(data) {
      this.selectedAddress = data.address;
      this.validAddress = data.valid;

      this.validateAddress(data.address);
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

<template>
  <div>
    <mew-address-select
      ref="addressSelect"
      :resolved-addr="resolvedAddr"
      :copy-tooltip="$t('common.copy')"
      :save-tooltip="$t('common.save')"
      :enable-save-address="enableSave"
      :label="$t('sendTx.to-addr')"
      :items="addressBookWithMyAddress"
      :placeholder="$t('sendTx.enter-addr')"
      :success-toast="$t('sendTx.success.title')"
      :is-valid-address="isValidAddress"
      :rules="rules"
      :error-messages="errorMessages"
      @saveAddress="toggleOverlay"
      @input="setAddress"
    />
    <!-- add and edit the address book -->
    <mew-overlay
      :title="$t('interface.address-book.add-addr')"
      :show-overlay="addMode"
      :close="toggleOverlay"
      left-btn-text=""
      :right-btn-text="$t('common.close')"
    >
      <template #mewOverlayBody>
        <address-book-add-edit
          :to-address="inputAddr"
          mode="add"
          @back="toggleOverlay"
        />
      </template>
    </mew-overlay>
  </div>
</template>

<script>
import { isAddress } from '@/core/helpers/addressUtils';
import { mapGetters, mapState } from 'vuex';
import NameResolver from '@/modules/name-resolver/index';
import AddressBookAddEdit from './components/AddressBookAddEdit';
import { _ } from 'web3-utils';
import { toChecksumAddress } from '@/core/helpers/addressUtils';

const USER_INPUT_TYPES = {
  typed: 'TYPED',
  selected: 'SELECTED'
};

export default {
  components: {
    AddressBookAddEdit
  },
  props: {
    isValidAddressFunc: {
      type: Function,
      default: isAddress
    },
    isHomePage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addMode: false,
      resolvedAddr: '',
      inputAddr: '',
      nameResolver: null,
      isValidAddress: false,
      loadedAddressValidation: false
    };
  },

  computed: {
    ...mapState('global', ['addressBook']),
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['web3']),
    errorMessages() {
      if (!this.isValidAddress && this.loadedAddressValidation) {
        return this.$t('interface.address-book.validations.invalid-address');
      }
      return '';
    },
    // TODO: remove the first rule once the components package is updated to the
    // right version (0.6.7-beta and up)
    // waiting on overlay changes
    rules() {
      return [
        (this.isValidAddress && this.loadedAddressValidation) ||
          this.$t('interface.address-book.validations.invalid-address'),
        value =>
          !!value || this.$t('interface.address-book.validations.addr-required')
      ];
    },
    addressBookWithMyAddress() {
      return this.isHomePage
        ? [
            {
              address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
              currency: 'ETH',
              nickname: 'MEW Donations',
              resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
            }
          ]
        : [
            {
              address: toChecksumAddress(this.$store.state.wallet.address),
              nickname: 'My Address',
              resolverAddr: ''
            }
          ].concat(this.addressBook);
    },
    enableSave() {
      return this.isHomePage ? false : this.isValidAddress;
    }
  },
  watch: {
    web3() {
      if (this.network.type.ens) {
        this.nameResolver = new NameResolver(this.network, this.web3);
      } else {
        this.nameResolver = null;
      }
    }
  },
  mounted() {
    if (this.network.type.ens)
      this.nameResolver = new NameResolver(this.network, this.web3);
    if (this.isHomePage) {
      this.setDonationAddress();
    }
  },
  methods: {
    /**
     * Checks if address is valid
     * and sets the address value
     */
    setAddress(value, inputType) {
      if (typeof value === 'string') {
        /**
         * Checks if user typed or selected an address from dropdown
         */
        const typeVal =
          inputType === USER_INPUT_TYPES.typed
            ? value
            : this.addressBookWithMyAddress.find(item => {
                return value.toLowerCase() === item.address.toLowerCase();
              });
        this.inputAddr = value;
        this.resolvedAddr = '';
        /**
         * Checks if the address is valid
         */
        const isAddValid = this.isValidAddressFunc(this.inputAddr);
        if (isAddValid instanceof Promise) {
          isAddValid.then(res => {
            this.isValidAddress = res;
          });
        } else {
          this.isValidAddress = isAddValid;
        }
        this.loadedAddressValidation = !this.isValidAddress ? false : true;

        /**
         * @emits setAddress
         */
        this.$emit('setAddress', value, this.isValidAddress, {
          type: inputType,
          value: _.isObject(typeVal) ? typeVal.nickname : typeVal
        });
        if (!this.isValidAddress) {
          this.resolveName();
        }
      }
    },
    // is used from the parent context
    // eslint-disable-next-line
    clear() {
      this.addMode = false;
      this.resolvedAddr = '';
      this.inputAddr = '';
      this.nameResolver = null;
      this.isValidAddress = false;
      this.$refs.addressSelect.clear();

      // Calls setups from mounted
      if (this.network.type.ens)
        this.nameResolver = new NameResolver(this.network, this.web3);
      if (this.isHomePage) {
        this.setDonationAddress();
      }
    },
    /**
     * Sets selected address to be MEW donation address
     * only happens on home page
     */
    setDonationAddress() {
      this.$refs.addressSelect.selectAddress(this.addressBookWithMyAddress[0]);
    },
    toggleOverlay() {
      this.addMode = !this.addMode;
    },
    /**
     * Resolves name and @returns address
     */
    resolveName: _.debounce(async function () {
      if (this.nameResolver) {
        try {
          await this.nameResolver.resolveName(this.inputAddr).then(addr => {
            this.resolvedAddr = addr;
            this.isValidAddress = true;
            this.loadedAddressValidation = true;
            this.$emit('setAddress', this.resolvedAddr, this.isValidAddress, {
              type: 'RESOLVED',
              value: this.inputAddr
            });
          });
          // eslint-disable-next-line no-empty
        } catch (e) {
          this.loadedAddressValidation = true;
        }
      }
    }, 500)
  }
};
</script>

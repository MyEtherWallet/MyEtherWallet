<template>
  <div>
    <mew-address-select
      ref="addressSelect"
      :resolved-addr="addressOnly"
      :hint="nameOnly"
      :copy-tooltip="$t('common.copy')"
      :save-tooltip="$t('common.save')"
      :enable-save-address="enableSave"
      :show-save="enableSave"
      :label="addrLabel"
      :items="addressBookWithMyAddress"
      :placeholder="$t('sendTx.enter-addr')"
      :success-toast="$t('sendTx.success.title')"
      :is-valid-address="isValidAddress"
      :show-copy="isValidAddress"
      :error-messages="errorMessages"
      @saveAddress="toggleOverlay"
      @input="setAddress"
    />
    <!-- add and edit the address book -->
    <mew-overlay
      :footer="{
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }"
      :title="$t('interface.address-book.add-addr')"
      :show-overlay="addMode"
      :close="toggleOverlay"
      content-size="xlarge"
    >
      <address-book-add-edit
        :to-address="inputAddr"
        mode="add"
        @back="toggleOverlay"
      />
    </mew-overlay>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { isObject, throttle } from 'lodash';
import WAValidator from 'multicoin-address-validator';
import { getAddressInfo } from '@kleros/address-tags-sdk';

import { isAddress, toChecksumAddress } from '@/core/helpers/addressUtils';
import NameResolver from '@/modules/name-resolver/index';
import { ERROR, Toast } from '../toast/handler/handlerToast';

const USER_INPUT_TYPES = {
  typed: 'TYPED',
  selected: 'SELECTED',
  resolved: 'RESOLVED'
};

export default {
  components: {
    AddressBookAddEdit: () => import('./components/AddressBookAddEdit')
  },
  props: {
    isValidAddressFunc: {
      type: Function,
      default: isAddress
    },
    isHomePage: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      default: 'ETH'
    },
    preselectCurrWalletAdr: {
      type: Boolean,
      default: false
    },
    enableSaveAddress: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      addMode: false,
      resolvedAddr: '',
      inputAddr: '',
      nameResolver: null,
      isValidAddress: false,
      loadedAddressValidation: false,
      nametag: ''
    };
  },

  computed: {
    ...mapState('addressBook', ['addressBookStore']),
    ...mapGetters('global', ['network']),
    ...mapState('wallet', [
      'web3',
      'address',
      'isOfflineApp',
      'identifier',
      'instance'
    ]),
    errorMessages() {
      if (!this.isValidAddress && this.loadedAddressValidation) {
        return this.$t('interface.address-book.validations.invalid-address');
      }
      if (!this.inputAddr && this.loadedAddressValidation) {
        return this.$t('interface.address-book.validations.addr-required');
      }
      return '';
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
        : this.myAddressBook;
    },
    myAddressBook() {
      if (!this.isHomePage && !this.identifier)
        this.instance.errorHandler(
          new Error('Wallet has no identifier! Please refresh the page')
        );
      return this.address
        ? [
            {
              address: toChecksumAddress(this.address),
              nickname: 'My Address',
              resolverAddr: ''
            }
          ].concat(this.addressBookStore)
        : // If address is undefined set to MEW Donations
          [
            {
              address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
              currency: 'ETH',
              nickname: 'MEW Donations',
              resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
            }
          ].concat(this.addressBookStore);
    },
    enableSave() {
      return this.isHomePage
        ? false
        : this.isValidAddress && this.enableSaveAddress;
    },
    addrLabel() {
      return this.label === '' ? this.$t('sendTx.to-addr') : this.label;
    },
    addressOnly() {
      return isAddress(this.resolvedAddr) && this.isValidAddress
        ? this.resolvedAddr
        : '';
    },
    nameOnly() {
      return !isAddress(this.resolvedAddr) && this.isValidAddress
        ? this.resolvedAddr || this.nametag
        : '';
    }
  },
  watch: {
    web3() {
      if (this.network.type.ens && this.web3.currentProvider) {
        this.nameResolver = new NameResolver(this.network, this.web3);
      } else {
        this.nameResolver = null;
      }
    },
    inputAddr(newVal) {
      this.nametag = '';
      if (isAddress(newVal.toLowerCase())) {
        this.resolveAddress();
      } else {
        this.resolveName();
      }
    }
  },
  mounted() {
    if (this.network.type.ens && this.web3.currentProvider)
      this.nameResolver = new NameResolver(this.network, this.web3);
    if (this.isHomePage) {
      this.setDonationAddress();
    }
    if (this.preselectCurrWalletAdr) {
      this.$refs.addressSelect.selectAddress(this.addressBookWithMyAddress[0]);
      this.setAddress(
        toChecksumAddress(this.address),
        USER_INPUT_TYPES.selected
      );
    }
  },
  methods: {
    /**
     * Checks if address is valid
     * and sets the address value
     */
    async setAddress(value, inputType) {
      if (typeof value === 'string') {
        if (
          this.currency.toLowerCase() ===
          this.network.type.currencyName.toLowerCase()
        ) {
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
          try {
            const isAddValid = this.isValidAddressFunc(this.inputAddr);
            if (isAddValid instanceof Promise) {
              const validation = await isAddValid;
              this.isValidAddress = validation;
            } else {
              this.isValidAddress = isAddValid;
            }
          } catch (e) {
            this.isValidAddress = false;
          }
          this.loadedAddressValidation = !this.isValidAddress ? false : true;
          /**
           * Resolve address with ENS/Unstoppable/Kleros
           */
          if (this.isValidAddress && !this.isOfflineApp)
            await this.resolveAddress();

          /**
           * @emits setAddress
           */
          this.$emit('setAddress', value, this.isValidAddress, {
            type: inputType,
            value: isObject(typeVal) ? typeVal.nickname : typeVal
          });
          if (!this.isValidAddress) {
            await this.resolveName();
          }
        } else {
          const currencyExists = WAValidator.findCurrency(
            this.currency.toLowerCase()
          );
          if (currencyExists) {
            const validate = WAValidator.validate(
              value,
              this.currency.toLowerCase()
            );
            if (validate) {
              this.inputAddr = value;
              this.isValidAddress = true;
            } else {
              this.isValidAddress = false;
            }
            this.loadedAddressValidation = true;
            /**
             * @emits setAddress
             */
            this.$emit('setAddress', value, this.isValidAddress, {
              type: inputType,
              value: value
            });
          } else {
            this.isValidAddress = false;
            this.loadedAddressValidation = true;
            this.$emit('setAddress', value, this.isValidAddress, {
              type: inputType,
              value: value
            });
          }
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
      this.loadedAddressValidation = false;
      this.$refs.addressSelect.clear();
      this.$emit('setAddress', this.resolvedAddr, this.isValidAddress, {
        type: USER_INPUT_TYPES.typed,
        value: this.inputAddr
      });

      // Calls setups from mounted
      if (!this.isOfflineApp && this.network.type.ens)
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
     * Resolves address and @returns name
     */
    resolveAddress: throttle(async function () {
      if (this.nameResolver) {
        try {
          const reverseName = await this.nameResolver.resolveAddress(
            this.inputAddr
          );
          if (reverseName && !reverseName.name) {
            try {
              await getAddressInfo(
                toChecksumAddress(this.inputAddr),
                'https://ipfs.kleros.io'
              ).then(data => {
                this.nametag = data?.publicNameTag || '';
              });
            } catch (e) {
              this.nametag = '';
            }
          }
          this.resolvedAddr = reverseName?.name ? reverseName.name : '';
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      }
    }, 300),
    /**
     * Resolves name and @returns address
     */
    resolveName: throttle(async function () {
      if (this.nameResolver) {
        try {
          await this.nameResolver.resolveName(this.inputAddr).then(addr => {
            this.resolvedAddr = addr;
            this.isValidAddress = true;
            this.loadedAddressValidation = true;
            this.$emit('setAddress', this.resolvedAddr, this.isValidAddress, {
              type: USER_INPUT_TYPES.resolved,
              value: this.inputAddr
            });
          });
        } catch (e) {
          this.loadedAddressValidation = true;
        }
      }
    }, 500)
  }
};
</script>

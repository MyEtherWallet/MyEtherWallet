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
      :footer="footer"
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
import { debounce, isObject } from 'lodash';
import WAValidator from 'multicoin-address-validator';
// import { getAddressInfo } from '@kleros/address-tags-sdk';

import { isAddress, toChecksumAddress } from '@/core/helpers/addressUtils';
import Resolver from '@/modules/name-resolver/index';
import { ERROR, Toast } from '../toast/handler/handlerToast';
import { ROOTSTOCK } from '@/utils/networks/types';

export const USER_INPUT_TYPES = {
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
      nametag: '',
      // Incremented whenever the input, the network or the resolver changes.
      // A resolution may only write back if its generation is still current,
      // otherwise a slow lookup could overwrite a newer recipient.
      resolveGeneration: 0,
      footer: {
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }
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
      if (!this.isHomePage && !this.identifier && this.instance)
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
      this.invalidateResolutions();
      if (this.network.type.ensEnkryptType) {
        this.nameResolver = new Resolver(this.network);
      } else {
        this.nameResolver = null;
      }
    },
    // A network change can arrive without `web3` being replaced, so it needs
    // its own invalidation: a resolution answered for the previous chain must
    // not land against the new one.
    'network.type.chainID'() {
      this.invalidateResolutions();
    },
    // Switching accounts changes what a reverse lookup describes.
    address() {
      this.invalidateResolutions();
    },
    $route() {
      this.invalidateResolutions();
    },
    inputAddr(newVal) {
      this.nametag = '';
      this.invalidateResolutions();
      if (isAddress(newVal.toLowerCase())) {
        this.resolveAddress();
      } else {
        this.resolveName();
      }
    }
  },
  created() {
    // Debounced per instance rather than on `methods`: Vue binds a single
    // shared function object to every instance, so declaring these on
    // `methods` would let two address inputs on the same page (see
    // ModuleSwap) share timer state and each other's pending results.
    this.resolveAddress = debounce(this.resolveAddressNow, 300);
    this.resolveName = debounce(this.resolveNameNow, 500);
  },
  beforeDestroy() {
    this.invalidateResolutions();
  },
  mounted() {
    if (this.isOfflineApp) {
      this.footer = {
        text: 'Need help? Email us at support@myetherwallet.com',
        linkTitle: '',
        link: ''
      };
    }
    if (this.network.type.ensEnkryptType)
      this.nameResolver = new Resolver(this.network);
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
     * Abandons every name resolution that is currently pending or queued.
     * Called whenever the input, the network or the resolver changes so that
     * an in-flight lookup can no longer write back a result belonging to an
     * input the user has since replaced.
     * @returns {number} the generation callers must still match to write back
     */
    invalidateResolutions() {
      this.resolveName?.cancel?.();
      this.resolveAddress?.cancel?.();
      return ++this.resolveGeneration;
    },
    /**
     * Checks if address is valid
     * and sets the address value
     */
    async setAddress(value, inputType) {
      this.invalidateResolutions();
      if (typeof value === 'string') {
        if (
          this.currency.toLowerCase() ===
          this.network.type.currencyName?.toLowerCase()
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
           * @emits setAddress
           */
          this.$emit('setAddress', value, this.isValidAddress, {
            type: inputType,
            value: isObject(typeVal) ? typeVal.nickname : typeVal
          });
          /**
           * Resolve address with ENS/Unstoppable/Kleros
           */
          if (this.isValidAddress && !this.isOfflineApp)
            await this.resolveAddress();

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
            try {
              this.inputAddr = value;
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
      this.invalidateResolutions();
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
      if (!this.isOfflineApp && this.network.type.ensEnkryptType)
        this.nameResolver = new Resolver(this.network);
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
     * Everything a resolution must still agree with before it may write back.
     * Captured before the await, re-checked after it.
     */
    resolutionContext() {
      return {
        generation: this.resolveGeneration,
        resolver: this.nameResolver,
        input: this.inputAddr,
        chainID: this.network.type.chainID,
        account: this.address
      };
    },
    /**
     * True while the resolution started in `ctx` is still the one the user is
     * waiting on: same input, same account, same chain, same resolver, and no
     * newer request issued since.
     */
    isCurrentResolution(ctx) {
      const now = this.resolutionContext();
      return (
        ctx.generation === now.generation &&
        ctx.resolver === now.resolver &&
        ctx.input === now.input &&
        ctx.chainID === now.chainID &&
        ctx.account === now.account
      );
    },
    /**
     * Resolves address and @returns name
     * Debounced per instance in created() as `resolveAddress`.
     */
    async resolveAddressNow() {
      if (!this.nameResolver) return;
      // Bind this lookup to the state that started it, so a slow reverse
      // lookup cannot label a newer recipient.
      const ctx = this.resolutionContext();
      try {
        // Ethers.js rejects Rootstock checksummed address so use lowercase address.
        const inputAddress =
          ctx.chainID === ROOTSTOCK.chainID ? ctx.input.toLowerCase() : ctx.input;
        const reverseName = await ctx.resolver.resolveAddress(inputAddress);
        if (!this.isCurrentResolution(ctx)) return;

        this.resolvedAddr = reverseName?.name ? reverseName.name : '';
      } catch (e) {
        if (!this.isCurrentResolution(ctx)) return;
        Toast(e, {}, ERROR);
      }
    },
    /**
     * Resolves name and @returns address
     * Debounced per instance in created() as `resolveName`.
     */
    async resolveNameNow() {
      if (!this.nameResolver) return;
      // Bind this lookup to the state that started it. Without this an
      // attacker-controlled resolver could stall its answer and overwrite a
      // recipient the user has already corrected.
      const ctx = this.resolutionContext();
      try {
        const addr = await ctx.resolver.resolveName(ctx.input);
        if (!this.isCurrentResolution(ctx)) return;

        this.resolvedAddr = addr;
        this.isValidAddress = true;
        this.loadedAddressValidation = true;
        this.$emit('setAddress', this.resolvedAddr, this.isValidAddress, {
          type: USER_INPUT_TYPES.resolved,
          value: ctx.input
        });
      } catch (e) {
        if (!this.isCurrentResolution(ctx)) return;
        this.loadedAddressValidation = true;
      }
    }
  }
};
</script>

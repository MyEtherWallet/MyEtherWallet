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
      @input="setAddress"
      @saveAddress="toggleOverlay"
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
import * as _ from 'underscore';

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
      isValidAddress: false
    };
  },
  computed: {
    ...mapState('global', ['addressBook']),
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['web3']),
    rules() {
      return [
        this.isValidAddress ||
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
              address: this.$store.state.wallet.address,
              nickname: 'My Address',
              resolverAddr: ''
            }
          ].concat(this.addressBook);
    },
    enableSave() {
      return this.isHomePage ? false : this.isValidAddress;
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
    async resolveName() {
      if (this.nameResolver) {
        try {
          await this.nameResolver.resolveName(this.inputAddr).then(addr => {
            this.resolvedAddr = addr;
            this.isValidAddress = true;
            this.$emit('setAddress', this.resolvedAddr, this.isValidAddress, {
              type: 'RESOLVED',
              value: this.inputAddr
            });
          });
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    },
    setAddress(value, inputType) {
      if (typeof value === 'string') {
        const typeVal =
          inputType === 'typed'
            ? value
            : this.addressBookWithMyAddress.find(item => {
                return value.toLowerCase() === item.address.toLowerCase();
              });
        this.inputAddr = value.address ? value.address : value;
        this.resolvedAddr = '';
        const isAddValid = this.isValidAddressFunc(this.inputAddr);
        if (isAddValid instanceof Promise) {
          isAddValid.then(res => {
            this.isValidAddress = res;
            this.$emit('setAddress', value, this.isValidAddress, {
              type: inputType,
              value: _.isObject(typeVal) ? typeVal.nickname : typeVal
            });
          });
        } else {
          this.isValidAddress = isAddValid;
          this.$emit('setAddress', value, this.isValidAddress, {
            type: inputType,
            value: _.isObject(typeVal) ? typeVal.nickname : typeVal
          });
        }
        if (!this.isValidAddress) {
          this.resolveName();
        }
      }
    }
  }
};
</script>

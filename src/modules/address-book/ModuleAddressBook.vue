<template>
  <div>
    <mew-address-select
      ref="addressSelect"
      :value="inputAddr"
      :resolved-addr="resolvedAddr"
      :copy-tooltip="$t('common.copy')"
      :save-tooltip="$t('common.save')"
      :enable-save-address="isValidAddress"
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

export default {
  components: {
    AddressBookAddEdit
  },
  props: {
    isValidAddressFunc: {
      type: Function,
      default: isAddress
    }
  },
  data() {
    return {
      addMode: false,
      resolvedAddr: '',
      inputAddr: '',
      nameResolver: {},
      isValidAddress: false
    };
  },
  computed: {
    ...mapState('global', ['addressBook']),
    ...mapGetters('global', ['network']),
    rules() {
      return [
        this.isValidAddress ||
          this.$t('interface.address-book.validations.invalid-address'),
        value =>
          !!value || this.$t('interface.address-book.validations.addr-required')
      ];
    },
    address() {
      return this.resolvedAddr.length > 0 ? this.resolvedAddr : this.inputAddr;
    },
    addressBookWithMyAddress() {
      return [
        {
          address: this.$store.state.wallet.address,
          nickname: 'My Address',
          resolverAddr: ''
        }
      ].concat(this.addressBook);
    }
  },
  mounted() {
    this.nameResolver = new NameResolver(this.network);
  },
  methods: {
    toggleOverlay() {
      this.addMode = !this.addMode;
    },
    async resolveName() {
      if (this.nameResolver) {
        try {
          await this.nameResolver.resolveName(this.inputAddr).then(addr => {
            this.resolvedAddr = addr;
            this.$emit('setAddress', this.resolvedAddr, true);
          });
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    },
    setAddress(value) {
      if (value) {
        this.inputAddr = value.address ? value.address : value;
        this.resolvedAddr = '';
        const isAddValid = this.isValidAddressFunc(this.inputAddr);
        if (isAddValid instanceof Promise) {
          isAddValid.then(res => {
            this.isValidAddress = res;
            this.$emit('setAddress', this.inputAddr, this.isValidAddress);
          });
        } else {
          this.isValidAddress = isAddValid;
          this.$emit('setAddress', this.inputAddr, this.isValidAddress);
        }
        if (!this.isValidAddress) {
          this.resolveName();
        }
      }
    }
  }
};
</script>

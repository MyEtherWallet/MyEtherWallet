<template>
  <div class="full-width">
    <mew-address-select
      ref="addressSelect"
      :value="toAddress"
      :resolved-addr="resolvedAddr"
      :copy-tooltip="$t('common.copy')"
      :save-tooltip="$t('common.save')"
      :enable-save-address="isValidAddress"
      :label="$t('sendTx.to-addr')"
      :items="addressBook"
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
          :to-address="toAddress"
          mode="add"
          @back="toggleOverlay"
        />
      </template>
    </mew-overlay>
  </div>
</template>

<script>
import utils from 'web3-utils';
import { mapState } from 'vuex';
import NameResolver from '@/modules/name-resolver/index';
import AddressBookAddEdit from './components/AddressBookAddEdit';

export default {
  name: 'ModuleAddressBook',
  components: {
    AddressBookAddEdit
  },
  data() {
    return {
      addMode: false,
      resolvedAddr: '',
      toAddress: '',
      nameResolver: {}
    };
  },
  computed: {
    ...mapState('wallet', ['addressBook', 'network']),
    isValidAddress() {
      return utils.isAddress(this.address);
    },
    rules() {
      return [
        this.isValidAddress ||
          this.$t('interface.address-book.validations.invalid-address'),
        value =>
          !!value || this.$t('interface.address-book.validations.addr-required')
      ];
    },
    address() {
      return this.resolvedAddr.length > 0 ? this.resolvedAddr : this.toAddress;
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
        await this.nameResolver.resolveName(this.toAddress).then(addr => {
          this.resolvedAddr = addr;
          this.$emit('setResolvedAddr', this.resolvedAddr);
        });
      }
    },
    setAddress(value) {
      this.toAddress = value.address ? value.address : value;
      this.$emit('setToAddr', this.toAddress);
      if (utils.isAddress(this.toAddress)) {
        this.resolveName();
      }
    }
  }
};
</script>

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
import utils from 'web3-utils';
import { mapGetters, mapState } from 'vuex';
import NameResolver from '@/modules/name-resolver/index';
import AddressBookAddEdit from './components/AddressBookAddEdit';

export default {
  components: {
    AddressBookAddEdit
  },
  data() {
    return {
      addMode: false,
      resolvedAddr: '',
      inputAddr: '',
      nameResolver: {}
    };
  },
  computed: {
    ...mapState('global', ['addressBook']),
    ...mapGetters('global', ['network']),
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
        await this.nameResolver.resolveName(this.inputAddr).then(addr => {
          this.resolvedAddr = addr;
          this.$emit('setAddress', this.resolvedAddr, this.isValidAddress);
        });
      }
    },
    setAddress(value) {
      if (value) {
        this.inputAddr = value.address ? value.address : value;
        this.resolvedAddr = '';
        this.$emit('setAddress', this.inputAddr, this.isValidAddress);
        if (!utils.isAddress(this.inputAddr)) {
          this.resolveName();
        }
      }
    }
  }
};
</script>

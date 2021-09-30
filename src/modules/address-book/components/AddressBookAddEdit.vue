<template>
  <div class="full-width">
    <!--
  =====================================================================================
    Address Book - add address mode
  =====================================================================================
  -->
    <mew-input
      v-if="addMode"
      :show-blockie="true"
      :label="$t('interface.address-book.address')"
      :placeholder="$t('interface.address-book.enter-addr')"
      :value="addressToAdd"
      :rules="addressRules"
      autofocus
      :resolved-addr="resolvedAddr"
      @input="setAddress"
    />
    <!--
  =====================================================================================
    Address Book - edit mode
  =====================================================================================
  -->
    <div v-if="editMode" class="full-width d-flex align-center mb-7">
      <mew-blockie
        class="mr-3"
        :address="item.resolvedAddr ? item.resolvedAddr : item.address"
        height="45px"
        width="45px"
      />
      <div class="truncate">
        <h5 class="font-weight-bold">
          {{ $t('interface.address-book.address') }}
        </h5>
        <div class="d-flex align-center">
          <span id="item-addr" class="monospace mr-3 truncate">
            {{ checksumAddressToAdd }}
          </span>
          <mew-copy :copy-value="item.address" :tooltip="$t('common.copy')" />
        </div>
      </div>
    </div>
    <!--
  =====================================================================================
    Address Book - add/edit nickname
  =====================================================================================
  -->
    <mew-input
      class="mt-2"
      :label="$t('interface.address-book.nickname')"
      :placeholder="
        nickname ? nickname : $t('interface.address-book.enter-nickname')
      "
      :value="nickname"
      :rules="nicknameRules"
      @input="setNickname"
    />
    <!--
  =====================================================================================
    Address Book - save
  =====================================================================================
  -->
    <div class="text-center mt-4">
      <mew-button
        :disabled="disabled"
        :title="
          editMode
            ? $t('interface.address-book.update')
            : $t('common.confirm-add')
        "
        btn-size="xlarge"
        @click.native="editMode ? update() : add()"
      />
    </div>
    <!--
  =====================================================================================
    Address Book - remove address
  =====================================================================================
  -->
    <div
      v-if="editMode"
      class="text-center mt-6 error--text cursor-pointer"
      @click="remove"
    >
      {{ $t('interface.address-book.remove-addr') }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import NameResolver from '@/modules/name-resolver/index';
import { toChecksumAddress, isAddress } from '@/core/helpers/addressUtils';

const modes = ['add', 'edit'];

export default {
  name: 'AddressBookAddEdit',
  props: {
    mode: { default: modes[0], type: String },
    item: { default: () => {}, type: Object },
    toAddress: { default: '', type: String }
  },
  data() {
    return {
      resolvedAddr: '',
      nameResolver: null,
      currentIdx: null,
      nickname: '',
      addressToAdd: ''
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('custom', ['addressBook']),
    ...mapGetters('global', ['network']),
    disabled() {
      if (this.addMode) {
        return (
          !this.addressToAdd ||
          !this.validAddress ||
          this.nickname?.length > 20 ||
          this.alreadyExists
        );
      }
      if (this.editMode) {
        return (
          this.nickname === this.item.nickname || this.nickname?.length > 20
        );
      }
      return true;
    },
    addressRules() {
      return [
        () =>
          !this.alreadyExists ||
          this.$t('interface.address-book.validations.already-exists'),
        this.validAddress ||
          this.$t('interface.address-book.validations.invalid-address'),
        value =>
          !!value || this.$t('interface.address-book.validations.addr-required')
      ];
    },
    nicknameRules() {
      return [
        value =>
          (value && value.length < 20) ||
          this.$t('interface.address-book.validations.nickname-length')
      ];
    },
    validAddress() {
      return this.resolvedAddr.length > 0
        ? isAddress(this.resolvedAddr)
        : isAddress(this.addressToAdd);
    },
    editMode() {
      return this.mode === modes[1];
    },
    addMode() {
      return this.mode === modes[0];
    },
    isMyAddress() {
      return this.address?.toLowerCase() === this.addressToAdd?.toLowerCase();
    },
    alreadyExists() {
      if (this.addMode) {
        if (this.isMyAddress) {
          return true;
        }
        return Object.keys(this.addressBook).some(key => {
          return (
            this.addressBook[key].address.toLowerCase() ===
            this.addressToAdd?.toLowerCase()
          );
        });
      }
      return false;
    },
    checksumAddressToAdd() {
      if (this.addressToAdd !== '' && isAddress(this.addressToAdd)) {
        return toChecksumAddress(this.addressToAdd);
      }
      return this.addressToAdd;
    }
  },
  watch: {
    toAddress(newVal) {
      this.addressToAdd = newVal;
    },
    addressToAdd() {
      this.resolveName();
    },
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
    if (this.addMode && this.toAddress) {
      this.addressToAdd = this.toAddress;
    }
    if (this.editMode) {
      this.addressToAdd = this.item.address;
      this.nickname = this.item.nickname;
      this.currentIdx = this.addressBook.findIndex(
        item => item.address === this.item.address
      );
    }
  },
  methods: {
    ...mapActions('custom', ['setAddressBook']),
    reset() {
      this.addressToAdd = '';
      this.nickname = '';
      this.resolvedAddr = '';
    },
    async resolveName() {
      if (
        this.nameResolver &&
        this.addressToAdd &&
        this.addressToAdd.includes('.')
      ) {
        await this.nameResolver
          .resolveName(this.addressToAdd)
          .then(addr => {
            this.resolvedAddr = addr;
          })
          .catch(() => {
            this.resolvedAddr = '';
          });
      }
    },
    setAddress(value) {
      this.addressToAdd = value ? value : '';
    },
    setNickname(value) {
      this.nickname = value;
    },
    update() {
      this.addressBook[this.currentIdx].address = this.checksumAddressToAdd;
      this.addressBook[this.currentIdx].nickname = this.nickname;
      this.setAddressBook(this.addressBook);
      this.$emit('back', 3);
    },
    remove() {
      this.addressBook.splice(this.currentIdx, 1);
      this.setAddressBook(this.addressBook);
      this.reset();
      this.$emit('back', 3);
    },
    add() {
      if (this.alreadyExists) {
        this.reset();
        return;
      }
      this.addressBook.push({
        address: this.checksumAddressToAdd,
        resolvedAddr: this.resolvedAddr,
        nickname: this.nickname || (this.addressBook.length + 1).toString()
      });
      this.setAddressBook(this.addressBook);
      this.reset();
      this.$emit('back', 3);
    }
  }
};
</script>

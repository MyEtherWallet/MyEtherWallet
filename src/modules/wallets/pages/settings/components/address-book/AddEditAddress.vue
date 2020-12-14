<template>
  <v-sheet class="pa-10 mt-5" width="700" :rounded="true">
    <mew-input
      v-if="addMode"
      :show-blockie="true"
      :label="$t('interface.address-book.address')"
      :placeholder="$t('interface.address-book.enter-addr')"
      :value="address"
      :rules="addressRules"
      @input="setAddress"
    />
    <div v-if="editMode" class="full-width d-flex align-center mb-7">
      <mew-blockie
        class="mr-3"
        address="0xAEcFF9cd2367CdBb726e904cd6397eDFCae6068D"
        height="45px"
        width="45px"
      />
      <div class="truncate">
        <h5 class="font-weight-bold">
          {{ $t('interface.address-book.address') }}
        </h5>
        <div class="d-flex align-center">
          <span id="item-addr" class="monospace mr-3 truncate">
            {{ address }}
          </span>
          <mew-copy copy-id="item-addr" :is-ref="false" tooltip="hello" />
        </div>
      </div>
    </div>
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
    <div
      v-if="editMode"
      class="text-center mt-6 error--text cursor-pointer"
      @click="remove"
    >
      {{ $t('interface.address-book.remove-addr') }}
    </div>
  </v-sheet>
</template>

<script>
import utils from 'web3-utils';
import { mapState, mapActions } from 'vuex';

const modes = ['add', 'edit'];

export default {
  props: {
    mode: { default: modes[0], type: String },
    item: { default: () => {}, type: Object }
  },
  data() {
    return {
      currentIdx: null,
      nickname: '',
      address: '',
      addressRules: [
        () =>
          !this.alreadyExists ||
          this.$t('interface.address-book.already-exists'),
        value =>
          (value.length > 0 && utils.isAddress(value)) ||
          this.$t('interface.address-book.invalid-address'),
        value => !!value || this.$t('interface.address-book.addr-required')
      ],
      nicknameRules: [
        value =>
          value.length < 20 || this.$t('interface.address-book.nickname-length')
      ]
    };
  },
  computed: {
    ...mapState('wallet', ['addressBook']),
    disabled() {
      if (this.addMode) {
        return (
          !this.address ||
          !this.validAddress ||
          this.nickname.length > 20 ||
          this.alreadyExists
        );
      }
      if (this.editMode) {
        return (
          this.nickname === this.item.nickname || this.nickname.length > 20
        );
      }
      return true;
    },
    validAddress() {
      return utils.isAddress(this.address);
    },
    editMode() {
      return this.mode === modes[1];
    },
    addMode() {
      return this.mode === modes[0];
    },
    alreadyExists() {
      if (this.addMode) {
        return Object.keys(this.addressBook).some(key => {
          return (
            this.addressBook[key].address.toLowerCase() ===
            this.address.toLowerCase()
          );
        });
      }
      return false;
    }
  },
  mounted() {
    if (this.editMode) {
      this.address = this.item.address;
      this.nickname = this.item.nickname;
      this.currentIdx = this.addressBook.findIndex(
        item => item.address === this.item.address
      );
    }
  },
  methods: {
    ...mapActions('wallet', ['setAddressBook']),
    setAddress(value) {
      this.address = value;
    },
    setNickname(value) {
      this.nickname = value;
    },
    update() {
      this.addressBook[this.currentIdx].address = this.address;
      this.addressBook[this.currentIdx].nickname = this.nickname;
      this.setAddressBook(this.addressBook);
      this.$emit('back');
    },
    remove() {
      this.addressBook.splice(this.currentIdx, 1);
      this.setAddressBook(this.addressBook);
      this.$emit('back');
    },
    add() {
      if (this.alreadyExists) {
        this.contactAddress = '';
        this.contactNickname = '';
        this.hexAddress = '';
        return;
      }
      this.addressBook.push({
        address: this.address,
        // currency: 'ETH',
        nickname: this.nickname || this.addressBook.length + 1,
        idx: this.addressBook.length
      });
      console.error('addressBook', this.addressBook);
      this.setAddressBook(this.addressBook);
      this.address = '';
      this.nickname = '';
      this.$emit('back');
      console.error('address', this.addressBook);
    }
  }
};
</script>

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
      :persistent-hint="validAddress"
      :hint="resolvedName || nametag || coin"
      :resolved-addr="resolvedAddress"
      autofocus
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
    <div v-if="editMode" class="mt-4 text-center">
      <mew-button
        :title="$t('interface.address-book.remove-addr')"
        :has-full-width="false"
        btn-size="small"
        btn-style="transparent"
        @click.native="remove"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { isEmpty, throttle } from 'lodash';
import { getAddressInfo } from '@kleros/address-tags-sdk';

import NameResolver from '@/modules/name-resolver/index';
import { toChecksumAddress, isAddress } from '@/core/helpers/addressUtils';
import { isValidCoinAddress } from '../handlers/handlerMulticoins.js';

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
      addressToAdd: '',
      nametag: ''
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('addressBook', ['addressBookStore']),
    ...mapGetters('global', ['network']),
    disabled() {
      if (this.addMode) {
        return (
          !this.addressToAdd ||
          !this.validAddress ||
          isEmpty(this.nickname) ||
          this.nickname?.length > 20 ||
          this.alreadyExists
        );
      }
      if (this.editMode) {
        return (
          this.nickname === this.item.nickname ||
          this.nickname?.length > 20 ||
          isEmpty(this.nickname)
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
          (value && value.length >= 1) ||
          this.$t('interface.address-book.validations.nickname-required'),
        value =>
          (value && value.length <= 20) ||
          this.$t('interface.address-book.validations.nickname-length')
      ];
    },
    validAddress() {
      if (this.addressToAdd.length > 94) return false;
      return this.resolvedAddr.length > 0 && !this.resolvedAddr?.includes('.')
        ? isAddress(this.resolvedAddr) ||
            isValidCoinAddress(this.resolvedAddr).valid
        : isAddress(this.lowercaseAddressToAdd) ||
            isValidCoinAddress(this.lowercaseAddressToAdd).valid ||
            isValidCoinAddress(this.addressToAdd).valid;
    },
    coin() {
      if (!this.validAddress) return '';
      return `Valid ${this.coinType} address`;
    },
    coinType() {
      return this.resolvedAddr.length > 0 && !this.resolvedAddr?.includes('.')
        ? isValidCoinAddress(this.resolvedAddr).coin
        : isValidCoinAddress(this.lowercaseAddressToAdd).coin ||
            isValidCoinAddress(this.addressToAdd).coin;
    },
    editMode() {
      return this.mode === modes[1];
    },
    addMode() {
      return this.mode === modes[0];
    },
    alreadyExists() {
      if (this.addMode) {
        return this.checkResolvedExists || this.checkAddressExists;
      }
      return false;
    },
    checkResolvedExists() {
      return Object.keys(this.addressBookStore).some(key => {
        const storedAddr = this.addressBookStore[key];
        return (
          this.resolvedAddr !== '' &&
          (storedAddr.address.toLowerCase() ===
            this.resolvedAddr?.toLowerCase() ||
            storedAddr.resolvedAddr.toLowerCase() ===
              this.resolvedAddr?.toLowerCase())
        );
      });
    },
    checkAddressExists() {
      return Object.keys(this.addressBookStore).some(key => {
        const storedAddr = this.addressBookStore[key];
        return (
          (storedAddr.resolvedAddr !== '' &&
            storedAddr.resolvedAddr?.toLowerCase() ===
              this.addressToAdd?.toLowerCase()) ||
          storedAddr.address.toLowerCase() === this.addressToAdd?.toLowerCase()
        );
      });
    },
    checksumAddressToAdd() {
      if (this.addressToAdd !== '' && isAddress(this.lowercaseAddressToAdd)) {
        return toChecksumAddress(this.lowercaseAddressToAdd);
      }
      return this.addressToAdd;
    },
    lowercaseAddressToAdd() {
      return this.addressToAdd.toLowerCase();
    },
    resolvedAddress() {
      if (this.resolvedAddr.length === 0) return '';
      return this.validAddress && !this.resolvedAddr?.includes('.')
        ? this.resolvedAddr
        : '';
    },
    resolvedName() {
      if (this.resolvedAddr.length === 0) return '';
      return this.validAddress && this.resolvedAddr?.includes('.')
        ? this.resolvedAddr
        : '';
    }
  },
  watch: {
    toAddress(newVal) {
      this.addressToAdd = newVal;
    },
    addressToAdd(newVal) {
      this.nametag = '';
      if (isAddress(newVal.toLowerCase())) {
        this.resolveAddress();
      } else {
        this.resolveName();
      }
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
      this.currentIdx = this.addressBookStore.findIndex(
        item => item.address === this.item.address
      );
    }
  },
  methods: {
    ...mapActions('addressBook', ['setAddressBook']),
    reset() {
      this.addressToAdd = '';
      this.nickname = '';
      this.resolvedAddr = '';
      this.nametag = '';
    },
    /**
     * Resolves address and @returns name
     */
    resolveAddress: throttle(async function () {
      if (this.nameResolver) {
        try {
          const resolvedName = await this.nameResolver.resolveAddress(
            this.addressToAdd
          );
          if (resolvedName && !resolvedName.name) {
            await getAddressInfo(
              this.checksumAddressToAdd,
              'https://ipfs.kleros.io'
            ).then(data => {
              this.nametag = data?.publicNameTag || '';
            });
          }
          this.resolvedAddr = resolvedName.name ? resolvedName.name : '';
        } catch (e) {
          this.nametag = '';
          this.resolvedAddr = '';
        }
      }
    }, 300),
    /**
     * Resolves name and @returns address
     */
    resolveName: throttle(async function () {
      if (this.nameResolver) {
        try {
          await this.nameResolver.resolveName(this.addressToAdd).then(addr => {
            this.resolvedAddr = addr;
          });
        } catch (e) {
          this.resolvedAddr = '';
        }
      }
    }, 500),
    setAddress(value) {
      this.addressToAdd = value ? value : '';
    },
    setNickname(value) {
      this.nickname = value;
    },
    update() {
      this.addressBookStore[this.currentIdx].address =
        this.checksumAddressToAdd;
      this.addressBookStore[this.currentIdx].coinType =
        this.coinType.toLowerCase();
      this.addressBookStore[this.currentIdx].nickname = this.nickname;
      this.setAddressBook(this.addressBookStore);
      this.$emit('back', [3]);
    },
    remove() {
      this.addressBookStore.splice(this.currentIdx, 1);
      this.setAddressBook(this.addressBookStore);
      this.reset();
      this.$emit('back', [3]);
    },
    add() {
      if (this.alreadyExists) {
        this.reset();
        return;
      }
      this.addressBookStore.push({
        address: this.checksumAddressToAdd,
        resolvedAddr: this.resolvedAddress,
        coinType: this.coinType.toLowerCase(),
        nickname: this.nickname || (this.addressBookStore.length + 1).toString()
      });
      this.setAddressBook(this.addressBookStore);
      this.reset();
      this.$emit('back', [3]);
    }
  }
};
</script>

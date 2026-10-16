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
import { debounce, isEmpty } from 'lodash';
import { getAddressInfo } from '@kleros/address-tags-sdk';

import Resolver from '@/modules/name-resolver/index';
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
      nametag: '',
      // See invalidateResolutions(): only a resolution whose generation is
      // still current may write its result back.
      resolveGeneration: 0
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
      this.invalidateResolutions();
      if (isAddress(newVal.toLowerCase())) {
        this.resolveAddress();
      } else {
        this.resolveName();
      }
    },
    web3() {
      this.invalidateResolutions();
      if (this.network.type.ensEnkryptType) {
        this.nameResolver = new Resolver(this.network);
      } else {
        this.nameResolver = null;
      }
    },
    // A chain or account change can arrive without `web3` being replaced.
    'network.type.chainID'() {
      this.invalidateResolutions();
    },
    address() {
      this.invalidateResolutions();
    }
  },
  created() {
    // Debounced per instance rather than on `methods`, which Vue would share
    // across every instance of this component along with its timer state.
    this.resolveAddress = debounce(this.resolveAddressNow, 300);
    this.resolveName = debounce(this.resolveNameNow, 500);
  },
  beforeDestroy() {
    this.invalidateResolutions();
  },
  mounted() {
    if (this.network.type.ensEnkryptType)
      this.nameResolver = new Resolver(this.network);
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
      this.invalidateResolutions();
      this.addressToAdd = '';
      this.nickname = '';
      this.resolvedAddr = '';
      this.nametag = '';
    },
    /**
     * Abandons every pending or queued resolution. Called whenever the input,
     * the network or the resolver changes so an in-flight lookup can no
     * longer write back a result for an input that has since been replaced.
     */
    invalidateResolutions() {
      this.resolveName?.cancel?.();
      this.resolveAddress?.cancel?.();
      return ++this.resolveGeneration;
    },
    /**
     * Everything a resolution must still agree with before it may write back.
     */
    resolutionContext() {
      return {
        generation: this.resolveGeneration,
        resolver: this.nameResolver,
        input: this.addressToAdd,
        chainID: this.network.type.chainID,
        account: this.address
      };
    },
    /**
     * True while the resolution started in `ctx` is still the one the user is
     * waiting on.
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
      const ctx = this.resolutionContext();
      try {
        const resolvedName = await ctx.resolver.resolveAddress(ctx.input);
        if (!this.isCurrentResolution(ctx)) return;
        if (resolvedName && !resolvedName.name) {
          const data = await getAddressInfo(
            this.checksumAddressToAdd,
            'https://ipfs.kleros.io'
          );
          if (!this.isCurrentResolution(ctx)) return;
          this.nametag = data?.publicNameTag || '';
        }
        this.resolvedAddr = resolvedName.name ? resolvedName.name : '';
      } catch (e) {
        if (!this.isCurrentResolution(ctx)) return;
        this.nametag = '';
        this.resolvedAddr = '';
      }
    },
    /**
     * Resolves name and @returns address
     * Debounced per instance in created() as `resolveName`.
     */
    async resolveNameNow() {
      if (!this.nameResolver) return;
      // Bind the lookup to the state that started it so a stalled resolver
      // cannot overwrite a corrected address.
      const ctx = this.resolutionContext();
      try {
        const addr = await ctx.resolver.resolveName(ctx.input);
        if (!this.isCurrentResolution(ctx)) return;
        this.resolvedAddr = addr;
      } catch (e) {
        if (!this.isCurrentResolution(ctx)) return;
        this.resolvedAddr = '';
      }
    },
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

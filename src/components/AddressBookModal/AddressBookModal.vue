<template>
  <div class="addr-book-modal">
    <b-modal
      ref="addressBookModal"
      :title="title"
      hide-footer
      centered
      static
      lazy
    >
      <div class="modal-contents">
        <div v-show="title === 'Add a New Contact'" class="add-new-container">
          <p class="title-header">{{ $t('interface.address-book.address') }}</p>
          <dropdown-address-selector
            :hide-copy="true"
            @toAddress="getToAddress($event)"
          />
        </div>
        <div v-show="title === 'Edit Address'" class="edit-address">
          <div class="addr-container">
            <blockie
              :address="currentAddress.address"
              width="34px"
              height="34px"
              class="blockie-image mr-3"
            />
            <div>
              <p class="title-header">
                {{ $t('interface.address-book.address') }}
              </p>
              <p class="address">{{ currentAddress.address }}</p>
            </div>
          </div>
        </div>
        <div class="nickname-container mt-3">
          <p class="title-header">
            {{ $t('interface.address-book.nickname') }}
          </p>
          <div
            :class="title === 'Edit Address' ? 'nickname-input-container' : ''"
          >
            <input
              v-model="contactNickname"
              :placeholder="$t('interface.address-book.nickname')"
              class="nickname-input mt-3 mb-3"
              type="text"
            />
            <div class="button-container">
              <button
                :class="!contactAddress || !isValidAddress ? 'disabled' : ''"
                @click="updateAddrBook()"
              >
                {{
                  title === 'Edit Address'
                    ? $t('interface.address-book.update')
                    : $t('interface.address-book.add')
                }}
              </button>
            </div>
          </div>
        </div>
        <p v-show="title === 'Edit Address'" class="remove-txt" @click="removeContact()">
          {{ $t('interface.address-book.remove-addr') }}
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Toast } from '@/helpers';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import { mapState } from 'vuex';
import Blockie from '@/components/Blockie';

export default {
  components: {
    'dropdown-address-selector': DropDownAddressSelector,
    blockie: Blockie
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    currentAddress: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      contactNickname: this.currentAddress.nickname || '',
      contactAddress: '',
      isValidAddress: false
    };
  },
  computed: {
    ...mapState(['addressBook'])
  },
  methods: {
    removeContact(idx) {
      this.addressBook.splice(this.currentAddress, 1);
      this.$store.dispatch('setAddressBook', this.addressBook);
    },
    getToAddress(obj) {
      this.contactAddress = obj.address;
      this.isValidAddress = obj.valid;
    },
    updateAddrBook(action) {
      action === 'add' ? this.addContact() : this.updateContact();
    },
    updateContact() {
      console.error('this', this.currentAddress);
    },
    addContact() {
      const alreadyExists = Object.keys(this.addressBook).some(key => {
        return this.addressBook[key].address === this.contactAddress;
      });

      if (alreadyExists) {
        Toast.responseHandler(
          new Error(this.$t('interface.address-book.already-exists')),
          Toast.ERROR
        );
        this.contactAddress = '';
        this.contactNickname = '';
        return;
      }

      this.addressBook.push({
        address: this.contactAddress,
        currency: 'ETH',
        nickname: this.contactNickname || this.addressBook.length + 1
      });

      this.$store.dispatch('setAddressBook', this.addressBook);

      this.contactAddress = '';
      this.contactNickname = '';
      this.$refs.addressBookModal.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddressBookModal.scss';
</style>

<style lang="scss">
.addr-book-modal {
  .modal-body {
    padding: 0;
  }

  .modal-content {
    overflow: visible;
  }
}
</style>

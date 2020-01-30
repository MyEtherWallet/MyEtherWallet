<template>
  <div class="addr-book-modal">
    <b-modal
      ref="addressBookModal"
      :title="$t(title)"
      hide-footer
      centered
      static
      lazy
    >
      <div class="modal-contents">
        <div
          v-show="modalAction === addressBookActions.ADD"
          class="add-new-container"
        >
          <p class="title-header">{{ $t('interface.address-book.address') }}</p>
          <div class="address-inputs">
            <blockie
              v-show="isValidAddress"
              :address="hexAddress"
              width="32px"
              height="32px"
              class="blockie-image"
            />
            <input
              v-model="contactAddress"
              v-addr-resolver="'contactAddress'"
              :class="isValidAddress ? 'blockie-input' : ''"
              :placeholder="$t('common.addr')"
              type="text"
            />
          </div>
        </div>
        <div
          v-show="modalAction === addressBookActions.EDIT"
          class="edit-address"
        >
          <div class="addr-container">
            <blockie
              :address="hexAddress"
              width="34px"
              height="34px"
              class="blockie-image mr-3"
            />
            <div>
              <p class="title-header">
                {{ $t('interface.address-book.address') }}
              </p>
              <p class="address">{{ contactAddress }}</p>
            </div>
          </div>
        </div>
        <div class="nickname-container">
          <p class="title-header">
            {{ $t('interface.address-book.nickname') }}
          </p>
          <div
            :class="
              modalAction === addressBookActions.EDIT
                ? 'nickname-input-container'
                : ''
            "
          >
            <input
              v-model="contactNickname"
              :placeholder="$t('interface.address-book.nickname')"
              class="nickname-input mt-3 mb-4"
              type="text"
            />
            <div class="button-container">
              <button
                :class="isBtnDisabled ? 'disabled' : ''"
                @click="updateAddrBook()"
              >
                {{
                  modalAction === addressBookActions.EDIT
                    ? $t('interface.address-book.update')
                    : $t('interface.address-book.add')
                }}
              </button>
            </div>
          </div>
        </div>
        <p
          v-show="modalAction === addressBookActions.EDIT"
          class="remove-txt"
          @click="removeContact()"
        >
          {{ $t('interface.address-book.remove-addr') }}
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Toast } from '@/helpers';
import { mapState, mapActions } from 'vuex';
import Blockie from '@/components/Blockie';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    modalAction: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    currentIdx: {
      type: Number,
      default: 0
    },
    selectedAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      contactNickname: '',
      contactAddress: '',
      isValidAddress: false,
      hexAddress: '',
      addressBookActions: {
        EDIT: 'edit',
        ADD: 'add'
      }
    };
  },
  computed: {
    ...mapState('main', ['addressBook']),
    isBtnDisabled() {
      if (
        this.modalAction === this.addressBookActions.EDIT &&
        this.addressBook[this.currentIdx]
      ) {
        return (
          this.contactNickname === this.addressBook[this.currentIdx].nickname
        );
      }
      return (
        !this.contactAddress || !this.isValidAddress || !this.contactNickname
      );
    }
  },
  mounted() {
    this.$refs.addressBookModal.$on('shown', () => {
      if (this.selectedAddress) {
        this.contactAddress = this.selectedAddress;
      }

      if (this.modalAction === this.addressBookActions.EDIT) {
        this.contactAddress = this.addressBook[this.currentIdx].address;
        this.contactNickname = this.addressBook[this.currentIdx].nickname;
        this.hexAddress = this.addressBook[this.currentIdx].resolverAddr;
      }
    });
  },
  methods: {
    ...mapActions('main', ['setAddressBook']),
    removeContact() {
      this.addressBook.splice(this.currentIdx, 1);
      this.setAddressBook(this.addressBook);
      this.$refs.addressBookModal.hide();
    },
    updateAddrBook() {
      this.modalAction === this.addressBookActions.EDIT
        ? this.updateContact()
        : this.addContact();
    },
    updateContact() {
      this.addressBook[this.currentIdx].nickname = this.contactNickname;

      this.setAddressBook(this.addressBook);

      Toast.responseHandler(
        this.$t('interface.address-book.success-update'),
        Toast.SUCCESS
      );

      this.contactAddress = '';
      this.contactNickname = '';
      this.hexAddress = '';
      this.$refs.addressBookModal.hide();
    },
    addContact() {
      const alreadyExists = Object.keys(this.addressBook).some(key => {
        return (
          this.addressBook[key].address.toLowerCase() ===
          this.contactAddress.toLowerCase()
        );
      });

      if (alreadyExists) {
        Toast.responseHandler(
          new Error(this.$t('interface.address-book.already-exists')),
          Toast.ERROR
        );
        this.contactAddress = '';
        this.contactNickname = '';
        this.hexAddress = '';
        return;
      }

      this.addressBook.push({
        address: this.contactAddress,
        resolverAddr: this.hexAddress,
        currency: 'ETH',
        nickname: this.contactNickname || this.addressBook.length + 1
      });

      this.setAddressBook(this.addressBook);

      this.contactAddress = '';
      this.contactNickname = '';
      this.hexAddress = '';
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

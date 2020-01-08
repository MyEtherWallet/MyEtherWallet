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
        <div
          v-show="title === addressBookActions.ADD"
          class="add-new-container"
        >
          <p class="title-header">{{ $t('interface.address-book.address') }}</p>
          <div class="address-inputs">
            <blockie
              v-show="isValidAddress"
              :address="contactAddress"
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
        <div v-show="title === addressBookActions.EDIT" class="edit-address">
          <div class="addr-container">
            <blockie
              :address="contactAddress"
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
              title === addressBookActions.EDIT
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
                  title === addressBookActions.EDIT
                    ? $t('interface.address-book.update')
                    : $t('interface.address-book.add')
                }}
              </button>
            </div>
          </div>
        </div>
        <p
          v-show="title === addressBookActions.EDIT"
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
import { mapState } from 'vuex';
import Blockie from '@/components/Blockie';

export default {
  components: {
    blockie: Blockie
  },
  props: {
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
      addressBookActions: {
        EDIT: 'Edit Address',
        ADD: 'Add a New Contact'
      }
    };
  },
  computed: {
    ...mapState(['addressBook']),
    isBtnDisabled() {
      if (
        this.title === this.addressBookActions.EDIT &&
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
  watch: {
    currentIdx() {
      if (this.title === this.addressBookActions.EDIT) {
        this.contactAddress = this.addressBook[this.currentIdx].address;
        this.contactNickname = this.addressBook[this.currentIdx].nickname;
      } else {
        this.contactAddress = '';
        this.contactNickname = '';
      }
    }
  },
  mounted() {
    this.$refs.addressBookModal.$on('shown', () => {
      if (this.selectedAddress) {
        this.contactAddress = this.selectedAddress;
      }
    });
  },
  methods: {
    removeContact() {
      this.addressBook.splice(this.currentIdx, 1);
      this.$store.dispatch('setAddressBook', this.addressBook);
      this.$refs.addressBookModal.hide();
    },
    getToAddress(obj) {
      this.contactAddress = obj.address;
      this.isValidAddress = obj.valid;
    },
    updateAddrBook() {
      this.title === this.addressBookActions.EDIT
        ? this.updateContact()
        : this.addContact();
    },
    updateContact() {
      this.addressBook[this.currentIdx].nickname = this.contactNickname;

      this.$store.dispatch('setAddressBook', this.addressBook);

      Toast.responseHandler(
        this.$t('interface.address-book.success-update'),
        Toast.SUCCESS
      );

      this.contactAddress = '';
      this.contactNickname = '';
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

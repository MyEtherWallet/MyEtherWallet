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
            :class="title === 'Edit Address' ? 'nickname-input-container' : ''"
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
                  title === 'Edit Address'
                    ? $t('interface.address-book.update')
                    : $t('interface.address-book.add')
                }}
              </button>
            </div>
          </div>
        </div>
        <p
          v-show="title === 'Edit Address'"
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
    currentIdx: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      contactNickname: '',
      contactAddress: '',
      isValidAddress: false
    };
  },
  computed: {
    ...mapState(['addressBook']),
    isBtnDisabled() {
      if (this.title === 'Edit Address') {
        return (
          this.contactNickname === this.addressBook[this.currentIdx].nickname
        );
      }
      return !this.contactAddress || !this.isValidAddress;
    }
  },
  watch: {
    currentIdx() {
      console.error('this', this.currentIdx, this.addressBook);
      if (this.title === 'Edit Address') {
        this.contactAddress = this.addressBook[this.currentIdx].address;
        this.contactNickname = this.addressBook[this.currentIdx].nickname;
      } else {
        this.contactAddress = '';
        this.contactNickname = '';
      }
    }
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
      this.title === 'Edit Address' ? this.updateContact() : this.addContact();
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

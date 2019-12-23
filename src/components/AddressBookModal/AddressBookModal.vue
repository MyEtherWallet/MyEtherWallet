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
        <span> Hello </span>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    removeContact(idx) {
      this.addressBook.splice(idx, 1);
      this.$store.dispatch('setAddressBook', this.addressBook);
      this.addrBookErrMsg = null;
    },
    addContact() {
      const alreadyExists = Object.keys(this.addressBook).some(key => {
        return this.addressBook[key].address === this.contactAddress;
      });

      if (this.addressBook.length > 9) {
        this.addrBookErrMsg = this.$t('interface.address-book.add-up-to');
        this.contactAddress = '';
        this.contactNickname = '';
        return;
      } else if (alreadyExists) {
        Toast.responseHandler(
          new Error(this.$t('interface.address-book.already-exists')),
          Toast.ERROR
        );
        this.contactAddress = '';
        this.contactNickname = '';
        return;
      }

      this.addrBookErrMsg = null;

      this.addressBook.push({
        address: this.contactAddress,
        currency: 'ETH',
        nickname: this.contactNickname || this.addressBook.length + 1
      });

      this.$store.dispatch('setAddressBook', this.addressBook);

      this.contactAddress = '';
      this.contactNickname = '';
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'AddressBookModal.scss';
</style>

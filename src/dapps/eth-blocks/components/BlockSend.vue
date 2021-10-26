<template>
  <!--
=====================================================================================
  Overlay - access using hardware
=====================================================================================
-->
  <mew-overlay
    :show-overlay="open"
    :title="title"
    :close="close"
    content-size="medium"
  >
    <div class="full-width pt-8 pt-md-0">
      <module-address-book
        ref="addressInput"
        @setAddress="setAddress"
        class="mb-4"
      />
      <mew-button
        title="Send ETH Block"
        has-full-width
        btn-size="xlarge"
        :disabled="disableSend"
        :loading="isSending"
        @click.native="sendBlock()"
      />
    </div>
  </mew-overlay>
</template>

<script>
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';

export default {
  name: 'BlockSend',
  components: {
    ModuleAddressBook
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    },
    blockNumber: {
      type: String,
      default: ''
    },
    isSending: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isValidAddress: false,
      toAddress: ''
    };
  },
  computed: {
    title() {
      return `Send ETH Block #${this.blockNumber}`;
    },
    disableSend() {
      return !this.isValidAddress || this.isSending;
    }
  },
  methods: {
    setAddress(addr, isValidAddress) {
      if (isValidAddress) {
        this.toAddress = addr;
      }
      this.isValidAddress = isValidAddress;
    },
    sendBlock() {
      if (this.isValidAddress) {
        this.$emit('send', this.toAddress);
      }
    }
  }
};
</script>

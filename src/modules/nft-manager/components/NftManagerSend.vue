<template>
  <!--
    =====================================================================================
      Nft Manager Send Component
    =====================================================================================
    -->
  <v-sheet class="d-flex align-center flex-column justify-center">
    <div
      class="cursor-pointer d-flex align-center justify-start full-width mb-4 mr-2"
    >
      <mew-button
        class="pl-0"
        btn-style="transparent"
        :title="backTxt"
        @click.native="close"
      />
    </div>
    <span class="mew-heading-2">Send Your NFT </span>
    <img
      height="150"
      :src="nft.image ? nft.image : getImageUrl(nft)"
      alt="nft image"
      @error="onImgErr"
    />
    <div class="mb-4 mt-2">{{ nft.name }}</div>
    <module-address-book @setAddress="setAddress" />
    <span
      v-if="!enoughFunds && showBalanceError"
      class="errormessage px-6 py-0 py-sm-3 mb-3 mb-sm-0"
      >You do not have enough ETH to send.
      <a
        href="https://ccswap.myetherwallet.com/#/"
        target="_blank"
        class="link"
      >
        <u>Buy More</u>
      </a>
    </span>
    <mew-button
      class="mt-1 mb-3"
      :has-full-width="false"
      :disabled="disabled || (!enoughFunds && showBalanceError)"
      title="Send"
      btn-size="large"
      color-theme="primary"
      @click.native="send(nft)"
    />
  </v-sheet>
</template>

<script>
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import nftPlaceholder from '@/assets/images/icons/icon-nft-placeholder.png';

export default {
  components: {
    ModuleAddressBook
  },
  props: {
    nft: {
      default: () => {
        return {};
      },
      type: Object
    },
    getImageUrl: {
      default: () => {
        return;
      },
      type: Function
    },
    send: {
      default: () => {
        return;
      },
      type: Function
    },
    setAddress: {
      default: () => {
        return;
      },
      type: Function
    },
    close: {
      default: () => {
        return;
      },
      type: Function
    },
    nftCategory: {
      default: '',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    },
    enoughFunds: {
      default: false,
      type: Boolean
    },
    showBalanceError: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      nftPlaceholder: nftPlaceholder
    };
  },
  computed: {
    backTxt() {
      return 'Back to ' + this.nftCategory;
    }
  },
  methods: {
    onImgErr(e) {
      e.target.src = this.nftPlaceholder;
    }
  }
};
</script>

<style scoped>
.errormessage {
  color: #ff445b;
}
</style>

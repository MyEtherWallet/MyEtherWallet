<template>
  <v-sheet class="d-flex align-center flex-column justify-center">
    <div
      class="cursor-pointer d-flex align-center justify-start full-width mb-4"
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
    />
    <div class="mb-4">{{ nft.name }}</div>
    <module-address-book @setAddress="setAddress" />
    <mew-button
      class="mt-1 mb-3"
      :has-full-width="false"
      title="Send"
      btn-size="large"
      color-theme="primary"
      @click.native="send(nft)"
    />
  </v-sheet>
</template>

<script>
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';

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
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      expandPanel: [
        {
          name: this.$t('common.details')
        }
      ]
    };
  },
  computed: {
    backTxt() {
      return 'Back to ' + this.nft.description;
    }
  }
};
</script>

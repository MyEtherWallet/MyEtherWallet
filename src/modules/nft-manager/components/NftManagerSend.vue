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
        btn-style="transparent"
        :title="backTxt"
        @click.native="close"
      />
    </div>
    <span class="mew-heading-2">Send Your NFT </span>
    <img height="150" :src="nft.image" alt="nft image" @error="onImgErr" />
    <div class="mb-4 mt-2">{{ nft.name | concatName }}</div>
    <module-address-book @setAddress="setAddress" />
    <span
      v-if="!enoughFunds && showBalanceError"
      class="redPrimary--text px-6 py-0 py-sm-3 mb-3 mb-sm-0"
      >You do not have enough {{ currencyName }} to send.
      <a
        target="_blank"
        class="link"
        @click="
          () => {
            openBuySell('NFTManagerSend');
          }
        "
      >
        <u>Buy More {{ currencyName }}</u>
      </a>
    </span>
    <mew-button
      class="mt-1 mb-3"
      :has-full-width="false"
      :disabled="!enoughFunds || disabled"
      title="Send"
      btn-size="large"
      color-theme="primary"
      @click.native="send(nft)"
    />
  </v-sheet>
</template>

<script>
import { mapGetters } from 'vuex';

import nftPlaceholder from '@/assets/images/icons/icon-nft-placeholder.png';
import buyMore from '@/core/mixins/buyMore.mixin.js';
export default {
  components: {
    ModuleAddressBook: () => import('@/modules/address-book/ModuleAddressBook')
  },
  filters: {
    concatName(val) {
      // should probably be moved globablly
      if (val.length < 11) return val;
      return `${val.substring(0, 11)}...${val.substring(
        val.length - 4,
        val.length
      )}`;
    }
  },
  mixins: [buyMore],
  props: {
    nft: {
      default: () => {
        return {};
      },
      type: Object
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
    ...mapGetters('global', ['network']),
    backTxt() {
      return 'Back to ' + this.nftCategory;
    },
    currencyName() {
      return this.network.type.currencyName;
    }
  },
  methods: {
    onImgErr(e) {
      e.target.src = this.nftPlaceholder;
    }
  }
};
</script>

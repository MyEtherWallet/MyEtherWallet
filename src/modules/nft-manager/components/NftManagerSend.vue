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
    <div class="mb-4 mt-2">{{ nft.name }}</div>
    <module-address-book @setAddress="setAddress" />
    <span
      v-if="!enoughFunds && showBalanceError"
      class="redPrimary--text px-6 py-0 py-sm-3 mb-3 mb-sm-0"
      >You do not have enough {{ currencyName }} to send.
      <a target="_blank" class="link" @click="openMoonpay">
        <u>Buy More {{ currencyName }}</u>
      </a>
    </span>
    <mew-button
      class="mt-1 mb-3"
      :has-full-width="false"
      :disabled="disabled || !enoughFunds"
      title="Send"
      btn-size="large"
      color-theme="primary"
      @click.native="send(nft)"
    />
  </v-sheet>
</template>

<script>
import nftPlaceholder from '@/assets/images/icons/icon-nft-placeholder.png';
import buyMore from '@/core/mixins/buyMore.mixin.js';
import { mapGetters } from 'vuex';
export default {
  components: {
    ModuleAddressBook: () => import('@/modules/address-book/ModuleAddressBook')
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

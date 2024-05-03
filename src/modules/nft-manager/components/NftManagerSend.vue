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
    <div class="mb-4 mt-2">{{ concatName(nft.name) }}</div>
    <module-address-book @setAddress="setAddress" />
    <span
      v-if="!enoughFunds && showBalanceError"
      class="redPrimary--text px-6 py-0 py-sm-3 mb-3 mb-sm-0"
      >You do not have enough {{ currencyName }} to send.
      <a
        v-show="network.type.canBuy"
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

<script setup>
import { defineAsyncComponent, defineProps, computed } from 'vue';

import nftPlaceholder from '@/assets/images/icons/icon-nft-placeholder.png';
import { useBuySell } from '@/core/composables/buyMore';
import { useGlobalStore } from '@/core/store/global';

const ModuleAddressBook = defineAsyncComponent(() =>
  import('@/modules/address-book/ModuleAddressBook')
);

// injections/use
const { openBuySell } = useBuySell();
const { network } = useGlobalStore();

const props = defineProps({
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
});

// computed
const backTxt = computed(() => {
  return `Back to ${props.nftCategory}`;
});

const currencyName = computed(() => {
  return network.type.currencyName;
});

// methods
const onImgErr = e => {
  e.target.src = nftPlaceholder;
};

const concatName = str => {
  // should probably be moved globablly
  if (str.length < 11) return str;
  return `${str.substring(0, 11)}...${str.substring(
    str.length - 4,
    str.length
  )}`;
};
</script>

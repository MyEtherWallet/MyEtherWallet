<template>
  <div class="dapp--eth-blocks--block-search">
    <!--
    ===================================================
      Max Block
    ===================================================
    -->
    <p class="primary--text mb-1 ml-2">Max block: {{ maxBlock }}</p>
    <date-selector-popup
      :show-popup="showDate"
      :search-date="searchByDate"
      :hide-popup="hidePopup"
    />
    <!--
    ===================================================
      Search Field
    ===================================================
    -->
    <mew-search
      is-search-block
      placeholder="Enter a block number"
      :value="searchBlock"
      :on-search="search"
      can-search-date
      :on-date-search="showDatePopup"
      :error-messages="searchErrorMessage"
      type="number"
      @input="setBlock"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed } from 'vue';
import { toBN } from 'web3-utils';
import { useRouter } from 'vue-router/composables';

import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { validBlockNumber, beginsWithZero } from '../handlers/helpers/common';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

const DateSelectorPopup = defineAsyncComponent(() =>
  import('./DateSelectorPopup.vue')
);

// injections/use
const { blockNumber } = useWalletStore();
const router = useRouter();

// data
const searchBlock = ref('');
const showDate = ref(false);

// computed
/**
 * Returns max block that can be minted
 * current block - 50
 * @returns {string}
 */
const maxBlock = computed(() => {
  const max = toBN(blockNumber ? blockNumber : 0).sub(toBN(50));
  const ZERO = toBN(0);
  return max.gt(ZERO) ? max.toNumber() : '';
});
/**
 * Returns search error messages, empty string if no error.
 * Rules: x > -1, x is integer, x != 1-10, x <= maxBloc
 * @returns{string}
 */
const searchErrorMessage = computed(() => {
  if (searchBlock.value && searchBlock.value !== '') {
    if (!validBlockNumber(searchBlock.value)) {
      return 'value must be a positive integer';
    }
    if (beginsWithZero(searchBlock.value)) {
      return 'value cannot begin with zero';
    }
    const search = toBN(searchBlock.value);
    const RESERVED = toBN(10);
    if (!search.isZero() && search.lte(RESERVED)) {
      return 'ETH Blocks 1-10 are reserved for the Ethereum founders';
    }
    const max = toBN(blockNumber).sub(toBN(50));
    if (search.gt(max)) {
      return `Block number must be smaller or equal to ${maxBlock.value}`;
    }
  }
  return '';
});
const checkExistingBlock = computed(() => {
  const search = toBN(searchBlock.value);
  const max = toBN(blockNumber).sub(toBN(50));
  return !search.gt(max);
});

// methods
const search = () => {
  if (
    searchBlock.value &&
    searchBlock.value !== '' &&
    !beginsWithZero(searchBlock.value) &&
    checkExistingBlock.value
  ) {
    try {
      router.push({
        name: ETH_BLOCKS_ROUTE.BLOCK.NAME,
        params: { blockRef: searchBlock.value }
      });
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  }
};
/**
 * Search via date
 */
const searchByDate = timeString => {
  if (timeString && timeString !== '') {
    try {
      router
        .push({
          name: ETH_BLOCKS_ROUTE.DATE_SEARCH.NAME,
          params: { dateString: timeString }
        })
        .then(hidePopup);
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  }
};
const showDatePopup = () => {
  showDate.value = true;
};
const hidePopup = () => {
  showDate.value = false;
};
/**
 * Setts serach Block, invoked by MewSearch component
 */
const setBlock = block => {
  searchBlock.value = block;
};
</script>

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

<script>
import { mapState } from 'vuex';
import { toBN } from 'web3-utils';

import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { validBlockNumber, beginsWithZero } from '../handlers/helpers/common';

export default {
  name: 'ModuleEthBlocksMint',
  components: {
    DateSelectorPopup: () => import('./DateSelectorPopup.vue')
  },
  data() {
    return {
      searchBlock: '',
      showDate: false
    };
  },
  computed: {
    /**
     * STORE STATE
     */
    ...mapState('wallet', ['blockNumber']),

    /**
     * Returns max block that can be minted
     * current block - 50
     * @returns {string}
     */
    maxBlock() {
      const max = toBN(this.blockNumber ? this.blockNumber : 0).sub(toBN(50));
      const ZERO = toBN(0);
      return max.gt(ZERO) ? max.toNumber() : '';
    },
    /**
     * Returns search error messages, empty string if no error.
     * Rules: x > -1, x is integer, x != 1-10, x <= maxBloc
     * @returns{string}
     */
    searchErrorMessage() {
      if (this.searchBlock && this.searchBlock !== '') {
        if (!validBlockNumber(this.searchBlock)) {
          return 'value must be a positive integer';
        }
        if (beginsWithZero(this.searchBlock)) {
          return 'value cannot begin with zero';
        }
        const search = toBN(this.searchBlock);
        const RESERVED = toBN(10);
        if (!search.isZero() && search.lte(RESERVED)) {
          return 'ETH Blocks 1-10 are reserved for the Ethereum founders';
        }
        const max = toBN(this.blockNumber).sub(toBN(50));
        if (search.gt(max)) {
          return `Block number must be smaller or equal to ${this.maxBlock}`;
        }
      }
      return '';
    },
    checkExistingBlock() {
      const search = toBN(this.searchBlock);
      const max = toBN(this.blockNumber).sub(toBN(50));
      return !search.gt(max);
    }
  },
  methods: {
    /**
     * Reroutes to Block Info page
     */
    search() {
      if (
        this.searchBlock &&
        this.searchBlock !== '' &&
        !beginsWithZero(this.searchBlock) &&
        this.checkExistingBlock
      ) {
        try {
          this.$router.push({
            name: ETH_BLOCKS_ROUTE.BLOCK.NAME,
            params: { blockRef: this.searchBlock }
          });
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      }
    },
    /**
     * Search via date
     */
    searchByDate(timeString) {
      if (timeString && timeString !== '') {
        try {
          this.$router
            .push({
              name: ETH_BLOCKS_ROUTE.DATE_SEARCH.NAME,
              params: { dateString: timeString }
            })
            .then(this.hidePopup);
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      }
    },
    showDatePopup() {
      this.showDate = true;
    },
    hidePopup() {
      this.showDate = false;
    },
    /**
     * Setts serach Block, invoked by MewSearch component
     */
    setBlock(block) {
      this.searchBlock = block;
    }
  }
};
</script>

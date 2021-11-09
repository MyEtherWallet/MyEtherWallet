<template>
  <div>
    <!--
    ===================================================
      Max Block
    ===================================================
    -->
    <p class="primary--text mb-1 ml-2">Max block: {{ blockNumber }}</p>
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
      :error-messages="searchErrorMessage"
      type="number"
      @input="setBlock"
    />
  </div>
</template>

<script>
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { mapState } from 'vuex';
import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { validBlockNumber } from '../handlers/helpers/common';
import { toBN } from 'web3-utils';

export default {
  name: 'ModuleEthBlocksMint',

  data() {
    return {
      searchBlock: ''
    };
  },
  computed: {
    ...mapState('wallet', ['blockNumber']),
    maxBlock() {
      const max = toBN(this.blockNumber).sub(toBN(50));
      const ZERO = toBN(0);
      return max.gt(ZERO) ? formatIntegerToString(max.toNumber()) : '';
    },
    searchErrorMessage() {
      if (this.searchBlock && this.searchBlock !== '') {
        if (!validBlockNumber(this.searchBlock)) {
          return 'value must be a positive integer';
        }
        const search = toBN(this.searchBlock);
        const RESERVED = toBN(10);
        if (!search.isZero() && search.lte(RESERVED)) {
          return 'ETH Blocks 1-10 are reserved for the Ethereum founders';
        }
        const max = toBN(this.blockNumber).sub(toBN(50));
        if (search.gt(max)) {
          return `block number must be smaller or equal to ${this.maxBlock}`;
        }
      }
      return '';
    }
  },
  methods: {
    search() {
      if (this.searchBlock && this.searchBlock !== '') {
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
    setBlock(block) {
      this.searchBlock = block;
    }
  }
};
</script>

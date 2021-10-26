<template>
  <div>
    <!--
    ===================================================
      Max Block
    ===================================================
    -->
    <p class="primary--text mb-1 ml-2">Max block: {{ maxBlock }}</p>
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
      @input="setBlock"
    />
  </div>
</template>

<script>
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { mapState } from 'vuex';
import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import BigNumber from 'bignumber.js';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
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
      return formatIntegerToString(this.blockNumber);
    },
    searchErrorMessage() {
      if (this.searchBlock && this.searchBlock !== '') {
        const block = BigNumber(this.searchBlock);
        if (!block.isInteger()) {
          return 'value must be an integer';
        }
        if (!block.gte(0)) {
          return 'block number should be a positive number';
        }
        if (block.gt(this.blockNumber)) {
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

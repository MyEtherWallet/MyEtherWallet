<template>
  <div class="dapps--eth-blocks--data-search pt-8 px-3 px-lg-12 pb-12 px-md-12">
    <block-search />
    <div class="pt-12">
      <div v-if="foundBlocks.length > 0">
        <block-result-component
          v-for="(block, idx) in foundBlocks"
          :key="block.blockNumber"
          :block-handler="block"
          :is-loading="false"
          :has-border="idx != foundBlocks.length - 1"
        />
      </div>
      <div v-else>
        <block-result-component
          v-for="(block, idx) in 3"
          :key="`loadingBlockResult` + block"
          is-loading
          :has-border="idx != 2"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { toBN } from 'web3-utils';
import EthDater from 'ethereum-block-by-date';
import moment from 'moment';
import { uniqBy } from 'lodash';
import handlerBlock from '../handlers/handlerBlock';

export default {
  name: 'ModuleEthBlocksDateSearch',
  components: {
    BlockSearch: () => import('../components/BlockSearch'),
    BlockResultComponent: () => import('../components/BlockResultComponent')
  },
  data() {
    return {
      foundBlocks: [],
      totalResult: 0
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),

    /**
     * STORE GETTERS
     */
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['blockNumber']),
    /**
     * Returns max block that can be minted
     * current block - 50
     * @returns {string}
     */
    maxBlock() {
      const max = toBN(this.blockNumber).sub(toBN(50));
      const ZERO = toBN(0);
      return max.gt(ZERO) ? max.toNumber() : 0;
    }
  },
  watch: {
    '$route.params': {
      deep: true,
      handler: function () {
        this.fetchBlocksByDate();
      }
    }
  },
  mounted() {
    this.fetchBlocksByDate();
  },
  methods: {
    // initializes the block searcher
    // loops through the result and fetch the
    // block meta before pushing to empty array
    async fetchBlocksByDate() {
      const newResultArray = [];
      this.foundBlocks = [];
      const dater = new EthDater(this.web3.eth);
      const startTimeString = this.$route.params.dateString;
      const endTimeString = startTimeString + 1000 * 60; // adds a minute to starting range
      try {
        const blocks = await dater.getEvery(
          'seconds',
          moment(startTimeString),
          moment(endTimeString),
          1,
          true
        );
        const filterBlocks = uniqBy(blocks, 'block');
        this.totalResult = filterBlocks.length;
        for (let index = 0; index < filterBlocks.length; index++) {
          if (filterBlocks[index].block <= this.maxBlock) {
            const block = new handlerBlock(
              this.web3,
              this.network,
              filterBlocks[index].block,
              this.address
            );

            newResultArray.push(
              block.getBlock().then(() => {
                return block;
              })
            );
          }
        }
        Promise.all(newResultArray).then(values => {
          this.foundBlocks = values.sort((a, b) => {
            return a.blockNumber < b.blockNumber
              ? -1
              : a.blockNumber > b.blockNumber
              ? 1
              : 0;
          });
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>

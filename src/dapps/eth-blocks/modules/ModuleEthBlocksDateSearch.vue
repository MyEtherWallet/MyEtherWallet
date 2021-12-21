<template>
  <div class="pt-8 px-12 pb-12">
    <block-search />
    <div class="pt-12">
      <div v-if="foundBlocks.length > 0">
        <block-result-component
          v-for="block in foundBlocks"
          :key="block.blockNumber"
          :block-handler="block"
          :is-loading="false"
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
import handlerBlock from '../handlers/handlerBlock';
// import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import BlockSearch from '../components/BlockSearch';
import BlockResultComponent from '../components/BlockResultComponent';

const STARTING_BLOCKS = 13078142; // testing purposes
export default {
  name: 'ModuleEthBlocksDateSearch',
  components: {
    BlockSearch,
    BlockResultComponent
  },
  data() {
    return {
      foundBlocks: []
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),

    /**
     * STORE GETTERS
     */
    ...mapGetters('global', ['network'])
  },
  mounted() {
    const newResultArray = [];
    this.foundBlocks = newResultArray;
    // testing purposes
    for (let index = 0; index < 10; index++) {
      const block = new handlerBlock(
        this.web3,
        this.network,
        STARTING_BLOCKS + index,
        this.address
      );
      block.getBlock().then(() => {
        newResultArray.push(block);
      });
    }
    this.foundBlocks = newResultArray;
  }
};
</script>

<style lang="scss" scoped></style>

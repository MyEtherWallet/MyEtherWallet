<template>
  <!--
    ===================================================
    Blocks Mint Tab
    ===================================================
    -->
  <div class="pt-10 pb-13 px-3 pa-sm-15">
    <v-sheet :max-width="step === 0 ? '680' : '100%'" class="mx-auto">
      <v-row no-gutters>
        <!--
        ===================================================
          SEARCH BAR
        ===================================================
        -->
        <v-col cols="12" order="first" order-sm="last">
          <mew-search
            is-search-block
            placeholder="Enter a block number"
            :value="searchInput"
          />
          <p class="primary--text pt-1 mb-8 mb-sm-0">
            Max block number: {{ maxBlock }}
          </p>
          <mew-button @click.native="search">Temp Search Button </mew-button>
        </v-col>
        <!--
        ===================================================
          STEP 0: show Eth Blocks overview
        ===================================================
        -->
        <v-col v-if="step === 0" cols="12">
          <mint-eth-blocks-info />
        </v-col>
      </v-row>
      <v-row v-if="step != 0" no-gutters>
        <!--
        ===================================================
          SEARCH Results
        ===================================================
        -->
        <v-col cols="12">
          <!-- <mint-loading /> -->
          <mint-search-result />
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { mapState } from 'vuex';
import MintEthBlocksInfo from '../components/mint/MintEthBlocksInfo.vue';
// import MintLoading from '../components/mint/MintLoading.vue';
import MintSearchResult from '../components/mint/MintSearchResult.vue';

export default {
  name: 'ModuleEthBlocksMint',
  components: {
    MintEthBlocksInfo,
    // MintLoading,
    MintSearchResult
  },
  data() {
    return {
      searchInput: '',
      /**
       * Step within the mint process
       * step 0 = initial view --> show ETH Blocks Descriptions (shown once)
       * step 1 = show search results
       */
      step: 0
    };
  },
  computed: {
    ...mapState('wallet', ['blockNumber']),

    maxBlock() {
      return formatIntegerToString(this.blockNumber);
    }
  },
  methods: {
    search() {
      this.step = 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.staked-status-container {
  max-width: 500px;
}
.border-container {
  border: 1px solid var(--v-selectBorder-base);
}
</style>

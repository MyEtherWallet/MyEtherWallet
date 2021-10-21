<template>
  <!--
    ===================================================
    Blocks Mint Tab
    ===================================================
    -->
  <div class="pt-10 pb-13 px-3 pa-sm-15">
    <v-sheet max-width="680" class="mx-auto">
      <v-row no-gutters>
        <!--
        ===================================================
          SEARCH BAR
        ===================================================
        -->
        <v-col cols="12" order="first" order-sm="last">
          <block-search />
        </v-col>
        <!--
        ===================================================
          STEP 0: show Eth Blocks overview
        ===================================================
        -->
        <v-col cols="12">
          <mint-eth-blocks-info />
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MintEthBlocksInfo from '../components/mint/MintEthBlocksInfo.vue';
// import MintLoading from '../components/mint/MintLoading.vue';
import BlockSearch from '../components/BlockSearch.vue';
export default {
  name: 'ModuleEthBlocksMint',
  components: {
    MintEthBlocksInfo,
    // MintLoading,
    BlockSearch
  },
  computed: {
    ...mapState('wallet', ['blockNumber'])
  }
};
</script>

<style lang="scss" scoped>
.staked-status-container {
  max-width: 500px;
}
.border-container {
  border: 2px solid var(--v-selectBorder-base);
}
</style>

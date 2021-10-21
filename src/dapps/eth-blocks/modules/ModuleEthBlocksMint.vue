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
          <!--
          ===================================================
            Eth Blocks Info:
                      ---------
                      |       |
                      |  img  |
                      |       |
                      ---------

                       Title
                     Description
          ===================================================
          -->
          <div class="text-center">
            <v-img src="../assets/eth-blocks-qrs.svg" height="129" contain />
            <div class="mt-5 mb-2 mew-heading-1">ETH Blocks</div>
            <h4 class="mb-6 textMedium--text">
              Generated a unique QR art-piecebased on your favorite block on the
              blockchain. From block 0 to the latest block, and expanding into
              the future. Let all those nosey people spying on your wallet
              collectibles wonder why you like a specific block!
            </h4>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BlockSearch from '../components/BlockSearch.vue';
export default {
  name: 'ModuleEthBlocksMint',
  components: {
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

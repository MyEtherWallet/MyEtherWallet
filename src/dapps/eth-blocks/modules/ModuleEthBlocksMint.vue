<template>
  <!--
    ===================================================
    Blocks Mint Tab
    ===================================================
    -->
  <div class="dapps--modules--module-eth-blocks-mint pt-5 pb-13 px-3 pa-sm-15">
    <v-sheet max-width="680" class="mx-auto" color="bgWalletBlock">
      <v-row no-gutters>
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
            <v-img
              src="../assets/eth-blocks-qrs.svg"
              height="129"
              contain
              class="mt-8 mt-md-0"
            />
            <div class="mt-5 mb-2 mew-heading-1">Find your ETH Block</div>
            <h4 class="mb-8 textMedium--text">
              Own the unownable. Mint your very own unique QR NFT of a specific
              block on the Ethereum blockchain. From Genesis, to the block of
              your first crypto transaction, or the block that took you to the
              moon. Forge a piece of crypto history with a MEW ETH Blocks.
            </h4>
          </div>
        </v-col>
        <!--
        ===================================================
          SEARCH BAR
        ===================================================
        -->
        <v-col cols="12" order="first" order-sm="last">
          <block-search />
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const BlockSearch = defineAsyncComponent(() =>
  import('../components/BlockSearch.vue')
);
</script>

<style lang="scss" scoped>
.staked-status-container {
  max-width: 500px;
}
.border-container {
  border: 2px solid var(--v-selectBorder-base);
}
</style>

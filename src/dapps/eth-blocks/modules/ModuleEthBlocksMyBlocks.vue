<template>
  <!--
    ===================================================
    Staked Status Tab
    ===================================================
    -->
  <div class="pt-5 pb-13 px-3 pa-sm-15">
    <!--
    ===================================================
    OverView Header
    ===================================================
    -->
    <v-row class="align-center">
      <!--
      ===================================================
        Block Count
        Order: 1st
      ===================================================
      -->
      <v-col cols="6" md="3" order="first">
        <div class="mew-heading-3 textDark--text">
          My Blocks <span>({{ totalBlocks }})</span>
        </div>
      </v-col>
      <v-spacer class="d-none d-md-flex" order="2" />
      <!--
      ===================================================
        Sort
        Order: xs-2nd, md-3rd
      ===================================================
      -->
      <v-col cols="6" md="3" order="2" order-md="4">
        <div class="d-flex align-center justify-end">
          <div class="d-none d-sm-block textLight--text mew-caption mr-5">
            sort by
          </div>
          <mew-button btn-style="light" btn-size="medium">Newest</mew-button>
          <mew-button btn-style="transparent" btn-size="medium">123</mew-button>
        </div>
      </v-col>
      <!--
      ===================================================
        Search Blocks
      ===================================================
      -->
      <v-col cols="12" md="3" order="3">
        <mew-search placeholder="Find my block" is-compact />
      </v-col>
      <!--
      ===================================================
        Alert: No Blocks Owned
      ===================================================
      -->
      <v-col v-if="!hasBlocks" cols="12" class="mt-10 mb-13 mb-md-16 pb-md-16">
        <mew-alert
          title="You do not have any ETH Blocks"
          description="If you recently minted or purchased an ETH Block, please wait until the transaction has been minted and come back. If you haven’t minted one, what are you waiting for? Mint a block!"
          theme="info"
          has-white-background
          hide-close-icon
        />
      </v-col>
    </v-row>
    <!--
    ===================================================
      Owned Blocks
    ===================================================
    -->
    <v-row v-if="hasBlocks" class="align-top justify-center">
      <v-col v-for="i in 23" :key="i" cols="9" sm="6" md="3">
        <div
          class="border-container px-5 pt-5 pb-8"
          @click="routeTo('130567789')"
        >
          <v-img src="../assets/temp-block.svg" contain />
          <div class="my-2 mew-heading-2 textDark--text">
            Block #13,0567,789
          </div>
        </div>
      </v-col>
    </v-row>
    <!--
    ===================================================
    Loading
    ===================================================
    -->
    <!-- <div v-if="loading">
      <v-skeleton-loader width="150px" type="list-item" />
      <v-skeleton-loader
        v-for="idx in 3"
        :key="idx"
        class="mb-4"
        height="100px"
        type="image"
      />
    </div> -->
  </div>
</template>

<script>
import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  name: 'ModuleEthBlocksMyBlocks',
  props: {},
  data() {
    return {
      hasBlocks: true,
      totalBlocks: 12
    };
  },
  computed: {},
  methods: {
    routeTo(block) {
      try {
        this.$router.push({
          name: ETH_BLOCKS_ROUTE.BLOCK.NAME,
          params: { blockRef: block }
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.border-container {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 12px;
}
</style>

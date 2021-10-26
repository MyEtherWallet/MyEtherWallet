<template>
  <!--
    ===================================================
    My Blocks Tab
    ===================================================
    -->
  <div class="pt-5 pb-13 px-3 pa-sm-15">
    <!--
    ===================================================
    Loading
    ===================================================
    -->
    <div v-if="loading">
      <blocks-loading />
    </div>
    <!--
    ===================================================
    Overview Header
    ===================================================
    -->
    <v-row v-else class="align-center justify-start">
      <!--
      ===================================================
        Block Count
        Order: 1st
      ===================================================
      -->
      <v-col cols="12" md="3">
        <div class="mew-heading-3 textDark--text">
          My Blocks <span>({{ handlerMyBlocks.totalBlocks }})</span>
        </div>
      </v-col>
      <v-spacer class="d-none d-md-flex" order="2" />
      <!--
      ===================================================
        Search Blocks
      ===================================================
      -->
      <v-col cols="12" md="3">
        <mew-search placeholder="Find my block" is-compact />
      </v-col>
      <!--
      ===================================================
        Sort
        Order: xs-2nd, md-3rd
      ===================================================
      -->
      <v-col cols="12" md="3">
        <v-row class="d-flex align-center">
          <!-- <div
            class="d-block white-space--nowrap textLight--text mew-caption pl-3"
          >
            sort by
          </div> -->
          <v-col class="pl-2">
            <blocks-sort @setSort="setActiveSort" />
          </v-col>
        </v-row>
      </v-col>

      <!--
      ===================================================
        Alert: No Blocks Owned
      ===================================================
      -->
      <v-col
        v-if="!hasBlocks"
        cols="12"
        order="last"
        class="mt-10 mb-13 mb-md-16 pb-md-16"
      >
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
    <v-row v-if="hasBlocks" class="align-top justify-start">
      <v-col v-for="block in blocks" :key="block.block" cols="9" sm="6" md="3">
        <div
          class="border-container px-5 pt-5 pb-8"
          @click="routeTo('block.block')"
        >
          <v-img :src="block.image" lazy-src="../assets/temp-block.svg" contain>
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <div class="my-2 mew-heading-2 textDark--text">
            Block #{{ formatBlockNumber(block.block) }}
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BlocksLoading from '../components/BlocksLoading.vue';
import BlocksSort from '../components/BlocksSort.vue';
import HandlerMyBlocks from '../handlers/handlerMyBlocks';
import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { mapState, mapGetters } from 'vuex';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';

export default {
  name: 'ModuleEthBlocksMyBlocks',
  components: { BlocksLoading, BlocksSort },
  data() {
    return {
      handlerMyBlocks: {},
      activeSort: 0
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('global', ['network', 'isTestNetwork']),
    /**
     * @returns {boolean}:
     * if HandelrMyBlocks.loading equals false,  returns false, otherwise returns true
     */
    loading() {
      return this.handlerMyBlocks && this.handlerMyBlocks.loading === false
        ? false
        : true;
    },
    blocks() {
      if (!this.loading) {
        switch (this.activeSort) {
          case 0:
            return this.handlerMyBlocks.blocks.newest;
          case 1:
            return this.handlerMyBlocks.blocks.oldest;
          case 2:
            return this.handlerMyBlocks.blocks.ascend;
          case 3:
            return this.handlerMyBlocks.blocks.dscend;
          default:
            return this.handlerMyBlocks.blocks.newest;
        }

        // if (this.activeSort === ) {
        //   return this.isReverseSort
        //     ? this.handlerMyBlocks.blocks.newest
        //     : this.handlerMyBlocks.blocks.oldest;
        // }
        // return this.isReverseSort
        //   ? this.handlerMyBlocks.blocks.ascend
        //   : this.handlerMyBlocks.blocks.dscend;
      }
      return [];
    },
    hasBlocks() {
      return this.handlerMyBlocks.totalBlocks > 0;
    }
  },
  mounted() {
    /**
     * Initiate My Blocks Handler
     */
    this.handlerMyBlocks = new HandlerMyBlocks(
      this.web3,
      this.network,
      this.address
    );
    this.handlerMyBlocks.getBlocks();
  },
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
    },
    formatBlockNumber(block) {
      return formatIntegerToString(block);
    },
    setActiveSort(value) {
      this.activeSort = value;
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

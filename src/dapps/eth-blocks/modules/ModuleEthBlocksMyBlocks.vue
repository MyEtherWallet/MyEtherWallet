<template>
  <!--
    ===================================================
    My Blocks Tab
    ===================================================
    -->
  <div class="pt-5 pb-13 px-3 px-sm-15 pb-sm-15 pt-md-8">
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
      <v-col cols="12" md="3" class="pt-0">
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
      <v-col cols="12" md="3" class="pt-0">
        <mew-search
          placeholder="Find my block"
          is-compact
          :value="filterBlock"
          :error-messages="filterErrorMessage"
          @input="setFilter"
        />
      </v-col>
      <!--
      ===================================================
        Sort
        Order: xs-2nd, md-3rd
      ===================================================
      -->
      <v-col cols="12" md="3" class="pt-0">
        <blocks-sort @setSort="setActiveSort" />
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
    <v-row
      v-if="hasBlocks"
      class="align-top justify-center justify-sm-start mt-5 mt-md-0"
    >
      <v-col
        v-for="block in blocks"
        :key="block.blockNumber"
        cols="9"
        sm="6"
        md="3"
      >
        <div
          class="border-container px-5 pt-5 pb-8 fill-height"
          @click="routeTo(block.blockNumber)"
        >
          <v-img
            :src="block.image"
            lazy-src="../assets/loading-block.svg"
            contain
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="disabledPrimary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <div class="my-2 mew-heading-2 textDark--text">
            Block #{{ formatBlockNumber(block.blockNumber) }}
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
import { validBlockNumber } from '../handlers/helpers/common';

export default {
  name: 'ModuleEthBlocksMyBlocks',
  components: { BlocksLoading, BlocksSort },
  data() {
    return {
      handlerMyBlocks: {},
      activeSort: 0,
      filterBlock: ''
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
            return this.filter(this.handlerMyBlocks.blocks.newest);
          case 1:
            return this.filter(this.handlerMyBlocks.blocks.oldest);
          case 2:
            return this.filter(this.handlerMyBlocks.blocks.ascend);
          case 3:
            return this.filter(this.handlerMyBlocks.blocks.dscend);
          default:
            return this.fitler(this.handlerMyBlocks.blocks.newest);
        }
      }
      return [];
    },
    hasBlocks() {
      return this.handlerMyBlocks.totalBlocks > 0;
    },
    /**
     * Property returns an error message based onthe filter input
     * @returns {string}
     */
    filterErrorMessage() {
      if (this.filterBlock && this.filterBlock !== '') {
        if (!validBlockNumber(this.filterBlock)) {
          return 'value must be a positive  integer';
        }
        if (!this.handlerMyBlocks.checkHasBlock(this.filterBlock)) {
          return `You do not own block #${this.filterBlock}`;
        }
      }
      return '';
    }
  },
  watch: {
    network(newVal) {
      if (newVal) {
        this.handlerMyBlocks.setNetwork(newVal);
        this.handlerMyBlocks.getBlocks();
      }
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
    },
    /**
     * Methods sets this.filterBlock based on the use input in search block component
     * @param {any}
     * If value is undefined or null sets filter block to empry string
     */
    setFilter(block) {
      if (block) {
        this.filterBlock = block;
      } else {
        this.filterBlock = '';
      }
    },
    /**
     * Methods filters array based on the search input provided by user
     * @param {Array} blocks
     * @return {Array}
     */
    filter(blocks) {
      if (this.filterBlock !== '' && this.filterErrorMessage === '') {
        return blocks.filter(value =>
          value.blockNumber
            .toString()
            .toLowerCase()
            .includes(this.filterBlock.toLowerCase())
        );
      }
      return blocks;
    }
  }
};
</script>

<style lang="scss" scoped>
.border-container {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 12px;
  cursor: pointer;
}
</style>

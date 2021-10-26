<template>
  <!--
    ===================================================
    Blocks Mint Tab
    ===================================================
    -->
  <v-container class="px-3 pb-13 pt-5 px-md-16 pb-md-15 pt-md-15">
    <!--
        ===================================================
          Block Search or BlockInfo
        ===================================================
        -->
    <block-search v-if="hasSearch" class="mb-8 mb-md-5" />
    <router-link
      v-else
      :to="{ name: ROUTES.MY_BLOCKS.NAME }"
      class="blue500--text"
    >
      <v-row class="align-center mt-3 mt-md-3 mb-7 mb-md-8" no-gutters>
        <v-icon class="bluePrimary--text" size="20"> mdi-chevron-left</v-icon>
        <div>Back to all My blocks</div>
      </v-row>
    </router-link>

    <v-row
      v-if="!loading"
      no-gutters
      class="justify-center mb-2 d-flex d-md-none align-center"
    >
      <div class="border-container d-block pa-1 mx-auto">
        <v-img
          src="../assets/loading-block.svg"
          :max-width="$vuetify.breakpoint.xs ? '160' : '240'"
          class="pointer-image"
          contain
        />
      </div>
    </v-row>
    <v-row v-if="!loading" no-gutters class="justify-center">
      <!--
        ===================================================
          NFT Image

          NOTE: ADD magnifying glass and link out to view full image src
        ===================================================
        -->
      <div class="d-block">
        <a
          :href="handlerBlock.rawImg"
          target="_blank"
          class="border-container d-none d-md-flex pa-1 mr-md-11 cursor-image"
        >
          <v-img
            lazy-src="../assets/loading-block.svg"
            :src="handlerBlock.img"
            max-width="332"
            contain
          />
        </a>
      </div>

      <v-col>
        <!--
        ===================================================
          NFT Title
        ===================================================
        -->
        <h2 class="mb-4 mb-md-8 text-center text-md-left">
          Block #{{ blockNumberFormatted }}
        </h2>
        <!--
        ===================================================
          Block Info Alert component
        ===================================================
        -->
        <block-info-alert
          :block-alert="alert"
          :owner="alertOwner"
          :price="alertMintPrice"
          :disable-mint="isMinting"
          :disable-send="isSending"
          @mint="mintBlock"
          @openSend="openSendBlockOverlay"
        />
        <!--
        ===================================================
          Block Description
        ===================================================
        -->
        <div class="border-container mt-4 mt-md-5 pa-5">
          <div class="mb-2 textMedium--text">
            {{ handlerBlock.description }}
          </div>
          <a
            v-if="!isTestNetwork"
            href="https://www.ethvm.com/address/0x64bbde373e909501de1309231336761adeaa07d5"
            target="_blank"
          >
            View block #{{ blockRef }} info on EthVM
          </a>
        </div>
      </v-col>
      <!--
      ===================================================
        NFT Properties
        XS12
      ===================================================
      -->
      <v-col cols="12" class="mt-4 mt-md-11">
        <div class="table-properties">
          <div
            class="
              table-properties--header
              py-3
              px-5
              textLight--text
              mew-caption
            "
          >
            properties
          </div>
          <div
            v-for="(item, index) in properties"
            :key="index"
            :class="[
              { 'table-properties--row-colored': isEven(index) },
              { 'table-properties--last-row': index + 1 === properties.length },
              'd-flex flex-row justify-space-between py-3 px-5 textDark--text '
            ]"
          >
            <div>{{ item.text }}</div>
            <div class="monospace">{{ item.value }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
    <blocks-loading v-else />
    <block-send
      :open="openSendOverlay"
      :close="closeSendOverlay"
      :block-number="blockNumberFormatted"
      :is-sending="isSending"
      @send="sendBlock"
    />
  </v-container>
</template>

<script>
import BlockInfoAlert from '../components/BlockInfoAlert.vue';
import BlockSearch from '../components/BlockSearch.vue';
import BlockSend from '../components/BlockSend.vue';
import BlocksLoading from '../components/BlocksLoading.vue';
import handlerBlock from '../handlers/handlerBlock';
import { BLOCK_ALERT } from '../handlers/helpers/blockAlertType';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'ModuleEthBlockInfo',
  components: {
    BlockInfoAlert,
    BlockSearch,
    BlocksLoading,
    BlockSend
  },
  props: {
    blockRef: {
      type: String,
      required: true
    },
    hasSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      handlerBlock: {},
      ROUTES: ETH_BLOCKS_ROUTE,
      openSendOverlay: false
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('global', ['network', 'isTestNetwork']),
    /**
     * @returns {string}:
     * formatted string of the block number
     */
    blockNumberFormatted() {
      return formatIntegerToString(this.blockRef);
    },
    /**
     * @returns {boolean}:
     * if HandelrBlockInfo.loading equals false,  returns false, otherwise returns true
     */
    loading() {
      return this.handlerBlock && this.handlerBlock.loading === false
        ? false
        : true;
    },
    /**
     * @returns allert type based on the owner of the block:
     * - null -> available
     * - adrees === wallet address -> owned
     * - address !== wallet address -> not available
     */
    alert() {
      if (!this.loading && this.handlerBlock.hasOwner) {
        return this.address === this.handlerBlock.owner
          ? BLOCK_ALERT.OWNED
          : BLOCK_ALERT.NOT_AVAILABLE;
      }
      return BLOCK_ALERT.AVAILABLE;
    },
    alertOwner() {
      return this.loading ? '' : this.handlerBlock.owner;
    },
    alertMintPrice() {
      return this.loading ? '' : this.handlerBlock.mintPrice;
    },

    /**
     * @returns array of block properties
     */
    properties() {
      if (!this.loading) {
        const author = `${this.handlerBlock.author.substr(
          0,
          6
        )}...${this.handlerBlock.author.substr(
          this.handlerBlock.author.length - 4,
          4
        )}`;
        return [
          { text: 'Number', value: this.blockNumberFormatted },
          { text: 'Date Created', value: this.handlerBlock.date },
          { text: 'Author', value: author },
          {
            text: 'Transactions',
            value: formatIntegerToString(this.handlerBlock.transactions)
          },
          {
            text: 'Gas Used',
            value: formatIntegerToString(this.handlerBlock.gasUsed)
          },
          {
            text: 'Uncles',
            value: formatIntegerToString(this.handlerBlock.transactions)
          }
        ];
      }
      return [];
    },
    /**
     * @returns {boolean}:
     */
    isMinting() {
      return this.loading ? false : this.handlerBlock.isMinting;
    },
    /**
     * @returns {boolean}:
     */
    isSending() {
      return this.loading ? false : this.handlerBlock.isSending;
    }
  },
  watch: {
    /**
     * Update HandelrBlockInfo on block number change and fetch data
     */
    blockRef(newVal) {
      this.handlerBlock.setBlockNumber(newVal);
      this.handlerBlock.getBlock();
    }
  },
  mounted() {
    /**
     * Initiate Block Info Handler
     */
    this.handlerBlock = new handlerBlock(
      this.web3,
      this.network,
      this.blockRef,
      this.address
    );
    this.handlerBlock.getBlock();
  },

  methods: {
    /**
     * Method returns whether or no number is even.
     * Used in table component, to determine row color
     * @param {number} _value
     * @returns {boolean}
     */
    isEven(_value) {
      return _value % 2 == 0;
    },
    /**
     * Method mints a blocks.
     * Responds, to child Alert component on emit 'mint' event
     */
    mintBlock() {
      this.handlerBlock.mintBlock();
    },

    /**
     * Method opens send overlay .
     * Responds, to child Alert component on emit 'openSend' event
     */
    openSendBlockOverlay() {
      this.openSendOverlay = true;
    },
    /**
     * Method closes send overlay .
     * Responds, to child Alert component on emit 'close' event
     */
    closeSendOverlay() {
      this.openSendOverlay = false;
    },
    /**
     * Method sends EthBlock .
     * Responds, to child Alert component on emit 'send' event
     * @param {string} value - to address
     */
    sendBlock(value) {
      this.handlerBlock.transferBlock(value);
    }
  }
};
</script>

<style lang="scss" scoped>
.border-container {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 12px;
}

.table-properties {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 10px;
  .table-properties--header {
    background-color: var(--v-backgroundWallet-base);
    border-radius: 10px 10px 0% 0%;
  }
  .table-properties--row-colored {
    background-color: var(--v-backgroundGrey-base);
  }
  .table-properties--last-row {
    border-radius: 0% 0% 10px 10px;
  }
}
.cursor-image {
  cursor: -moz-zoom-in;
  cursor: -webkit-zoom-in;
  cursor: zoom-in;
}
</style>

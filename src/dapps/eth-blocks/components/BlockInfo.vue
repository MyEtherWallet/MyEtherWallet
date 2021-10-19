<template>
  <!--
    ===================================================
    Blocks Mint Tab
    ===================================================
    -->
  <div>
    <v-row no-gutters class="justify-center mb-2 d-flex d-md-none align-center">
      <div class="border-container d-block pa-1 mx-auto">
        <v-img
          src="../assets/temp-block.svg"
          :max-width="$vuetify.breakpoint.xs ? '160' : '240'"
          contain
        />
      </div>
    </v-row>
    <v-row no-gutters class="justify-center">
      <!--
        ===================================================
          NFT Image

          NOTE: ADD magnifying glass and link out to view full image src
        ===================================================
        -->
      <div class="d-block">
        <div class="border-container d-none d-md-flex pa-1 mr-md-11">
          <v-img src="../assets/temp-block.svg" max-width="332" contain />
        </div>
      </div>

      <v-col>
        <!--
        ===================================================
          NFT Title
        ===================================================
        -->
        <h2 class="mb-4 mb-md-8 text-center text-md-left">Block #500,000</h2>
        <!--
        ===================================================
          Block Info Alert component
        ===================================================
        -->
        <block-info-alert :block-alert="alert" />
        <!--
        ===================================================
          Block Description
        ===================================================
        -->
        <div class="border-container mt-4 mt-md-5 pa-5">
          <div class="mb-2 textMedium--text">
            Completed on 7/31/2017, this iconic piece of history included 2
            transactions. Note the use of 92,721 in gas. With a size of 962
            bytes, this immutable piece will look fantastic next to a statue.
          </div>
          <a
            href="https://www.ethvm.com/address/0x64bbde373e909501de1309231336761adeaa07d5"
            target="_blank"
          >
            View block #500,000 info on EthVM
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
  </div>
</template>

<script>
import BlockInfoAlert from './BlockInfoAlert.vue';
import { blockAlert } from '../handlers/helpers/blockAlertType';
export default {
  name: 'BlockInfo',
  components: {
    BlockInfoAlert
  },
  props: {
    // properties: {
    //   default: () => [],
    //   type: Array
    // }
  },
  data() {
    return {
      /**
       *  !!!!!!Must be a PROP, just a temp here
       */
      properties: [
        { text: 'Date Created', value: '7/31/2019' },
        { text: 'Number', value: '134,234,935' },
        { text: 'Transactions', value: '1,459' },
        { text: 'Uncles', value: '0' },
        { text: 'Gas Used', value: '92,754 Gwei' },
        { text: 'Size', value: '965 bytes' }
      ],
      alert: blockAlert.OWNED
    };
  },
  methods: {
    isEven(_value) {
      return _value % 2 == 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.staked-status-container {
  max-width: 500px;
}
.border-container {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 12px;
}
.search-success {
  border: 1px solid var(--v-greenMedium-base);
  border-radius: 10px;
  .search-success--header {
    background-color: var(--v-backgroundOverlay-base);
    border-radius: 10px 10px 0% 0%;
  }
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
</style>

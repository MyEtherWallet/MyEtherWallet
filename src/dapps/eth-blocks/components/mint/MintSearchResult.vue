<template>
  <!--
    ===================================================
    Blocks Mint Tab
    ===================================================
    -->
  <div>
    <v-row no-gutter class="justify-center">
      <!--
        ===================================================
          Block title
          Visible only on XS
        ===================================================
        -->
      <v-col cols="12" class="d-sm-none">
        <h2 class="mb-4">Block #500,000</h2>
      </v-col>
      <!--
        ===================================================
          NFT Image
        ===================================================
        -->
      <div class="border-container pa-1">
        <v-img
          src="../../assets/temp-block.svg"
          :max-width="$vuetify.breakpoint.mdAndUp ? '430' : '280'"
          contain
        />
      </div>
      <!--
      ===================================================
        Block Title + Message
      ===================================================
      -->
      <v-col>
        <h2 class="mb-4 mb-md-8 d-none d-sm-flex">Block #500,000</h2>
        <!--
        ===================================================
          Success Message
        ===================================================
        -->
        <div class="search-success">
          <div
            class="
              d-flex
              flex-row
              search-success--header
              align-center
              justify-start
              pa-4
            "
          >
            <v-icon class="greenPrimary--text mr-1" size="16"
              >mdi-check-circle</v-icon
            >
            <p class="font-weight-bold greenPrimary--text mb-0">
              This block is available
            </p>
          </div>
          <div class="d-flex flex-column flex-md-row px-7 py-5 align-md-center">
            <div class="mr-sm-7">
              <h2>0.05 ETH</h2>
              <p class="textLight--text mb-5 mb-md-0">$180.42</p>
            </div>
            <mew-button btn-size="xlarge" title="Mint Block" />
          </div>
        </div>
      </v-col>
      <!--
      ===================================================
        NFT Properties
        XS12
      ===================================================
      -->
      <v-col cols="12">
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
              'd-flex flex-row justify-space-between py-3 px-5'
            ]"
          >
            <div>{{ item.text }}</div>
            <div>{{ item.value }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'MintESearchResult',
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
      ]
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

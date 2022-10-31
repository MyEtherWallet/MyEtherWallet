<template>
  <div class="mew-component--moon-pay">
    <div class="mb-2">
      <div
        class="d-flex align-center textDark--text mb-10 cursor--pointer"
        @click="$emit('close')"
      >
        <v-icon color="textDark">mdi-arrow-left mr-4</v-icon>
        <div class="mew-heading-2 textDark--text mt-1">Select Token</div>
      </div>
      <mew-select
        class="mt-1"
        label="Network"
        is-custom
        :items="fetchedNetworks"
      />
      <mew-search
        placeholder="Search"
        is-search-block
        is-filled
        persistent-hint
      />
      <div
        v-for="(currency, i) in currencyItems"
        :key="i"
        class="currencyList d-flex align-center justify-space-between mt-4"
        @click="setCurrency(currency)"
      >
        <div class="d-flex align-center">
          <mew-token-container
            size="small"
            :img="currency.img"
            class="tokenHugger"
          />
          <div class="ml-3">
            <span class="mew-heading-3 textDark--text">{{
              currency.symbol
            }}</span>
            <span class="basic--text"> - {{ currency.subtext }}</span>
          </div>
        </div>
        <div class="ml-10">
          <span class="basic--text">{{ currency.price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ModuleNetworkSelect',
  components: {},
  props: {
    currencyItems: {
      type: Array,
      default: () => []
    },
    fetchedNetworks: {
      type: Array,
      default: () => []
    },
    // selectedCurrency: {
    //   type: Object,
    //   default: () => {}
    // },
    setCurrency: {
      type: Function,
      default: () => {}
    }
  },
  // data() {
  //   return {
  //     defaultNetwork: {
  //       name: 'Ethereum Mainnet',
  //       value: 'ETH',
  //       // eslint-disable-next-line
  //       img: require(`@/assets/images/currencies/eth.png`)
  //     }
  //   };
  // },
  computed: {},
  mounted() {},
  method: {}
};
</script>

<style lang="scss" scoped>
.currencyList:hover {
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
  background: #f8f9fb79;
}
.tokenHugger {
  width: 80px;
  height: 80px;
}
</style>

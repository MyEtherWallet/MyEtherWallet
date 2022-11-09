<template>
  <!-- ============================================================== -->
  <!-- Token select popup -->
  <!-- ============================================================== -->
  <div
    class="currency-select white moon-pay-token-select"
    :class="open ? 'open' : ''"
  >
    <div class="py-8">
      <div class="px-5 d-flex align-center">
        <v-btn icon @click.native="close">
          <v-icon color="textDark">mdi-arrow-left</v-icon>
        </v-btn>
        <div class="ml-4 mew-heading-2 textDark--text">Select Token</div>
      </div>
      <div class="px-8 mt-8">
        <mew-select
          v-model="selectedNetwork"
          :items="fetchedNetworks"
          label="Select Network"
          class="mt-1"
          is-custom
        />
        <v-text-field
          class="mt-3"
          outlined
          label="Search tokens"
          prepend-inner-icon="mdi-magnify"
          hide-details
        ></v-text-field>

        <div class="mt-5">
          <div v-for="token in currencyItems" :key="token.name">
            <v-btn
              v-if="token.name"
              width="100%"
              text
              dpressed
              class="d-flex align-center py-6"
              @click.native="setCurrency(token)"
            >
              <mew-token-container size="30px" :img="token.img" />
              <div class="mew-heading-3 textDark--text ml-4">
                {{ token.name }}
              </div>
              <div class="textDark--text ml-3">- {{ token.subtext }}</div>
              <div class="textDark--text ml-auto">{{ token.price }}</div>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import get from 'lodash/get';

export default {
  name: 'MoonpayTokenSelect',
  props: {
    currencyItems: {
      type: Array,
      default: () => []
    },
    setCurrency: {
      type: Function,
      default: () => {}
    },
    fetchedNetworks: {
      type: Array,
      default: () => []
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedNetwork: this.fetchedNetworks
      // selectItems: [],
      // search: ''
    };
  },
  computed: {},
  watch: {
    selectedNetwork: {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.selectedNetwork = newVal;
          this.callSetNetwork(this.selectedNetwork);
        }
      }
    }
    // search: {
    //   handler: function (newVal, oldVal) {
    //     if (newVal !== oldVal) {
    //       this.selectItems = this.items;
    //     } else {
    //       const foundItems = this.items.reduce((foundTokens, item) => {
    //         const searchValue = String(newVal).toLowerCase();
    //         const value = String(get(item, 'value', '')).toLowerCase();
    //         const name = String(get(item, 'name', '')).toLowerCase();
    //         const subtext = String(get(item, 'subtext', '')).toLowerCase();
    //         if (
    //           name === searchValue ||
    //           subtext === searchValue ||
    //           value === searchValue
    //         ) {
    //           foundTokens.unshift(item);
    //         } else if (
    //           name.includes(searchValue) ||
    //           subtext.includes(searchValue) ||
    //           value.includes(searchValue)
    //         ) {
    //           foundTokens.push(item);
    //         }
    //         return foundTokens;
    //       }, []);
    //       this.selectItems = foundItems;
    //     }
    //   }
    // }
  },
  methods: {
    callSetNetwork(network) {
      this.$emit('newNetwork', network);
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.moon-pay-token-select {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0%;
  width: 100%;
  overflow: hidden;
  transition: height 0.25s ease;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  &.open {
    height: 100%;
  }
}
</style>

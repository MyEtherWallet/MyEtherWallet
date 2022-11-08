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
        <v-btn icon @click="close">
          <v-icon color="textDark">mdi-arrow-left</v-icon>
        </v-btn>
        <div class="ml-4 mew-heading-2 textDark--text">Select Token</div>
      </div>
      <div class="px-8 mt-8">
        <mew-select
          label="Network"
          :items="currencyItems"
          :value="selectedCurrency"
          is-custom
        />
        <v-text-field
          class="mt-n3"
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
export default {
  name: 'ModuleBuyEth',
  props: {
    currencyItems: {
      type: Array,
      default: () => []
    },
    selectedCurrency: {
      type: Object,
      default: () => {}
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
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

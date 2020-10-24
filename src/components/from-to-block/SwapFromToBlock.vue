<template>
  <div class="position--relative superPrimary border-radius--5px">
    <div
      class="d-flex flex-column flex-lg-row align-center justify-space-around"
    >
      <div class="text-center px-10 py-6">
        <img
          src="@/assets/images/currencies/icon-eth-blue.svg"
          alt="Eth"
          height="40"
        />

        <div class="d-flex align-center justify-center mt-1">
          <div
            class="text-uppercase monospace text-overflow--ellipsis font-weight-medium"
            style="max-width: 80px"
          >
            {{ from }}
          </div>
          <div class="searchText--text ml-1 text-uppercase font-weight-medium">
            ETH
          </div>
        </div>
      </div>

      <div class="d-flex align-center justify-center">
        <div class="right-arrow d-flex align-center justify-center">
          <v-icon class="d-none d-lg-block searchText--text">
            mdi-arrow-right-thick
          </v-icon>
          <v-icon class="d-block d-lg-none searchText--text">
            mdi-arrow-down-thick
          </v-icon>
        </div>
      </div>

      <div class="text-center px-10 py-6">
        <img
          src="@/assets/images/currencies/icon-eth-blue.svg"
          alt="Eth"
          height="40"
        />

        <div class="d-flex align-center justify-center mt-1">
          <div
            class="text-uppercase monospace text-overflow--ellipsis font-weight-medium"
            style="max-width: 80px"
          >
            {{ to }}
          </div>
          <div class="searchText--text ml-1 text-uppercase font-weight-medium">
            XMR
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    from: { default: '', type: String },
    to: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.right-arrow {
  background-color: var(--v-mewBg-base);
  border-radius: 100%;
  height: 40px;
  width: 40px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div class="mew-component--side-info-token-value">
    <mew6-white-sheet :sideinfo="!mobile" class="px-7 py-5">
      <div class="mew-heading-2">My token value</div>
      <h5 class="font-weight-bold mt-2">$3,212.23</h5>
      <div class="d-flex align-center justify-space-between mt-3">
        <img
          v-for="(i, k) in 6"
          :key="k"
          src="@/assets/images/currencies/btc.png"
          alt="Token1"
          height="30"
        />
        <div
          class="more-tokens d-flex align-center justify-center primary--text font-weight-bold"
        >
          +12
        </div>
      </div>
    </mew6-white-sheet>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.more-tokens {
  border-radius: 100%;
  border: 1px dotted var(--v-primary-base);
  height: 30px;
  width: 30px;
  font-size: 11px;
}
</style>

<template>
  <mew6-flexible-btn
    small
    :to="{ name: 'AccessWalletBrowserExtention', query: {} }"
  >
    <div class="d-flex align-center justify-space-between">
      <div class="pr-9">
        <div class="d-flex align-center mb-2">
          <h4 class="mr-2 font-weight-bold">Browser Extention</h4>
          <mew6-icon-secure />
        </div>
        <div>
          Use Browser Extention to access my wallet
        </div>
      </div>
      <div>
        <img
          height="80"
          src="@/assets/images/icons/icon-mew-cx.png"
          alt="MEW extention"
        />
      </div>
    </div>
  </mew6-flexible-btn>
</template>

<script>
export default {
  components: {},
  data: () => ({}),
  methods: {
    openOverlay(name) {
      this.$store.commit('openOverlay', name);
    }
  }
};
</script>

<style lang="scss" scoped></style>

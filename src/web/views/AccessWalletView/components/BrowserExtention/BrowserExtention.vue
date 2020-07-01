<template>
  <div>
    <mew-super-button
      class="mb-1"
      color-theme="basic"
      title="Browser Extention"
      subtitle="Use Browser Extention to access my wallet"
      :right-icon="require('@/assets/images/icons/icon-mew-cx.png')"
      :title-icon="require('@/assets/images/icons/icon-mew-cx.png')"
    />

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
  </div>
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

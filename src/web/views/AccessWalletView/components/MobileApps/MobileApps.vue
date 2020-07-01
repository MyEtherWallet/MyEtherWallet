<template>
  <div>
    <mew-super-button
      class="mb-1"
      color-theme="basic"
      title="Mobile Apps"
      subtitle="WalletConnect, Wallet Link"
      :right-icon="require('@/assets/images/icons/icon-wallet-connect.svg')"
      :title-icon="require('@/assets/images/icons/icon-mew-cx.png')"
    />
    <mew6-flexible-btn
      small
      :to="{ name: 'AccessWalletMobileApps', query: {} }"
    >
      <div class="d-flex align-center justify-space-between">
        <div class="pr-9">
          <div class="d-flex align-center mb-2">
            <h4 class="mr-2 font-weight-bold">Mobile Apps</h4>
            <mew6-icon-secure />
          </div>
          <div>
            WalletConnect, Wallet Link
          </div>
        </div>
        <div class="d-flex align-center my-4">
          <img
            height="55"
            src="@/assets/images/icons/icon-wallet-connect.svg"
            alt="Wallet Connect"
            class="mr-3"
          />
          <img
            height="45"
            src="@/assets/images/icons/icon-wallet-link.png"
            alt="Wallet Link"
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

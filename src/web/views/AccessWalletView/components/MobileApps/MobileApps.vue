<template>
  <router-link
    :to="{ name: 'AccessWalletMobileApps', query: {} }"
    class="display--block"
  >
    <mew-super-button
      color-theme="basic"
      title="Mobile Apps"
      subtitle="WalletConnect, Wallet Link"
      icon-type="img"
      :right-icon="require('@/assets/images/icons/icon-wallet-connect.svg')"
      :right-icon2="require('@/assets/images/icons/icon-wallet-link.png')"
      title-icon="mdi-shield-check"
    />
  </router-link>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>

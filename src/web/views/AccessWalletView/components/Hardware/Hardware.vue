<template>
  <router-link
    :to="{ name: 'AccessWalletHardwareWallets', query: {} }"
    class="display--block"
  >
    <mew-super-button
      color-theme="basic"
      title="Hardware wallets"
      subtitle="Ledge, Trezor, Keep key, FINNEY, BitBox, Secalot"
      icon-type="img"
      :right-icon="require('@/assets/images/icons/icon-hardware-wallet.png')"
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

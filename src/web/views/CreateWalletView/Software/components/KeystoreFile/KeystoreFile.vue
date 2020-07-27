<template>
  <router-link
    :to="{ name: 'HomeCreateWalletKeystore', query: { step: '1' } }"
    class="display--block"
  >
    <mew-super-button
      color-theme="basic"
      title="Keystore File"
      subtitle="Keystore file contains all the sensitive information of your wallet.
            We don't recommand using this method to create your wallet."
      icon-type="img"
      :right-icon="require('@/assets/images/icons/icon-keystore-file.svg')"
    />
  </router-link>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>

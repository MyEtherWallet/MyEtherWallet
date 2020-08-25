<template>
  <router-link
    :to="{ name: 'HomeCreateWalletMnemonic', query: { step: '1' } }"
    class="display--block"
  >
    <mew-super-button
      class="mb-1"
      color-theme="basic"
      title="Mnemonic phrase"
      subtitle="Mnemonic Phrase can be lost or stolen by someone else. We don't
            recommand using this method to create your wallet."
      icon-type="img"
      :right-icon="require('@/assets/images/icons/icon-mnemonic.svg')"
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

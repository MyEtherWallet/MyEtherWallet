<template>
  <router-link
    :to="{ name: 'HomeCreateWalletSoftware', query: {} }"
    class="display--block"
  >
    <mew-super-button
      color-theme="outline"
      title="Software"
      subtitle="Keystore files, Mnemonic phrase, Private key"
      icon-type="img"
      title-icon="mdi-alert"
      note="NOT RECOMMANDED"
    />
  </router-link>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>

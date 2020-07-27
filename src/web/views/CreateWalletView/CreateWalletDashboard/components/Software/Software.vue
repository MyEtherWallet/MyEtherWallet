<template>
  <router-link :to="{ name: 'HomeCreateWalletSoftware', query: {} }">
    <mew-super-button
      color-theme="outline"
      title="Software"
      subtitle="Keystore files / Mnemonic phrase is highly sensitive information, and
          they should only be used in offline settings by experienced users."
      title-icon="mdi-alert"
      title-icon-class="warning--text text--darken-1"
      note="NOT RECOMMANDED"
      title-icon-type="mdi"
    />
  </router-link>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>

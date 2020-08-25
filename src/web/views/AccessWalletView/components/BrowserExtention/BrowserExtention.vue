<template>
  <router-link
    :to="{ name: 'AccessWalletBrowserExtention', query: {} }"
    class="display--block"
  >
    <mew-super-button
      color-theme="basic"
      title="Browser Extention"
      subtitle="Use Browser Extention to access my wallet"
      icon-type="img"
      :right-icon="require('@/assets/images/icons/icon-mew-cx.png')"
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

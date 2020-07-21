<template>
  <a
    href="https://www.mewwallet.com/"
    target="_blank"
    class="display--block text-decoration--none"
  >
    <mew-super-button
      class="mew-wallet-btn"
      color-theme="basic"
      title="Get MEWwallet"
      subtitle="MEW Brings a hardware wallet style security to your iOS or Android
            smartphone, helping you to secure your funds as never before."
      title-icon="mdi-shield-check"
      title-icon-type="mdi"
      right-icon-type="img"
      title-icon-class="primary--text"
    >
      <template v-slot:rightSlot>
        <img
          class="mew-wallet-img"
          :src="require('@/assets/images/snippets/bg-mew-wallet.png')"
        />
      </template>
    </mew-super-button>
  </a>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>
<style lang="scss" scoped>
.mew-wallet-btn {
  img {
    height: 140px;
    position: absolute;
    bottom: 0;
  }
}
</style>

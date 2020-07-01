<template>
  <div>
    <mew-super-button
      class="mb-1"
      color-theme="outline"
      title="Software"
      subtitle="Keystore files, Mnemonic phrase, Private key"
      :title-icon="require('@/assets/images/icons/icon-mew-cx.png')"
    />
    <mew6-flexible-btn
      :to="{ name: 'HomeCreateWalletSoftware', query: {} }"
      class="position--relative"
      outlined
      medium
    >
      <h6 class="orange--text corner-text font-weight-bold">NOT RECOMMANDED</h6>
      <div class="pr-9">
        <div class="d-flex align-center mb-2">
          <h4 class="mr-2 font-weight-bold white--text">Software</h4>
          <mew6-icon-warning />
        </div>
        <div class="white--text">
          Keystore files, Mnemonic phrase, Private key
        </div>
      </div>
    </mew6-flexible-btn>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.corner-text {
  position: absolute;
  top: 20px;
  right: 25px;
}
</style>

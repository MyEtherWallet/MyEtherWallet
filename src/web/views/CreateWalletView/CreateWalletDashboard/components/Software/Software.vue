<template>
  <mew6-flexible-btn
    :to="{ name: 'HomeCreateWalletKeystore', query: { step: '1' } }"
    class="position--relative"
    outlined
  >
    <h6 class="orange--text corner-text font-weight-bold">NOT RECOMMANDED</h6>
    <div class="pr-9">
      <div class="d-flex align-center mb-2">
        <h4 class="mr-2 font-weight-bold white--text">Software</h4>
        <mew6-icon-warning />
      </div>
      <div class="white--text">
        Keystore files / Mnemonic phrase is highly sensitive information, and
        they should only be used in offline settings by experienced users.
      </div>
    </div>
  </mew6-flexible-btn>
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

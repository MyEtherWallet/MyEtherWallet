<template>
  <SuperButton
    class="position--relative"
    outlined
    :to="{ name: 'HomeCreateWalletMewConnect', query: { step: '1' } }"
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
  </SuperButton>
</template>

<script>
import SuperButton from '@/web/components/Buttons/SuperButton';
export default {
  components: { SuperButton },
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

<template>
  <div class="accept-terms">
    <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
      <input
        type="checkbox"
        @click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled" >
      <span class="checkmark"/>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'AcceptTermsChecker.scss';
</style>

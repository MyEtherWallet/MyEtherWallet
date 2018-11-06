<template>
  <div class="accept-terms">
    <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
      <input
        type="checkbox"
        @click="allowAccess" >
      <span class="checkmark"/>
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grantAccess: false
    };
  },
  methods: {
    allowAccess() {
      this.grantAccess = !this.grantAccess;
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AcceptTermsChecker.scss';
</style>

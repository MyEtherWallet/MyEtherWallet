<template>
  <div class="support">
    <router-link to="/">
      <div class="support-content">
        <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
        <div class="support-label"><h5>{{ $t("common.customerSupport") }}</h5></div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
</style>

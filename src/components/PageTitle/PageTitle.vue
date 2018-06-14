<template>
  <div class="page-title">
    <div class="wrap">
      <div class="page-container">
        <div class="page-title">
          <h2>{{ $t("reused.createWallet") }}</h2>
          <h5>{{ $t("pageTitle.alreadyHave") }} <router-link to="/">{{ $t("reused.unlockWallet") }}</router-link></h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "PageTitle.scss";
</style>

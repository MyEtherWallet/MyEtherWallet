<template>
  <div class="page-footer">
    <div class="wrap">
      <div class="page-container">
        <p>{{ $t("pageFooter.title")}} <router-link to="/">{{ $t("reused.faqs")}}</router-link></p>
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
  @import "PageFooter.scss";
</style>

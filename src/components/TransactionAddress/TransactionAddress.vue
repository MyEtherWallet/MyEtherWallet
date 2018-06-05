<template>
  <div class="transaction-address">
    <div class="wrap">

      <div class="info-block address">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/avatar.svg">
        </div>
        <div class="block-content">
          <h2>{{ $t("reused.address")}}</h2>
          <p class="address">0xe5cD582F564991F83bE7A5b3ba<br>742cb4ff5c6FE2</p>
          <p class="bottom-button">Print <i class="fa fa-chevron-right" aria-hidden="true"></i></p>
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
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionAddress.scss";
</style>

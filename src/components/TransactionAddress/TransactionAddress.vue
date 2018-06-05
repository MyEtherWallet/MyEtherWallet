<template>
  <div class="transaction-address">
    <div class="wrap">

      <div class="info-block address">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/avatar.svg">
        </div>
        <div class="block-content">
          <h2>{{ $t("txAddress.title")}}</h2>
          <p class="address">0xe5cD582F564991F83bE7A5b3ba<br>742cb4ff5c6FE2</p>
          <div class="icon-container">
            <b-btn v-b-tooltip.hover title="I'm a tooltip!" class="custom-tooltip">
              <img src="~@/assets/images/icons/printer-white.svg">
            </b-btn>
            <b-btn v-b-tooltip.hover title="I'm a tooltip!" class="custom-tooltip">
              <img src="~@/assets/images/icons/copy.svg">
            </b-btn>
            <b-btn v-b-tooltip.hover title="I'm a tooltip!" class="custom-tooltip">
              <img src="~@/assets/images/icons/change.svg">
            </b-btn>
          </div>
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

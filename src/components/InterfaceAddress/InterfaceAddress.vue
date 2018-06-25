<template>
  <div class="transaction-address">
    <div class="wrap">

      <div class="info-block address">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/avatar.svg">
        </div>
        <div class="block-content">
          <h2>{{ $t("reused.address")}}</h2>
          <p class="address">{{address}}</p>
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
  props: ['address']
}
</script>

<style lang="scss" scoped>
  @import "InterfaceAddress.scss";
</style>

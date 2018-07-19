<template>
  <div class="interface-address">
    <div class="info-block address">
      <div class="block-image">
         <blockie :address="address" width="64px" height="64px"/>
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
</template>

<script>
import Blockie from '@/components/Blockie'
export default {
  props: ['address'],
  components: {
    'blockie': Blockie
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceAddress.scss";
</style>

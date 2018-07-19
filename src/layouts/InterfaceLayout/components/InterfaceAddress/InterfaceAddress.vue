<template>
  <div class="interface-address">
    <div class="info-block address">
      <div class="block-image">
         <blockie :address="address" width="64px" height="64px"/>
         <input ref="copyAddress" class="hidden-input" :value="address"/>
      </div>
      <div class="block-content">
        <h2>{{ $t("reused.address")}}</h2>
        <p class="address">{{address}}</p>
        <div class="icon-container">
          <b-btn v-b-tooltip.hover title="Print" class="custom-tooltip">
            <img src="~@/assets/images/icons/printer-white.svg">
          </b-btn>
          <b-btn v-b-tooltip.hover title="Copy" class="custom-tooltip" @click="copy">
            <img src="~@/assets/images/icons/copy.svg">
          </b-btn>
          <b-btn v-b-tooltip.hover title="Switch Address" class="custom-tooltip">
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
  },
  methods: {
    copy () {
      this.$refs.copyAddress.select()
      document.execCommand('copy')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceAddress.scss";
</style>

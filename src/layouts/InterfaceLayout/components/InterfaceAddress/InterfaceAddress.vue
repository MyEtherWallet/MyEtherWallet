<template>
  <div class="interface-address">
    <div class="info-block address">
      <div class="block-image">
         <blockie :address="address" width="64px" height="64px"/>
         <input ref="copyAddress" class="hidden-input" :value="address" autocomplete="off"/>
      </div>
      <div class="block-content">
        <div class="information-container">
          <h2>{{ $t("common.address") }}</h2>
          <p class="address">{{address}}</p>
        </div>
        <div class="icon-container">
          <b-btn class="custom-tooltip" id="print">
            <img src="~@/assets/images/icons/printer-white.svg">
          </b-btn>
          <b-btn class="custom-tooltip" @click="copy" id="copy">
            <img src="~@/assets/images/icons/copy.svg">
          </b-btn>
          <b-btn class="custom-tooltip" id="switch">
            <img src="~@/assets/images/icons/change.svg">
          </b-btn>
          <b-popover target="print" placement="top" triggers="hover" title="" :content="$t('popover.print')"></b-popover>
          <b-popover target="copy" placement="top" triggers="hover" title="" :content="$t('popover.copy')"></b-popover>
          <b-popover target="switch" placement="top" triggers="hover" title="" :content="$t('popover.switchAddress')"></b-popover>
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

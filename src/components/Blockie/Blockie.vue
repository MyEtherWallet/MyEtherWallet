<template lang="html">
  <div class="address-blockie" :style="`background-image: url(${addr});`">
  </div>
</template>

<script>
export default {
  props: ['addr'],
  mounted: function () {
    console.log(this.addr)
  }
}
</script>

<style lang="scss" scoped>
  @import "Blockie.scss";
</style>

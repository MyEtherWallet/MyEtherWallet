<template lang="html">
  <div class="content-title">
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import "InterfaceContainerTitle.scss";
</style>

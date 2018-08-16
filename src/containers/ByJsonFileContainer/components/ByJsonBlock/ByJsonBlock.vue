<template>
  <div class="content-block">
    <div class="icon-block">
      <img class="icon" :src="img"/>
    </div>
    <div class="text-block">
      <h6>{{title}}</h6>
      <p>{{desc}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['img', 'title', 'desc'],
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "ByJsonBlock.scss";
</style>

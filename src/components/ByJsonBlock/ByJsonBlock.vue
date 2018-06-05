<template>
  <div>
    <img class="icon" :src="img"/>
    <h6>{{title}}</h6>
    <p>{{desc}}</p>
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

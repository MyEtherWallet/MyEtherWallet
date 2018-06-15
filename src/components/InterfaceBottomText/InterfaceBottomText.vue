<template>
  <div class="bottom-text">
    <p>{{ question }} <a :href="link" target="_blank">{{ linkText }}</a></p>
  </div>
</template>

<script>
export default {
  props: ['link', 'linkText', 'question'],
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceBottomText.scss";
</style>

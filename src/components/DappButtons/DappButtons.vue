<template>
  <div @click.prevent="switcher">
    <div class="dapps-button">
      <img :src="icon">
      <h4>{{ title }}</h4>
      <p>{{ desc }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'desc', 'icon'],
  methods: {
    switcher () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "DappButtons.scss";
</style>

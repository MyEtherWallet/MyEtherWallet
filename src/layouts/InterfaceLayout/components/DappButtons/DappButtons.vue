<template>
  <div @click.prevent="switcher">
    <div class="dapps-button">
      <img 
        :src="icon" 
        class="icon-block">
      <div class="text-contents">
        <h4>{{ title }}</h4>
        <p>{{ desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    switcher() {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DappButtons-desktop.scss';
@import 'DappButtons-tablet.scss';
@import 'DappButtons-mobile.scss';
</style>

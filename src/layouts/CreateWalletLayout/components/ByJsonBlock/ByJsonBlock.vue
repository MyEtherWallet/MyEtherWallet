<template>
  <div class="content-block">
    <div class="icon-block"><img :src="img" class="icon" /></div>
    <div class="text-block">
      <h6>{{ title }}</h6>
      <p>{{ desc }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'ByJsonBlock-desktop.scss';
@import 'ByJsonBlock-tablet.scss';
@import 'ByJsonBlock-mobile.scss';
</style>

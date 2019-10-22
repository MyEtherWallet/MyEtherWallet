<template functional>
  <div class="content-block">
    <div class="icon-block"><img :src="props.img" class="icon" alt /></div>
    <div class="text-block">
      <h6>{{ props.title }}</h6>
      <p>{{ props.desc }}</p>
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
  }
};
</script>

<style lang="scss" scoped>
@import 'ByJsonBlock-desktop.scss';
@import 'ByJsonBlock-tablet.scss';
@import 'ByJsonBlock-mobile.scss';
</style>

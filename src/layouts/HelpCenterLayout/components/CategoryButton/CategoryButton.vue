<template>
  <div class="category-button">
    <div class="wrap">
      <div class="button-icon">
        <img :src="content.icon">
      </div>
      <div class="button-title">
        {{ content.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
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
@import 'CategoryButton.scss';
</style>

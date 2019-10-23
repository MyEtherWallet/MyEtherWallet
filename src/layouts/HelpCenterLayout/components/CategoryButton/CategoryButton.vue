<template functional>
  <div class="category-button">
    <div class="wrap">
      <div class="button-icon"><img :src="props.content.icon" alt /></div>
      <div class="button-title">{{ props.content.title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: function() {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CategoryButton.scss';
</style>

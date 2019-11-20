<template functional>
  <div class="flex--row--align-center content-block-title">
    <h4>{{ props.title }}</h4>
    <div class="margin--left--auto">
      <p>{{ props.buttonText }}</p>
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
    buttonText: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ContentBlockTitle.scss';
</style>

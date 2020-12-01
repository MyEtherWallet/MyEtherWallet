<template functional>
  <div class="flex--row--align-center content-block-title">
    <h4 class="mr-2">{{ props.title }}</h4>
    <p>{{ props.buttonText }}</p>
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

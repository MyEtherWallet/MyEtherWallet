<template functional>
  <div class="bottom-text">
    <p>
      {{ props.question }}
      <a :href="props.link" target="_blank" rel="noopener noreferrer">{{
        props.linkText
      }}</a>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: ''
    },
    linkText: {
      type: String,
      default: ''
    },
    question: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceBottomText.scss';
</style>

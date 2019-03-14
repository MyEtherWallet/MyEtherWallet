<template>
  <div class="bottom-text">
    <p>
      {{ question }}
      <a :href="link" target="_blank" rel="noopener noreferrer">{{
        linkText
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
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceBottomText.scss';
</style>

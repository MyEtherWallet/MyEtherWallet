<template>
  <div class="flex--row--align-center content-block-title">
    <h4>{{ title }}</h4>
    <div class="margin--left--auto">
      <p>{{ buttonText }}</p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },

  computed: {},
  watch: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import 'ContentBlockTitle.scss';
</style>

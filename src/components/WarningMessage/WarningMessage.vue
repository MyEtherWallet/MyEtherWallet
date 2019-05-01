<template>
  <div class="warning-message">
    <div class="left">⚠️</div>
    <div class="right">
      <p class="title">{{ options.title }}</p>
      <p class="message">{{ options.message }}</p>
      <div v-if="options.link.url" class="link">
        > Read:
        <a :href="options.link.url" target="_blank">{{ options.link.text }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {}
    }
  },
  data() {
    return {
      expanded: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'WarningMessage.scss';
</style>

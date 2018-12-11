<template>
  <div class="round-button">
    <button>{{ title }}</button>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'RoundButton.scss';
</style>

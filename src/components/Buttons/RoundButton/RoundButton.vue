<template functional>
  <div class="round-button">
    <button>{{ props.title }}</button>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: function () {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'RoundButton.scss';
</style>

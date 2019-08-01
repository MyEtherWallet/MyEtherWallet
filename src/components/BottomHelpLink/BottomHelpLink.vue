<template lang="html">
  <div class="Bottom-help-link">
    <div v-if="type == 'issues'" class="issues">
      Having issues?
      <a href="https://kb.myetherwallet.com/" target="_blank">Help Center</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'issues'
    }
  },
  data() {
    return {
      // Create a random string for each popover instance
      popOverId: 'popoverid' + String(Math.floor(Math.random() * 100000000))
    };
  }
};
</script>

<style lang="scss" scoped>
@import './BottomHelpLink';
</style>

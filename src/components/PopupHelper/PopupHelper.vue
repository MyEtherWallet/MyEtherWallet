<template lang="html">
  <div class="popup-helper">
    <img class="question" src="~@/assets/images/icons/question.png" />
    <div class="helper-box">
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    boxstyle: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    image: {
      type: Object,
      default: function() {
        return;
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import './PopupHelper.scss';
</style>

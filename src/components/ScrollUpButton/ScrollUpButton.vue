<template>
  <div class="scroll-up-button">
    <div 
      class="button-block" 
      @click="scrollToTop">
      <img src="~@/assets/images/icons/up.svg">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    scrollToTop: function() {
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ScrollUpButton.scss';
</style>

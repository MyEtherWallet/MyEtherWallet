<template>
  <div class="scroll-up-button">
    <div class="button-block" @click="scrollToTop">
      <img src="~@/assets/images/icons/arrow.png" alt />
    </div>
  </div>
</template>

<script>
import Misc from '@/helpers/misc';

export default {
  data() {
    return {};
  },
  methods: {
    scrollToTop: function() {
      Misc.scrollToTop(600);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ScrollUpButton.scss';
</style>

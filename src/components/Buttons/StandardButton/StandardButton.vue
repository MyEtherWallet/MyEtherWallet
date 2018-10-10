<template>
  <div 
    :class="options.fullWidth ? 'full-width' : ''" 
    class="standard-button">
     
    <div :class="buttonClass">
      <div
        class="the-button">{{ options.title }}
        <img 
          v-if="options.loadingIcon"
          class="loading-left" 
          src="@/assets/images/icons/loading.png">

        <img 
          v-if="options.rightArrow && options.buttonStyle == 'green'"
          class="arrow-right" 
          src="@/assets/images/icons/arrow-right.svg">

        <img 
          v-if="options.rightArrow && options.buttonStyle == 'green-border'"
          class="arrow-right" 
          src="@/assets/images/icons/arrow-right.svg">

        <img 
          v-if="options.leftArrow && options.buttonStyle == 'green'" 
          class="arrow-left" 
          src="@/assets/images/icons/arrow-left.svg">

        <img 
          v-if="options.leftArrow && options.buttonStyle == 'green-border'" 
          class="arrow-left" 
          src="@/assets/images/icons/arrow-green-left.svg">
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    buttonClass() {
      switch (this.options.buttonStyle) {
        case 'white':
          return 'standard-button__white';
        case 'white-border':
          return 'standard-button__white-border';
        case 'grey':
          return 'standard-button__grey';
        case 'grey-border':
          return 'standard-button__grey-border';
        case 'green':
          return 'standard-button__green';
        case 'green-border':
          return 'standard-button__green-border';
        case 'green-noclick':
          return 'standard-button__green-noclick';
        case 'blue':
          return 'standard-button__blue';
        case 'blue-border':
          return 'standard-button__blue-border';
        default:
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StandardButton.scss';
</style>

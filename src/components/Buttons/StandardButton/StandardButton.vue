<template>
  <div 
    :class="options.fullWidth ? 'full-width' : ''" 
    class="standard-button">
     
    <div :class="buttonClass">
      <div         
        class="the-button">{{ options.title }}
        <img 
          v-if="options.rightArrow" 
          src="@/assets/images/icons/right-arrow.png">
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
        case 'green':
          return 'standard-button__green';
        case 'green-border':
          return 'standard-button__green-border';
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

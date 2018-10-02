<template>
  <div class="green-button">
     
    <div :class="buttonClass">
      <div 
        :class="fullwidth == 'true' ? 'full-width' : ''" 
        class="the-button">{{ buttontext }}
        <img 
          v-if="rightarrow == 'true'" 
          src="@/assets/images/icons/right-arrow.png">
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    buttontext: {
      type: String,
      default: ''
    },
    rightarrow: {
      type: String,
      default: ''
    },
    fullwidth: {
      type: String,
      default: ''
    },
    buttonstyle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
    buttonClass() {
      switch (this.buttonstyle) {
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

<template>
  <div
    v-show="show"
    :class="fullWidth ? 'full-width' : ''"
    class="standard-button"
    @click="buttonClicked">

    <div :class="buttonClass">
      <div
        class="the-button">
        <slot>{{ title }}</slot>
        <img
          v-if="loadingIcon"
          class="loading-left"
          src="@/assets/images/icons/loading.png">

        <img
          v-if="rightArrow && buttonStyle === 'green'"
          class="arrow-right"
          src="@/assets/images/icons/arrow-right.svg">

        <img
          v-if="rightArrow && buttonStyle === 'green-border'"
          class="arrow-right"
          src="@/assets/images/icons/arrow-right.svg">

        <img
          v-if="leftArrow && buttonStyle === 'green'"
          class="arrow-left"
          src="@/assets/images/icons/arrow-left.svg">

        <img
          v-if="leftArrow && buttonStyle === 'green-border'"
          class="arrow-left"
          src="@/assets/images/icons/arrow-green-left.svg">
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'button'
    },
    show: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    buttonStyle: {
      type: String,
      default: 'standard-button__green'
    },
    fullWidth: {
      type: Boolean,
      default: true
    },
    loadingIcon: {
      type: Boolean,
      default: false
    },
    rightArrow: {
      type: Boolean,
      default: false
    },
    leftArrow: {
      type: Boolean,
      default: false
    },
    mobileBottom: {
      type: Boolean,
      default: false
    },
    noMinWidth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    isThisMobileBottomButton() {
      return this.mobileBottom;
    },
    buttonClass() {
      if (this.disabled) return 'standard-button__grey';
      switch (this.buttonStyle) {
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
          return 'standard-button__green';
      }
    }
  },
  methods: {
    buttonClicked() {
      if (!this.disabled) {
        this.$emit('click');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StandardButton.scss';
</style>

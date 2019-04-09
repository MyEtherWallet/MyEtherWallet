<template>
  <div
    v-b-popover.hover.top="tooltipMsg"
    :class="disabled ? 'inactive' : ''"
    @click="disabled ? () => {} : select(name)"
    @mouseover="isHovered = true"
    @mouseout="isHovered = false"
  >
    <div :class="[selected ? 'selected' : '', 'wallet-option-container']">
      <div class="img-title-container">
        <img
          :src="(isHovered || selected) && !disabled ? hoverIcon : regularIcon"
          class="icon"
        />
        <div class="title-link-container">
          <span>{{ text }}</span>
          <a v-show="link !== ''" :href="link" target="_blank" @click.stop>
            Buy Now >
          </a>
        </div>
      </div>
      <i
        v-show="selected"
        class="fa fa-check-circle good-button"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    select: {
      type: Function,
      default: () => {}
    },
    selected: {
      type: Boolean,
      default: false
    },
    regularIcon: {
      type: String,
      default: ''
    },
    hoverIcon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tooltipMsg: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isHovered: false
    };
  }
};
</script>
<style lang="scss" scoped>
@import 'WalletOption.scss';
</style>

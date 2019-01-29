<template>
  <div
    @click="select(name)"
    @mouseover="isHovered = true"
    @mouseout="isHovered = false"
  >
    <div :class="[selected ? 'selected' : '', 'wallet-option-container']">
      <div>
        <img
          :src="isHovered || selected ? hoverIcon : regularIcon"
          class="icon"
        />
        <span>{{ text }}</span>
      </div>
      <i
        :class="[selected ? '' : 'not-good', 'fa fa-check-circle good-button']"
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

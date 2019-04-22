<template>
  <div
    v-b-popover.hover.top="tooltipMsg"
    @click="select(name)"
    @mouseover="isHovered = true"
    @mouseout="isHovered = false"
  >
    <div
      :class="[
        selected ? 'selected' : '',
        'wallet-option-container',
        link !== '' ? 'has-link' : ''
      ]"
    >
      <div class="img-title-container">
        <img :src="hoverIcon" class="icon" />
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
    selected: {
      type: Boolean,
      default: false
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
  },
  methods: {
    select(name) {
      this.$emit('updateSelected', name);
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'WalletOption.scss';
</style>

<template>
  <div
    :class="hidebottomborder ? 'hide-bottom-border' : ''"
    class="expending-option"
  >
    <div class="title-bar-container">
      <div class="input-title">{{ title }}</div>
      <!-- Rounded switch -->
      <div class="switch sliding-switch-white">
        <label class="switch">
          <input type="checkbox" @click="expanded = !expanded" />
          <span class="slider round" />
        </label>
      </div>
    </div>

    <div :class="expanded ? 'expanded' : ''" class="contnet-container">
      <div class="content-block"><slot></slot></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    hidebottomborder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expanded: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'ExpendingOption.scss';
</style>

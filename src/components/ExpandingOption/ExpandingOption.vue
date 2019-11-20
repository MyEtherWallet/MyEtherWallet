<template>
  <div
    :class="hidebottomborder ? 'hide-bottom-border' : ''"
    class="expanding-option"
  >
    <div class="title-bar-container">
      <div class="input-title">{{ title }}</div>
      <div v-if="buttonText !== ''" class="button-text">{{ buttonText }}</div>
      <!-- Rounded switch -->
      <div class="switch sliding-switch-white">
        <label class="switch">
          <input type="checkbox" @click="optionExpanded" />
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
    buttonText: {
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
  },
  methods: {
    optionExpanded() {
      this.expanded = !this.expanded;
      this.$emit('expanded', this.expanded);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExpandingOption.scss';
</style>

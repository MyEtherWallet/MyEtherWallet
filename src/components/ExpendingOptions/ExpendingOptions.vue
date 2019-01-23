<template>
  <div class="expending-options">
    <div :class="nobottomborder ? 'no-bottom-border' : ''" class="wrap">
      <div class="header-block">
        <p class="title">{{ title }}</p>
        <!-- Rounded switch -->
        <div class="sliding-switch-white">
          <label class="switch">
            <input type="checkbox" @click="expended = !expended" />
            <span class="slider round" />
          </label>
        </div>
      </div>
      <div :class="expended ? 'expend' : ''" class="content-container">
        <div class="content"><slot /></div>
      </div>
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
    nobottomborder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expended: false
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'ExpendingOptions.scss';
</style>

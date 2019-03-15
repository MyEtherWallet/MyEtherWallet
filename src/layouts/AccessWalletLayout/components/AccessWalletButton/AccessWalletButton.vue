<template>
  <button
    :class="[disabled ? 'disabled' : '', 'button-block', classname]"
    @click="func"
  >
    <div class="button-image">
      <img :src="disabled ? imgDisabled : img" class="icon" />
    </div>
    <h3>{{ title }}</h3>
    <p class="desc">{{ desc }}</p>
    <p :v-if="recommend !== ''" class="small-note">{{ recommend }}</p>
  </button>
</template>

<script>
export default {
  props: {
    func: {
      type: Function,
      default: function() {}
    },
    img: {
      type: String,
      default: ''
    },
    imgDisabled: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    recommend: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: true
    },
    classname: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'AccessWalletButton.scss';
</style>

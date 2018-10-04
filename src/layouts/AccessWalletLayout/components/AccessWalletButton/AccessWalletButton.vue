<template>
  <div
    :class="[!disabled ? 'disabled': '','button-block']"
    @click="func">
    <div class="button-image">
      <img
        :src="img"
        class="icon">
    </div>
    <h3>{{ title }}</h3>
    <p class="desc">{{ desc }}</p>
    <p
      :v-if="recommend !== ''"
      class="small-note">{{ recommend }}</p>
    <div class="tooltip-box">
      <span>
        <b-btn
          v-b-tooltip.hover
          :title="tooltip">
          <i
            class="fa fa-question-circle-o"
            aria-hidden="true"/>
        </b-btn>
      </span>
    </div>
  </div>
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

<template functional>
  <div
    :class="[props.disabled ? 'disabled' : '', 'button-block', props.classname]"
    @click="props.func"
  >
    <div :style="{ padding: props.imgPadding }" class="button-image-block">
      <img
        :src="props.disabled ? props.imgDisabled : props.img"
        class="button-image"
      />
    </div>

    <h3>{{ props.title }}</h3>
    <p class="desc">{{ props.desc }}</p>
    <p :v-if="props.recommend !== ''" class="small-note">
      {{ props.recommend }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    func: {
      type: Function,
      default: function () {}
    },
    img: {
      type: String,
      default: ''
    },
    imgPadding: {
      type: String,
      default: 'aaaaa'
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
    disabled: {
      type: Boolean,
      default: true
    },
    classname: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccessWalletButton.scss';
</style>

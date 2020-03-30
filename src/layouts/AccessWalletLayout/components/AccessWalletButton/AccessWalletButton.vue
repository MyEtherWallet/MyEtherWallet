<template functional>
  <button
    :class="[props.disabled ? 'disabled' : '', 'button-block', props.classname]"
    @click="props.func"
  >
    <div class="button-image">
      <img
        :src="props.disabled ? props.imgDisabled : props.img"
        alt
        class="icon"
      />
    </div>
    <h3>{{ props.title }}</h3>
    <p v-if="props.hasOtherExamples === true" class="access-wallet-or">
      - {{ parent.$t('accessWallet.access-wallet-or') }} -
    </p>
    <p class="desc">
      {{ parent.$t(props.desc) }}
    </p>
    <p :v-if="props.recommend !== ''" class="small-note">
      {{ props.recommend }}
    </p>
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
    disabled: {
      type: Boolean,
      default: true
    },
    classname: {
      type: String,
      default: ''
    },
    hasOtherExamples: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccessWalletButton.scss';
</style>

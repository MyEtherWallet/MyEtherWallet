<template functional>
  <div class="footer-text">
    <p>
      <span>{{ props.doNotForget }}</span>
      {{ props.doNotForgetDesc }}<span> {{ props.combo }}</span>
      {{ props.desc }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    combo: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    doNotForget: {
      type: String,
      default: ''
    },
    doNotForgetDesc: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateWalletInputFooter.scss';
</style>

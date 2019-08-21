<template>
  <div class="submit-container">
    <img class="logo ml-4" src="~@/assets/images/short-hand-logo.png" />
    <span :class="showPreview ? 'submit-preview-text' : ''" class="submit-text">
      Submit DApp
    </span>
    <p v-if="showPreview" class="preview-txt mr-3">Preview</p>
    <button v-if="showBack" class="back-btn mr-3" @click="back">Back</button>
    <button class="submit-btn mr-5" @click="next">{{ btnText }}</button>
  </div>
</template>
<script>
export default {
  props: {
    showPreview: {
      type: Boolean,
      default: false
    },
    showBack: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: ''
    },
    next: {
      type: Function,
      default: () => {}
    },
    back: {
      type: Function,
      default: () => {}
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'BannerSubmitComponent.scss';
</style>

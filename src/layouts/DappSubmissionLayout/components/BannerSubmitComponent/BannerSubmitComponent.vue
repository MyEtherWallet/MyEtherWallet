<template>
  <div class="submit-container">
    <img class="logo ml-4" src="~@/assets/images/short-hand-logo.png" />
    <span class="submit-text">Submit DApp</span>
    <p v-if="true" class="preview-txt mr-3">Preview</p>
    <button v-if="true" class="back-btn mr-3">Back</button>
    <button class="submit-btn mr-5">{{ btnText }}</button>
  </div>
</template>
<script>
export default {
  props: {
    btnText: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'BannerSubmitComponent.scss';
</style>

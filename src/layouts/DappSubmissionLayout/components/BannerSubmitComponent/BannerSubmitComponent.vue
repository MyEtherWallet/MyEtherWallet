<template>
  <div class="submit-container">
    <router-link to="/">
      <img class="logo ml-4" src="~@/assets/images/short-hand-logo.png" />
    </router-link>
    <span :class="showPreview ? 'submit-preview-text' : ''" class="submit-text">
      Submit Dapp
    </span>
    <p v-if="showPreview" class="preview-txt mr-3">Preview</p>
    <button v-if="showBack" class="back-btn mr-3" @click="back">Back</button>
    <button
      :class="[
        disableSubmit || (lackOfInfo && showPreview) ? 'disabled' : 'submit-btn'
      ]"
      class="mr-5"
      @click="next"
    >
      {{ btnText }}
    </button>
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
    },
    disableSubmit: {
      type: Boolean,
      default: false
    },
    lackOfInfo: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'BannerSubmitComponent.scss';
</style>

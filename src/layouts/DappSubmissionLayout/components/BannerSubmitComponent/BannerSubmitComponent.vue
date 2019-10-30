<template functional>
  <div class="submit-container">
    <router-link to="/">
      <img
        :src="require(`@/assets/images/short-hand-logo-${props.buildType}.png`)"
        class="logo ml-4"
      />
    </router-link>
    <span
      :class="props.showPreview ? 'submit-preview-text' : ''"
      class="submit-text"
    >
      Submit Dapp
    </span>
    <p v-if="props.showPreview" class="preview-txt mr-3">Preview</p>
    <button v-if="props.showBack" class="back-btn mr-3" @click="props.back">
      Back
    </button>
    <button
      :class="[
        props.disableSubmit || (props.lackOfInfo && props.showPreview)
          ? 'disabled'
          : 'submit-btn'
      ]"
      class="mr-5"
      @click="props.next"
    >
      {{ props.btnText }}
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
    },
    buildType: {
      type: String,
      default: 'mew'
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'BannerSubmitComponent.scss';
</style>

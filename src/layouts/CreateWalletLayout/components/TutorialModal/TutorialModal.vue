<template>
  <b-modal
    ref="tutorial"
    hide-footer
    centered
    hide-header
    no-close-on-backdrop
    no-close-on-esc
    class="bootstrap-modal padding-40-20 background-image-1"
  >
    <div class="d-block text-center">
      <h3 class="title">{{ $t('createWallet.tutorialModalHeader') }}</h3>
      <p class="content">
        {{ $t('createWallet.tutorialModalDesc') }}
        <span @click="skip">{{ $t('createWallet.tutorialModalSkip') }}</span>
        {{ $t('createWallet.tutorialModalSkipCont') }}
      </p>
    </div>
    <div class="button-container">
      <router-link
        to="/getting-started"
        class="mid-round-button-green-filled close-button"
      >
        {{ $t('common.continue') }}
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    skip: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'TutorialModal-desktop.scss';
@import 'TutorialModal-tablet.scss';
@import 'TutorialModal-mobile.scss';
</style>

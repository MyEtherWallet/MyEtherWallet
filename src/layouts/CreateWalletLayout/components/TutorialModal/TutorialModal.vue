<template>
  <b-modal
    ref="tutorial"
    hide-footer
    centered
    hide-header
    no-close-on-backdrop
    no-close-on-esc
    class="bootstrap-modal nopadding"
    static
    lazy
  >
    <div class="tutorial-content">
      <div class="d-block text-center">
        <h3 class="title">{{ $t('createWallet.welcome.title') }}</h3>
        <i18n path="createWallet.welcome.desc" tag="p" class="content">
          <span slot="skip" @click="skip">{{
            $t('createWallet.welcome.button-skip')
          }}</span>
        </i18n>
      </div>
      <div class="button-container mt-4 mb-0">
        <router-link
          to="/getting-started"
          class="mid-round-button-green-filled close-button"
        >
          {{ $t('common.continue') }}
        </router-link>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    skip: {
      type: Function,
      default: function () {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'TutorialModal-desktop.scss';
@import 'TutorialModal-tablet.scss';
@import 'TutorialModal-mobile.scss';
</style>

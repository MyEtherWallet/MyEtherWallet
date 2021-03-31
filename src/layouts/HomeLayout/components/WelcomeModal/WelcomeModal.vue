<template>
  <b-modal
    ref="welcome"
    hide-footer
    hide-header
    no-close-on-backdrop
    no-close-on-esc
    centered
    class="bootstrap-modal nopadding"
    static
    lazy
  >
    <div class="welcome-modal">
      <img src="@/assets/images/modal/garlands.png" alt />
      <div class="welcome-modal-container">
        <div class="welcome-modal-text">
          <h3>{{ $t('common.popup.desc3') }}</h3>
        </div>
        <div class="welcome-modal-button">
          <button @click="closeModal">
            {{ $t('welcomeMessage.button-onwards') }}!
          </button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$refs.welcome.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WelcomeModal.scss';
</style>

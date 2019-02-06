<template>
  <b-modal
    ref="welcome"
    hide-footer
    centered
    hide-header
    no-close-on-backdrop
    no-close-on-esc
    class="bootstrap-modal"
  >
    <div class="welcome-modal">
      <img src="@/assets/images/modal/garlands.png" />
      <div class="welcome-modal-container">
        <div class="welcome-modal-text">
          <h3>Welcome to MEW V5</h3>
          <p>
            Welcome to the brand new MEW! If this is your first time visiting,
            check out our <a target="_blank">Medium article on what's new</a>.
            Vintage MEW can still be accessed
            <a href="https://vintage.myetherwallet.com" target="_blank">
              here
            </a>
            , or at the bottom of the page.
          </p>
        </div>
        <div class="welcome-modal-button">
          <button @click="closeModal">
            Take me to MEW!
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

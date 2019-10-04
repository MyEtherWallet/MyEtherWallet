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
          <h3>{{ $t('home.welcome.title') }}</h3>
          <i18n path="home.welcome.desc1" tag="p" for="home.welcome.link1">
            <a
              href="https://medium.com/@myetherwallet/lets-make-it-official-mew5-myetherwallet-s-all-new-interface-is-here-2063117180a4"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('home.welcome.link1') }}</a
            >
          </i18n>
          <i18n path="home.welcome.desc2" tag="p" for="home.welcome.link2">
            <a
              aria-label="Vintage MyEtherWallet"
              href="https://vintage.myetherwallet.com"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('home.welcome.link2') }}</a
            >
          </i18n>
        </div>
        <div class="welcome-modal-button">
          <button @click="closeModal">{{ $t('home.welcome.button-onwards') }}!</button>
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

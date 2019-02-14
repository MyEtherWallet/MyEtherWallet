<template>
  <b-modal
    ref="welcome"
    hide-footer
    hide-header
    no-close-on-backdrop
    no-close-on-esc
    centered
    class="bootstrap-modal nopadding"
  >
    <div class="welcome-modal">
      <img src="@/assets/images/modal/garlands.png" />
      <div class="welcome-modal-container">
        <div class="welcome-modal-text">
          <h3>{{ $t('home.welcomeTov5') }}</h3>
          <i18n path="home.welcomeToV5Desc1" tag="p" for="home.welcomeToLink1">
            <a
              href="https://medium.com/@myetherwallet/lets-make-it-official-mew5-myetherwallet-s-all-new-interface-is-here-2063117180a4"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('home.welcomeToLink1') }}</a
            >
          </i18n>
          <i18n path="home.welcomeToV5Desc2" tag="p" for="home.welcomeToLink2">
            <a
              href="https://vintage.myetherwallet.com"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('home.welcomeToLink2') }}</a
            >
          </i18n>
        </div>
        <div class="welcome-modal-button">
          <button @click="closeModal">{{ $t('home.onwards') }}!</button>
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

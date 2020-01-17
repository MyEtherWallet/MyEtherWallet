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
          <h3>{{ $t('welcomeMessage.title') }}</h3>
          <i18n
            v-if="!firstTimeRu"
            path="welcomeMessage.desc1"
            tag="p"
            for="welcomeMessage.link1"
          >
            <a
              href="https://medium.com/@myetherwallet/lets-make-it-official-mew5-myetherwallet-s-all-new-interface-is-here-2063117180a4"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('welcomeMessage.link1') }}</a
            >
          </i18n>
          <i18n
            v-if="firstTimeRu"
            path="welcomeMessage.first-time-ru.desc1"
            tag="p"
          >
            <a
              slot="link1"
              href="https://vk.com/public190491855"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('welcomeMessage.first-time-ru.link1') }}</a
            >
            <a
              slot="supportEmail"
              href="mailto:support@myetherwallet.com"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('common.support-email') }}</a
            >
            <a
              slot="link2"
              href="https://twitter.com/myetherwallet"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('welcomeMessage.first-time-ru.link2') }}</a
            >
          </i18n>
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
  props: {
    firstTimeRu: {
      type: Boolean,
      default: false
    }
  },
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

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
          <h3>{{ $t('welcomeMessage.v5-title') }}</h3>
          <i18n v-if="!firstTimeRu" path="welcomeMessage.v5-desc1" tag="p">
            <a
              slot="v6"
              target="_blank"
              href="https://www.myetherwallet.com/"
              rel="noopener noreferrer"
            >
              {{ $t('welcomeMessage.v6-link') }}
            </a>
            <a
              slot="twitter"
              href="https://twitter.com/myetherwallet"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('welcomeMessage.v5-twitter-link') }}</a
            >
            <a
              slot="email"
              href="mailto:support@myetherwallet.com"
              rel="noopener noreferrer"
            >
              {{ $t('welcomeMessage.v5-email-link') }}</a
            ></i18n
          >
          <p v-if="firstTimeRu">
            Если Вам удобнее общаться с нами и другими пользователями MEW на
            русском языке, присоединяйтесь к нашему сообществу в
            <a target="_blank" href=" https://vk.com/public190491855">ВК</a>!
            Для поддержки, пишите на
            <a target="_blank" href="mailto:support@myetherwallet.com"
              >support@myetherwallet.com</a
            >. Для самых свежих новостей, подпишитесь на наш
            <a target="_blank" href="https://twitter.com/myetherwallet"
              >Твиттер</a
            >."
          </p>
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

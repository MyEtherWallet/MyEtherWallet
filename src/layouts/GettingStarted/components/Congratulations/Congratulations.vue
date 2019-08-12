<template>
  <div class="what-is-mew">
    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          {{ $t('gettingStarted.congratulationsTitle') }}
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue" />
        </div>
        <div class="block-progressbar__content text-cented">
          <img src="~@/assets/images/icons/drink.svg" />

          <p>
            {{ $t('gettingStarted.congratulationsDesc') }}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://kb.myetherwallet.com"
            >
              {{ $t('gettingStarted.congratulationsLink') }}
            </a>
            {{ $t('gettingStarted.congratulationsDescCont') }}
          </p>

          <div
            class="done-button mid-round-button-green-filled-green-border"
            @click="done"
          >
            Get Started
          </div>
        </div>
      </dir>
    </div>
  </div>
</template>

<script>
import store from 'store';

export default {
  props: {
    progressBarValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    done() {
      store.set('skipTutorial', 'done');
      this.$router.push({ path: 'create-wallet' });
      this.$store.dispatch('gettingStartedDone');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../BlockWithProgressBar-desktop.scss';
@import '../BlockWithProgressBar-tablet.scss';
@import '../BlockWithProgressBar-mobile.scss';
</style>

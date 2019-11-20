<template>
  <div class="what-is-mew">
    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          {{ $t('gettingStarted.title-congrats') }}
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue" />
        </div>
        <div class="block-progressbar__content text-cented">
          <img alt src="~@/assets/images/icons/drink.svg" />
          <i18n path="gettingStarted.congratulations.desc" tag="p">
            <a
              slot="helpCenter"
              rel="noopener noreferrer"
              target="_blank"
              href="https://kb.myetherwallet.com"
              >{{ $t('common.help-center') }}</a
            >
          </i18n>
          <div
            class="done-button mid-round-button-green-filled-green-border"
            @click="done"
          >
            {{ $t('common.get-started') }}
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

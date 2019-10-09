<template>
  <div class="what-is-mew">
    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          {{ $t('gettingStarted.title-about') }}
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue" />
        </div>
        <div class="block-progressbar__content">
          <h4>{{ $t('gettingStarted.where-are-my-funds.title') }}</h4>
          <p>{{ $t('gettingStarted.where-are-my-funds.desc') }}</p>
          <div class="block-progressbar__warning">
            {{ $t('gettingStarted.where-are-my-funds.warning') }}
          </div>
          <div class="block-progressbar__sliding-switch-expender">
            <div class="title">
              <h4>{{ $t('gettingStarted.what-is-blockchain.title') }}</h4>
              <div class="sliding-switch sliding-switch-white">
                <label class="switch">
                  <input
                    type="checkbox"
                    @click="expenderContentShow = !expenderContentShow"
                  />
                  <span class="slider round" />
                </label>
              </div>
            </div>
            <div v-if="expenderContentShow" class="content">
              <p>{{ $t('gettingStarted.what-is-blockchain.desc1') }}</p>
              <p>{{ $t('gettingStarted.what-is-blockchain.desc2') }}</p>
            </div>
          </div>
        </div>
      </dir>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progressBarValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      expenderContentShow: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../BlockWithProgressBar-desktop.scss';
@import '../BlockWithProgressBar-tablet.scss';
@import '../BlockWithProgressBar-mobile.scss';
</style>

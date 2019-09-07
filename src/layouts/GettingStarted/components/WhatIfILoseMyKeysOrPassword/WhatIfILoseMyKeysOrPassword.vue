<template>
  <div class="what-is-mew">
    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          {{ $t('gettingStarted.aboutSecurity') }}
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue" />
        </div>
        <div class="block-progressbar__content">
          <h4>{{ $t('gettingStarted.lostPasswordTitle') }}</h4>
          <p>
            {{ $t('gettingStarted.lostPasswordDescHalf') }}
            <span>{{ $t('gettingStarted.lostPasswordDescCaps') }}</span
            >. {{ $t('gettingStarted.lostPasswordDescCont') }}
          </p>

          <ul>
            <li>{{ $t('gettingStarted.lostPasswordDescOpt1') }}</li>
            <li>{{ $t('gettingStarted.lostPasswordDescOpt2') }}</li>
          </ul>
          <div class="block-progressbar__warning">
            {{ $t('gettingStarted.whatIsUpsideWarning') }}
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
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '../BlockWithProgressBar-desktop.scss';
@import '../BlockWithProgressBar-tablet.scss';
@import '../BlockWithProgressBar-mobile.scss';
</style>

<template>
  <div class="what-is-upside">
    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          {{ $t('gettingStarted.whatIsUpsideTitle') }}
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue" />
        </div>
        <div class="block-progressbar__content">
          <h4>{{ $t('gettingStarted.whatIsUpsideSubTitle') }}</h4>
          <p>{{ $t('gettingStarted.whatIsUpsideDesc1') }}</p>
          <p>{{ $t('gettingStarted.whatIsUpsideDesc2') }}</p>
          <p>{{ $t('gettingStarted.whatIsUpsideDesc3') }}</p>
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

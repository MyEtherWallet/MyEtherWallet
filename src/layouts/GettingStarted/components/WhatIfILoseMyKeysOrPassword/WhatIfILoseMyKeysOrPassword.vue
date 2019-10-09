<template>
  <div class="what-is-mew">
    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          {{ $t('gettingStarted.title-security') }}
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue" />
        </div>
        <div class="block-progressbar__content">
          <h4>{{ $t('gettingStarted.lost-password.title') }}</h4>
          <i18n path="gettingStarted.lost-password.desc" tag="p">
            <span slot="goneForever" alt>{{
              $t('gettingStarted.lost-password.desc-caps-gone-forever')
            }}</span>
          </i18n>
          <ul>
            <li>{{ $t('gettingStarted.lost-password.option1') }}</li>
            <li>{{ $t('gettingStarted.lost-password.option2') }}</li>
          </ul>
          <div class="block-progressbar__warning">
            {{ $t('gettingStarted.lost-password.warning') }}
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

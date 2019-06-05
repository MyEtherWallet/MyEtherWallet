<template>
  <div class="terms-and-conditions">
    <div class="wrap">
      <div class="page-container">
        <div class="content-width-limit">
          <div class="page-header">
            <h1>{{ $t('termsOfConditions.title') }}</h1>
            <h6>{{ $t('termsOfConditions.date') }}</h6>
          </div>
          <div class="content">
            <p>{{ $t('termsOfConditions.paragraph1') }}</p>
            <p>{{ $t('termsOfConditions.paragraph2') }}</p>
            <p>{{ $t('termsOfConditions.paragraph3') }}</p>
            <p>{{ $t('termsOfConditions.paragraph4') }}</p>
            <p>{{ $t('termsOfConditions.paragraph5') }}</p>
            <p>{{ $t('termsOfConditions.paragraph6') }}</p>
            <p>{{ $t('termsOfConditions.paragraph7') }}</p>
            <p>{{ $t('termsOfConditions.paragraph8') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Terms',
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'TermsAndConditionsLayout.scss';
</style>

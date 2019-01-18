<template>
  <div class="terms-of-conditions">
    <div class="wrap">
      <div class="page-container">
        <div class="content-width-limit">
          <div class="page-header">
            <h1>{{ $t('termsOfConditions.title') }}</h1>
          </div>

          <div class="content">
            <h6>{{ $t('termsOfConditions.date') }}</h6>
            <p>
              {{ $t('termsOfConditions.paragraph1') }} <br /><br />
              {{ $t('termsOfConditions.paragraph2') }} <br /><br />
              {{ $t('termsOfConditions.paragraph3') }} <br /><br />
              {{ $t('termsOfConditions.paragraph4') }} <br /><br />
              {{ $t('termsOfConditions.paragraph5') }} <br /><br />
              {{ $t('termsOfConditions.paragraph6') }} <br /><br />
              {{ $t('termsOfConditions.paragraph7') }} <br /><br />
              {{ $t('termsOfConditions.paragraph8') }}
            </p>
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

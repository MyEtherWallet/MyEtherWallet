<template functional>
  <div>
    <div class="terms-and-conditions">
      <div class="wrap">
        <div class="page-container">
          <div class="content-width-limit">
            <div class="page-header">
              <h1>{{ parent.$t('termsOfConditions.title') }}</h1>
              <h6>{{ parent.$t('termsOfConditions.date') }}</h6>
            </div>
            <div class="content">
              <p>{{ parent.$t('termsOfConditions.paragraph-1') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph-2') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph-3') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph-4') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph-5') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph-6') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph-7') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph-8') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'TermsAndConditionsLayout.scss';
</style>

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
              <p>{{ parent.$t('termsOfConditions.paragraph1') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph2') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph3') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph4') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph5') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph6') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph7') }}</p>
              <p>{{ parent.$t('termsOfConditions.paragraph8') }}</p>
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

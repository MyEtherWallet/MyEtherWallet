<template>
  <div class="team">
    <div class="wrap">
      <div class="page-container">
        <div class="content-width-limit">
          <div class="page-header">
            <h1>{{ $t('privacyPol.title') }}</h1>
          </div>

          <div class="content">
            <h6>{{ $t('privacyPol.date') }}</h6>
            <p>
              {{ $t('privacyPol.paragraph1') }} <br /><br />
              {{ $t('privacyPol.paragraph2') }} <br /><br />
              {{ $t('privacyPol.paragraph3') }} <br /><br />
              {{ $t('privacyPol.paragraph4') }} <br /><br />
              {{ $t('privacyPol.paragraph5') }} <br /><br />
              {{ $t('privacyPol.paragraph6') }} <br /><br />
              {{ $t('privacyPol.paragraph7') }} <br /><br />
              {{ $t('privacyPol.paragraph8') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'PrivacyPolicyLayout.scss';
</style>

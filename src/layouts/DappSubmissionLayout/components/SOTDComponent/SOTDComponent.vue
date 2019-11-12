<template functional>
  <div class="sotd-wrapper">
    <div class="mt-5 ml-5 sotd-container">
      <div class="text-container">
        <p class="header">{{ parent.$t('dappsSubmission.sotd.title') }}</p>
        <img
          src="~@/assets/images/icons/dapps/sotd.png"
          alt="State of the Dapps"
        />
      </div>
      <div class="info-box">
        <p>
          {{ parent.$t('dappsSubmission.sotd.info') }}
          <a href="https://www.stateofthedapps.com/">{{
            parent.$t('dappsSubmission.sotd.url')
          }}</a
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SOTDComponent.scss';
</style>

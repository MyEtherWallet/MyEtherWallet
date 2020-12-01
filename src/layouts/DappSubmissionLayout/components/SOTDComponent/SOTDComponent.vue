<template functional>
  <div class="sotd-wrapper">
    <div class="mt-5 ml-5 sotd-container">
      <div class="text-container">
        <p class="header">{{ parent.$t('dappsSubmission.sotd.title') }}</p>
        <img
          :alt="parent.$t('dappsSubmission.sotd.name')"
          src="~@/assets/images/icons/dapps/sotd.png"
        />
      </div>
      <div class="info-box">
        <i18n tag="p" path="dappsSubmission.sotd.info">
          <a
            slot="url"
            rel="noopener noreferrer"
            href="https://www.stateofthedapps.com/"
            >{{ parent.$t('dappsSubmission.sotd.url') }}</a
          >.
        </i18n>
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

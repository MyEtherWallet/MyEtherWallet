<template>
  <div>
    <div class="mew-support-box ml-5 mt-5">
      <div class="mew-support-container">
        <p class="mew-support-header">
          {{ $t('dappsSubmission.mew-support.title') }}
        </p>
        <div class="text-container">
          <p class="mew-support-info">
            {{ $t('dappsSubmission.mew-support.info') }}
          </p>
          <img class="msg-logo" src="~@/assets/images/message.png" />
        </div>
      </div>
      <b-link
        class="email-us-btn"
        rel="noopener noreferrer"
        href="mailto:support@myetherwallet.com"
        target="_blank"
        >{{ $t('dappsSubmission.contact-support') }}</b-link
      >
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'MewSupportComponent.scss';
</style>

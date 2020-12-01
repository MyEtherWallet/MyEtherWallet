<template>
  <div class="modal-container">
    <b-modal
      ref="feedback"
      :title="$t('common.feedback.feedback-title')"
      hide-footer
      centered
      class="bootstrap-modal"
      static
      lazy
    >
      <div class="modal-content">
        {{ $t('common.feedback.send-us-feedback') }}
        <a
          href="mailto:support@myetherwallet.com"
          target="_blank"
          rel="noopener noreferrer"
          >{{ $t('common.support-email') }}</a
        >. {{ $t('common.thank-you') }}.
      </div>
    </b-modal>
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
@import 'FeedbackModal.scss';
</style>

<template>
  <div class="modal-container">
    <b-modal
      ref="feedback"
      hide-footer
      centered
      class="bootstrap-modal"
      title="Feedback / Custommer Support"
    >
      <div class="modal-content">
        If you want to send us your feedback, please use
        <a
          href="mailto:support@xinfin.network"
          target="_blank"
          rel="noopener noreferrer"
          >support@xinfin.network</a
        >. Thank you.
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

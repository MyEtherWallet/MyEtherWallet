<template>
  <div>
    <b-modal
      ref="verifyModal"
      hide-footer
      class="bootstrap-modal nopadding"
      title="Verify Message"
    >
      <div class="modal-contents">
        <verify-message-input :signature="signature" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import VerifyMessageInput from '@/components/VerifyMessageInput';

export default {
  components: {
    'verify-message-input': VerifyMessageInput
  },
  props: {
    signature: {
      type: String,
      default: ''
    }
  }
};
</script>

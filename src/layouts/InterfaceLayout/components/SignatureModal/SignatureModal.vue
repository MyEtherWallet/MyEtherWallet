<template>
  <div>
    <b-modal
      ref="signatureModal"
      hide-footer
      centered
      class="bootstrap-modal"
      title="Signature"
      static
      lazy
    >
      <div class="modal-contents">
        <div>
          <div class="copy-container">
            <h4>Signed Message:</h4>
            <div class="copy-buttons">
              <span @click="copy">{{ $t('common.copy') }}</span>
            </div>
          </div>
          <textarea
            ref="signedMess"
            :value="signature"
            name="message"
            class="custom-textarea-1"
          />
          <div class="button-container">
            <button
              class="submit-button large-round-button-green-filled clickable"
              @click="copy('main')"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Toast } from '@/helpers';

export default {
  props: {
    signature: {
      type: String,
      default: ''
    }
  },
  methods: {
    copy(type) {
      this.$refs.signedMess.select();
      document.execCommand('copy');
      Toast.responseHandler('Copied!', Toast.INFO);
      if (type === 'main') this.$refs.signatureModal.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SignatureModal.scss';
</style>

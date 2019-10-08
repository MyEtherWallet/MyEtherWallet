<template>
  <div class="verify-content-container">
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('verifyMessage.signature') }}:</h4>
          <div class="copy-buttons">
            <span @click="deleteInput">{{ $t('common.clear') }}</span>
            <span @click="copyToClipboard">{{ $t('common.copy') }}</span>
          </div>
        </div>
      </div>
      <div class="the-form signature">
        <textarea
          v-validate="'required'"
          ref="signature"
          v-model="message"
          name="signature"
          class="custom-textarea-1"
        />
      </div>
      <div>
        <p
          v-if="message !== '' && showMessage === true"
          class="success-message"
        >
          {{ JSON.parse(message).address }}
          {{ $t('verifyMessage.message.address-signed') }}:
          <br v-if="JSON.parse(message).msg.length > 20" />
          <b>{{ JSON.parse(message).msg }}</b>
        </p>
        <p v-if="errors.has('signature')">
          {{ $t('verifyMessage.message.validation-fail') }}
        </p>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <button
          :class="[
            errors.has('signature') || message === '' ? 'disabled' : '',
            'submit-button large-round-button-green-filled clickable'
          ]"
          @click="verifyMessage"
        >
          {{ $t('verifyMessage.title') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from '@/helpers';
import { mapState } from 'vuex';
import {
  toBuffer,
  hashPersonalMessage,
  ecrecover,
  pubToAddress
} from 'ethereumjs-util';

export default {
  props: {
    signature: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      message: this.signature,
      showMessage: false
    };
  },
  computed: {
    ...mapState(['web3'])
  },
  watch: {
    message(newVal) {
      this.message = newVal;
    },
    signature(newVal) {
      this.message = newVal;
    }
  },
  methods: {
    copyToClipboard() {
      this.$refs.signature.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    },
    deleteInput() {
      this.showMessage = false;
      this.message = '';
    },
    verifyMessage() {
      try {
        const json = JSON.parse(this.message);
        let hash = hashPersonalMessage(toBuffer(json.msg));
        const sig = Buffer.from(json.sig.replace('0x', ''), 'hex');
        if (sig.length !== 65) {
          Toast.responseHandler(
            `${this.$t('errorsGlobal.something-went-wrong')}`,
            Toast.ERROR
          );
          return;
        }
        sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64];
        if (json.version === '1') {
          hash = this.web3.utils.sha3(json.msg);
        }
        const pubKey = ecrecover(
          hash,
          sig[64],
          sig.slice(0, 32),
          sig.slice(32, 64)
        );
        if (
          json.address.replace('0x', '') !==
          pubToAddress(pubKey).toString('hex')
        ) {
          this.showMessage = false;
          Toast.responseHandler(
            `${this.$t('errorsGlobal.signer-address-different')}`,
            Toast.ERROR
          );
        } else {
          this.showMessage = true;
        }
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'VerifyMessageInput.scss';
</style>

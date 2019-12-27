<template>
  <div class="verify-content-container">
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('common.signature') }}:</h4>
          <div class="copy-buttons">
            <span @click="deleteInput">{{ $t('common.clear') }}</span>
            <span @click="copyToClipboard">{{ $t('common.copy') }}</span>
          </div>
        </div>
      </div>
      <div class="the-form signature">
        <textarea
          ref="signature"
          v-model="message"
          :placeholder="verifyMessageLabel"
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
import { Toast, Misc } from '@/helpers';
import { mapState } from 'vuex';
import { hashPersonalMessage, ecrecover, pubToAddress } from 'ethereumjs-util';

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
      showMessage: false,
      verifyMessageLabel: `
      {
        "address": "0xdecaf9cd2367cdbb726e904cd6397edfcae6068d",
        "msg": "no one is giving away free ETH",
        "sig":
          "0xfd53681a1bbbdbd6074a884e628540f129c57
          634c055f91d45615c943db446fb0acc35ef34bf9
          05a78b634d4a88769b80432b4714ba2b19e2fda9
          814a95a1dbb1b",
        "version": "3",
        "signer": "MEW"
      }
    `
    };
  },
  computed: {
    ...mapState('main', ['web3'])
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
        let hash = hashPersonalMessage(Misc.toBuffer(json.msg));
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
          this.deleteInput();
          this.showMessage = false;
          Toast.responseHandler(
            `${this.$t('errorsGlobal.signer-address-different')}`,
            Toast.ERROR
          );
        } else {
          this.showMessage = true;
        }
      } catch (e) {
        this.deleteInput();
        Toast.responseHandler(e, Toast.ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'VerifyMessageInput.scss';
</style>

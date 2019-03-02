<template>
  <div class="verify-message-container">
    <interface-container-title :title="$t('common.verifyMessage')" />

    <div class="content-container">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>Signature:</h4>
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
            name="verify"
            class="custom-textarea-1"
          />
        </div>
        <div>
          <p
            v-if="message !== '' && showMessage === true"
            class="success-message"
          >
            {{ JSON.parse(message).address }}
            {{ $t('interface.verifiedMessage') }}:
            <br v-if="JSON.parse(message).msg.length > 20" />
            <b>{{ JSON.parse(message).msg }}</b>
          </p>
          <p v-if="errors.has('verify')">{{ errors.first('verify') }}</p>
        </div>
      </div>

      <div class="submit-button-container">
        <div class="buttons">
          <button
            :class="[
              errors.has('verify') || message === '' ? 'disabled' : '',
              'submit-button large-round-button-green-filled clickable'
            ]"
            @click="verifyMessage"
          >
            {{ $t('common.verifyMessage') }}
          </button>
        </div>
        <interface-bottom-text
          :link-text="$t('interface.helpCenter')"
          :question="$t('interface.haveIssues')"
          link="https://kb.myetherwallet.com"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import { MessageUtil, Toast } from '@/helpers';
import { mapGetters } from 'vuex';
// eslint-disable-next-line
const createKeccakHash = require('keccak');

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle
  },
  data() {
    return {
      message: '',
      showMessage: false
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3'
    })
  },
  watch: {
    message(newVal) {
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
      this.$refs.signature.value = '';
    },
    verifyMessage() {
      const json = JSON.parse(this.message);
      let hash = MessageUtil.hashPersonalMessage(
        MessageUtil.toBuffer(json.msg)
      );
      const sig = Buffer.from(MessageUtil.getNakedAddress(json.sig), 'hex');
      if (sig.length !== 65) {
        Toast.responseHandler('Something went wrong!', Toast.ERROR);
        return;
      }

      sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64];
      if (json.version === '3') {
        if (json.signer === 'trezor') {
          hash = MessageUtil.getTrezorHash(json.msg);
        } else if (json.signer === 'ledger') {
          hash = MessageUtil.hashPersonalMessage(Buffer.from(json.msg));
        }
      } else if (json.version === '1') {
        hash = this.web3.utils.sha3(json.msg);
      }

      const pubKey = MessageUtil.ecrecover(
        hash,
        sig[64],
        sig.slice(0, 32),
        sig.slice(32, 64)
      );
      if (
        MessageUtil.getNakedAddress(json.address) !==
        MessageUtil.pubToAddress(pubKey).toString('hex')
      ) {
        Toast.responseHandler('Something went wrong!', Toast.ERROR);
      } else {
        this.showMessage = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'VerifyMessageContainer.scss';
</style>

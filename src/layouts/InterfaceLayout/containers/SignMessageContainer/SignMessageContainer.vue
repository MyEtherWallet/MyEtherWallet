<template>
  <div class="sign-message-container">
    <signature-modal-modal ref="signatureModal" :signature="signature" />
    <interface-container-title :title="$t('signMessage.title')" />
    <div class="content-container">
      <div class="send-form">
        <p>{{ $t('signMessage.desc') }}</p>
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('signMessage.message') }}</h4>
          </div>
        </div>

        <div class="the-form">
          <textarea
            v-model="message"
            v-validate="'required'"
            name="message"
            class="custom-textarea-1"
          />
          <span v-show="errors.has('message')">
            {{ errors.first('message') }}
          </span>
        </div>
      </div>

      <div class="submit-button-container">
        <div class="buttons">
          <button
            :class="[
              message.length > 0 ? '' : 'disabled',
              'submit-button large-round-button-green-filled clickable'
            ]"
            @click="signMessage"
          >
            {{ $t('signMessage.sign') }}
          </button>
        </div>
        <div class="clear-all-btn" @click="deleteInputText()">
          {{ $t('common.clear-all') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import SignatureModal from '../../components/SignatureModal';

export default {
  name: 'SignMessage',
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'signature-modal-modal': SignatureModal
  },
  data() {
    return {
      message: '',
      signature: ''
    };
  },
  computed: {
    ...mapState('main', ['account', 'web3'])
  },
  mounted() {
    this.$refs.signatureModal.$refs.signatureModal.$on('hidden', () => {
      this.deleteInputText();
    });
  },
  methods: {
    signMessage() {
      try {
        this.web3.eth
          .sign(this.message, this.account.address)
          .then(_signedMessage => {
            this.signature = JSON.stringify(
              {
                address: this.account.address,
                msg: this.message,
                sig: _signedMessage,
                version: '3',
                signer: this.account.isHardware
                  ? this.account.identifier
                  : 'MEW'
              },
              null,
              2
            );
            this.$refs.signatureModal.$refs.signatureModal.show();
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    copyToClipboard() {
      this.$refs.signature.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      Toast.responseHandler(this.$t('common.copied'), Toast.INFO);
    },
    deleteInputText() {
      this.signature = '';
      this.message = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SignMessageContainer.scss';
</style>

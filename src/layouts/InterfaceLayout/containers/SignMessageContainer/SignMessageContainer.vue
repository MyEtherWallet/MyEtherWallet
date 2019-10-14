<template>
  <div class="sign-message-container">
    <signature-modal-modal ref="signatureModal" :signature="signature" />
    <interface-container-title :title="$t('common.signMessage')" />
    <div class="content-container">
      <div class="send-form">
        <p>{{ $t('interface.signMessageDesc') }}</p>
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.txSideMenuMessage') }}</h4>
          </div>
        </div>

        <div class="the-form">
          <textarea
            v-validate="'required'"
            v-model="message"
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
            {{ $t('common.sign') }}
          </button>
        </div>
        <interface-bottom-text
          :link-text="$t('common.help-center')"
          :question="$t('interface.haveIssues')"
          link="https://kb.myetherwallet.com"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import SignatureModal from '../../components/SignatureModal';

export default {
  name: 'SignMessage',
  components: {
    'interface-bottom-text': InterfaceBottomText,
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
    ...mapState(['account', 'web3'])
  },
  methods: {
    signMessage() {
      this.web3.eth
        .sign(this.message, this.account.address)
        .then(_signedMessage => {
          this.signature = JSON.stringify(
            {
              address: this.account.address,
              msg: this.message,
              sig: _signedMessage,
              version: '3',
              signer: this.account.isHardware ? this.account.identifier : 'MEW'
            },
            null,
            2
          );
          this.$refs.signatureModal.$refs.signatureModal.show();
        })
        .catch(e => {
          Toast.responseHandler(e, false);
        });
    },
    copyToClipboard() {
      this.$refs.signature.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      Toast.responseHandler('Copied', Toast.INFO);
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

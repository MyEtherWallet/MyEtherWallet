<template>
  <div class="deploy-contract-container">
    <success-modal
      message=""
      link-message="Ok"/>
    <interface-container-title :title="$t('common.signMessage')"/>
    <div class="send-form">
      <p>
        Include your nickname and where
        you use the nickname so someone
        else cannot use it.
        Include a specific reason
        for the message so it cannot be
        reused for a different purpose.
      </p>

      <div class="title-container">
        <div class="title">
          <h4>Message</h4>
          <popover :popcontent="$t('popover.whatIsMessageContent')"/>
        </div>
      </div>

      <div class="the-form">
        <textarea
          ref="message"
          class="custom-textarea-1"/>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Signature</h4>
          <popover :popcontent="$t('popover.whatIsSignatureContent')"/>

          <div class="copy-buttons">
            <span @click="deleteInputText('signature')">Clear</span>
            <span @click="copyToClipboard('signature')">Copy</span>
          </div>

        </div>
      </div>
      <div class="the-form domain-name">
        <textarea
          ref="signature"
          class="custom-textarea-1"
          name=""/>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div
          class="submit-button large-round-button-green-filled clickable"
          @click="signMessage">
          {{ $t('Sign') }}
        </div>
      </div>
      <interface-bottom-text
        :link-text="$t('interface.learnMore')"
        :question="$t('interface.haveIssues')"
        link="/"/>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';

export default {
  name: 'SignMessage',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'success-modal': SuccessModal
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
  },
  methods: {
    signMessage() {
      this.$store.state.web3.eth
        .sign(this.$refs.message.value)
        .then(_signedMessage => {
          this.$refs.signature.value = JSON.stringify(
            {
              address: this.wallet.getAddressString(),
              msg: this.$refs.message.value,
              sig: _signedMessage,
              version: '3',
              signer: this.wallet.brand ? this.wallet.brand : 'MEW'
            },
            null,
            2
          );
        })
        // eslint-disable-next-line
        .catch(console.error);
    },
    successModalOpen() {
      this.$children[0].$refs.success.show();
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    },
    deleteInputText(ref) {
      this.$refs[ref].value = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SignMessageContainer.scss';
</style>

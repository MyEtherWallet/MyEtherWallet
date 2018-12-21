<template>
  <div class="deploy-contract-container">
    <interface-container-title :title="$t('common.signMessage')" />
    <div class="send-form">
      <p>{{ $t('interface.signMessageDesc') }}</p>
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.txSideMenuMessage') }}</h4>
        </div>
      </div>

      <div class="the-form">
        <textarea ref="message" class="custom-textarea-1" />
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('common.signature') }}</h4>
          <popover :popcontent="$t('popover.signature')" />

          <div class="copy-buttons">
            <span @click="deleteInputText('signature')">{{
              $t('common.clear')
            }}</span>
            <span @click="copyToClipboard('signature')">{{
              $t('common.copy')
            }}</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea ref="signature" class="custom-textarea-1" name="" />
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div
          class="submit-button large-round-button-green-filled clickable"
          @click="signMessage"
        >
          {{ $t('common.sign') }}
        </div>
      </div>
      <interface-bottom-text
        :link-text="$t('interface.helpCenter')"
        :question="$t('interface.haveIssues')"
        link="https://kb.myetherwallet.com"
      />
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
      wallet: 'wallet',
      web3: 'web3'
    })
  },
  methods: {
    signMessage() {
      this.web3.eth
        .sign(this.$refs.message.value, this.wallet.getAddressString())
        .then(_signedMessage => {
          this.$refs.signature.value = JSON.stringify(
            {
              address: this.wallet.getChecksumAddressString(),
              msg: this.$refs.message.value,
              sig: _signedMessage,
              version: '3',
              signer: this.wallet.isHardware ? this.wallet.identifier : 'MEW'
            },
            null,
            2
          );
        })
        // eslint-disable-next-line
        .catch(console.error);
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

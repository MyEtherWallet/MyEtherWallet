<template>
  <div class="deploy-contract-container">
    <success-modal message="" linkMessage="Ok"></success-modal>
    <interface-container-title :title="$t('reused.signMessage')"></interface-container-title>
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

          <div class="tooltip-box-1">
            <b-btn id="exPopover1"></b-btn>
            <b-popover target="exPopover1" triggers="hover focus" placement="top">
              <template slot="title">MetaMask</template>
              <img class="icon" src="~@/assets/images/icons/button-metamask.svg">
              MetaMask is a <strong>bridge</strong> that allows you to
              visit the distributed web of tomorrow in your browser today.
              It allows you to <strong>run Ethereum dApps right in your
              browser without running a full Ethereum node.</strong>
              MetaMask includes a secure identity vault, providing a user
              interface to manage your identities on different sites
              and sign blockchain transactions.
            </b-popover>
          </div>

        </div>
      </div>

      <div class="the-form">
        <textarea class="custom-textarea-1"></textarea>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Signature</h4>
          <popover :popdata="popoverSignature"/>

          <div class="copy-buttons">
            <span v-on:click="deleteInputText('abi')">Clear</span>
            <span v-on:click="copyToClipboard('abi')">Copy</span>
          </div>

        </div>
      </div>
      <div class="the-form domain-name">
        <textarea ref="abi" class="custom-textarea-1" name=""></textarea>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div v-on:click="successModalOpen" class="submit-button large-round-button-green-filled clickable">
          {{ $t('interface.sign') }}
        </div>
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import SuccessModal from '@/components/SuccessModal'
import PopOver from '@/components/PopOver'

export default {
  name: 'Send Message',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'success-modal': SuccessModal,
    'popover': PopOver
  },
  data () {
    return {
      popoverSignature: {
        title: 'h1',
        content: 'gogogo'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SignMessageContainer.scss";
</style>

<template>
  <div class="deploy-contract-container">
    <success-modal message="" linkMessage="Ok"></success-modal>
    <interface-container-title :title="$t('common.signMessage')"></interface-container-title>
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
        <textarea class="custom-textarea-1"></textarea>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Signature</h4>
          <popover :popcontent="$t('popover.whatIsSignatureContent')"/>

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
          {{ $t('Sign') }}
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

export default {
  name: 'SignMessage',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'success-modal': SuccessModal
  },
  data () {
    return {
    }
  },
  methods: {
    successModalOpen () {
      this.$children[0].$refs.success.show()
    },
    copyToClipboard (ref) {
      this.$refs[ref].select()
      document.execCommand('copy')
    },
    deleteInputText (ref) {
      this.$refs[ref].value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SignMessageContainer.scss";
</style>

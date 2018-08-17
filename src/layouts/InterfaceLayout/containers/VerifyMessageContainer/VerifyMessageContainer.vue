<template>
  <div class="deploy-contract-container">
    <success-modal message="" linkMessage="Ok"></success-modal>
    <interface-container-title :title="$t('common.verifyMessage')"></interface-container-title>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('common.signature') }}</h4>
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

    <div class="send-form send-form-small-top-margin">
      <div class="the-form domain-name">
        <input type="text" ref="bytecode" placeholder="Byte code">
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div v-on:click="successModalOpen" class="submit-button large-round-button-green-filled clickable">
          {{ $t('common.verify') }}
        </div>
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue'

export default {
  name: 'Interact',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'success-modal': SuccessModal
  },
  data () {
    return {
      showModal: true,
      existingContracts: [
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '1'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '2'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '3'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '4'
        }
      ]
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
  },
  watch: {
    showModal () {
      if (this.showModal === false) {
        this.showModal = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "VerifyMessageContainer.scss";
</style>

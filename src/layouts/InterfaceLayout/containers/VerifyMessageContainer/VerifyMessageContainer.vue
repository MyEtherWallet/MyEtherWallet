<template>
  <div class="deploy-contract-container">
    <interface-container-title :title="$t('common.verifyMessage')"></interface-container-title>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Signature: </h4>
          <div class="copy-buttons">
            <span v-on:click="deleteInput">Clear</span>
            <span v-on:click="copyToClipboard">Copy</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea ref="signature" class="custom-textarea-1" v-model="message"></textarea>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div class="submit-button large-round-button-green-filled clickable" @click="verifyMessage">
          {{$t('common.verifyMessage')}}
        </div>
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle
  },
  data () {
    return {
      message: '',
      error: false
    }
  },
  methods: {
    copyToClipboard () {
      this.$refs.signature.select()
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
    },
    deleteInput () {
      this.$refs.signature.value = ''
    },
    parseSig (hex) {
      return hex.toLowerCase().replace('0x', '')
    },
    verifyMessage () {
      const json = JSON.parse(this.message)
      const sig = new Buffer(this.parseSig(json.sig), 'hex')
      if (sig.length !== 65) {
        this.error = true
      }
      console.log(new Buffer(this.parseSig(json.sig), 'hex')[64])
      sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64]
      console.log(sig[64])
      // try {
      //
      // } catch (e) {
      //
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "VerifyMessageContainer.scss";
</style>

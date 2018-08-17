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
            <span v-on:click="deleteInput">Clear</span>
            <span v-on:click="copyToClipboard">Copy</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea ref="signature" class="custom-textarea-1" v-model="message"></textarea>
      </div>
      <div>
        <p v-if="message !== '' && showMessage === true">{{ JSON.parse(message).address }} did sign the message:<br v-if="JSON.parse(message).msg.length > 20"> <b>{{ JSON.parse(message).msg }}</b></p>
        <p v-if="message !== '' && error.show === true">{{ error.show }}</p>
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
import { MessageUtil } from '@/helpers'
// eslint-disable-next-line
const createKeccakHash = require('keccak')

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle
  },
  data () {
    return {
      message: '',
      error: {
        show: false,
        msg: ''
      },
      showMessage: false
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
    verifyMessage () {
      const json = JSON.parse(this.message)
      let hash = MessageUtil.hashPersonalMessage(MessageUtil.toBuffer(json.msg))
      const sig = Buffer.from(MessageUtil.getNakedAddress(json.sig), 'hex')
      if (sig.length !== 65) {
        this.error.show = true
        this.error.msg = 'Something went terribly WRONG!!!!' // Should be replaced with actual error message
        return
      }

      sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64]
      if (json.version === '3') {
        if (json.signer === 'trezor') {
          hash = MessageUtil.getTrezorHash(json.msg)
        } else if (json.signer === 'ledger') {
          hash = MessageUtil.hashPersonalMessage(Buffer.from(json.msg))
        }
      } else if (json.version === '1') {
        hash = this.$store.state.web3.utils.sha3(json.msg)
      }

      let pubKey = MessageUtil.ecrecover(hash, sig[64], sig.slice(0, 32), sig.slice(32, 64))
      if (MessageUtil.getNakedAddress(json.address) !== MessageUtil.pubToAddress(pubKey).toString('hex')) {
        this.error.show = true
        this.error.msg = 'Something went terribly WRONG!!!!' // Should be replaced with actual error message
      } else {
        this.showMessage = true
      }
    }
  },
  watch: {
    message () {
      this.error = {
        show: false,
        msg: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "VerifyMessageContainer.scss";
</style>

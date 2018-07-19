<template>
  <div class="generate-info">
    <success-modal message="Success" :linkMessage="'Ok'"></success-modal>
    <div class="wrap">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div><h4>Signed Transaction</h4></div>
            <div class="form-controller">
              <p class="linker-1 prevent-user-select" v-on:click="deleteTxHex">Clear</p>
              <p class="linker-1 prevent-user-select" v-on:click="copyTxHex">Copy</p>
            </div>
          </div>
        </div>

        <div class="the-form gas-amount">
          <textarea ref="txHex" name="" v-model="signedTx" placeholder="Enter TX Hex"></textarea>
        </div>
      </div>
      <div class="submit-button-container">
        <div class="submit-button large-round-button-green-filled clickable" v-on:click="sendTx">
          Send Transaction
        </div>
        <interface-bottom-text :link="'/'" :linkText="'Learn more'" :question="'Have any issues?'"></interface-bottom-text>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import SuccessModal from '@/components/SuccessModal'
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'success-modal': SuccessModal
  },
  props: ['rawTx'],
  data () {
    return {
      signedTx: this.rawTx
    }
  },
  methods: {
    deleteTxHex () {
      this.signedTx = ''
    },
    copyTxHex () {
      this.$refs.txHex.select()
      document.execCommand('copy')
    },
    sendTx () {
      this.$store.state.web3.eth.sendSignedTransaction(this.signedTx).on('receipt').then(res => {
        this.$children[0].$refs.success.show()
        console.log(res)
      })
    },
    hideModal () {
      this.$children[0].$refs.success.hide()
    }
  },
  watch: {
    rawTx (newVal) {
      this.signedTx = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SendTx.scss";
</style>

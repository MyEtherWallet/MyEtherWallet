<template>
  <div class="generate-info">
    <success-modal message="Success" :linkMessage="'Ok'"></success-modal>
    <div class="wrap">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div><h4>Signed Transaction</h4></div>
            <div class="form-controller">
              <p class="linker-1" v-on:click="deleteTxHex">Clear</p>
              <p class="linker-1" v-on:click="copyTxHex">Copy</p>
            </div>
          </div>
        </div>

        <div class="the-form gas-amount">
          <textarea ref="txHex" name="" v-model="signedTx" placeholder="Enter TX Hex"></textarea>
        </div>
      </div>
      <div class="submit-button-container">
        <div class="submit-button large-round-button-green-filled clickable" v-on:click="successModalOpen">
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
  data () {
    return {
      signedTx: ''
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
    successModalOpen () {
      this.$children[0].$refs.success.show()
    },
    hideModal () {
      this.$children[0].$refs.success.hide()
      this.processChange('process1')
    },
    processChange (process) {
      this.$store.state.state.pageStates.sendOffline.processLocation = process
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SendTx.scss";
</style>

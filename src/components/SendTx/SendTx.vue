<template>
  <div class="generate-info">
    <success-modal message="'Success'" :linkMessage="'Ok'"></success-modal>
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
          <textarea id="tx-hex" name="" value="" placeholder="Enter TX Hex">0xb5d0cb3a5f29b24601e39388b75df082a7e88cd3d236b8f7e7612479b21627feb5d0cb3a5f29b24601e39388b7b5d0cb3a5f29b24601e39388b75df082a7e88cd3d236b8f7e7612479b21627feb5d0cb3a5f29b24601e39388b75df082a7e88cd3d236b8f7e7612479b21627fe5df082a7e88cd3d236b8f7e7612479b21627feb5d0cb3a5f29b24601e39388b75df082a7e88cd3d236b8f7e7612479b21627fe</textarea>
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
export default {
  data () {
    return {
    }
  },
  methods: {
    deleteTxHex () {
      document.querySelector('#tx-hex').value = ''
    },
    copyTxHex () {
      document.querySelector('#tx-hex').select()
      document.execCommand('copy')
    },
    successModalOpen () {
      this.$refs.success.show()
    },
    hideModal () {
      this.$refs.success.hide()
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

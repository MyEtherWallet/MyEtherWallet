<template>
  <b-modal ref="signedTx" hide-footer class="bootstrap-modal signed-tx-modal" title="Signed Transaction">
    <div class="d-block">
      <p class="title">Signed Transaction</p>
      <div class="signed-tx-container">
        <code>
          {{ signedTx }}
        </code>
        <input ref="signedTxInput" style="position: absolute; top: 0; opacity: 0;" :value="signedTx"/>
      </div>
      <div class="with-toggle">
        <p class="title">
          Raw
        </p>
        <div class="sliding-switch-white">
          <label class="switch">
            <input type="checkbox" v-on:click="showRaw = !showRaw">
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <div :class="[!showRaw ? 'collapsed' : '', 'raw-tx-container']">
        <code>
          {{ rawTx }}
        </code>
      </div>
    </div>
    <div class="button-container">
      <b-btn class="mid-round-button-green-filled close-button" @click="copyAndContinue">
        Copy It and Continue
      </b-btn>
    </div>
  </b-modal>
</template>

<script type="text/javascript">
export default {
  name: 'signed-tx-modal',
  props: ['signedTx', 'rawTx', 'pathUpdate'],
  data () {
    return {
      showRaw: false
    }
  },
  methods: {
    copyAndContinue () {
      this.$refs.signedTxInput.select()
      document.execCommand('copy')
      this.pathUpdate()
    }
  }
}
</script>

<style lang="scss">
  @import "SignedTxModal.scss";
</style>

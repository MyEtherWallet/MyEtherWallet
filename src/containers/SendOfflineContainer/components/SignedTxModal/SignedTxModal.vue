<template>
  <b-modal ref="signedTx" hide-footer class="bootstrap-modal signed-tx-modal" title="Signed Transaction">
    <div class="d-block">
      <p class="title">Signed Transaction</p>
      <div class="signed-tx-container">
        <code>
          {{ signedTx }}
        </code>
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
      <b-btn class="mid-round-button-green-filled close-button">
        Copy It and Continue ------->
      </b-btn>
    </div>
  </b-modal>
</template>

<script type="text/javascript">
export default {
  name: 'signed-tx-modal',
  props: ['signedTx', 'rawTx'],
  data () {
    return {
      showRaw: false
    }
  }
}
</script>

<style lang="scss">
  @import "SignedTxModal.scss";
</style>

<template>
  <div>
    <b-modal
      ref="finalize"
      hide-footer
      centered
      title="Finalize"
      class="bootstrap-modal-wide nopadding finalize-modal">
      <div class="finalize-modal-container">
        <h3>Are you about to finalize the auction for <br> {{ domainName }}.eth and claim this name?</h3>
        <div class="button-container">
          <button 
            class="cancel" 
            @click="close">Cancel</button>
          <button 
            class="confirm" 
            @click="finalize">Confirm</button>
        </div>
        <p>The ETH node you are sending through is provided by <a 
          :href="$store.state.network.url" 
          target="_blank">{{ $store.state.network.service }}</a></p>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    finalize: {
      type: Function,
      default: function() {}
    },
    domainName: {
      type: String,
      default: ''
    }
  },
  methods: {
    close() {
      this.refs.finalize.hide();
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'FinalizeModal.scss';
</style>

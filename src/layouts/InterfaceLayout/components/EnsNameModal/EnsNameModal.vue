<template lang="html">
  <div class="modal-container">
    <b-modal
      ref="registerEns"
      hide-footer
      centered
      class="bootstrap-modal nopadding ens-modal"
      title="Register Domain">
      <div class="ens-modal-body">
        <div class="content-header">
          <div>
            <h3> {{ ensName }}.eth </h3>
            <p>Cheers! This Domain is available.</p>
          </div>
        </div>
        <form class="form">
          <div class="input-container">
            <label for="bidAmount">Actual Bid Amount</label>
            <input
              v-model="bidAmount"
              type="number"
              name="bidAmount">
          </div>
          <div class="input-container">
            <label for="bidMask">Bid Mask</label>
            <input
              v-model="bidMask"
              type="number"
              name="bidMask">
          </div>
          <div class="input-container">
            <label for="secretPhrase">Secret Phrase</label>
            <input
              v-model="secretPhrase"
              type="text"
              name="secretPhrase">
          </div>
          <div class="form-buttons">
            <button
              type="button"
              name="button"
              class="cancel"
              @click="cancel">Cancel</button>
            <button
              type="submit"
              name="submit"
              class="submit"
              @click.prevent="createBid">Submit</button>
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    ensName: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      bidAmount: 0,
      bidMask: 0,
      secretPhrase: ''
    };
  },
  methods: {
    cancel() {
      this.$refs.registerEns.hide();
      this.clearInputs();
    },
    clearInputs() {
      this.bidAmount = 0;
      this.bidMask = 0;
      this.secretPhrase = '';
    },
    createBid() {
      console.log('WAZZAAAAA');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'EnsNameModal.scss';
</style>

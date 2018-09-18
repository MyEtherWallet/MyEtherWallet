<template lang="html">
  <div class="modal-container">
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
            @click="cancel">Back</button>
          <button
            type="submit"
            name="submit"
            class="submit"
            @click.prevent="createBid">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ensName: {
      type: String,
      default: ''
    },
    bidAmount: {
      type: Number,
      default: 0
    },
    bidMask: {
      type: Number,
      default: 0
    },
    secretPhrase: {
      type: String,
      default: ''
    },
    cancel: {
      type: Function,
      default: function() {}
    },
    createBid: {
      type: Function,
      default: function() {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'EnsBid.scss';
</style>

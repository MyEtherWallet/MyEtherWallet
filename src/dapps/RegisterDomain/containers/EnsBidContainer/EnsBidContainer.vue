<template lang="html">
  <div>
    <timer
      v-if="state === 'nameAvailableAuctionStarted'"
      :date-number="auctionDateEnd"
      date-type="reveal" />
    <timer
      v-if="state === 'nameAvailableAuctionStarted'"
      :date-number="auctionDateEnd"
      date-type="auction" />
    <div class="name-available-container">
      <div
        v-if="state==='nameAvailableAuctionNotStarted'"
        class="content-header">
        <div>
          <h3> {{ domainName }}.eth </h3>
          <p>Cheers! This Domain is available.</p>
        </div>
      </div>
      <div
        v-if="state==='nameAvailableAuctionStarted'"
        class="auction-started">
        <div>
          <h3> An auction has been started for {{ domainName }}.eth </h3>
        </div>
      </div>
      <form class="form">
        <div class="input-container">
          <label for="localBidAmount">Actual Bid Amount</label>
          <input
            v-model="localBidAmount"
            type="number"
            name="localBidAmount">
        </div>
        <div class="input-container">
          <label for="localBidMask">Bid Mask</label>
          <input
            v-model="localBidMask"
            :class="[localBidAmount >= localBidMask ? 'errored': '']"
            type="number"
            name="localBidMask">
          <p
            v-show="localBidAmount >= localBidMask"
            class="erroredMsg">We recommend having your Bid mask higher than your Bid amount.</p>
        </div>
        <div class="input-container">
          <label for="localSecretPhrase">Secret Phrase</label>
          <input
            v-model="localSecretPhrase"
            type="text"
            name="localSecretPhrase">
        </div>
        <div class="form-buttons">
          <button
            type="button"
            name="button"
            class="cancel"
            @click="cancel">Back</button>
          <button
            v-if="state === 'nameAvailableAuctionNotStarted'"
            type="submit"
            name="submit"
            class="submit"
            @click.prevent="startAuctionAndBid">Start Auction</button>
          <button
            v-if="state === 'nameAvailableAuctionStarted'"
            type="submit"
            name="submit"
            class="submit"
            @click.prevent="() => {console.log('hello there!')}">Bid</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Timer from '../../components/Timer';
export default {
  components: {
    timer: Timer
  },
  props: {
    domainName: {
      type: String,
      default: ''
    },
    bidAmount: {
      type: Number,
      default: 0.01
    },
    bidMask: {
      type: Number,
      default: 0.02
    },
    secretPhrase: {
      type: String,
      default: ''
    },
    cancel: {
      type: Function,
      default: function() {}
    },
    startAuctionAndBid: {
      type: Function,
      default: function() {}
    },
    auctionDateEnd: {
      type: Number,
      default: 0
    },
    state: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localSecretPhrase: this.secretPhrase,
      localBidAmount: this.bidAmount,
      localBidMask: this.bidMask
    };
  },
  watch: {
    localSecretPhrase(newVal) {
      this.$emit('updateSecretPhrase', newVal);
    },
    localBidAmount(newVal) {
      this.$emit('updateBidAmount', +newVal);
    },
    localBidMask(newVal) {
      this.$emit('updateBidMask', +newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'EnsBidContainer.scss';
</style>

<template>
  <div class="main-content">
    <div class="content-title">
      <h2>Send Offline</h2>
    </div>

    <div class="online-status">
      <div class="">
        <p class="title">Online</p>
        <p class="description">Generate Information</p>
      </div>
      <div class="">
        <p class="title">Offline</p>
        <p class="description">Generate Transaction</p>
      </div>
      <div class="">
        <p class="title">Online</p>
        <p class="description">Send/Publish Transaction</p>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Speed of Transaction</h4>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input type="number" name="" value="" placeholder="Please Enter the Address">
      </div>
    </div>
    <div class="submit-button-container">
      <div class="submit-button large-round-button-green-filled clickable">
        Generate
      </div>
      <p>Have any issues? <a href="/">Learn more</a></p>
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
    copyAddress: function () {
      alert('This doesn\'t work for now.')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SendOfflineContainer.scss";
</style>

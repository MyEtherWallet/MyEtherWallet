<template>
  <div class="generate-info">
    <div class="wrap">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>Signed Transaction</h4>
          </div>
        </div>

        <div class="the-form gas-amount">
          <textarea name="" value="" readonly></textarea>
        </div>
      </div>
      <div class="submit-button-container">
        <div class="submit-button large-round-button-green-filled clickable">
          Send Transaction
        </div>
        <p>Have any issues? <a href="/">Learn more</a></p>
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
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "SendTx.scss";
</style>

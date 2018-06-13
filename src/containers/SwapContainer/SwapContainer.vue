<template>
  <div class="main-content">
    <div class="content-title">
      <h2>Swap</h2>
      <img class="icon" src="~@/assets/images/etc/bity.png">
    </div>

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="title">
            <h4>From</h4>
          </div>
          <div class="dropdown-select-search-1">
            <v-select :options="['foo','bar']"></v-select>
          </div>
          <div class="the-form amount-number">
            <input type="number" name="" value="" placeholder="Deposit Amount">
          </div>
        </div>
        <div class="exchange-icon">
          <i class="fa fa-exchange" aria-hidden="true"></i>
        </div>
        <div class="amount">
          <div class="title">
            <h4>To</h4>
          </div>
          <div class="dropdown-select-search-1">
            <v-select :options="['foo','bar']"></v-select>
          </div>
          <div class="the-form amount-number">
            <input type="number" name="" value="" placeholder="Received Amount">
          </div>
        </div>
      </div> <!-- .form-block .amount-to-address -->
    </div> <!-- .send-form -->

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Speed of Transaction</h4>
        </div>
      </div>
      <div class="the-form gas-amount">
        <input type="number" name="" value="" placeholder="Please Enter The Address">
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Speed of Transaction<span class="alert-button"></span></h4>
          <p>Transcation Fee: 0.000013 ETH ($1.234)</p>
        </div>
        <div class="buttons">
          <div class="small-circle-button-green-border">
            Slow
          </div>
          <div class="small-circle-button-green-border active">
            Regular
          </div>
          <div class="small-circle-button-green-border">
            Fast
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input type="number" name="" value="" placeholder="Gas Amount">
        <div class="good-button-container">
          <p>Gwei</p>
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <h4>1 ETH = 0.000231 BTC</h4>
      <div class="submit-button large-round-button-green-filled clickable">
        Continue
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
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "SwapContainer.scss";
</style>

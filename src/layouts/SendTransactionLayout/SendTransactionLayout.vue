<template>
  <div class="send-eth-and-tokens">
    <div class="wrap">
      <div class="side-nav">
        <transactions-side-menu></transactions-side-menu>
      </div>
      <div class="contents">
        <div class="tx-contents">
          <div class="">
            <transaction-address />
          </div>
          <div class="">
            <transaction-balance />
          </div>
          <div class="">
            <transaction-network />
          </div>
          <div class="main-content">
            <div class="content-title">
              <h2></h2>
            </div>

            <div class="send-form">
              <div class="form-block amount-to-address">
                <div class="amount">
                  <div class="title">
                    <h4>{{ $t("reused.sendTx") }}</h4>
                  </div>
                  <div class="dropdown-select-search-1">
                    <v-select :options="['foo','bar']"></v-select>
                    <i class="fa fa-search" aria-hidden="true"></i>
                  </div>
                  <div class="the-form amount-number">
                    <input type="number" name="" value="" placeholder="Amount">
                    <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="to-address">
                  <div class="title">
                    <h4>{{ $t("sendTx.toAddr") }}</h4>
                    <img class="icon" src="~@/assets/images/icons/avatar.svg">
                    <!-- <p v-on:click="copyAddress" class="copy-button">Copy</p> -->
                    <p class="copy-button">Copy</p>
                  </div>
                  <div class="the-form address-block">
                    <textarea id="address" name="name">0xe5cD582F564991F83bE7A5b3ba742cb4ff5c6FE2</textarea>
                    <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
                  </div>
                </div> <!-- .to-address -->
              </div> <!-- .form-block .amount-to-address -->
              <div class="error-message-container">
                <p>You don't have enough funds</p>
              </div>
            </div> <!-- .send-form -->

            <div class="send-form">
              <div class="title">
                <h4>{{ $t("sendTx.speedTx") }}</h4>
                <p>{{ $t("sendTx.txFee") }}: 0.000013 ETH ($1.234)</p>
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

            <div class="send-form advanced">
              <div class="advanced-content">
                <h4>Advanced</h4>
                <div class="toggle-button">
                  <span>Data & Gas Limited</span>
                  <!-- Rounded switch -->
                  <div class="sliding-switch-white">
                    <label class="switch">
                      <input type="checkbox">
                      <span class="slider round"></span>
                    </label>
                  </div>

                </div>
              </div>
            </div>

            <div class="submit-button-container">
              <div class="submit-button large-round-button-green-filled clickable">
                Send Transaction
              </div>
              <p>Have any issues? <a href="/">Learn more</a></p>
            </div>

          </div>
          <div class="tokens">
            <!-- <transaction-tokens /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SendTransactionLayout.scss";
</style>

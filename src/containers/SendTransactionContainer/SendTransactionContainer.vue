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
                  <div class="dropdown-select-search">
                    <v-select v-model="selected" :options="['foo','bar']"></v-select>
                  </div>
                  <div class="the-form amount-number">
                    <input type="text" name="" value="2.03222">
                  </div>
                </div>
                <div class="to-address">
                  <div class="title">
                    <h4>{{ $t("sendTx.toAddr") }}</h4>
                    <img class="icon" src="~@/assets/images/icons/avatar.svg">
                    <p class="copy-button">Copy</p>
                  </div>
                  <div class="the-form address-block">
                    <textarea name="name">0xe5cD582F564991F83bE7A5b3ba742cb4ff5c6FE2</textarea>
                  </div>
                </div> <!-- .to-address -->
              </div> <!-- .form-block .amount-to-address -->
            </div> <!-- .send-form -->

            <div class="send-form">
              <div class="title">
                <h4>{{ $t("sendTx.speedTx") }}</h4>
                <p>{{ $t("sendTx.txFee") }}: 0.000013 ETH ($1.234)</p>
              </div>
              <div class="the-form gas-amount">
                <input type="text" name="" value="2.03222">
              </div>
            </div>

          </div>
          <div class="tokens">
            <div class="">
              wfwgergergerg
            </div>
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
  @import "SendTransactionContainer.scss";
</style>

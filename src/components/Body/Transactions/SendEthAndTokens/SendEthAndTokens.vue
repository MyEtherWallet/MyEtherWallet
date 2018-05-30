<template>
  <div class="send-eth-and-tokens">
    <vue-header></vue-header>
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
            <div class="title">
              <h2>Send ETH & Tokens</h2>
            </div>

            <div class="status">
              <div class="status-block">
                <p>Online</p>
                <p>Generate Information</p>
              </div>
              <div class="status-block">
                <p>Offline</p>
                <p>Generate Transaction</p>
              </div>
              <div class="status-block active">
                <p>Online</p>
                <p>Send/Publish Transaction</p>
              </div>
            </div>

            <div class="send-form">

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
    <vue-footer></vue-footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "SendEthAndTokens.scss";
</style>

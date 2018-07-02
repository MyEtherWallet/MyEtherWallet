<template>
  <div class="swap">

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
            <div class="content-title">
              <h2>Deploy Contract</h2>
            </div>

            <div class="send-form">
              <div class="title-container">
                <div class="title">
                  <h4>Byte Code</h4>
                  <div class="copy-buttons">
                    <span>Clear</span>
                    <span>Copy</span>
                  </div>
                </div>
              </div>
              <div class="the-form domain-name">
                <input type="number" name="" value="" placeholder="Enter Domain Name or Address">
              </div>
            </div>

            <div class="send-form">
              <div class="title-container">
                <div class="title">
                  <h4>ABI/JSON Interface</h4>
                  <div class="copy-buttons">
                    <span>Clear</span>
                    <span>Copy</span>
                  </div>
                </div>
              </div>
              <div class="the-form domain-name">
                <textarea class="custom-textarea-1" name=""></textarea>
              </div>
            </div>

            <div class="send-form2">
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
              <router-link :to="{ name: 'InteractWithContract2', params: {} }">
                <div class="submit-button large-round-button-green-filled clickable">
                  Continue
                </div>
              </router-link>
              <div class="bottom-text">
                <p>Have any issues? <a href="/">Learn more</a></p>
              </div>
            </div>

          </div>
          <div class="tokens">
            <transaction-tokens />
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
  methods: {
    expendDomainCheckForm: function () {
      document.querySelector('.domain-check-form').classList.toggle('hidden')
      document.querySelector('.sub-domain-list').classList.add('hidden')
    },
    domainAvailabilityCheck: function () {
      // document.querySelector('.domain-check-form').classList.toggle('hidden')
      document.querySelector('.sub-domain-list').classList.remove('hidden')
    },
    domainBuyButtonClick: function ($event) {
      // $event.toElement.classList.toggle('very-small-circle-button-green-filled')
    }
  },
  mounted () {
    this.$store.state.state.pageStates.activeMenuSetter(['contract', 'deployContract'])
  }
}
</script>

<style lang="scss" scoped>
  @import "DeployContract.scss";
</style>

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
            <router-link to="/dapps" class="nounderline">
              <div class="content-title">
                <i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                <p>Back</p>
              </div>
            </router-link>

            <div class="send-form">
              <div class="title-container">
                <div class="title">
                  <h4>Register Domain - ENS</h4>
                  <p>DomainSale is a secondary market for the Ethereum Name Service that allows you to buy and sell domains that are already owned.</p>
                </div>
              </div>
              <div class="the-form domain-name">
                <input type="number" name="" value="" placeholder="Please Enter at Least 7 Characters">
                <span>.eth</span>
              </div>
            </div>

            <div class="submit-button-container">
              <div class="submit-button large-round-button-green-filled clickable">
                Check Domain
              </div>

              <div class="flex-container">
                <div class="title-container">
                  <h4 class="modal-title">Sub Domain</h4>
                  <div class="margin-left-auto add-custom-network">
                    <div class="sliding-switch-white">
                      <label class="switch">
                        <input v-on:click="expendDomainCheckForm" type="checkbox">
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="domain-check-form hidden">
                  <div class="domain-checker">
                    <input type="number" name="" value="" placeholder="Enter Domain Name">
                    <div class="check-button" v-on:click="domainAvailabilityCheck">
                      Check
                    </div>
                  </div>
                </div>
                <div class="sub-domain-list hidden">
                  <h4 class="title">All Sub Domains</h4>
                  <ul>
                    <li>
                      <p>myetherwallet2018.etherbase.eth</p>
                      <div class="buy-button-container">
                        <p>0 ETH</p>
                        <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                          Buy
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>myetherwallet2018.etherbase.eth</p>
                      <div class="buy-button-container">
                        <p>0 ETH</p>
                        <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border very-small-circle-button-green-filled">
                          Buy
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>myetherwallet2018.etherbase.eth</p>
                      <div class="buy-button-container">
                        <p>0 ETH</p>
                        <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                          Buy
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>myetherwallet2018.etherbase.eth</p>
                      <div class="buy-button-container">
                        <p>0 ETH</p>
                        <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                          Buy
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>myetherwallet2018.etherbase.eth</p>
                      <div class="buy-button-container">
                        <p>0 ETH</p>
                        <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                          Buy
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>myetherwallet2018.etherbase.eth</p>
                      <div class="buy-button-container">
                        <p>0 ETH</p>
                        <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                          Buy
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>myetherwallet2018.etherbase.eth</p>
                      <div class="buy-button-container">
                        <p>0 ETH</p>
                        <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                          Buy
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
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
    this.$store.state.state.pageStates.activeMenuSetter(['dapps'])
  }
}
</script>

<style lang="scss" scoped>
  @import "RegisterDomainENS.scss";
</style>

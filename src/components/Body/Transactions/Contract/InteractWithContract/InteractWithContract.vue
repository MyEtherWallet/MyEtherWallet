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
              <router-link to="/dapps" class="nounderline">
                <i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
              </router-link>
              <router-link to="/dapps" class="nounderline">
                <p>Back</p>
              </router-link>
            </div>

            <div class="send-form">
              <div class="title-container">
                <div class="title">
                  <h4>Contract Address</h4>
                </div>
                <sui-dropdown
                  fluid
                  placeholder="Select Friend"
                  selection
                  :options="options"
                  v-model="current"
                />
              </div>
              <div class="the-form domain-name">
                <input type="number" name="" value="" placeholder="Enter Domain Name or Address">
              </div>
            </div>

            <div class="send-form">
              <div class="title-container">
                <div class="title">
                  <h4>ABI/JSON Interface</h4>
                </div>
              </div>
              <div class="the-form domain-name">
                <textarea class="custom-textarea-1" name=""></textarea>
              </div>
            </div>

            <div class="submit-button-container">
              <div class="submit-button large-round-button-green-filled clickable">
                Continue
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
      current: null,
      options: [{
        key: 'Jenny Hess',
        text: 'Jenny Hess',
        value: 'Jenny Hess',
        image: { avatar: true, src: 'static/images/icons/btc.png' }
      },
      {
        key: 'Matt',
        text: 'Matt',
        value: 'Matt',
        image: { avatar: true, src: 'static/images/icons/btc.png' }
      },
      {
        key: 'Justen Kitsune',
        text: 'Justen Kitsune',
        value: 'Justen Kitsune',
        image: { avatar: true, src: 'static/images/icons/btc.png' }
      }]
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
  }
}
</script>

<style lang="scss" scoped>
  @import "InteractWithContract.scss";
</style>

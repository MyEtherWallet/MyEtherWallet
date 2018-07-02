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
                  <h4>Contract Address</h4>
                  <div class="select-contract no-border">
                    <v-select :options="existingContracts" placeholder="Choose existing contract"></v-select>
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
      existingContracts: [
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '1'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '2'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '3'
        },
        {
          label: 'Battle Of Thermopy wefweoifjwfo ewrofijweo gf',
          value: '4'
        }
      ]
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
  @import "DeployContract.scss";
</style>

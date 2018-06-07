<template>
  <div class="dapps">

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
              <h2>Dapps</h2>
            </div>
            <div class="buttons-container">
              <router-link to="/register-domain">
                <div class="dapps-button">
                  <img class="icon" src="~@/assets/images/icons/domain.svg">
                  <h4>Register Domain</h4>
                  <p>This is a function for register domain</p>
                </div>
              </router-link>
              <router-link to="/domain-sale">
                <div class="dapps-button">
                  <img class="icon" src="~@/assets/images/icons/domain-sale.svg">
                  <h4>Domain Sale</h4>
                  <p>This is a function for register domain</p>
                </div>
              </router-link>
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
    copyAddress: function () {
      alert('This doesn\'t work for now.')
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "Dapps.scss";
</style>

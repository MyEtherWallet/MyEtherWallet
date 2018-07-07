<template>
  <div class="generate-info">
    <div class="wrap">

      <div class="send-form">
        <div class="title-container">
          <div class="title-and-copy">
            <div><h4>From Address</h4></div>
            <div class="form-controller">
              <p class="linker-1" v-on:click="deleteFromAddress">Clear</p>
              <p class="linker-1" v-on:click="copyFromAddress">Copy</p>
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input id="from-address" type="text" name="" value="" placeholder="From Address">
          <div class="good-button-container">
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div v-if="moreInfoGenerated">
        <div class="send-form">
          <div class="title-container">
            <div class="title">
              <div class="title-helper">
                <h4>Speed of Transaction</h4>
                <div class="tooltip-box-1">
                  <b-btn id="exPopover1"></b-btn>
                  <b-popover target="exPopover1" triggers="hover focus" placement="top">
                    <template slot="title">MetaMask</template>
                    <img class="icon" src="~@/assets/images/icons/button-metamask.svg">
                    MetaMask is a <strong>bridge</strong> that allows you to visit the distributed web of tomorrow in your browser today.
                    It allows you to <strong>run Ethereum dApps right in your browser without running a full Ethereum node.</strong>
                    MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.
                  </b-popover>
                </div>
              </div>
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

        <div class="send-form">
          <div class="title-container">
            <div class="title">
              <div class="title-helper">
                <h4>Nonce</h4>
                <div class="tooltip-box-1">
                  <b-btn id="exPopover2"></b-btn>
                  <b-popover target="exPopover2" triggers="hover focus" placement="top">
                    <template slot="title">MetaMask</template>
                    <img class="icon" src="~@/assets/images/icons/button-metamask.svg">
                    MetaMask is a <strong>bridge</strong> that allows you to visit the distributed web of tomorrow in your browser today.
                    It allows you to <strong>run Ethereum dApps right in your browser without running a full Ethereum node.</strong>
                    MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.
                  </b-popover>
                </div>
              </div>
            </div>
          </div>
          <div class="the-form gas-amount">
            <input type="number" name="" value="" placeholder="Gas Amount">
            <div class="good-button-container">
              <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!moreInfoGenerated" class="submit-button-container">
        <div class="submit-button large-round-button-green-filled clickable" v-on:click="generateInfo">
          Generate
        </div>
        <p>Have any issues? <a href="/">Learn more</a></p>
      </div>

      <div v-if="moreInfoGenerated" class="submit-button-container">
        <div class="submit-button large-round-button-green-filled clickable" v-on:click="processChange">
          Continue
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
      moreInfoGenerated: false
    }
  },
  methods: {
    generateInfo: function () {
      this.moreInfoGenerated = true
    },
    copyFromAddress: function () {
      document.querySelector('#from-address').select()
      document.execCommand('copy')
    },
    deleteFromAddress: function () {
      document.querySelector('#from-address').value = ''
    },
    processChange: function () {
      this.$store.state.state.pageStates.sendOffline.processLocation = 'process2'
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "GenerateInfo.scss";
</style>

<template>
  <div class="transaction-info-blocks">

    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <div class="modal-container">
      <!-- Modal (MEW Connect) ============================================================================================================================================ -->
      <b-modal ref="network" hide-footer class="bootstrap-modal network nopadding max-height-1" title="Network">
        <div class="content-block">
          <div class="flex-container">
            <h4>Advanced</h4>
            <div class="margin-left-auto add-custom-network">
              <p>Add Custom Network/Node</p>
              <div class="sliding-switch-white">
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="content-block">
          <div class="">

          </div>
          <h4 class="dot-green">ETH</h4>
          <div class="grid-3">
            <p>myetherapi.com</p>
            <p>infura.io</p>
            <p>giveth.io</p>
            <p>etherscan.io</p>
          </div>
        </div>
        <div class="content-block">
          <h4 class="dot-bluegreen">ETC</h4>
          <div class="grid-3">
            <p>Ethereum Commonwealth</p>
            <p>epool.io</p>
          </div>
        </div>
        <div class="content-block">
          <h4 class="dot-blue">ROPSTEN ETH <span>(Test environment)</span></h4>
          <div class="grid-3">
            <p>myetherapi.com</p>
            <p>epool.io</p>
          </div>
        </div>
        <div class="content-block">
          <h4 class="dot-orange">EXP</h4>
          <div class="grid-3">
            <p>expense.tech</p>
          </div>
        </div>
        <div class="content-block">
          <h4 class="dot-green">EXP</h4>
          <div class="grid-3">
            <p>expense.tech</p>
          </div>
        </div>
      </b-modal>
    </div>
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->

    <div v-on:click="networkModalOpen" class="wrap">
      <div class="info-block network">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/network.svg">
        </div>
        <div class="block-content">
          <h2>Network</h2>
          <p>myetherapi.com(ETH)</p>
          <p>Last Block#: 5699679</p>
          <div class="icon-container">
            <img src="~@/assets/images/icons/change.svg">
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
    }
  },
  methods: {
    networkModalOpen () {
      this.$refs.network.show()
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionNetwork.scss";
</style>

<template>
  <div class="transaction-info-blocks">

    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <div class="modal-container">
      <!-- Modal (MEW Connect) ============================================================================================================================================ -->
      <b-modal ref="network" hide-footer centered class="bootstrap-modal network nopadding max-height-1" title="Network">
        <div class="content-block">
          <div class="flex-container">
            <h4 class="modal-title">Advanced</h4>
            <div class="margin-left-auto add-custom-network">
              <p>Add Custom Network/Node</p>
              <div class="sliding-switch-white">
                <label class="switch">
                  <input v-on:click="addCustomNetworkToggle" type="checkbox">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="network-list">
          <div class="content-block">
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
        </div> <!-- .network-list -->
        <div class="network-add hidden">
          <div class="content-block">
            <div class="input-block-container">
              <input class="custom-input-text-1" type="text" name="" value="" placeholder="ETH Node Name">
              <select class="custom-select-1">
                <option value="network">Network</option>
                <option value="node">Node</option>
              </select>
              <input class="custom-input-text-1" type="text" name="" value="" placeholder="URL">
              <input class="custom-input-text-1" type="text" name="" value="" placeholder="Port">
            </div>
          </div>

          <div class="content-block">
            <div class="flex-container">
              <h4 class="modal-title">HTTP Basic Access Athentication</h4>
              <div class="margin-left-auto add-custom-network">
                <div class="sliding-switch-white">
                  <label class="switch">
                    <input v-on:click="expendAuth" type="checkbox">
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="auth-form-container hidden">
              <input class="custom-input-text-1" type="text" name="" value="" placeholder="User Name">
              <input class="custom-input-text-1" type="text" name="" value="" placeholder="Password">
            </div>
          </div>

          <div class="content-block">
            <div class="save-button-container">
              <div class="save-button large-round-button-green-filled clickable">
                Save
              </div>
              <p>Don't know what it is? <a href="/">Learn more</a></p>
            </div>
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
          <div class="icon-container small-tooltop-1">
            <div v-b-tooltip.hover title="Refresh" class="custom-tooltip">
              <img src="~@/assets/images/icons/change.svg">
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
    }
  },
  methods: {
    networkModalOpen () {
      this.$refs.network.show()
    },
    addCustomNetworkToggle () {
      document.querySelector('.network-list').classList.toggle('hidden')
      document.querySelector('.network-add').classList.toggle('hidden')
      document.querySelector('.network').classList.toggle('max-height-1')
    },
    expendAuth () {
      document.querySelector('.auth-form-container').classList.toggle('hidden')
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionNetwork.scss";
</style>

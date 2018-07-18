<template>
  <div>
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
          <!-- <p>Transcation Fee: 0.000013 ETH ($1.234)</p> -->
        </div>
        <div class="buttons">
          <div :class="[$store.state.gasPrice === 5 ? 'active': '','small-circle-button-green-border']" @click="setSpeed(5)">
            Slow
          </div>
          <div :class="[$store.state.gasPrice === 45 ? 'active': '','small-circle-button-green-border']" @click="setSpeed(45)">
            Regular
          </div>
          <div :class="[$store.state.gasPrice === 75 ? 'active': '','small-circle-button-green-border']" @click="setSpeed(75)">
            Fast
          </div>
        </div>
      </div>
      <div class="the-form gas-amount">
        <input type="number" name="" :value="$store.state.gasPrice" placeholder="Gas Price" v-on:change="setSpeed">
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
        <input type="number" v-model="locNonce" placeholder="Nonce">
        <div class="good-button-container">
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>Gas Limit</h4>
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
        <input type="number" v-model="gasPrice" placeholder="Gas Limit">
        <div class="good-button-container">
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "TxSpeedInput.scss";
</style>

<script>
export default {
  props: ['data', 'toAddress', 'value', 'gasLimit', 'nonce'],
  data () {
    return {
      fast: 75,
      regular: 45,
      slow: 5,
      gasPrice: this.gasLimit,
      locNonce: this.nonce
    }
  },
  methods: {
    setSpeed (val) {
      if (val.target !== undefined) {
        this.$store.dispatch('setGasPrice', Number(val.target.value))
      } else {
        this.$store.dispatch('setGasPrice', Number(val))
      }
    }
  },
  watch: {
    locNonce (newVal) {
      this.$emit('nonceUpdate', newVal)
    },
    gasPrice (newVal) {
      this.$emit('gasLimitUpdate', newVal)
    }
  }
}
</script>

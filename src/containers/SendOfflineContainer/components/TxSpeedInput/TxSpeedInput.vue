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
          <p>Transcation Fee: 0.000013 ETH ($1.234)</p>
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
        <input type="number" v-model="nonce" placeholder="Nonce">
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
import BigNumber from 'bignumber.js'
import web3 from 'web3'
// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  props: ['data', 'toAddress', 'value', 'gasLimit'],
  data () {
    return {
      fast: 75,
      regular: 45,
      slow: 5,
      gasPrice: this.gasLimit,
      nonce: this.$store.state.account.nonce + 1
    }
  },
  methods: {
    setSpeed (val) {
      if (val.target !== undefined) {
        this.$store.dispatch('setGasPrice', Number(val.target.value))
      } else {
        this.$store.dispatch('setGasPrice', Number(val))
      }
    },
    async generateGasEstimate () {
      let txObject = {
        from: this.$store.state.wallet.getAddressString(),
        to: this.toAddress === undefined ? '' : this.toAddress,
        value: this.value === undefined ? 0 : unit.toWei(new BigNumber(this.value), 'ether'),
        gasPrice: this.gasLimit,
        nonce: this.$store.state.account.nonce + 1,
        data: this.data === undefined ? '0x' : this.data
      }

      this.gasPrice = await this.$store.state.web3.eth.estimateGas(txObject).then(res => {
        return res
      }).catch(err => console.log(err))
    }
  },
  watch: {
    toAddress (newVal) {
      if (this.$store.state.online && web3.utils.isAddress(newVal)) {
        this.generateGasEstimate()
      }
    },
    nonce (newVal) {
      this.$store.dispatch('setAccountNonce', Number(newVal))
    },
    gasPrice (newVal) {
      this.$emit('gasLimitUpdate', newVal)
    },
    toAmt (newVal) {
      console.log(unit.toWei(new BigNumber(newVal), 'ether'))
    }
  }
}
</script>

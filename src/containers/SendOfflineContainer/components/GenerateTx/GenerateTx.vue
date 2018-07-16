<template>
  <div class="generate-info">
    <div class="wrap">

      <div class="send-form">
        <div class="form-block amount-to-address">
          <div class="amount">
            <div class="title">
              <h4>Amount</h4>
            </div>
            <div class="dropdown-select-search-1">
              <v-select :options="coinType" v-model="selectedCoinType"></v-select>
              <i class="fa fa-search" aria-hidden="true"></i>
            </div>
            <div class="the-form amount-number">
              <input type="number" name="" v-model="toAmt" placeholder="Deposit Amount">
              <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
            </div>
          </div>
          <div class="to-address">
            <div class="title">
              <h4>To Address</h4>
              <blockie :address="toAddress" width="22px" height="22px" v-if="toAddress.length !== 0"></blockie>
              <p v-on:click="copyToAddress" class="copy-button linker-1 prevent-user-select">Copy</p>
            </div>
            <div class="the-form address-block">
              <textarea ref="toaddress" name="name" v-model="toAddress" placeholder="Please Enter The Address"></textarea>
              <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div class="error-message-container" v-show="parsedBalance < toAmt">
          <p>You don't have enough funds</p>
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div class="title-helper">
              <h4>Data</h4>
              <div class="tooltip-box-1">
                <b-btn id="exPopover4"></b-btn>
                <b-popover target="exPopover4" triggers="hover focus" placement="top">
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
          <input type="number" name="" v-model="toData" placeholder="e.g. 0x65746865726d696e652d657531">
          <div class="good-button-container">
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <tx-speed-input :toAddress="toAddress"></tx-speed-input>
      <div class="submit-button-container">
        <div class="submit-button large-round-button-green-filled clickable" @click="next">
          Generate
        </div>
        <interface-bottom-text link="/" question="Have issues?" linkText="Learn More"></interface-bottom-text>
      </div>

    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import TxSpeedInput from '../../components/TxSpeedInput'
import Blockie from '@/components/Blockie'
// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'tx-speed-input': TxSpeedInput,
    'blockie': Blockie
  },
  data () {
    return {
      toAmt: 0,
      toAddress: '',
      toData: '',
      parsedBalance: 0,
      coinType: [
        {label: 'ETH', value: 'eth'},
        {label: '$FFC', value: 'ffc'},
        {label: '$FYX', value: 'fyx'},
        {label: '0xBTC', value: 'oxbtc'}
      ],
      selectedCoinType: ''
    }
  },
  methods: {
    copyToAddress () {
      this.$refs('toaddress').select()
      document.execCommand('copy')
    },
    next () {
      this.$store.dispatch('updatePageState', ['interface', 'sendOffline', 'sendPubTx'])
    }
  },
  mounted () {
    this.parsedBalance = unit.fromWei(this.$store.state.account.balance.result, 'ether')
  },
  watch: {
    parsedBalance (newVal) {
      this.parsedBalance = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "GenerateTx.scss";
</style>

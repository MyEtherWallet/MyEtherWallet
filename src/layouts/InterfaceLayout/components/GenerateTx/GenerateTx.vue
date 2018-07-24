<template>
  <div class="generate-info">
    <div class="wrap">

      <div class="send-form">
        <div class="form-block amount-to-address">
          <div class="amount">
            <div class="title">
              <h4>Amount</h4>
            </div>
            <currency-picker :currency="coinType" page="sendOfflineGenTx" :token="true"></currency-picker>
            <div class="the-form amount-number">
              <input type="number" name="" v-model="toAmt" placeholder="Deposit Amount">
              <i :class="[parsedBalance < toAmt ? 'not-good': '','fa fa-check-circle good-button']" aria-hidden="true"></i>
            </div>
          </div>
          <div class="to-address">
            <div class="title">
              <h4>To Address</h4>
              <blockie :address="toAddress" width="22px" height="22px" v-show="toAddress !== '' && !validAddress"></blockie>
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
        <div class="error-message-container" v-show="toAddress !== '' && !validAddress">
          <p>Invalid Address</p>
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
      <tx-speed-input :nonce="nonce" v-on:nonceUpdate="nonceUpdated" :data="toData" :value="toAmt" :toAddress="toAddress" :gasLimit="gasLimit" v-on:gasLimitUpdate="gasLimitUpdated"></tx-speed-input>
      <div class="submit-button-container">
        <div :class="[!validAddress ? 'disabled': '' ,'submit-button large-round-button-green-filled']" @click="next">
          Generate
        </div>
        <interface-bottom-text link="/" question="Have issues?" linkText="Learn More"></interface-bottom-text>
      </div>

    </div>
    <signed-tx-modal :signedTx="signed" :rawTx="raw" :pathUpdate="pathUpdate"></signed-tx-modal>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import TxSpeedInput from '../../components/TxSpeedInput'
import CurrencyPicker from '../CurrencyPicker'
import SignedTxModal from '../../components/SignedTxModal'
import Blockie from '@/components/Blockie'
// eslint-disable-next-line
const EthTx = require('ethereumjs-tx')
// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  props: ['gasLimit', 'nonce'],
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'tx-speed-input': TxSpeedInput,
    'blockie': Blockie,
    'signed-tx-modal': SignedTxModal,
    'currency-picker': CurrencyPicker
  },
  data () {
    return {
      toAmt: 0,
      toAddress: '',
      toData: '0x',
      parsedBalance: 0,
      localGas: this.gasLimit,
      coinType: [
        {symbol: '$FFC', name: 'ffc'},
        {symbol: '$FYX', name: 'fyx'},
        {symbol: '0xBTC', name: 'oxbtc'}
      ],
      selectedCoinType: '',
      raw: '',
      signed: '',
      locNonce: this.nonce,
      validAddress: false
    }
  },
  methods: {
    copyToAddress () {
      this.$refs('toaddress').select()
      document.execCommand('copy')
    },
    next () {
      const raw = {
        from: this.$store.state.wallet.getAddressString(),
        gas: this.localGas,
        value: unit.toWei(this.toAmt, 'ether'),
        data: this.toData,
        nonce: this.locNonce,
        gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
        to: this.toAddress,
        chainId: this.$store.state.network.type.chainID
      }

      const tx = new EthTx(raw)
      tx.sign(this.$store.state.wallet.getPrivateKey())
      const serializedTx = tx.serialize()
      const signedTx = `0x${serializedTx.toString('hex')}`
      this.$emit('createdRawTx', signedTx)

      this.raw = raw
      this.signed = signedTx
      this.$children[5].$refs.signedTx.show()
      window.scrollTo(0, 0)
    },
    gasLimitUpdated (e) {
      this.$emit('gasLimitUpdate', e)
    },
    nonceUpdated (e) {
      this.$emit('nonceUpdate', e)
    },
    pathUpdate () {
      this.$emit('pathUpdate', 'sendPubTx')
    }
  },
  mounted () {
    this.parsedBalance = unit.fromWei(this.$store.state.account.balance.result, 'ether')
  },
  watch: {
    parsedBalance (newVal) {
      this.parsedBalance = newVal
    },
    gasLimit (newVal) {
      this.localGas = newVal
    },
    toAddress (newVal) {
      if (newVal !== '' && newVal.length !== 0 && this.$store.state.web3.utils.isAddress(newVal)) {
        this.validAddress = true
      } else {
        this.validAddress = false
      }

      this.toAddress = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "GenerateTx.scss";
</style>

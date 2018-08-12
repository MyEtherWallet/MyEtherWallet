<template>
  <div class="send-currency-container">
    <interface-container-title :title="$t('common.sendTx')"></interface-container-title>

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="title">
            <h4>{{ $t('interface.sendTxAmount') }}</h4>
            <p v-on:click="setBalanceToAmt" class="title-button prevent-user-select">Entire
                                                                                     Balance</p>
          </div>
          <currency-picker :currency="tokensWithBalance" v-on:selectedCurrency="setSelectedCurrency"
                           :page="'sendEthAndTokens'" :token="true"></currency-picker>
          <div class="the-form amount-number">
            <input type="number" name="" v-model="amount" placeholder="Amount"/>
            <i
              :class="[selectedCurrency.name === 'Ether' ? parsedBalance < amount ? 'not-good': '' : selectedCurrency.balance < amount ? 'not-good': '','fa fa-check-circle good-button']"
              aria-hidden="true"></i>
          </div>
          <div class="error-message-container"
               v-if="selectedCurrency.name === 'Ether' ? amount > parsedBalance : selectedCurrency.balance < amount">
            <p>{{ $t('common.dontHaveEnough') }}</p>
          </div>
        </div>
        <div class="to-address">
          <div class="title">
            <h4>{{ $t('interface.sendTxToAddr') }}</h4> &nbsp;
            <blockie :address="toAddress" width="22px" height="22px"
                     v-show="addressValid && toAddress.length !== 0"></blockie>
            <p class="copy-button prevent-user-select" v-on:click="copyToClipboard('address')">{{
                                                                                               $t('common.copy')
                                                                                               }}</p>
          </div>
          <div class="the-form address-block">
            <textarea ref="address" name="name" v-model="toAddress" autocomplete="off"></textarea>
            <i
              :class="[addressValid && toAddress.length !== 0 ? '':'not-good', 'fa fa-check-circle good-button']"
              aria-hidden="true"></i>
          </div>
          <div class="error-message-container">
            <p v-if="toAddress.length === 0 && toAddress === ''">Can't be empty</p>
            <p v-show="!addressValid && toAddress !== ''">Invalid address</p>
          </div>
        </div>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>{{ $t('common.speedTx') }}</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTransactionContent')"/>
          </div>
          <p>{{ $t('common.txFee') }}: {{ transactionFee }} ETH </p>
        </div>
        <div class="buttons">
          <div
            :class="[$store.state.gasPrice === 5 ? 'active': '', 'small-circle-button-green-border']"
            @click="changeGas(5)">
            {{ $t('common.slow') }}
          </div>
          <div
            :class="[$store.state.gasPrice === 45 ? 'active': '', 'small-circle-button-green-border']"
            @click="changeGas(45)">
            {{ $t('common.regular') }}
          </div>
          <div
            :class="[$store.state.gasPrice === 75 ? 'active': '', 'small-circle-button-green-border']"
            @click="changeGas(75)">
            {{ $t('common.fast') }}
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input type="number" name="" v-model="gasAmount" placeholder="Gas Amount"/>
        <div class="good-button-container">
          <p>Gwei</p>
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="send-form advanced">
      <div class="advanced-content">
        <h4>{{ $t('common.advanced') }}</h4>
        <div class="toggle-button">
          <span>{{ $t('interface.dataGas') }}</span>
          <!-- Rounded switch -->
          <div class="sliding-switch-white">
            <label class="switch">
              <input type="checkbox" v-on:click="advancedExpend = !advancedExpend"/>
              <span class="slider round"></span>
            </label>
          </div>
          <br/>
          <div class="input-container" v-if="advancedExpend">
            <div class="the-form user-input">
              <input type="text" name="" v-model="data"
                     placeholder="Add Data (e.g. 0x7834f874g298hf298h234f)" autocomplete="off"/>
            </div>
            <div class="the-form user-input">
              <input type="number" name="" v-model="gasLimit" placeholder="Gas Limit"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div
        :class="[addressValid && toAddress.length !== 0? '': 'disabled','submit-button large-round-button-green-filled']"
        @click="confirmationModalOpen">
        {{ $t('interface.sendTx') }}
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')"
                             :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>
    <confirm-modal :showSuccess="showSuccessModal" :signedTx="signedTx" :fee="transactionFee"
                   :gasPrice="$store.state.gasPrice" :from="$store.state.wallet.getAddressString()"
                   :to="toAddress" :value="amount" :gas="gasLimit" :data="data"
                   :nonce="nonce + 1"></confirm-modal>
    <success-modal message="Sending Transaction" linkMessage="Close"></success-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import CurrencyPicker from '../../components/CurrencyPicker'
import InterfaceBottomText from '@/components/InterfaceBottomText'
import ConfirmModal from '@/components/ConfirmModal'
import Blockie from '@/components/Blockie'
import SuccessModal from '@/components/SuccessModal'

// eslint-disable-next-line
const EthTx = require('ethereumjs-tx')
// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  props: ['address', 'tokensWithBalance'],
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'confirm-modal': ConfirmModal,
    'blockie': Blockie,
    'currency-picker': CurrencyPicker,
    'success-modal': SuccessModal
  },
  data () {
    return {
      advancedExpend: false,
      addressValid: true,
      amount: 0,
      amountValid: true,
      nonce: 0,
      gasLimit: 21000,
      data: '0x',
      gasAmount: this.$store.state.gasPrice,
      parsedBalance: 0,
      toAddress: '',
      transactionFee: 0,
      selectedCurrency: {symbol: 'ETH', name: 'Ethereum'},
      raw: {},
      signedTx: ''
    }
  },
  methods: {
    copyToClipboard (ref) {
      this.$refs[ref].select()
      document.execCommand('copy')
    },
    showSuccessModal () {
      this.$children[6].$refs.success.show()
    },
    createTx () {
      (async () => {
        const jsonInterface = [{
          'constant': false,
          'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_amount', 'type': 'uint256'}],
          'name': 'transfer',
          'outputs': [{'name': 'success', 'type': 'bool'}],
          'payable': false,
          'type': 'function'
        }]
        const contract = new this.$store.state.web3.eth.Contract(jsonInterface)
        const isEth = this.selectedCurrency.name === 'Ethereum'
        this.nonce = await this.$store.state.web3.eth.getTransactionCount(this.$store.state.wallet.getAddressString())
        this.data = isEth ? this.data : contract.methods.transfer(this.toAddress, unit.toWei(this.amount, 'ether')).encodeABI()

        this.raw = {
          from: this.$store.state.wallet.getAddressString(),
          gas: this.gasLimit,
          nonce: this.nonce,
          gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
          value: isEth ? this.amount === '' ? 0 : unit.toWei(this.amount, 'ether') : 0,
          to: isEth ? this.toAddress : this.selectedCurrency.addr,
          data: this.data
        }

        if (this.toAddress === '') {
          delete this.raw['to']
        }

        const fromAddress = this.raw.from
        this.$store.state.web3.eth.sendTransaction(this.raw)
          .once('transactionHash', (hash) => {
            this.$store.dispatch('addNotification', [fromAddress, hash, 'Transaction Hash'])
          })
          .on('receipt', (res) => {
            this.$store.dispatch('addNotification', [fromAddress, res, 'Transaction Receipt'])
          })
          .on('error', (err) => {
            this.$store.dispatch('addNotification', [fromAddress, err, 'Transaction Error'])
          })
      })()
    },
    confirmationModalOpen () {
      this.createTx()
      window.scrollTo(0, 0)
    },
    changeGas (val) {
      this.gasAmount = val
      this.createDataHex()
      this.$store.dispatch('setGasPrice', Number(val))
    },
    setBalanceToAmt () {
      if (this.selectedCurrency.name === 'Ethereum') {
        this.amount = this.parsedBalance - this.transactionFee
      }
    },
    createDataHex () {
      if (this.selectedCurrency.name !== 'Ethereum') {
        const jsonInterface = [{
          'constant': false,
          'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_amount', 'type': 'uint256'}],
          'name': 'transfer',
          'outputs': [{'name': 'success', 'type': 'bool'}],
          'payable': false,
          'type': 'function'
        }]
        const contract = new this.$store.state.web3.eth.Contract(jsonInterface)
        this.data = contract.methods.transfer(this.toAddress, this.amount).encodeABI()
      } else {
        this.data = '0x'
      }
    },
    setSelectedCurrency (e) {
      this.selectedCurrency = e
      this.createDataHex()
    },
    estimateGas () {
      const newRaw = this.raw
      delete newRaw['gas']
      delete newRaw['nonce']
      // this.createTx() // Is it necessary to generate the signed transaction here?
      this.createDataHex()
      this.$store.state.web3.eth.estimateGas(newRaw).then(res => {
        this.transactionFee = unit.fromWei(unit.toWei(this.$store.state.gasPrice, 'gwei') * res, 'ether')
        this.gasLimit = res
      }).catch(err => console.log(err))
    },
    verifyAddr () {
      if (this.toAddress.length !== 0 && this.toAddress !== '') {
        const valid = this.$store.state.web3.utils.isAddress(this.toAddress)
        if (!valid) {
          return true
        } else {
          return false
        }
      }
    }
  },
  mounted () {
    if (this.account.balance) {
      this.parsedBalance = unit.fromWei(parseInt(this.account.balance), 'ether')
    }
  },
  watch: {
    toAddress (newVal) {
      this.toAddress = newVal
      if (this.verifyAddr()) {
        this.addressValid = false
      } else {
        this.estimateGas()
        this.addressValid = true
      }
    },
    parsedBalance (newVal) {
      this.parsedBalance = newVal
    },
    gasAmount (newVal) {
      this.gasAmount = newVal
      if (!this.verifyAddr()) {
        this.estimateGas()
      }
      this.$store.dispatch('setGasPrice', Number(newVal))
    },
    amount (newVal) {
      this.amount = newVal
      if (!this.verifyAddr()) {
        this.estimateGas()
      }
    },
    selectedCurrency (newVal) {
      this.estimateGas()
      this.selectedCurrency = newVal
    }
  },
  computed: {
    ...mapGetters({
      account: 'account'
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "SendCurrencyContainer.scss";
</style>

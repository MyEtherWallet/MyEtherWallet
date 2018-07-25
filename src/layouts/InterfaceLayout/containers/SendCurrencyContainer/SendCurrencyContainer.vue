<template>
  <div class="send-currency-container">
    <interface-container-title :title="$t('reused.sendTx')"></interface-container-title>

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="title">
            <h4>Amount</h4>
             <p v-on:click="setBalanceToAmt" class="title-button prevent-user-select">Entire Balance</p>
          </div>
          <currency-picker :currency="tokensWithBalance" v-on:selectedCurrency="setSelectedCurrency" :page="'sendEthAndTokens'" :token="true"></currency-picker>
          <div class="the-form amount-number">
            <input type="number" name="" v-model="amount" placeholder="Amount">
            <i :class="[parsedBalance < amount ? 'not-good': '','fa fa-check-circle good-button']" aria-hidden="true"></i>
          </div>
          <div class="error-message-container" v-if="amount > parsedBalance">
            <p>{{ $t('reused.dontHaveEnough') }}</p>
          </div>
        </div>
        <div class="to-address">
          <div class="title">
            <h4>{{ $t("sendTx.toAddr") }}</h4> &nbsp;
            <blockie :address="toAddress" width="22px" height="22px" v-show="addressValid && toAddress.length !== 0"></blockie>
            <p class="copy-button prevent-user-select" v-on:click="copyToClipboard('address')">{{ $t('reused.copy') }}</p>
          </div>
          <div class="the-form address-block">
            <textarea ref="address" name="name" v-model="toAddress"></textarea>
            <i :class="[addressValid && toAddress.length !== 0 ? '':'not-good', 'fa fa-check-circle good-button']" aria-hidden="true"></i>
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
            <h4>{{ $t("reused.speedTx") }}</h4>
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
          <p>{{ $t("reused.txFee") }}: {{ transactionFee }} ETH </p>
        </div>
        <div class="buttons">
          <div :class="[$store.state.gasPrice === 5 ? 'active': '', 'small-circle-button-green-border']" @click="changeGas(5)">
            {{ $t('reused.slow') }}
          </div>
          <div :class="[$store.state.gasPrice === 45 ? 'active': '', 'small-circle-button-green-border']" @click="changeGas(45)">
            {{ $t('reused.regular') }}
          </div>
          <div :class="[$store.state.gasPrice === 75 ? 'active': '', 'small-circle-button-green-border']" @click="changeGas(75)">
            {{ $t('reused.fast') }}
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input type="number" name="" v-model="gasAmount" placeholder="Gas Amount">
        <div class="good-button-container">
          <p>Gwei</p>
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="send-form advanced">
      <div class="advanced-content">
        <h4>{{ $t('reused.advanced') }}</h4>
        <div class="toggle-button">
          <span>{{ $t('interface.dataGas') }}</span>
          <!-- Rounded switch -->
          <div class="sliding-switch-white">
            <label class="switch">
              <input type="checkbox" v-on:click="advancedExpend = !advancedExpend">
              <span class="slider round"></span>
            </label>
          </div>
          <br/>
          <div class="input-container" v-if="advancedExpend">
            <div class="the-form user-input">
              <input type="number" name="" v-model="data" placeholder="Add Data (e.g. 0x7834f874g298hf298h234f)">
            </div>
            <div class="the-form user-input">
              <input type="number" name="" v-model="gasLimit" placeholder="Gas Limit">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div :class="[addressValid && toAddress.length !== 0? '': 'disabled','submit-button large-round-button-green-filled']" @click="confirmationModalOpen">
        {{ $t('interface.sendTx') }}
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>
    <confirm-modal :fee="transactionFee" :gasLimit="gasLimit" :from="$store.state.wallet.getAddressString()" :to="toAddress" :value="amount" :gas="$store.state.gasPrice" :data="data" :nonce="$store.state.account.nonce + 1"></confirm-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import CurrencyPicker from '../../components/CurrencyPicker'
import InterfaceBottomText from '@/components/InterfaceBottomText'
import ConfirmModal from '@/components/ConfirmModal'
import Blockie from '@/components/Blockie'

// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  props: ['address', 'tokensWithBalance'],
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'confirm-modal': ConfirmModal,
    'blockie': Blockie,
    'currency-picker': CurrencyPicker
  },
  data () {
    return {
      advancedExpend: false,
      addressValid: true,
      amount: 0,
      amountValid: true,
      gasLimit: 21000,
      data: '0x',
      gasAmount: this.$store.state.gasPrice,
      parsedBalance: 0,
      toAddress: '',
      transactionFee: 0,
      selectedCurrency: {symbol: 'ETH', name: 'Ethereum'}
    }
  },
  methods: {
    copyToClipboard (ref) {
      this.$refs[ref].select()
      document.execCommand('copy')
    },
    confirmationModalOpen () {
      this.$children[5].$refs.confirmation.show()
    },
    changeGas (val) {
      this.gasAmount = val
      this.$store.dispatch('setGasPrice', Number(val))
    },
    setBalanceToAmt () {
      if (this.selectedCurrency.name === 'Ethereum') {
        this.amount = this.parsedBalance - this.transactionFee
      } else {
        this.amount = this.selectedCurrency.balance - this.transactionFee
      }
    },
    setSelectedCurrency (e) {
      this.selectedCurrency = e
    },
    estimateGas () {
      const raw = {
        from: this.$store.state.wallet.getAddressString(),
        value: this.amount,
        gas: unit.toWei(this.$store.state.gasPrice, 'gwei'),
        data: this.data,
        nonce: this.$store.state.account.nonce + 1
      }

      if (this.toAddress !== '') {
        raw['to'] = this.toAddress
      }

      this.gasPrice = this.$store.state.web3.eth.estimateGas(raw).then(res => {
        this.transactionFee = unit.fromWei(unit.toWei(this.$store.state.gasPrice, 'gwei') * res, 'ether')
        return res
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
    // const jsonInterface = [{'constant': false, 'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_amount', 'type': 'uint256'}], 'name': 'transfer', 'outputs': [{'name': 'success', 'type': 'bool'}], 'payable': false, 'type': 'function'}]
    // const contract = new this.$store.state.web3.eth.Contract(jsonInterface)
    // console.log(contract.methods.transfer(this.toAddress))
    this.parsedBalance = unit.fromWei(parseInt(this.account.balance.result), 'ether')
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

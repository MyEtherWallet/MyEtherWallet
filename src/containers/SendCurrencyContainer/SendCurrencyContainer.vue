<template>
  <div class="send-currency-container">
    <confirm-modal></confirm-modal>
    <div class="content-title">
      <h2>{{ $t('reused.sendTx') }}</h2>
    </div>

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="title">
            <h4>Amount</h4>
             <p v-on:click="setBalanceToAmt" class="title-button prevent-user-select">Entire Balance</p>
          </div>
          <div class="dropdown-select-search-1">
            <v-select :options="['foo','bar']"></v-select>
            <i class="fa fa-search" aria-hidden="true"></i>
          </div>
          <div class="the-form amount-number">
            <input type="number" name="" v-model="amount" placeholder="Amount">
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
          <div class="error-message-container" v-if="amount > parsedBalance">
            <p>{{ $t('reused.dontHaveEnough') }}</p>
          </div>
        </div>
        <div class="to-address">
          <div class="title">
            <h4>{{ $t("sendTx.toAddr") }}</h4>
            <blockie :address="address" width="22px" height="22px" v-if="address.length !== 0"></blockie>
            <p class="copy-button prevent-user-select" v-on:click="copyToClipboard('address')">{{ $t('reused.copy') }}</p>
          </div>
          <div class="the-form address-block">
            <textarea ref="address" name="name" v-model="address"></textarea>
            <i class="fa fa-check-circle not-good" aria-hidden="true" v-if="addressValid === true"></i>
            <i class="fa fa-check-circle good-button" aria-hidden="true" v-if="addressValid === false"></i>
          </div>
          <div class="error-message-container">
            <p v-if="address.length === 0">Can't be empty</p>
            <p v-if="addressValid === false && address.length !== 0">Invalid address</p>
          </div>
        </div> <!-- .to-address -->
      </div> <!-- .form-block .amount-to-address -->
    </div> <!-- .send-form -->

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
          <p>{{ $t("reused.txFee") }}: 0.000013 ETH ($1.234)</p>
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
          <div class="input-container" v-if="advancedExpend">
            <div class="the-form user-input">
              <input type="number" name="" value="" placeholder="Add Data (e.g. 0x7834f874g298hf298h234f)">
            </div>
            <div class="the-form user-input">
              <input type="number" name="" value="" placeholder="Gas Limit">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="submit-button large-round-button-green-filled clickable">
        {{ $t('interface.sendTx') }}
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
import web3 from 'web3'

import InterfaceBottomText from '@/components/InterfaceBottomText'
import ConfirmModal from '@/components/ConfirmModal'
import Blockie from '@/components/Blockie'

// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  props: ['address'],
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'confirm-modal': ConfirmModal,
    'blockie': Blockie
  },
  data () {
    return {
      advancedExpend: false,
      addressValid: true,
      amount: 0,
      amountValid: true,
      gasAmount: 0,
      parsedBalance: 0,
      coinType: [
        {label: 'ETH', value: 'eth'},
        {label: '$FFC', value: 'ffc'},
        {label: '$FYX', value: 'fyx'},
        {label: '0xBTC', value: 'oxbtc'}
      ]
    }
  },
  methods: {
    copyToClipboard (ref) {
      this.$refs[ref].select()
      document.execCommand('copy')
    },
    confirmationModalOpen () {
      this.$refs[0].confirmation.show()
    },
    changeGas (val) {
      this.gasAmount = val
    },
    setBalanceToAmt () {
      this.amount = this.parsedBalance
    }
  },
  mounted () {
    this.parsedBalance = unit.fromWei(this.$store.state.account.balance.result, 'ether')
  },
  watch: {
    address (newVal) {
      const valid = web3.utils.isAddress(newVal)

      if (valid) {
        this.address = newVal
        this.addressValid = true
      } else {
        this.addressValid = false
      }
    },
    parsedBalance (newVal) {
      this.parsedBalance = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SendCurrencyContainer.scss";
</style>

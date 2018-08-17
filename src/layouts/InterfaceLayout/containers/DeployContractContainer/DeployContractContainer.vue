<template>
  <div class="deploy-contract-container">
    <success-modal message="" linkMessage="Ok"></success-modal>
    <interface-container-title :title="$t('common.depContract')"></interface-container-title>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Byte Code</h4>
          <div class="copy-buttons">
            <span v-on:click="deleteInput('bytecode')">Clear</span>
            <span v-on:click="copyToClipboard('bytecode')">Copy</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea ref="bytecode" class="custom-textarea-1" v-model="bytecode"></textarea>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>ABI/JSON Interface</h4>
          <div class="copy-buttons">
            <span v-on:click="deleteInput('abi')">Clear</span>
            <span v-on:click="copyToClipboard('abi')">Copy</span>
          </div>
        </div>
      </div>
      <div class="the-form domain-name">
        <textarea ref="abi" class="custom-textarea-1" v-model="abi"></textarea>
        <i :class="[validAbi && validAbi !== ''? '': 'not-good' ,'fa fa-check-circle good-button']" aria-hidden="true"></i>
      </div>
    </div>

    <div class="send-form" v-if="constructors.length !== 0">
      <div class="title-container">
        <div class="title">
          <h4>Constructor {{ constructors.length > 1 ? 'Inputs': 'Input' }}: </h4>
        </div>
      </div>
      <div v-for="(construct, idx) in constructors" :key="construct.type+idx">
        <div v-for="(input, idx) in construct.inputs" :key="input.name + idx">
          <div class="title-container">
            <div class="title">
              <h5>{{input.name | capitalize }}: </h5>
            </div>
          </div>
          <div class="the-form domain-name">
            <input ref="contractName" v-model="inputs[input.name]"/>
          </div>
        </div>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>Contract Name</h4>
        </div>
      </div>
      <div class="the-form domain-name">
        <input ref="contractName" v-model="contractName" :placeholder="contractNamePlaceholder"/>
      </div>
    </div>

    <div class="send-form2">
      <div class="title-container">
        <div class="title">
          <div class="title-and-popover">
            <h4>{{ $t("common.speedTx") }}</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTransactionContent')"/>
          </div>
          <p>{{ $t("common.txFee") }}: {{ transactionFee }} ETH </p>
        </div>
        <div class="buttons">
          <div :class="[$store.state.gasPrice === 5 ? 'active': '', 'small-circle-button-green-border']" @click="changeGas(5)">
            {{ $t('common.slow') }}
          </div>
          <div :class="[$store.state.gasPrice === 45 ? 'active': '', 'small-circle-button-green-border']" @click="changeGas(45)">
            {{ $t('common.regular') }}
          </div>
          <div :class="[$store.state.gasPrice === 75 ? 'active': '', 'small-circle-button-green-border']" @click="changeGas(75)">
            {{ $t('common.fast') }}
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input type="number" name="" v-model="gasLimit" placeholder="Gas Limit" />
        <div class="good-button-container">
          <p>Gwei</p>
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div v-on:click="confirmationModalOpen" :class="[abi === '' || bytecode === '' || !validAbi ? 'disabled': '', 'submit-button large-round-button-green-filled clickable']">
          Sign Transaction
        </div>
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>
    <confirm-modal :showSuccess="showSuccessModal" :signedTx="signedTx" :fee="transactionFee" :gasPrice="$store.state.gasPrice" :from="$store.state.wallet.getAddressString()" :gas="gasLimit" :data="data" :nonce="nonce" :contractName="contractName" :abi="abi"></confirm-modal>
    <success-modal message="Sending Transaction" linkMessage="Close"></success-modal>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import ConfirmModal from '@/containers/ConfirmationContainer/components/ConfirmModal/ConfirmModal'
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue'
import {Misc} from '@/helpers'

import store from 'store'

// eslint-disable-next-line
const EthTx = require('ethereumjs-tx')
// eslint-disable-next-line
const unit = require('ethjs-unit')
export default {
  name: 'DeployContract',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'confirm-modal': ConfirmModal,
    'success-modal': SuccessModal
  },
  data () {
    return {
      bytecode: '',
      abi: '',
      constructors: [],
      inputs: {},
      contractName: '',
      contractNamePlaceholder: '',
      raw: {},
      signedTx: '',
      transactionFee: 0,
      gasAmount: this.$store.state.gasPrice,
      gasLimit: 21000,
      data: '',
      nonce: 0,
      validAbi: false
    }
  },
  methods: {
    async signTransaction () {
      const web3 = this.$store.state.web3
      const contract = new web3.eth.Contract(JSON.parse(this.abi))
      const deployArgs = Object.keys(this.inputs).map(key => {
        return web3.utils.toHex(this.inputs[key])
      })
      this.data = contract.deploy({data: this.bytecode, arguments: deployArgs}).encodeABI()
      this.nonce = await web3.eth.getTransactionCount(this.$store.state.wallet.getAddressString())

      this.raw = {
        from: this.$store.state.wallet.getAddressString(),
        gas: this.gasLimit,
        nonce: this.nonce,
        gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
        data: this.data
      }

      // const tx = new EthTx(this.raw)
      // tx.sign(this.$store.state.wallet.getPrivateKey())
      // const signedTx = tx.serialize()
      // this.signedTx = `0x${signedTx.toString('hex')}`
      await web3.eth.sendTransaction(this.raw).once('transactionHash', (hash) => {
        this.$store.dispatch('addNotification', [this.from, hash, 'Transaction Hash'])
      }).on('receipt', (res) => {
        this.$store.dispatch('addNotification', [this.from, res, 'Transaction Receipt'])
      }).on('error', (err) => {
        console.log(err)
        this.$store.dispatch('addNotification', [this.from, err, 'Transaction Error'])
      })
    },
    showSuccessModal () {
      this.$children[5].$refs.success.show()
    },
    confirmationModalOpen () {
      this.signTransaction()
      window.scrollTo(0, 0)
      this.$children[4].$refs.confirmation.show()
    },
    estimateGas () {
      if (this.bytecode !== '' && this.abi !== '') {
        const newRaw = this.raw
        delete newRaw['gas']
        delete newRaw['nonce']
        this.$store.state.web3.eth.estimateGas(newRaw).then(res => {
          this.transactionFee = unit.fromWei(unit.toWei(this.$store.state.gasPrice, 'gwei') * res, 'ether')
          this.gasLimit = res
        }).catch(err => console.log(err))
      }
    },
    copyToClipboard (ref) {
      this.$refs[ref].select()
      document.execCommand('copy')
    },
    deleteInput (ref) {
      this[ref] = ''
    },
    changeGas (val) {
      this.gasAmount = val
      this.$store.dispatch('setGasPrice', Number(val))
    }
  },
  mounted () {
    this.contractNamePlaceholder = store.get('localContracts') !== undefined ? `myContracts${store.get('localContracts').length}` : 'myContracts'
    this.constructors = []
    this.validAbi = Misc.isJson(this.abi)
    if (this.abi !== '' && this.validAbi) {
      JSON.parse(this.abi && this.validAbi).forEach(item => {
        if (item.type === 'constructor') {
          this.constructors.push(item)
        }
      })
    }

    this.estimateGas()
  },
  watch: {
    abi (newVal) {
      this.constructors = []
      this.validAbi = Misc.isJson(newVal)
      if (newVal !== '' && this.validAbi) {
        JSON.parse(newVal).forEach(item => {
          if (item.type === 'constructor') {
            this.constructors.push(item)
          }
        })
      }
      this.estimateGas()
    },
    bytecode (newVal) {
      this.estimateGas()
    },
    gasAmount (newVal) {
      this.estimateGas()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "DeployContractContainer.scss";
</style>

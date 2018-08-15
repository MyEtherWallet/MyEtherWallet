<template>
  <div class="interact-with-contract-container">
    <interface-container-title :title="$t('common.interactWcontract')"></interface-container-title>
    <div v-if="!interact" class="interact-div">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.contractAddr') }}</h4>
            <div class="select-contract no-border">
              <currency-picker :currency="network.type.contracts" v-on:selectedCurrency="selectedCurrency" page="interactWContract" :token="false"></currency-picker>
            </div>
          </div>
        </div>
        <div class="the-form domain-name">
          <input type="text" name="" v-model="address" placeholder="Enter Domain Name or Address" />
          <i :class="[validAddress && address !== ''? '': 'not-good' ,'fa fa-check-circle good-button']" aria-hidden="true" class="address-validation-check"></i>
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.abiJsonInt') }}</h4>
            <div class="copy-buttons">
              <span @click="deleteInput('abi')">{{ $t('common.clear') }}</span>
              <span @click="copyToClipboard('abi')">{{ $t('common.copy') }}</span>
            </div>
          </div>
        </div>
        <div class="the-form domain-name">
          <textarea class="custom-textarea-1" name="" v-model="abi" ref="abi"></textarea>
          <i :class="[validAbi && abi !== ''? '': 'not-good' ,'fa fa-check-circle good-button']" aria-hidden="true"></i>
        </div>
      </div>
      <div class="submit-button-container">
        <div :class="[(validAbi && validAddress) && (address !== '' && abi !== '')? '': 'disabled' ,'submit-button large-round-button-green-filled clickable']" @click="switchView('forward')">
          {{ $t('common.continue') }}
          <img src="~@/assets/images/icons/right-arrow.png">
        </div>
        <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
      </div>
    </div>
    <div v-else class="interact-div">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>Read / Write Contract</h4>
          </div>
        </div>
        <div class="address-container">
          <div class="address"> Contract Address: {{ address }}</div>
          <div class="functions">
            <currency-picker :currency="methods" v-on:selectedCurrency="selectFunction" page="interactWContract" :token="false"></currency-picker>
          </div>
        </div>
      </div>
      <div class="send-form" v-show="selectedMethod.name !== undefined">
        <div class="title-container">
          <div class="title">
            <h4>{{selectedMethod.name}}</h4>
          </div>
        </div>
        <div>
          <div class="the-form domain-name" v-if="selectedMethod.constant === true && selectedMethod.inputs.length === 0">
            <input type="text" name="" v-model="result" placeholder="0x00000000000000" disabled />
          </div>
          <div class="the-form domain-name" v-for="(input, idx) in selectedMethod.inputs" :key="input.name + idx" v-else v-show="selectedMethod.inputs.length !== 0">
            <div v-if="input.type === 'bool'" class="bool-input">
              <div class="title-container">
                <div class="title">
                  <p>{{ input.name | capitalize }}</p>
                </div>
              </div>
              <div class="bool-input-container">
                <div>
                  <input type="radio" v-model="writeInputs[input.name]" :value="true" :name="input.name" :checked="writeInputs[input.name] === true? true: false"/>
                  <label :for="input.name">true</label>
                </div>
                <div>
                  <input type="radio" v-model="writeInputs[input.name]" :value="false" :name="input.name" :checked="writeInputs[input.name] === false? true: false"/>
                  <label :for="input.name">false</label>
                </div>
              </div>
            </div>
            <input :type="checkType(input.type)" name="" v-model="writeInputs[input.name]" :placeholder="input.name" v-else class="contract-inputs"/>
          </div>
          <div class="the-form domain-name result-container" v-show="selectedMethod.constant === false">
            <div class="title-container">
              <div class="title">
                <h4>Value: </h4>
              </div>
            </div>
            <input type="text" name="" v-model="value" placeholder="ETH" />
          </div>
          <div class="the-form domain-name result-container" v-if="result !== '' && selectedMethod.inputs.length > 0">
            <div class="title-container">
              <div class="title">
                <h4>Result: </h4>
              </div>
            </div>
            <div class="result-inputs">
              <input type="text" name="" v-model="result" placeholder="0x00000000000000" disabled v-if="resType === 'string'" />
              <div v-if="resType === 'object'"> <!-- Have to separate them since v-for still loops when v-if is in the same line getting max stack -->
                <div v-for="(res, idx) in Object.keys(result)" :key="selectedMethod.outputs[idx].name !== ''? selectedMethod.outputs[idx].name + idx : selectedMethod.outputs[idx].type + idx">
                  <label :name="selectedMethod.outputs[idx].name !== ''? selectedMethod.outputs[idx].name: selectedMethod.outputs[idx].type + idx"> {{selectedMethod.outputs[idx].name !== ''? selectedMethod.outputs[idx].name: selectedMethod.outputs[idx].type}}</label>
                  <input type="text" :name="selectedMethod.outputs[idx].name !== ''? selectedMethod.outputs[idx].name: selectedMethod.outputs[idx].type + idx"  :value="result[res]" placeholder="0x00000000000000" disabled/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="submit-button-container">
        <div class="buttons interact-buttons">
          <div class="submit-button large-round-button-green-border clickable" @click="switchView('backwards')">
            {{ $t('common.back') }}
          </div>
          <div :class="[inputsFilled? '': 'disabled', loading ? 'disabled': '','submit-button large-round-button-green-filled clickable']" @click="write" v-if="selectedMethod.constant === true && selectedMethod.inputs.length > 0">
            <span v-show="!loading">
              Read
            </span>
            <i class="fa fa-spinner fa-spin fa-lg" v-show="loading"></i>
          </div>
          <div :class="[inputsFilled? '': 'disabled', loading ? 'disabled': '','submit-button large-round-button-green-filled clickable']" @click="write" v-if="selectedMethod.constant === false">
            <span v-show="!loading">
              Write
            </span>
            <i class="fa fa-spinner fa-spin fa-lg" v-show="loading"></i>
          </div>
        </div>
        <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
      </div>
    </div>
    <confirm-modal :showSuccess="showSuccessModal" :signedTx="signedTx" :fee="transactionFee" :gasPrice="$store.state.gasPrice" :from="$store.state.wallet.getAddressString()" :to="address" :value="value" :gas="gasLimit" :data="data" :nonce="nonce"></confirm-modal>
    <success-modal message="Sending Transaction" linkMessage="Close"></success-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CurrencyPicker from '../../components/CurrencyPicker'
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import InterfaceBottomText from '@/components/InterfaceBottomText'
import { Misc } from '@/helpers'
import ConfirmModal from '@/components/ConfirmModal'
import SuccessModal from '@/components/SuccessModal'

// eslint-disable-next-line
const EthTx = require('ethereumjs-tx')
// eslint-disable-next-line
const unit = require("ethjs-unit");

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'currency-picker': CurrencyPicker,
    'confirm-modal': ConfirmModal,
    'success-modal': SuccessModal
  },
  data () {
    return {
      abi: '',
      address: '',
      interact: false,
      validAbi: false,
      validAddress: false,
      methods: [],
      selectedMethod: {},
      result: '',
      writeInputs: {},
      inputsFilled: false,
      loading: false,
      resType: 'string',
      gasLimit: 21000,
      value: 0,
      data: '',
      raw: {},
      nonce: 0,
      signedTx: '',
      transactionFee: 0
    }
  },
  methods: {
    selectedCurrency (currency) {
      if (currency.abi === '') {
        this.abi = ''
      } else {
        this.abi = JSON.stringify(currency.abi)
      }
      this.address = currency.address
    },
    checkType (type) {
      if (type === 'address' || type === 'string' || type === 'byte' || type.includes('bytes')) {
        return 'string'
      } else {
        return 'number'
      }
    },
    selectFunction (method) {
      const contract = new this.$store.state.web3.eth.Contract(
        [method],
        this.address
      )
      if (method.constant === true && method.inputs.length === 0) {
        contract.methods[method.name]()
          .call({ from: this.$store.state.wallet.getAddressString() })
          .then(res => {
            this.result = res
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.result = ''
      }
      this.selectedMethod = method
    },
    copyToClipboard (ref) {
      this.$refs[ref].select()
      document.execCommand('copy')
    },
    deleteInput (ref) {
      this.$refs[ref].value = ''
    },
    switchView (direction) {
      switch (direction) {
        case 'forward':
          this.methods = JSON.parse(this.abi)
            .map(func => func)
            .filter(func => func.type !== 'constructor')
            .filter(func => func.constant !== undefined)
          this.interact = true
          break
        default:
          this.interact = false
      }
    },
    async write () {
      const web3 = this.$store.state.web3
      const contract = new web3.eth.Contract([this.selectedMethod], this.address)
      const params = Object.keys(this.writeInputs).map(input => web3.utils.toHex(this.writeInputs[input]))
      this.loading = true
      if (this.selectedMethod.constant === true) {
        contract.methods[this.selectedMethod.name](...params)
          .call({ from: this.$store.state.wallet.getAddressString() })
          .then(res => {
            this.result = res
            this.loading = false
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      } else {
        this.nonce = await web3.eth.getTransactionCount(this.$store.state.wallet.getAddressString())
        this.gasLimit = await contract.methods[this.selectedMethod.name](
          ...params
        )
          .estimateGas({ from: this.$store.state.wallet.getAddressString() })
          .then(res => {
            this.transactionFee = unit.fromWei(unit.toWei(this.$store.state.gasPrice, 'gwei') * res, 'ether')
            return res
          })
          .catch(err => console.log(err))
        this.data = contract.methods[this.selectedMethod.name](...params).encodeABI()
        this.raw = {
          from: this.$store.state.wallet.getAddressString(),
          gas: this.gasLimit,
          nonce: this.nonce,
          gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
          value: this.value,
          to: this.address,
          data: this.data
        }

        const tx = new EthTx(this.raw)
        tx.sign(this.$store.state.wallet.getPrivateKey())
        const serializedTx = tx.serialize()
        this.signedTx = `0x${serializedTx.toString('hex')}`
        // Waiting on this: https://github.com/ethereum/web3.js/issues/1637
        // await web3.eth.sendTransaction(this.raw).once('transactionHash', (hash) => {
        //   this.loading = false
        //   this.$store.dispatch('addNotification', [this.from, hash, 'Transaction Hash'])
        // }).on('receipt', (res) => {
        //   this.loading = false
        //   this.$store.dispatch('addNotification', [this.from, res, 'Transaction Receipt'])
        // }).on('error', (err) => {
        //   console.log(err)
        //   this.loading = false
        //   this.$store.dispatch('addNotification', [this.from, err, 'Transaction Error'])
        // })
        this.confirmationModalOpen()
      }
    },
    confirmationModalOpen () {
      this.loading = false
      window.scrollTo(0, 0)
      const confirmation = this.$children.filter(child => child.$refs.hasOwnProperty('confirmation'))
      confirmation[0].$refs.confirmation.show()
    },
    showSuccessModal () {
      const success = this.$children.filter(child => child.$refs.hasOwnProperty('success'))
      success[0].$refs.success.show()
    },
    checkInputsFilled () {
      const inputs = Object.keys(this.writeInputs)
      for (var i = 0; i < inputs.length; i++) {
        if (this.writeInputs[inputs[i]] === '') {
          this.inputsFilled = false
          return
        } else {
          this.inputsFilled = true
        }
      }
    }
  },
  watch: {
    abi (newVal) {
      this.validAbi = Misc.isJson(newVal)
    },
    selectedMethod (newVal) {
      this.writeInputs = {}
      for (let inputs in newVal) {
        if (newVal.hasOwnProperty(inputs)) {
          newVal.inputs.forEach(input => {
            this.$set(this.writeInputs, input.name, '')
          })
        }
      }
    },
    address (newVal) {
      this.validAddress = this.$store.state.web3.utils.isAddress(newVal)
    },
    writeInputs: {
      // Watches nested values instead
      handler: function (val, oldVal) {
        this.checkInputsFilled()
      },
      deep: true
    },
    result (newVal) {
      this.resType = typeof newVal
    },
    network () {
      this.abi = ''
      this.address = ''
      this.interact = false
      this.validAbi = false
      this.validAddress = false
      this.methods = []
      this.selectedMethod = {}
      this.result = ''
      this.writeInputs = {}
      this.inputsFilled = false
    }
  },
  computed: {
    ...mapGetters({
      network: 'network'
    })
  }
}
</script>

<style lang="scss" scoped>
@import "InteractWithContractContainer.scss";
</style>

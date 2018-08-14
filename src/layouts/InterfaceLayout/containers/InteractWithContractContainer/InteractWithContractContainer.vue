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
          <div class="the-form domain-name" v-if="selectedMethod.constant === true">
            <input type="text" name="" v-model="result" placeholder="0x00000000000000" disabled />
          </div>
          <div class="the-form domain-name" v-for="(input, idx) in selectedMethod.inputs" :key="input.name + idx" v-else v-show="selectedMethod.inputs.length !== 0">
            <div v-if="input.type === 'bool'" class="bool-input">
              <div class="title-container">
                <div class="title">
                  <h4>{{ input.name | capitalize }}</h4>
                </div>
              </div>
              <div class="bool-input-container">
                <div>
                  <input type="radio" v-model="writeInputs[input.name]" value="true" name="true"/>
                  <label for="true">true</label>
                </div>
                <div>
                  <input type="radio" v-model="writeInputs[input.name]" value="false" name="false"/>
                  <label for="false">false</label>
                </div>
              </div>
            </div>
            <input :type="checkType(input.type)" name="" v-model="writeInputs[input.name]" :placeholder="input.name" v-else class="contract-inputs"/>
          </div>
        </div>
      </div>
      <div class="submit-button-container">
        <div class="buttons interact-buttons">
          <div class="submit-button large-round-button-green-border clickable" @click="switchView('backwards')">
            {{ $t('common.back') }}
          </div>
          <div class="submit-button large-round-button-green-filled clickable" @click="write" v-if="selectedMethod.constant === false">
            Write
          </div>
        </div>
        <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import CurrencyPicker from '../../components/CurrencyPicker'
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import InterfaceBottomText from '@/components/InterfaceBottomText'
import {Misc} from '@/helpers'

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'currency-picker': CurrencyPicker
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
      writeInputs: {}
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
      if (type === 'address' || 'string') {
        return 'string'
      } else {
        return 'number'
      }
    },
    selectFunction (method) {
      const contract = new this.$store.state.web3.eth.Contract([method], this.address)
      if (method.constant === true) {
        contract.methods[method.name]().call({from: this.$store.state.wallet.getAddressString()}).then(res => {
          this.result = res
        }).catch(err => {
          console.log(err)
        })
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
          this.methods = JSON.parse(this.abi).map(func => func).filter(func => func.type !== 'constructor').filter(func => func.constant !== undefined)
          this.interact = true
          break
        default:
          this.interact = false
      }
    },
    write () {
      console.log('Write!')
    }
  },
  watch: {
    abi (newVal) {
      this.validAbi = Misc.isJson(newVal)
    },
    selectedMethod () {
      this.writeInputs = {}
    },
    address (newVal) {
      this.validAddress = this.$store.state.web3.utils.isAddress(newVal)
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

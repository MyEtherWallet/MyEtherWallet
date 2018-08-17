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
      </div>
    </div>

    <div class="send-form" v-if="constructors.length !== 0">
      <div class="title-container">
        <div class="title">
          <h4>Constructor {{ constructors.length > 1 ? 'Inputs': 'Input' }}: </h4>
        </div>
      </div>
      <div v-for="construct in constructors" :key="construct.inputs[0].name">
        <div class="title-container">
          <div class="title">
            <h5>{{construct.inputs[0].name | capitalize }}: </h5>
          </div>
        </div>
        <div class="the-form domain-name">
          <input ref="contractName" v-model="inputs[construct.inputs[0].name]"></input>
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
        <input ref="contractName" v-model="contractName"></input>
      </div>
    </div>

    <div class="send-form2">
      <div class="title-container">
        <div class="title">
          <div class="title-and-popover">
            <h4>Speed of Transaction</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTransactionContent')"/>
          </div>
          <p>Transcation Fee: 0.000013 ETH ($1.234)</p>
        </div>
        <div class="buttons">
          <div class="small-circle-button-green-border">
            Slow
          </div>
          <div class="small-circle-button-green-border active">
            Regular
          </div>
          <div class="small-circle-button-green-border">
            Fast
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input type="number" name="" value="" placeholder="Gas Amount" />
        <div class="good-button-container">
          <p>Gwei</p>
          <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="buttons">
        <div v-on:click="signTransaction" :class="[abi === '' || bytecode === ''? 'disabled': '', 'submit-button large-round-button-green-filled clickable']">
          Sign Transaction
        </div>
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue'

export default {
  name: 'DeployContract',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'success-modal': SuccessModal
  },
  data () {
    return {
      abi: '',
      bytecode: '',
      constructors: [],
      inputs: {},
      contractName: ''
    }
  },
  methods: {
    signTransaction () {
      // this.$children[0].$refs.success.show()
    },
    copyToClipboard (ref) {
      this.$refs[ref].select()
      document.execCommand('copy')
    },
    deleteInput (ref) {
      this[ref] = ''
    }
  },
  watch: {
    abi (newVal) {
      const self = this
      if (newVal !== '') {
        JSON.parse(newVal).forEach(item => {
          if (item.type === 'constructor') {
            self.constructors.push(item)
          }
        })
      } else {
        self.constructors = []
      }
    },
    inputs (newVal) {
      console.log(newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "DeployContractContainer.scss";
</style>

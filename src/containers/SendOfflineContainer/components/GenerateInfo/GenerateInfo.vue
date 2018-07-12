<template>
  <div class="generate-info">
    <div class="wrap">

      <div class="send-form">
        <div class="title-container">
          <div class="title-and-copy">
            <div><h4>From Address</h4></div>
            <div class="form-controller">
              <p class="linker-1" v-on:click="deleteFromAddress">Clear</p>
              <p class="linker-1" v-on:click="copyFromAddress">Copy</p>
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input ref="fromaddress" type="text" placeholder="From Address" :value="$store.state.wallet.getAddressString()">
          <div class="good-button-container">
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <tx-speed-input v-if="moreInfoGenerated"></tx-speed-input>
      <div v-if="!moreInfoGenerated" class="submit-button-container">
        <div class="submit-button large-round-button-green-filled clickable" v-on:click="generateInfo">
          Generate
        </div>
      </div>

      <div v-if="moreInfoGenerated" class="submit-button-container">
        <div class="submit-button large-round-button-green-filled clickable" v-on:click="generateTx">
          Continue
        </div>
      </div>
      <interface-bottom-text link="/" question="Have issues?" linkText="Learn More"></interface-bottom-text>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import TxSpeedInput from '../../components/TxSpeedInput'
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'tx-speed-input': TxSpeedInput
  },
  data () {
    return {
      moreInfoGenerated: false
    }
  },
  methods: {
    generateInfo () {
      this.moreInfoGenerated = true
    },
    copyFromAddress () {
      this.$refs.fromaddress.select()
      document.execCommand('copy')
    },
    deleteFromAddress () {
      this.$refs.fromaddress.value = ''
    },
    generateTx () {
      this.$store.dispatch('updatePageState', ['interface', 'sendOffline', 'genTx'])
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "GenerateInfo.scss";
</style>

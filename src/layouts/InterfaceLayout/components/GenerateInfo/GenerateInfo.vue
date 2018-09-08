<template>
  <div class="generate-info">
    <div class="wrap">

      <div class="send-form">
        <div class="title-container">
          <div class="title-and-copy">
            <div><h4>From Address</h4></div>
            <div class="form-controller">
              <p
                class="linker-1 prevent-user-select"
                @click="deleteFromAddress">Clear</p>
              <p
                class="linker-1 prevent-user-select"
                @click="copyFromAddress">Copy</p>
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input
            ref="fromaddress"
            :value="$store.state.wallet.getAddressString()"
            type="text"
            placeholder="From Address"
            autocomplete="off" >
          <div class="good-button-container">
            <i
              :class="[isValid ? 'not-good' : '', 'fa fa-check-circle good-button']"
              aria-hidden="true"/>
          </div>
        </div>
      </div>
      <tx-speed-input
        v-show="moreInfoGenerated"
        :nonce="nonce"
        :gas-limit="gasLimit"
        @gasLimitUpdate="gasLimitUpdated"
        @nonceUpdate="nonceUpdated"/>
      <div
        v-if="!moreInfoGenerated"
        class="submit-button-container">
        <div
          class="submit-button large-round-button-green-filled clickable"
          @click="generateInfo">
          Generate
        </div>
      </div>

      <div
        v-if="moreInfoGenerated"
        class="submit-button-container">
        <div
          class="submit-button large-round-button-green-filled clickable"
          @click="generateTx">
          Continue
        </div>
      </div>
      <interface-bottom-text
        link="/"
        question="Have issues?"
        link-text="Learn More"/>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import TxSpeedInput from '../../components/TxSpeedInput';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'tx-speed-input': TxSpeedInput
  },
  props: {
    gasLimit: {
      type: Number,
      default: 0
    },
    nonce: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      moreInfoGenerated: false,
      isValid: false
    };
  },
  methods: {
    generateInfo() {
      this.moreInfoGenerated = true;
    },
    copyFromAddress() {
      this.$refs.fromaddress.select();
      document.execCommand('copy');
    },
    deleteFromAddress() {
      this.$refs.fromaddress.value = '';
    },
    generateTx() {
      this.$emit('pathUpdate', 'genTx');
    },
    gasLimitUpdated(e) {
      this.$emit('gasLimitUpdate', e);
    },
    nonceUpdated(e) {
      this.$emit('nonceUpdate', e);
    },
    checkAddress() {
      return this.$store.state.web3.utils.isAddress(
        this.$store.state.wallet.getAddressString()
      );
    },
    mounted() {
      this.isValid = this.checkAddress();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'GenerateInfo.scss';
</style>

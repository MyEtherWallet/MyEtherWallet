<template>
  <div class="send-publish-tx">
    <success-modal
      :link-message="'Ok'"
      message="Success"/>
    <div class="page-wrap">

      <div class="main-form-block">
        <div class="form-container single--1">
          <standard-input :options="inputSignedTX" />
        </div>
      </div>


      <div class="page--bottom-button-container">
        <standard-button 
          :options="buttonSendTX"
          @click.native="sendTx"
        />
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
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'success-modal': SuccessModal
  },
  props: {
    rawTx: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      buttonSendTX: {
        title: 'Send Transaction',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false
      },
      inputSignedTX: {
        title: 'Signed Transaction',
        value: 'oegn0345gn30p4r3n94gm-4emgf-4m3-4tg',
        type: '',
        buttonCopy: true,
        buttonClear: true,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Enter TX Hex',
        rightInputText: '',
        isTextarea: true
      },
      signedTx: this.rawTx
    };
  },
  watch: {
    rawTx(newVal) {
      this.signedTx = newVal;
    }
  },
  mounted() {
    //this.$children[0].$refs.success.show();
  },
  methods: {
    deleteTxHex() {
      this.signedTx = '';
    },
    copyTxHex() {
      this.$refs.txHex.select();
      document.execCommand('copy');
    },
    sendTx() {
      this.$store.state.web3.eth
        .sendSignedTransaction(this.signedTx)
        .on('receipt', () => {})
        .then(() => {
          this.$children[0].$refs.success.show();
          // eslint-disable-next-line no-console
        });
    },
    hideModal() {
      this.$children[0].$refs.success.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../InformationBlockForms-desktop';
@import '../InformationBlockForms-tablet';
@import '../InformationBlockForms-mobile';
</style>

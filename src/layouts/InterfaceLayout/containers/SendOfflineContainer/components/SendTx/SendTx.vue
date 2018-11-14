<template>
  <div class="generate-info">
    <success-modal
      ref="successModal"
      :link-message="'Ok'"
      message="Success"/>
    <div class="wrap">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div><h4>{{ $t('interface.signedTx') }}</h4></div>
            <div class="form-controller">
              <p
                class="linker-1 prevent-user-select"
                @click="uploadJson">Upload JSON</p>
              <p
                class="linker-1 prevent-user-select"
                @click="deleteTxHex">{{ $t('common.clear') }}</p>
              <p
                class="linker-1 prevent-user-select"
                @click="copyTxHex">{{ $t('common.copy') }}</p>
            </div>
          </div>
        </div>

        <div class="the-form gas-amount">
          <textarea
            ref="txHex"
            v-model="signedTx"
            name=""
            placeholder="Enter TX Hex"/>
          <input
            ref="jsonInput"
            type="file"
            name="file"
            style="display: none"
            @change="uploadFile">
        </div>
      </div>
      <div class="submit-button-container">
        <div
          class="submit-button large-round-button-green-filled clickable"
          @click="sendTx">
          {{ $t('interface.sendTx') }}
        </div>
        <interface-bottom-text
          :link="'/'"
          :link-text="'Learn more'"
          :question="'Have any issues?'"/>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'success-modal': SuccessModal
  },
  props: {
    rawTx: {
      type: String,
      default: "{'rawTransaction': '0xasdfasdfasdfasdfasasdfasdf'}"
    }
  },
  data() {
    const parsedRaw = new Object(this.rawTx);
    return {
      signedTx: parsedRaw.rawTransaction,
      readTx: {}
    };
  },
  computed: {
    ...mapGetters({ web3: 'web3' })
  },
  watch: {
    rawTx(newVal) {
      this.signedTx = JSON.parse(newVal).rawTransaction;
    },
    readTx(newVal) {
      this.signedTx = newVal.rawTransaction;
    }
  },
  methods: {
    uploadJson() {
      const jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    deleteTxHex() {
      this.signedTx = '';
    },
    copyTxHex() {
      this.$refs.txHex.select();
      document.execCommand('copy');
    },
    sendTxRes(signedTx) {
      this.$eventHub.$emit('showSuccessModal', 'Sending Transaction', 'Close');
      this.web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once('transactionHash', hash => {
          this.$store.dispatch('addNotification', [
            signedTx.tx.from,
            hash,
            'Transaction Hash'
          ]);
        })
        .on('receipt', res => {
          this.$store.dispatch('addNotification', [
            signedTx.tx.from,
            res,
            'Transaction Receipt'
          ]);
        })
        .on('error', err => {
          this.$store.dispatch('addNotification', [
            signedTx.tx.from,
            err,
            'Transaction Error'
          ]);
        });
    },
    sendTx() {
      this.$eventHub.$emit('showSendSignedTx', this.signedTx, this.sendTxRes);
    },
    hideModal() {
      this.$refs.successModal.$refs.success.hide();
    },
    uploadFile(e) {
      const self = this;
      const reader = new FileReader();
      reader.onloadend = function(evt) {
        self.readTx = JSON.parse(evt.target.result);
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendTx.scss';
</style>

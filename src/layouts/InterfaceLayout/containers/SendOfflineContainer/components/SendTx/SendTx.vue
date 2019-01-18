<template>
  <div class="generate-info">
    <success-modal ref="successModal" :link-message="'Ok'" message="Success" />
    <div class="wrap">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div>
              <h4>{{ $t('interface.signedTx') }}</h4>
            </div>
            <div class="form-controller">
              <button
                class="title-button prevent-user-select"
                @click="uploadJson"
              >
                Upload JSON
              </button>
              <button
                class="title-button prevent-user-select"
                @click="deleteTxHex"
              >
                {{ $t('common.clear') }}
              </button>
              <button
                class="title-button prevent-user-select"
                @click="copyTxHex"
              >
                {{ $t('common.copy') }}
              </button>
            </div>
          </div>
        </div>

        <div class="the-form gas-amount">
          <textarea
            v-validate="'required'"
            ref="txHex"
            v-model="signedTx"
            name="signedTrans"
            placeholder="Enter TX Hex"
          />
          <p v-show="errors.has('signedTrans')">
            {{ errors.first('signedTrans') }}
          </p>
          <p v-show="error.length !== 0">{{ error }}</p>
          <input
            ref="jsonInput"
            type="file"
            name="file"
            style="display: none"
            @change="uploadFile"
          />
        </div>
      </div>
      <div class="submit-button-container">
        <div
          :class="[
            errors.has('signedTrans') || signedTx.length === 0
              ? 'disabled'
              : '',
            'submit-button large-round-button-green-filled clickable'
          ]"
          @click="sendTx"
        >
          {{ $t('interface.sendTx') }}
        </div>
        <interface-bottom-text
          link="https://kb.myetherwallet.com"
          question="Have issues?"
          link-text="Help Center"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import { mapGetters } from 'vuex';
import { Misc } from '@/helpers';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'success-modal': SuccessModal
  },
  props: {
    rawTx: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      readTx: {},
      signedTx: this.rawTx ? JSON.parse(this.rawTx).rawTransaction : '',
      error: ''
    };
  },
  computed: {
    ...mapGetters({ web3: 'web3', wallet: 'wallet' })
  },
  watch: {
    rawTx(newVal) {
      this.signedTx = JSON.parse(newVal).rawTransaction;
    },
    readTx(newVal) {
      this.signedTx = newVal.rawTransaction;
    },
    signedTx(newVal) {
      if (this.validateHexString(newVal)) {
        this.signedTx = newVal;
        this.error = '';
      } else {
        this.error = 'Invalid hex string';
      }
    }
  },
  methods: {
    validateHexString: Misc.validateHexString,
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
            'Hash',
            this.wallet.getChecksumAddressString(),
            signedTx.tx,
            hash
          ]);
        })
        .on('receipt', res => {
          this.$store.dispatch('addNotification', [
            'Receipt',
            this.wallet.getChecksumAddressString(),
            signedTx.tx,
            res
          ]);
        })
        .on('error', err => {
          this.$store.dispatch('addNotification', [
            'Error',
            this.wallet.getChecksumAddressString(),
            signedTx.tx,
            err
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

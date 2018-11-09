<template>
  <div class="generate-info">
    <success-modal ref="successModal" :link-message="'Ok'" message="Success" />
    <div class="wrap">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div><h4>{{$t('interface.signedTx')}}</h4></div>
            <div class="form-controller">
              <p
                class="linker-1 prevent-user-select"
                @click="deleteTxHex">{{$t('common.clear')}}</p>
              <p
                class="linker-1 prevent-user-select"
                @click="copyTxHex">{{$t('common.copy')}}</p>
            </div>
          </div>
        </div>

        <div class="the-form gas-amount">
          <textarea
            ref="txHex"
            v-model="signedTx"
            name=""
            placeholder="Enter TX Hex"
          />
        </div>
      </div>
      <div class="submit-button-container">
        <div
          class="submit-button large-round-button-green-filled clickable"
          @click="sendTx"
        >
          {{ $t('interface.sendTx') }}
        </div>
        <interface-bottom-text
          :link="'/'"
          :link-text="'Learn more'"
          :question="'Have any issues?'"
        />
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
      default: '0x'
    }
  },
  data() {
    return {
      signedTx: this.rawTx
    };
  },
  computed: {
    ...mapGetters({ web3: 'web3' })
  },
  watch: {
    rawTx(newVal) {
      this.signedTx = newVal;
    }
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
      this.web3.eth
        .sendSignedTransaction(this.signedTx)
        .on('receipt', () => {})
        .then(() => {
          this.$refs.successModal.$refs.success.show();
        });
    },
    hideModal() {
      this.$refs.successModal.$refs.success.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendTx.scss';
</style>

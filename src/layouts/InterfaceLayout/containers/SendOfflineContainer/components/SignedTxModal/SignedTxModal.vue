<template>
  <b-modal
    ref="signedTx"
    :title="$t('interface.signedTx')"
    hide-footer
    class="bootstrap-modal signed-tx-modal"
  >
    <div class="d-block">
      <div class="title-block">
        <h4 class="block-title">{{ $t('interface.signedTx') }}</h4>
      </div>
      <div class="signed-tx-container">
        <code>{{ JSON.parse(signedTx).rawTransaction }}</code>
        <input
          ref="signedTxInput"
          :value="signedTx"
          style="position: absolute; top: 0; opacity: 0;"
          autocomplete="off"
        />
      </div>
      <div class="scan-download-container">
        <h4 class="block-title">Scan QR code</h4>
        <div v-if="signedTx !== ''" class="scan-download-items">
          <qrcode
            :value="JSON.parse(signedTx).rawTransaction"
            :options="{ size: 200 }"
          />or <a :href="jsonFile" :download="jsonFileName">Download JSON</a>
        </div>
      </div>
      <div class="raw">
        <div class="title-block">
          <h4 class="block-title">{{ $t('interface.raw') }}</h4>
          <div class="sliding-switch-white">
            <label class="switch">
              <input type="checkbox" @click="showRaw = !showRaw" />
              <span class="slider round" />
            </label>
          </div>
        </div>
        <div v-if="showRaw" class="raw-tx-container">
          <code>{{ rawTx }}</code>
        </div>
      </div>
    </div>
    <div class="button-container">
      <b-btn
        class="mid-round-button-green-filled close-button"
        @click="copyAndContinue"
        >{{ $t('interface.copyAndCont') }}</b-btn
      >
    </div>
  </b-modal>
</template>

<script type="text/javascript">
export default {
  name: 'SignedTxModal',
  props: {
    signedTx: {
      type: String,
      default: ''
    },
    rawTx: {
      type: Object,
      default: function() {
        return {};
      }
    },
    pathUpdate: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      showRaw: false,
      jsonFile: '',
      jsonFileName: `signedTransactionObject-${+new Date()}.json`
    };
  },
  watch: {
    signedTx(newVal) {
      const string =
        typeof newVal === 'object' ? JSON.stringify(newVal) : newVal;
      const blob = new Blob([string], {
        type: 'mime'
      });
      this.jsonFileName = `signedTransactionObject-${+new Date()}.json`;
      this.jsonFile = window.URL.createObjectURL(blob);
    }
  },
  methods: {
    copyAndContinue() {
      this.$refs.signedTxInput.select();
      document.execCommand('copy');
      this.pathUpdate();
    }
  }
};
</script>

<style lang="scss">
@import 'SignedTxModal.scss';
</style>

<template>
  <b-modal
    ref="signedTx"
    hide-footer
    centered
    class="bootstrap-modal signed-tx-modal"
    title="Signed Transaction">
    <div class="d-block">
      <div class="title-block">
        <h4 class="block-title">Signed Transaction</h4>
      </div>
      <div class="signed-tx-container">
        <code>
          {{ signedTx }}
        </code>
        <input
          ref="signedTxInput"
          :value="signedTx"
          style="position: absolute; top: 0; opacity: 0;"
          autocomplete="off">
      </div>
      <div class="raw">
        <div class="title-block">
          <h4 class="block-title">
            Raw
          </h4>
          <div class="sliding-switch-white">
            <label class="switch">
              <input
                type="checkbox"
                @click="showRaw = !showRaw">
              <span class="slider round"/>
            </label>
          </div>
        </div>
        <div
          v-if="showRaw"
          class="raw-tx-container">
          <code>
            {{ rawTx }}
          </code>
        </div>
      </div>
    </div>

    <standard-button 
      buttontext="Copy and Continue" 
      rightarrow="true"
      fullwidth="true"
      buttonstyle="green"
      @click="copyAndContinue" />

    <div 
      v-if="false" 
      class="button-container">
      <b-btn
        class="mid-round-button-green-filled close-button"
        @click="copyAndContinue">
        Copy and Continue
      </b-btn>
    </div>
  </b-modal>
</template>

<script type="text/javascript">
import StandardButton from '@/components/Buttons/StandardButton';

export default {
  name: 'SignedTxModal',
  components: {
    'standard-button': StandardButton
  },
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
      showRaw: false
    };
  },
  mounted() {
    this.$refs.signedTx.show();
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

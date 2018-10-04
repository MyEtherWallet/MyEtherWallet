<template>
  <b-modal
    ref="signedTx"
    hide-footer
    centered
    class="bootstrap-modal signed-tx-modal"
    title="Signed Transaction">
    <div class="modal-container">

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
              Raw Transaction
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
        :options="buttonCopyContinue"
        @click.native="copyAndContinue"
      />

      <div 
        v-if="false" 
        class="button-container">
        <b-btn
          class="mid-round-button-green-filled close-button"
          @click="copyAndContinue">
          Copy and Continue
        </b-btn>
      </div>

    </div><!-- .modal-container -->
  </b-modal>
</template>

<script type="text/javascript">
export default {
  name: 'SignedTxModal',
  components: {},
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
      buttonCopyContinue: {
        title: 'Copy and Continue',
        buttonStyle: 'green',
        rightArrow: true,
        fullWidth: false
      },
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

<style lang="scss" scoped>
@import 'SignedTxModal.scss';
</style>

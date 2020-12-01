<template>
  <div>
    <b-modal
      ref="signatureModal"
      :title="$t('swap.address-verification')"
      hide-footer
      centered
      class="bootstrap-modal"
      static
      lazy
    >
      <div class="modal-contents">
        <div>
          <div class="copy-container">
            <h4>{{ $t('swap.message-to-sign') }}</h4>
          </div>
          {{ signature }}
          <div class="button-container">
            <button
              class="submit-button large-round-button-green-filled clickable"
              @click="sign()"
            >
              {{ $t('swap.proceed-to-sign') }}
            </button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Toast } from '@/helpers';
import { mapState } from 'vuex';
export default {
  props: {
    signature: {
      type: String,
      default: ''
    },
    sendSigned: {
      type: Function,
      default: function () {}
    }
  },
  computed: {
    ...mapState('main', ['account', 'web3'])
  },
  methods: {
    sign() {
      try {
        this.web3.eth
          .sign(this.signature, this.account.address)
          .then(signed => {
            this.sendSigned(signed);
            this.$refs.signatureModal.hide();
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SignatureModal.scss';
</style>

<template>
  <div :class="showModal ? '' : 'hidden'">
    <b-modal
      ref="bitbox02"
      :title="$t('accessWallet.bitbox.bitbox02')"
      hide-footer
      class="bootstrap-modal"
      centered
      static
      lazy
    >
      <div class="bitbox-container">
        <div v-if="device.status === 'connected'">
          <h4>{{ $t('accessWallet.bitbox.unlock') }}</h4>
          <div class="password-gestures-gif-wrapper">
            <img
              class="password-gestures-gif"
              :src="imgPath"
              alt="Password entry GIF"
            />
          </div>
        </div>

        <div v-if="device.status === 'unpaired'">
          <h4>{{ $t('accessWallet.bitbox.pairing') }}</h4>
          <pre>{{ device.pairingCode }}</pre>
          <div class="button-container">
            <div
              :class="[
                device.pairingConfirmed ? '' : 'disabled',
                'submit-button large-round-button-green-filled'
              ]"
              @click="device.pairingConfirmationResolve()"
            >
              {{ $t('accessWallet.hardware.modal.button-choose') }}
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import bb02PwEntry from '@/assets/images/modal/bitbox02/bb02PwEntry.gif';
export default {
  props: {
    device: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      imgPath: bb02PwEntry
    };
  },
  computed: {
    showModal() {
      return (
        this.device.status === 'connected' || this.device.status === 'unpaired'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Bitbox02Modal.scss';
</style>

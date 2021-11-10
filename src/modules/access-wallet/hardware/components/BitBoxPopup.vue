<template>
  <v-sheet
    v-show="showModal"
    color="white"
    :rounded="true"
    class="pa-5"
    width="100%"
  >
    <div
      v-if="device.status === 'connected'"
      align="center"
      justify="center"
      class="px-sm-12"
    >
      <p class="mew-heading-3 pa-3">Please enter password</p>
      <img
        class="password-gestures-gif"
        :src="imgPath"
        alt="Password entry GIF"
      />
    </div>
    <div
      v-if="device.status === 'unpaired'"
      align="center"
      justify="center"
      class="px-sm-12"
    >
      <p class="mew-heading-3 pa-3">Please verify pairing code</p>
      <pre>{{ device.pairingCode }}</pre>
      <mew-button
        title="Confirm"
        color-theme="greenPrimary"
        :has-full-width="false"
        btn-size="medium"
        icon-align="left"
        btn-style="background"
        :disabled="!device.pairingConfirmed"
        @click.native="device.pairingConfirmationResolve()"
      />
    </div>
  </v-sheet>
</template>

<script>
import bb02PwEntry from '@/assets/images/modal/bb02PwEntry.gif';
export default {
  props: {
    device: {
      type: Object,
      default: () => {}
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

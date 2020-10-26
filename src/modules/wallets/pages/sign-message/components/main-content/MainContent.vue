<template>
  <div>
    <signMessageConfirmationOverlay
      :open="openConfirmationOverlay"
      @close="openConfirmationOverlay = false"
    />
    <div
      class="cursor--pointer font-weight-bold mr-4"
      @click="openConfirmationOverlay = true"
    >
      Confirmation Overlay
    </div>

    <mew6-white-sheet>
      <interface-wrap title="Sign Message">
        <v-textarea
          outlined
          no-resize
          name="message"
          label="Message"
          value="This is a message I wish to send to someone who can validate that I own the signing address."
        ></v-textarea>

        <div class="text-center mt-3">
          <mew-button
            title="Sign"
            :has-full-width="false"
            btn-size="xlarge"
            @click.native="openOverlay('SignMessageConfirmation')"
          />
        </div>
        <div class="text-center mt-4">
          <mew-button
            title="Clear all"
            :has-full-width="false"
            btn-size="small"
            btn-style="transparent"
          />
        </div>
      </interface-wrap>
    </mew6-white-sheet>
  </div>
</template>

<script>
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import signMessageConfirmationOverlay from '@/modules/wallets/components/sign-message-confirmation-overlay/SignMessageConfirmationOverlay';

export default {
  components: {
    'interface-wrap': InterfaceWrap,
    signMessageConfirmationOverlay
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      openConfirmationOverlay: false
    };
  }
};
</script>

<style lang="scss" scoped></style>

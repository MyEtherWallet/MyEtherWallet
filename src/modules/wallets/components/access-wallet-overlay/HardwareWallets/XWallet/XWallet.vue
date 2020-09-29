<template>
  <div class="mew-component--access-wallet-bitbox">
    <mew-overlay
      :show-overlay="open"
      right-btn-text="Cancel"
      @closeOverlay="$emit('close')"
    >
      <template v-slot:mewOverlayBody>
        <div class="full-width">
          <h2 class="text-center mb-10">Scan the QR code</h2>
          <mew6-white-sheet max-width="500px" class="mx-auto pa-4 pa-sm-12">
            <div class="mb-3 font-weight-bold">
              Please use Pundi X Savings account by MEW to scan the QR code
              below.
            </div>

            <div class="text-center mt-10 mb-10">
              <img src="@/assets/images/temp/qr.png" alt="QR code" />
            </div>

            <div
              class="d-block d-sm-flex align-center justify-center text-center"
            >
              <img
                src="@/assets/images/icons/button-app-store.png"
                alt="App store"
                height="40"
                class="mx-1"
              />
              <img
                src="@/assets/images/icons/button-play-store.png"
                alt="Play store"
                height="40"
                class="mx-1"
              />
            </div>
          </mew6-white-sheet>
        </div>
      </template>
    </mew-overlay>
  </div>
</template>

<script>
export default {
  components: {},
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
    return {};
  }
};
</script>

<style lang="scss" scoped></style>

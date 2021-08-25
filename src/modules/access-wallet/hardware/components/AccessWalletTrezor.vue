<template>
  <div class="d-flex flex-column align-center">
    <div class="titlePrimary-text">
      Follow the instructions in the Trezor connection tab. If it did not open
      automatically, click below.
    </div>
    <div>
      <mew-button
        class="mt-7"
        title="Connect Trezor"
        icon="mdi-open-in-new"
        icon-type="mdi"
        @click.native="trezorUnlock"
      />
    </div>
    <div class="primary--text my-8 cursor--pointer" @click="back">
      <v-icon small class="primary--text">mdi-arrow-left</v-icon>
      Connect a different wallet
    </div>
  </div>
</template>

<script>
export default {
  props: {
    trezorUnlock: {
      type: Function,
      default: () => {}
    },
    back: {
      type: Function,
      default: () => {}
    }
  }
};
</script>

<template>
  <!-- <div>
    <span>Deviation</span>
    <mew-select />
  </div> -->
  <div>
    <div class="d-flex flex-column">
      <span class="mew-heading-2 mb-2"> Enter your PIN. </span>
      <span class="mew-heading-4 mb-5">
        The PIN layout is displayed on your Hardware wallet.
      </span>
    </div>
    <mew-input class="mb-5" />
    <v-container
      class="mb-8 pa-0 d-flex flex-column align-center justify-center"
    >
      <v-row class="keypad" no-gutters>
        <v-col v-for="(button, idx) in 9" :key="idx" cols="4">
          <div
            class="
              tableHeader
              rounded
              pin
              mr-2
              mb-2
              d-flex
              align-center
              justify-center
            "
          >
            <div class="pin-inner-circle disabled"></div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <mew-button title="Unlock wallet" btn-size="xlarge" has-full-width />
  </div>
</template>

<script>
export default {
  name: 'AccessWalletKeepkey',
  props: {
    paths: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    console.error('paths', this.paths);
  }
};
</script>

<style lang="scss" scoped>
.keypad {
  width: 266px;
  .pin {
    height: 80px;
    width: 80px;
    .pin-inner-circle {
      border-radius: 50%;
      height: 20px;
      width: 20px;
    }
  }
}
</style>

<template>
  <v-sheet width="100%" max-width="600px" class="mx-auto">
    <mew6-white-sheet class="pa-8">
      <v-sheet
        width="100%"
        max-width="500px"
        class="mx-auto pa-5 border-radius--5px"
        color="bg_datablock"
      >
        <div>
          <div class="d-flex align-center justify-space-between mb-2">
            <div>Domain name:</div>
            <div>mewdev.eth</div>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div>Term:</div>
            <div>2 years</div>
          </div>
        </div>
      </v-sheet>
      <div class="text-center mt-10">
        <div>
          <mew-icon icon-name="clock" :img-height="120" />
          <div class="mew-subtitle textSecondary--text mt-3">00:00</div>
          <div class="mew-heading-2 mt-6">Complete registration...</div>
          <v-sheet width="100%" max-width="300px" class="mx-auto mt-3">
            Please click 'Register' and follow the prompts to complete a final
            transaction and complete your domain registration.
          </v-sheet>
        </div>
        <div class="d-flex justify-center mt-9">
          <mew-button title="Register" button-size="xlarge" />
        </div>
      </div>
      <div class="text-center mt-10">
        <v-sheet width="100%" max-width="200px" class="mx-auto">
          <v-progress-linear
            color="red lighten-2"
            buffer-value="0"
            stream
          ></v-progress-linear>
        </v-sheet>
        <div class="mew-heading-2 mt-6">
          Processing the registration request
        </div>
        <v-sheet width="100%" max-width="300px" class="mx-auto mt-3">
          Please do not exit the Dapp or close your browser, it takes a short
          while for registration…
        </v-sheet>
      </div>
    </mew6-white-sheet>
  </v-sheet>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  }
};
</script>

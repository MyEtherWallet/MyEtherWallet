<template>
  <mew-overlay :show-overlay="open">
    <template #mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">Transfer domain</h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="600px" class="pa-8">
            <mew-address-select />
            <div class="d-flex justify-center mt-2">
              <mew-button title="Pay" btn-size="xlarge" />
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>
      <div>
        <h2 class="text-center mb-10">Confirmation</h2>
        <mew6-white-sheet>
          <!-- <transaction-confirmation /> -->
        </mew6-white-sheet>
        <mew6-white-sheet>
          <div class="pa-8">
            <v-sheet
              color="transparent"
              class="
                mx-auto
                mb-10
                border-radius--10px
                informationBlock
                py-5
                px-7
              "
            >
              <div class="d-flex align-center justify-space-between">
                <div>Domain name:</div>
                <div class="font-weight-medium">mewwallet.crypto</div>
              </div>
            </v-sheet>
            <v-progress-linear
              style="margin: 130px auto 40px auto; max-width: 200px"
              indeterminate
              color="greenPrimary"
            ></v-progress-linear>
            <h3 class="text-center">Processing the registration</h3>
            <v-sheet
              color="transparent"
              max-width="300px"
              class="text-center mx-auto mt-3"
            >
              Please do not exit the Dapp or close your browser, it takes a
              short while for registration…
            </v-sheet>
          </div>
          <div class="py-10"></div>
        </mew6-white-sheet>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
export default {
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped></style>

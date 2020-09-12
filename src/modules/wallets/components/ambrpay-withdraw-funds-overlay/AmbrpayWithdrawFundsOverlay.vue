<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">Withdraw funds</h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="500px" class="pa-8">
            <div class="d-flex align-center justify-space-between">
              <div class="font-weight-bold">Available Balance</div>
              <div class="text-right">
                <div class="mb-2">
                  <span class="font-weight-bold">9.11234</span> ETH
                </div>
                <div>$2,564.12</div>
              </div>
            </div>
            <v-divider class="mt-4 mb-12" />

            <div class="mb-3 font-weight-bold">
              How many ETH do you want to withdraw?
            </div>
            <mew-input label="Amount" placeholder=" " />

            <div class="d-flex justify-center">
              <mew-button title="Withdraw" button-size="xlarge" />
            </div>
          </v-sheet>
        </mew6-white-sheet>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="500px" class="pa-8">
            <div class="d-flex align-center justify-space-between">
              <div class="font-weight-bold">Available Balance</div>
              <div class="text-right">
                <div class="mb-2">
                  <span class="font-weight-bold">9.11234</span> ETH
                </div>
                <div>$2,564.12</div>
              </div>
            </div>
            <v-divider class="mt-4 mb-12" />

            <div class="mb-3 font-weight-medium text-center">
              <v-icon class="circle-icon mb-10 primary--text">
                mdi-check-circle-outline
              </v-icon>
              <v-sheet color="transparent" max-width="300px" class="mx-auto">
                Your withdrawed fund
                <span class="primary--text">(0.0031 ETH)</span> will show up in
                your wallet within few minutes.
              </v-sheet>
            </div>

            <div class="d-flex justify-center mt-8">
              <mew-button title="Ok" button-size="xlarge" />
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>
    </template>
  </mew-overlay>
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

<style lang="scss" scoped>
.circle-icon {
  font-size: 10rem;
}
</style>

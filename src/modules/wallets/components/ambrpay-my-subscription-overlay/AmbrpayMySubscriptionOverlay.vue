<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">My subscription</h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="700px" class="pa-6 pb-4">
            <div class="mew-component--ambrpay-my-subscription-overlay">
              <v-expansion-panels flat>
                <v-expansion-panel v-for="(item, i) in 5" :key="i">
                  <v-expansion-panel-header>
                    <div class="primary--text">
                      <v-icon
                        class="circle-icon primary--text mr-1"
                        style="font-size: 20px"
                      >
                        mdi-check-circle
                      </v-icon>
                      <span class="font-weight-medium primary--text"
                        >Active</span
                      >
                      (Next payment 09/19/2019)
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="py-2 d-flex align-center justify-space-between">
                      <div class="font-weight-medium">Receiver wallet</div>
                      <div class="primary--text">0x123DA78EFB986CD</div>
                    </div>
                    <div class="py-2 d-flex align-center justify-space-between">
                      <div class="font-weight-medium">Amount</div>
                      <div>0.03453634634 ETH</div>
                    </div>
                    <div class="py-2 d-flex align-center justify-space-between">
                      <div class="font-weight-medium">Network</div>
                      <div>Ropsten</div>
                    </div>
                    <div class="py-2 d-flex align-center justify-space-between">
                      <div class="font-weight-medium">Current cycle</div>
                      <div>09/18/2019 - 09/19/2019</div>
                    </div>
                    <div class="py-2 d-flex align-center justify-space-between">
                      <div class="font-weight-medium">Interval</div>
                      <div>In every 2 day(s)</div>
                    </div>
                    <div class="py-2 d-flex align-center justify-space-between">
                      <div class="font-weight-medium">Subscription</div>
                      <div>Custom Fiat</div>
                    </div>

                    <v-divider class="mt-5 mb-2" />

                    <div
                      class="pa-4 mb-n2 text-center font-weight-medium error--text cursor--pointer"
                    >
                      Unsubscribe
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
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

<style lang="scss">
.mew-component--ambrpay-my-subscription-overlay {
  .v-expansion-panel {
    background-color: var(--v-informationBlock-base) !important;
    margin-bottom: 8px !important;
    margin-top: 0 !important;
    border-radius: 4px !important;
  }
}
</style>

<style lang="scss" scoped>
.circle-icon {
  font-size: 10rem;
}
</style>

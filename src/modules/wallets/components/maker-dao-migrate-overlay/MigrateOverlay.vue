<template>
  <mew-overlay :show-overlay="open" @closeOverlay="$emit('close')">
    <template #mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">Migrate</h2>
        <mew6-white-sheet>
          <v-sheet
            color="transparent"
            max-width="600px"
            width="100%"
            class="pa-3 pa-lg-8"
          >
            <v-row>
              <v-col cols="12" lg="6">
                <div class="informationBlock pa-6">
                  <div class="font-weight-bold mb-2">My DAI Balance</div>
                  <div class="mew-heading-1 mb-1">
                    12.256 <span class="mew-body font-weight-regular">DAI</span>
                  </div>
                  <div>$ 13.64</div>
                </div>
              </v-col>

              <v-col cols="12" lg="6">
                <div class="informationBlock pa-6">
                  <div class="font-weight-bold mb-2">My CDPs</div>
                  <div class="mew-heading-1 mb-1">
                    12.256 <span class="mew-body font-weight-regular">CDP</span>
                  </div>
                  <div>$ 13.64</div>
                </div>
              </v-col>
            </v-row>

            <div class="mx-4 mx-lg-12 my-8">
              <div class="mew-heading-3 mb-2">
                Migrate Single Collateral CDP to Multi-Collateral Vault
              </div>
              <div>
                Here you can set the amount you want to migrate. You can
                manually enter a specific amount or use the percentage buttons
                below.
              </div>
            </div>

            <v-sheet max-width="300px" class="mx-auto" color="transparent">
              <mew-input placeholder=" " label="Amount" />
            </v-sheet>

            <v-sheet
              max-width="250px"
              class="mx-auto mt-n2"
              color="transparent"
            >
              <v-btn-toggle
                v-model="amount"
                tile
                color="deep-purple accent-3"
                group
              >
                <v-btn value="25"> 25% </v-btn>

                <v-btn value="50"> 50% </v-btn>

                <v-btn value="75"> 75% </v-btn>

                <v-btn value="100"> Max </v-btn>
              </v-btn-toggle>
            </v-sheet>

            <div class="d-flex justify-center mt-6">
              <mew-button title="Migrate" btn-size="xlarge" />
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>

      <div>
        <h2 class="text-center mb-10">Confirmation</h2>
        <mew6-white-sheet>
          <transaction-confirmation />
        </mew6-white-sheet>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import transactionConfirmation from '@/modules/wallets/components/transaction-confirmation/TransactionConfirmation';

export default {
  components: { transactionConfirmation },
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
      amount: 25
    };
  }
};
</script>

<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">Withdraw</h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="600px" class="pa-8">
            <v-card flat color="informationBlock" class="pa-6 mx-2">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="mew-heading-3 mb-1">DAI Balance</div>
                  <div>
                    Dai savings rate: <span class="primary--text">2.00%</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="mew-heading-1 mb-1">
                    12.256 <span class="mew-body font-weight-regular">DAI</span>
                  </div>
                  <div>$ 30.12</div>
                </div>
              </div>
            </v-card>

            <div class="mx-12 my-8">
              <div class="mew-heading-3 mb-2">
                How many DAI do you want to withdraw?
              </div>
              <div>
                Here you can set the amount you want to deposit. You can
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
              <mew-button title="Withdraw" button-size="xlarge" />
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

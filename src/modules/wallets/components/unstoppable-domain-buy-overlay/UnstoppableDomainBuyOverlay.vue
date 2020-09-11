<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">Buy domain</h2>
        <mew6-white-sheet>
          <div class="pa-8">
            <v-sheet
              color="transparent"
              width="600px"
              class="mx-auto mb-10 border-radius--10px informationBlock py-5 px-7"
            >
              <div class="d-flex align-center justify-space-between mb-3">
                <div>Domain name:</div>
                <div class="font-weight-medium">mewwallet.crypto</div>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div>Price:</div>
                <div class="font-weight-medium">0.002353234 ETH ($40.00)</div>
              </div>
            </v-sheet>
            <v-sheet color="transparent" width="450px" class="mx-auto">
              <div class="d-flex align-center justify-space-between mb-5">
                <div class="mew-heading-1">Pay with Crypto</div>
                <div class="font-weight-medium primary--text">
                  Pay with Credit Card
                </div>
              </div>

              <v-card
                outlined
                color="informationBlock"
                class="pa-4 d-flex align-center justify-space-between bordered-red"
                style="border-color: var(--v-error-base) !important"
              >
                <div class="d-flex align-center">
                  <img
                    src="@/assets/images/currencies/icon-eth-blue.svg"
                    alt="Crypto"
                  />
                  <div class="font-weight-medium ml-3">
                    0.0341234234
                    <span class="primary--text">ETH</span>
                  </div>
                </div>
                <v-icon class="primary--text">mdi-check-circle</v-icon>
              </v-card>

              <div class="error--text mt-3 mb-7 font-weight-medium">
                Insufficient balance.
                <a
                  href="https://ccswap.myetherwallet.com/#/"
                  target="_blank"
                  class="text-decoration--underline"
                >
                  Buy more ETH
                </a>
              </div>

              <v-card
                flat
                color="informationBlock"
                class="mt-3 pa-4 d-flex align-center justify-space-between"
              >
                <div class="d-flex align-center">
                  <img
                    src="@/assets/images/icons/icon-fiat-white.svg"
                    alt="Fiat"
                  />
                  <div class="font-weight-medium ml-3">
                    40.23
                    <span class="primary--text">USD</span>
                  </div>
                </div>
                <v-icon>mdi-check-circle-outline</v-icon>
              </v-card>

              <div class="d-flex justify-center mt-5">
                <mew-button title="Pay" button-size="xlarge" />
              </div>
            </v-sheet>
          </div>
        </mew6-white-sheet>
      </div>
      <div>
        <h2 class="text-center mb-10">Confirmation</h2>
        <mew6-white-sheet>
          <transaction-confirmation />
        </mew6-white-sheet>
        <mew6-white-sheet>
          <div class="pa-8">
            <v-sheet
              color="transparent"
              class="mx-auto mb-10 border-radius--10px informationBlock py-5 px-7"
            >
              <div class="d-flex align-center justify-space-between">
                <div>Domain name:</div>
                <div class="font-weight-medium">mewwallet.crypto</div>
              </div>
            </v-sheet>
            <v-progress-linear
              style="margin: 130px auto 40px auto; max-width: 200px"
              indeterminate
              color="primary"
            ></v-progress-linear>
            <h4 class="font-weight-bold text-center">
              Processing the registration
            </h4>
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

      <div>
        <h2 class="text-center mb-10">Confirmation</h2>
        <mew6-white-sheet>
          <transaction-confirmation />
        </mew6-white-sheet>
        <mew6-white-sheet>
          <div class="py-5"></div>
          <div class="text-center">
            <div>
              <mew-icon icon-name="clock" :img-height="120" />
              <div class="mew-subtitle textSecondary--text mt-3">00:00</div>
              <div class="mew-heading-2 mt-6">Complete registration...</div>
              <v-sheet
                color="transparent"
                width="100%"
                max-width="300px"
                class="mx-auto mt-3"
              >
                Please click 'Register' and follow the prompts to complete a
                final transaction and complete your domain registration.
              </v-sheet>
            </div>
            <div class="d-flex justify-center mt-9">
              <mew-button title="Register" button-size="xlarge" />
            </div>
          </div>
          <div class="py-5"></div>
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
    return {};
  }
};
</script>

<style lang="scss" scoped></style>

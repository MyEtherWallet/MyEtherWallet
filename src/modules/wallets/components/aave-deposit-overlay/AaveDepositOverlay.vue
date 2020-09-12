<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">Select the token you want to deposit</h2>
        <mew6-white-sheet>
          <v-sheet
            color="transparent"
            width="700px"
            class="pa-8 mew-component--aave-deposit-overlay"
          >
            <div class="d-flex align-center justify-space-between mb-6">
              <mew-input
                class="search"
                is-search
                placeholder="Search for token name"
              />
              <div class="d-flex align-center">
                <div class="mr-5">Type of token</div>
                <v-btn-toggle v-model="tokenType" dense>
                  <v-btn value="all">All</v-btn>
                  <v-btn value="stable">Stable</v-btn>
                </v-btn-toggle>
              </div>
            </div>
            <mew-table
              class="token-table"
              :has-color="false"
              :table-headers="tableHeaders"
              :table-data="tableData"
            />
          </v-sheet>
        </mew6-white-sheet>
      </div>
      <div>
        <h2 class="text-center mb-10">Deposit</h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="500px" class="pa-10">
            <div>
              <div class="d-flex align-center justify-space-between py-2">
                <div>Currency</div>
                <div class="font-weight-bold">Ethereum</div>
              </div>
              <div class="d-flex align-center justify-space-between py-2">
                <div class="d-flex align-center">
                  Current Health Factor
                  <info-tooltip class="ml-2" text="Health" />
                </div>
                <div class="font-weight-bold primary--text">2.4725</div>
              </div>
              <div class="d-flex align-center justify-space-between py-2">
                <div class="d-flex align-center">
                  Next Health Factor <info-tooltip class="ml-2" text="Health" />
                </div>
                <div class="font-weight-bold primary--text">
                  2.123
                  <v-icon class="red--text mew-heading-3"
                    >mdi-arrow-down-bold</v-icon
                  >
                </div>
              </div>
            </div>
            <v-divider class="mt-6 mb-3" />
            <div>
              <div class="d-flex align-center justify-space-between py-2">
                <div>Gas Fee</div>
                <div class="font-weight-bold">0.000142 ETH ($0.31)</div>
              </div>
              <div class="d-flex align-center justify-space-between py-2">
                <div>Total</div>
                <div class="font-weight-bold">0.000142 ETH ($0.31)</div>
              </div>
            </div>
            <v-divider class="mt-3 mb-10" />
            <div class="d-flex justify-center mt-8">
              <mew-button title="Confirm" button-size="xlarge" />
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>
      <div>
        <h2 class="text-center mb-10">Confirmation</h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="500px" class="pa-10">
            <v-card
              flat
              color="informationBlock"
              class="px-8 py-3 d-flex align-center justify-space-between"
            >
              <div>
                <div class="font-weight-bold mb-2">Amount to Deposit</div>
                <div class="mew-heading-1 mb-1">
                  12.256 <span class="mew-body font-weight-regular">DAI</span>
                </div>
                <div>$ 13.64</div>
              </div>
              <div>
                <img
                  src="@/assets/images/currencies/icon-btc-gold.svg"
                  alt="DAI"
                  height="60"
                />
              </div>
            </v-card>
            <div class="mt-5">
              <div class="d-flex align-center justify-space-between py-2">
                <div class="d-flex align-center">
                  Current Health Factor
                  <info-tooltip class="ml-2" text="Health" />
                </div>
                <div class="font-weight-bold primary--text">2.4725</div>
              </div>
              <div class="d-flex align-center justify-space-between py-2">
                <div class="d-flex align-center">
                  Next Health Factor <info-tooltip class="ml-2" text="Health" />
                </div>
                <div class="font-weight-bold primary--text">
                  2.123
                  <v-icon class="red--text mew-heading-3"
                    >mdi-arrow-down-bold</v-icon
                  >
                </div>
              </div>
            </div>
            <v-divider class="mt-6 mb-3" />
            <div>
              <div class="d-flex align-center justify-space-between py-2">
                <div>Gas Fee</div>
                <div class="font-weight-bold">0.000142 ETH ($0.31)</div>
              </div>
              <div class="d-flex align-center justify-space-between py-2">
                <div>Total</div>
                <div class="font-weight-bold">0.000142 ETH ($0.31)</div>
              </div>
            </div>
            <v-divider class="mt-3 mb-10" />
            <div class="d-flex justify-center mt-8">
              <mew-button title="Confirm to deposit" button-size="xlarge" />
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>
      <div>
        <h2 class="text-center mb-10">Deposite</h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="600px" class="pa-8">
            <div class="d-flex">
              <v-card
                flat
                color="informationBlock"
                class="pa-6 mx-2 flex-grow-1"
              >
                <div class="font-weight-bold mb-2">Aave Deposit Balance</div>
                <div class="mew-heading-1 mb-1">
                  12.256 <span class="mew-body font-weight-regular">DAI</span>
                </div>
                <div>$ 13.64</div>
              </v-card>
              <v-card
                flat
                color="informationBlock"
                class="pa-6 mx-2 flex-grow-1"
              >
                <div class="font-weight-bold mb-2">Aave Wallet balance</div>
                <div class="mew-heading-1 mb-1">
                  12.256 <span class="mew-body font-weight-regular">SAI</span>
                </div>
                <div>$ 13.64</div>
              </v-card>
            </div>
            <div class="mx-12 my-8">
              <div class="mew-heading-3 mb-2">
                How much would you like to deposit?
              </div>
              <div>
                Set the amount you want to borrow. You can manually enter a
                specific amount or use the percentage buttons below.
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
                <v-btn value="25">25%</v-btn>
                <v-btn value="50">50%</v-btn>
                <v-btn value="75">75%</v-btn>
                <v-btn value="100">Max</v-btn>
              </v-btn-toggle>
            </v-sheet>

            <div class="d-flex justify-center mt-6">
              <mew-button title="Deposit" button-size="xlarge" />
            </div>
            <div class="d-flex justify-center mt-4">
              <mew-button
                title="Cancel"
                btn-style="transparent"
                color-theme="error"
                button-size="small"
              />
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>
      <div>
        <h2 class="text-center mb-10">Confirmation</h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="500px" class="pa-10">
            <div class="text-center">
              <mew-icon icon-name="clock" :img-height="120" />
              <div class="mew-subtitle textSecondary--text mt-3">00:00</div>
              <div class="mew-heading-2 mt-6">Hang on tight!</div>
              <v-sheet
                color="transparent"
                width="100%"
                max-width="300px"
                class="mx-auto mt-3"
              >
                Please do not close your browser or exit this Dapp, We are
                working on your request.
              </v-sheet>
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>
      <div>
        <h2 class="text-center mb-10">Processing</h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="500px" class="pa-10">
            <div class="text-center">
              <v-sheet width="100%" max-width="200px" class="mx-auto mb-8">
                <v-progress-linear
                  indeterminate
                  color="primary"
                ></v-progress-linear>
              </v-sheet>
              <h4 class="font-weight-bold text-center">
                Processing the deposit
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
    return {
      amount: 25,
      tokenType: 'all',
      tableHeaders: [
        {
          text: 'Token',
          value: 'token',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '15%'
        },
        {
          text: 'Available Balance',
          value: 'balance',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '25%'
        },
        {
          text: 'Deposited',
          value: 'deposit',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '25%'
        },
        {
          text: 'APR',
          value: 'apr',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '15%'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '20%'
        }
      ],
      tableData: [
        {
          token: 'XMR',
          balance: '15.2342 DAI',
          deposit: '2.35343 DAI',
          apr: '9.74%',
          callToAction: 'Borrow'
        },
        {
          token: 'ADR',
          balance: '15.2342 DAI',
          deposit: '2.35343 DAI',
          apr: '9.74%',
          callToAction: 'Borrow'
        },
        {
          token: 'XDA',
          balance: '15.2342 DAI',
          deposit: '2.35343 DAI',
          apr: '9.74%',
          callToAction: 'Borrow'
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.mew-component--aave-deposit-overlay {
  .search {
    .v-input__slot {
      padding: 0 !important;
      margin: 0 !important;
      min-height: initial !important;
      border-bottom: 1px solid var(--v-inputBorder-base);
      border-radius: 0 !important;
    }
    .v-text-field__details {
      display: none !important;
    }
    .v-text-field input {
      min-height: 30px;
      padding: 0 !important;
    }
    .v-input__prepend-inner {
      margin-top: 4px !important;
    }
  }
  .token-table {
    td {
      button {
        padding: 0 !important;
        margin: 0 !important;
      }
    }
  }
}
</style>

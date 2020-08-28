<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">
          Select the token you want to deposit
        </h2>
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
                <div class="mr-5">
                  Type of token
                </div>
                <v-btn-toggle v-model="tokenType" dense>
                  <v-btn value="all">
                    All
                  </v-btn>
                  <v-btn value="stable">
                    Stable
                  </v-btn>
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
        <h2 class="text-center mb-10">
          Deposit
        </h2>
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
        <h2 class="text-center mb-10">
          Confirmation
        </h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="500px" class="pa-10">
            <v-card
              flat
              color="informationBlock"
              class="pa-8 d-flex align-center justify-space-between"
            >
              <div>
                <div class="font-weight-bold mb-2">Amount to Deposit</div>
                <div class="mew-heading-1 mb-1">
                  12.256 <span class="font-weight-medium">DAI</span>
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
            <div>
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
          callToAction: 'Deposit'
        },
        {
          token: 'XMR',
          balance: '15.2342 DAI',
          deposit: '2.35343 DAI',
          apr: '9.74%',
          callToAction: 'Deposit'
        },
        {
          token: 'XMR',
          balance: '15.2342 DAI',
          deposit: '2.35343 DAI',
          apr: '9.74%',
          callToAction: 'Deposit'
        },
        {
          token: 'XMR',
          balance: '15.2342 DAI',
          deposit: '2.35343 DAI',
          apr: '9.74%',
          callToAction: 'Deposit'
        },
        {
          token: 'XMR',
          balance: '15.2342 DAI',
          deposit: '2.35343 DAI',
          apr: '9.74%',
          callToAction: 'Deposit'
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

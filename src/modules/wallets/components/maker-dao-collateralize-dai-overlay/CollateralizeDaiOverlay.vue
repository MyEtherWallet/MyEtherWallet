<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>
        <v-sheet
          max-width="550px"
          color="transparent"
          class="mb-6 mx-auto text-center"
        >
          <h2 class="mb-3">
            1. Select a Collateral Type
          </h2>
          <div>
            Each collateral type has its own risk parameters. You can lock up
            additional collateral types later..
          </div>
        </v-sheet>
        <mew6-white-sheet>
          <v-sheet
            color="transparent"
            width="700px"
            class="pa-8 mew-component--aave-borrow-overlay"
          >
            <mew-table :table-headers="tableHeader" :table-data="tableData" />

            <mew-expand-panel
              class="mt-10"
              :panel-items="panelItems"
              has-dividers
            />

            <div class="d-flex justify-center mt-8">
              <mew-button
                button-size="xlarge"
                title="Continue"
                @click.native="activeTab = 1"
              />
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>

      <div>
        <h2 class="text-center mb-10">
          2. Deposit ETH and Generate DAI
        </h2>
        <mew6-white-sheet>
          <v-sheet color="transparent" width="600px" class="pa-8">
            <v-row class="mb-5">
              <v-col cols="6" md="6">
                <div class="mew-heading-3 mb-2">My Collateralization Ratio</div>
                <div>65.34% (Min 150%)</div>
              </v-col>
              <v-col cols="6" md="6">
                <div class="mew-heading-3 mb-2">My Liquidation Price</div>
                <div>$420.53</div>
              </v-col>
              <v-col cols="6" md="6">
                <div class="mew-heading-3 mb-2">Current ETH Price</div>
                <div>$120.53</div>
              </v-col>
              <v-col cols="6" md="6">
                <div class="mew-heading-3 mb-2">Stability Fee</div>
                <div>4.00%</div>
              </v-col>
            </v-row>
            <div class="d-flex mx-n2">
              <v-card
                flat
                color="informationBlock"
                class="pa-6 mx-2 flex-grow-1"
              >
                <div class="font-weight-bold mb-2">My ETH Balance</div>
                <div class="mew-heading-1 mb-1">
                  12.256 <span class="mew-body font-weight-regular">ETH</span>
                </div>
                <div>$ 13.64</div>
              </v-card>
              <v-card
                flat
                color="informationBlock"
                class="pa-6 mx-2 flex-grow-1"
              >
                <div class="font-weight-bold mb-2">
                  Max Available to Generate
                </div>
                <div class="mew-heading-1 mb-1">
                  12.256 <span class="mew-body font-weight-regular">DAI</span>
                </div>
                <div>$ 13.64</div>
              </v-card>
            </div>

            <div class="mx-12 my-8">
              <div class="mew-heading-3 mb-2">
                How much ETH would you like to lock in your Vault?
              </div>
              <div>
                The amount of ETH you lock up determines how much Dai you can
                generate.
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
                v-model="vaultAmount"
                tile
                color="deep-purple accent-3"
                group
              >
                <v-btn value="25">
                  25%
                </v-btn>

                <v-btn value="50">
                  50%
                </v-btn>

                <v-btn value="75">
                  75%
                </v-btn>

                <v-btn value="100">
                  Max
                </v-btn>
              </v-btn-toggle>
            </v-sheet>

            <div class="mx-12 my-8">
              <div class="mew-heading-3 mb-2">
                How much DAI would you like to generate?
              </div>
              <div>
                Generate an amount that is safely above the liquidation ratio.
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
                v-model="daiAmount"
                tile
                color="deep-purple accent-3"
                group
              >
                <v-btn value="25">
                  25%
                </v-btn>

                <v-btn value="50">
                  50%
                </v-btn>

                <v-btn value="75">
                  75%
                </v-btn>

                <v-btn value="100">
                  Max
                </v-btn>
              </v-btn-toggle>
            </v-sheet>

            <div class="error--text py-3 text-center">
              A Vault requires a minimum of 20 DAI to be generated
            </div>

            <div class="d-flex justify-center mt-6">
              <mew-button title="Continue" button-size="xlarge" />
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>

      <div>
        <h2 class="text-center mb-10">
          Collateralize DAI
        </h2>
        <mew6-white-sheet>
          <v-sheet
            color="transparent"
            width="700px"
            class="px-8 py-1 mew-component--aave-borrow-overlay"
          >
            <table class="width--full">
              <tbody>
                <tr>
                  <td class="font-weight-bold vertical-align--middle py-8">
                    Upgrade SAI to DAI
                  </td>
                  <td class="text-right">
                    <mew-button title="Upgrade" btn-style="outline" />
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold vertical-align--middle py-8">
                    Migrate Single Collateral CDP to Multi-Collateral Vault
                  </td>
                  <td class="text-right">
                    <mew-button title="Upgrade" btn-style="outline" />
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold vertical-align--middle py-8">
                    DAI Savings
                  </td>
                  <td class="text-right">
                    <mew-button title="Upgrade" btn-style="outline" />
                  </td>
                </tr>
              </tbody>
            </table>
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
      vaultAmount: 25,
      daiAmount: 25,
      tableHeader: [
        {
          text: 'COLLATERAL TYPE',
          value: 'collateralType',
          sortable: true,
          filterable: false,
          width: '100%'
        },
        {
          text: 'STABILITY FEE',
          value: 'stabilityFee',
          sortable: true,
          filterable: false,
          width: '60%'
        },
        {
          text: 'LIQ RATIO',
          value: 'liqRatio',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'LIQ fee',
          value: 'liqFee',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'My BALANCE',
          value: 'balance',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '100%'
        }
      ],
      tableData: [
        {
          collateralType: 'ETH-A',
          stabilityFee: '4.00%',
          liqRatio: '150%',
          liqFee: '13.00%',
          balance: '0.038 ETH'
        },
        {
          collateralType: 'ETH-B',
          stabilityFee: '4.00%',
          liqRatio: '150%',
          liqFee: '13.00%',
          balance: '0.038 ETH'
        }
      ],
      panelItems: [
        {
          name: 'What is stability fee?',
          subtext: '',
          colorTheme: 'transparent'
        },
        {
          name: 'What is liquidation ratio?',
          subtext: '',
          colorTheme: 'transparent'
        },
        {
          name: 'What is liquidation fee?',
          subtext: '',
          colorTheme: 'transparent'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
table {
  tbody {
    tr:not(:last-child) {
      td {
        border-bottom: 1px solid var(--v-inputBorder-base);
      }
    }
  }
}
</style>

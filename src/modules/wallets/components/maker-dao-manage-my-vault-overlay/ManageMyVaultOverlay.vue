<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">Manage My Vault</h2>
        <mew6-white-sheet>
          <v-sheet
            color="transparent"
            width="700px"
            class="pa-8 mew-component--aave-borrow-overlay"
          >
            <div class="mew-heading-2 mb-5">ETH-A Vault #375</div>

            <v-row>
              <v-col>
                <div class="font-weight-bold mb-2 ml-2">Liquidation Price</div>
                <div class="informationBlock border-radius--5px pa-5">
                  <div class="mew-heading-3 font-weight-regular mb-2">
                    <span class="font-weight-bold secondary--text">
                      $ 59.334
                    </span>
                    USD
                  </div>
                  <div class="d-flex justify-space-between">
                    <div>Current price</div>
                    <div>
                      <span class="font-weight-bold">$ 182.03</span> USD/ETH
                    </div>
                  </div>
                  <div class="d-flex justify-space-between">
                    <div>Liquidation penalty</div>
                    <div>
                      <span class="font-weight-bold">13.00%</span>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col>
                <div class="font-weight-bold mb-2 ml-2">
                  Collateralization Ratio
                </div>
                <div class="informationBlock border-radius--5px pa-5">
                  <div class="mew-heading-3 font-weight-regular mb-2">
                    <span class="font-weight-bold orange--text">
                      125.342%
                    </span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <div>Minimum radio</div>
                    <div>
                      <span class="font-weight-bold">150.00%</span>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between">
                    <div>Stability fee</div>
                    <div>
                      <span class="font-weight-bold">2.500%</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>

            <div class="mt-4">
              <div class="font-weight-bold mb-2 ml-2">ETH overview</div>
              <div class="informationBlock px-5 border-radius--5px">
                <table class="width--full">
                  <tbody>
                    <tr>
                      <td class="vertical-align--middle py-6">ETH locked</td>
                      <td class="text-right">
                        <div class="d-flex align-center justify-end">
                          <div class="mr-4">
                            <div>
                              <span class="font-weight-medium">0.4</span> ETH
                            </div>
                            <div>$ 73.32 USD</div>
                          </div>
                          <mew-button
                            title="Deposit"
                            button-size="medium"
                            btn-style="outline"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="vertical-align--middle py-6">
                        Liquidation penalty
                      </td>
                      <td class="text-right">
                        <div class="d-flex align-center justify-end">
                          <div class="mr-4">
                            <div>
                              <span class="font-weight-medium">0.4</span> ETH
                            </div>
                            <div>$ 73.32 USD</div>
                          </div>
                          <mew-button
                            title="Withdraw"
                            button-size="medium"
                            btn-style="outline"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-8">
              <div class="font-weight-bold mb-2 ml-2">DAI Overview</div>
              <div class="informationBlock px-5 border-radius--5px">
                <table class="width--full">
                  <tbody>
                    <tr>
                      <td class="vertical-align--middle py-6">
                        Outstanding DAI debt
                      </td>
                      <td class="text-right">
                        <div class="d-flex align-center justify-end">
                          <div class="mr-4">
                            <div>
                              <span class="font-weight-medium">30.04</span> DAI
                            </div>
                          </div>
                          <mew-button
                            title="Pay Back"
                            button-size="medium"
                            btn-style="outline"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="vertical-align--middle py-6">
                        Available to generate
                      </td>
                      <td class="text-right">
                        <div class="d-flex align-center justify-end">
                          <div class="mr-4">
                            <div>
                              <span class="font-weight-medium">30.04</span> DAI
                            </div>
                          </div>
                          <mew-button
                            title="Generate"
                            button-size="medium"
                            btn-style="outline"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-8">
              <div class="font-weight-bold mb-2 ml-2">DAI Overview</div>
              <mew-table
                :table-headers="tableHeaders"
                :table-data="tableData"
              />
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
      tableHeaders: [
        {
          text: 'Activity',
          value: 'activity',
          sortable: false,
          filterable: false,
          width: '100%'
        },
        {
          text: 'Date',
          value: 'date',
          sortable: false,
          filterable: false,
          width: '60%'
        },
        {
          text: 'Tx Hash',
          value: 'txHash',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '100%'
        }
      ],
      tableData: [
        {
          activity: 'Deposited 0.0001 ETH into Vault',
          date: '01/02/2020, 2:16:32 PM',
          txHash: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 30.0000 new Dai from Vault',
          date: '01/02/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 2.0 new Dai from Vault',
          date: '01/05/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
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

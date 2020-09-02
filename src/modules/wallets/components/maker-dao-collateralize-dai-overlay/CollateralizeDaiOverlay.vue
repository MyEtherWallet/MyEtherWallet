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
            <mew-table
              has-select
              :table-select-headers="tableHeader"
              :table-select-data="tableData"
            />

            <div class="d-flex justify-center my-8">
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
      tableHeader: [
        {
          text: 'Address',
          value: 'address',
          sortable: false,
          filterable: false,
          width: '100%'
        },
        {
          text: '#Token',
          value: 'token',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '30%'
        },
        {
          text: '24H Changes',
          value: 'change',
          sortable: false,
          filterable: false,
          width: '30%'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          width: '20%'
        }
      ],
      tableData: [
        {
          ethBalance: '0.0001 ETH',
          token: '21',
          tokenImg:
            'https://cdn4.iconfinder.com/data/icons/cryptocoins/227/ETH-512.png',
          address: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          ethBalance: '2.23 ETH',
          token: '10',
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          change: '0.23%',
          status: '+',
          changeData: {
            x: [1, 4, 10, 4],
            y: [5, 1, 34, 43]
          }
        },
        {
          ethBalance: '0.23 ETH',
          token: '8',
          address: '0xAECFF9CD2367cdbb726E904cD6397eDFcAe6068D',
          callToAction: 'Edit'
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

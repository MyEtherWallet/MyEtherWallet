<template>
  <mew-overlay
    :show-overlay="open"
    title="1. Connect with Ledger"
    right-btn-text="Close"
  >
    <template #mewOverlayBody>
      <mew-tabs :items="tabs" is-block>
        <template #tabContent0>
          <mew6-white-sheet>
            <div class="pa-8">
              <div class="mt-2 mb-9 text-center">
                <mew-icon icon-name="ETH" img-height="100"></mew-icon>
              </div>
              <mew-select
                :items="apps"
                select-label="Choose your coin"
                placeholder="Search..."
                class="mb-1"
              />
              <mew-select
                :items="path"
                select-label="HD derivation path"
                placeholder="Search..."
                class="mb-1"
              />

              <div class="text-center">
                <mew-button title="Connect with Ledger" button-size="xlarge" />
              </div>
            </div>
          </mew6-white-sheet>
        </template>
        <template #tabContent2>
          <v-sheet max-width="750px">
            <mew-expand-panel :panel-items="panelItems">
              <template #panelBody1> </template>
              <template #panelBody2>
                <mew-table
                  has-select
                  has-color
                  :table-select-headers="tableHeaders"
                  :table-select-data="tableData"
                />
              </template>
            </mew-expand-panel>
          </v-sheet>
          <div class="pa-8">
            <div class="text-center">
              <mew-button title="Access My Wallet" button-size="xlarge" />
            </div>
          </div>
        </template>
      </mew-tabs>
    </template>
  </mew-overlay>
</template>

<script>
export default {
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
      tabs: [
        {
          name: 'Tab 1'
        },
        {
          name: 'Tab 2'
        }
      ],
      appSelected: '',
      apps: [
        { name: 'Ethereum', value: 'eth' },
        { name: 'Ethereum2', value: 'eth2' },
        { name: 'Ethereum3', value: 'eth3' }
      ],
      pathSelected: '',
      path: [
        { name: "m/44'/60'/0'", value: '1' },
        { name: "m/44'/60'/2'", value: '2' }
      ],
      panelItems: [
        {
          name: 'Network',
          subtext: 'ETH - myetherwallet.com'
        },
        {
          name: 'Address to interact with'
        }
      ],
      tableHeaders: [
        {
          text: 'Address',
          value: 'address',
          sortable: false,
          filterable: false,
          width: '100%'
        },
        {
          text: 'Eth Balance',
          value: 'ethBalance',
          sortable: false,
          filterable: false,
          width: '40%'
        },
        {
          text: '#Token',
          value: 'token',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '30%'
        }
      ],
      tableData: [
        {
          ethBalance: '0.0001 ETH',
          token: '21',
          address: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          ethBalance: '2.23 ETH',
          token: '10',
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          ethBalance: '0.23 ETH',
          token: '8',
          address: '0xAECFF9CD2367cdbb726E904cD6397eDFcAe6068D',
          edit: 'Edit'
        }
      ]
    };
  }
};
</script>

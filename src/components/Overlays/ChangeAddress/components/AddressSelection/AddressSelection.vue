<template>
  <v-sheet max-width="750px">
    <mew-expand-panel :panel-items="panelItems">
      <template v-slot:panelBody0> </template>
      <template v-slot:panelBody1>
        <mew-table
          has-select
          has-color
          :table-select-headers="tableHeaders"
          :table-select-data="tableData"
        />
      </template>
    </mew-expand-panel>
  </v-sheet>
</template>

<script>
export default {
  components: {},
  props: {
    text: { default: '', type: String }
  },
  data() {
    return {
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

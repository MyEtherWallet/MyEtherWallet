<template>
  <mew-table :table-headers="tableHeaders" :table-data="tableData" />
</template>

<script>
export default {
  components: {},
  data: () => ({
    tableHeaders: [
      {
        text: 'Token',
        value: 'token',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: 'Value ID',
        value: 'id',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: 'Current Ratio',
        value: 'ratio',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: 'Deposited',
        value: 'deposited',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: 'Avail. To Withdraw',
        value: 'avail',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: 'DAI',
        value: 'dai',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: '',
        value: 'btn',
        sortable: false,
        filterable: false,
        containsLink: false,
        width: '100%'
      }
    ],
    tableData: [
      {
        token: 'DAI',
        id: '375',
        ratio: '243.11%',
        deposited: '0.40 ETH',
        avail: '0.15 ETH',
        dai: '30.08 DAI',
        btn: 'Manage'
      }
    ]
  })
};
</script>

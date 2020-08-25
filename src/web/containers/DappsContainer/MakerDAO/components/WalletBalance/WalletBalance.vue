<template>
  <mew-table :table-headers="tableHeaders" :table-data="tableData" />
</template>

<script>
export default {
  components: {},
  data: () => ({
    tableHeaders: [
      {
        text: 'Asset',
        value: 'asset',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: 'Balance',
        value: 'balance',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: 'USD Value',
        value: 'value',
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
        asset: 'DAI',
        balance: '15.231234 DAI',
        value: '$12.23',
        btn: 'Send'
      }
    ]
  })
};
</script>

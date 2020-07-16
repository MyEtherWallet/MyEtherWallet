<template>
  <mew-table :table-headers="tableHeaders" :table-data="tableData" />
</template>

<script>
export default {
  components: {},
  data: () => ({
    tableHeaders: [
      {
        text: 'Activity',
        value: 'activity',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: 'Date',
        value: 'date',
        sortable: true,
        filterable: false,
        containsLink: false,
        width: '100%'
      },
      {
        text: 'TX Hash',
        value: 'hash',
        sortable: true,
        filterable: false,
        containsLink: true,
        width: '100%'
      }
    ],
    tableData: [
      {
        activity: 'Deposited 12.00000 DAI',
        date: '01/02/2020, 2:16:32 PM',
        hash:
          '0x68f6ce1e607d6a6ec6fb1aaa6f43bb8210658f49065ae5a7325c5771ea1100e8'
      },
      {
        activity: 'Deposited 12.00000 DAI',
        date: '01/02/2020, 2:16:32 PM',
        hash:
          '0x68f6ce1e607d6a6ec6fb1aaa6f43bb8210658f49065ae5a7325c5771ea1100e8'
      }
    ]
  })
};
</script>

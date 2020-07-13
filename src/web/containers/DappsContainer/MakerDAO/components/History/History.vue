<template>
  <div class="more-actions--table pb-5">
    <v-data-table
      :headers="headers"
      :items="addresses"
      :items-per-page="10"
      item-key="id"
      sort-by="calories"
    >
      <template v-slot:item.change="{ item }"> {{ item.change }}% </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [
      {
        text: 'Token Name',
        value: 'token'
      },
      { text: 'Price', value: 'price' },
      { text: 'Market Cap', value: 'marketCap' },
      { text: 'Change(24h)', value: 'change' },
      { text: 'Amount', value: 'amount' },
      { text: 'My value', value: 'myvalue' }
    ],
    addresses: []
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.addresses = [
        {
          token: 'Monero(XMR)',
          price: '$8.29',
          marketCap: '$1.56B',
          change: 0.23,
          amount: 27.54,
          myvalue: '$228.42'
        },
        {
          token: 'AMIS(AMIS)',
          price: '$10.72',
          marketCap: '$1.56B',
          change: 0.23,
          amount: 27.54,
          myvalue: '$228.42'
        },
        {
          token: 'Joack(JCK)',
          price: '$0.21',
          marketCap: '$1.56B',
          change: 0.23,
          amount: 27.54,
          myvalue: '$228.42'
        },
        {
          token: 'Amon(AMN)',
          price: '$10.22',
          marketCap: '$1.56B',
          change: 0.23,
          amount: 27.54,
          myvalue: '$228.42'
        }
      ];
    }
  }
};
</script>

<style lang="scss">
.more-actions--table {
  .v-data-table-header {
    background-color: var(--v-bg_table-base);
  }
  .v-data-table thead tr th {
    text-transform: uppercase;
    font-weight: 500;
    &:not(:hover) {
      color: var(--v-gray_text-base) !important;
    }
  }
}
</style>

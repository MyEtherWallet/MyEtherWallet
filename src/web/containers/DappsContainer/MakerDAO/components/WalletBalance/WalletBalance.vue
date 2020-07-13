<template>
  <div class="more-actions--table pb-5">
    <v-data-table
      :headers="headers"
      :items="addresses"
      :items-per-page="10"
      item-key="id"
      sort-by="calories"
    >
      <template v-slot:item.icon="{ item }">
        <div class="d-flex align-center justify-center">
          <img :src="item.icon" :alt="item.token" height="24" class="pl-4" />
        </div>
      </template>
      <template v-slot:item.change="{ item }"> {{ item.change }}% </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    headers: [
      {
        text: '',
        value: 'icon',
        sortable: false
      },
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
          icon: require('@/assets/images/currencies/icon-btc-gold.svg'),
          token: 'Monero(XMR)',
          price: '$8.29',
          marketCap: '$1.56B',
          change: 0.23,
          amount: 27.54,
          myvalue: '$228.42'
        },
        {
          icon: require('@/assets/images/currencies/icon-eth-blue.svg'),
          token: 'AMIS(AMIS)',
          price: '$10.72',
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

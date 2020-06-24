<template>
  <div class="ledger-address-table">
    <v-data-table
      :headers="headers"
      :items="addresses"
      :items-per-page="10"
      item-key="address"
      sort-by="address"
      single-select
      show-select
    >
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
      <template v-slot:item.blockie="{ item }">
        <blockie
          :address="item.address"
          :size="8"
          :scale="16"
          width="30px"
          height="30px"
          class="blockie-image"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Blockie from '@/web/components/Blockie';

export default {
  components: { Blockie },
  data: () => ({
    delDialog: false,
    dialog: false,
    headers: [
      {
        text: '',
        value: 'blockie'
      },
      {
        text: 'ADDRESS',
        value: 'address'
      },
      { text: 'BALANCE', value: 'balance' },
      { text: '#TOKEN', value: 'token' }
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
          address: '0x4b0953A599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b095F09',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b0959F0a569',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b09535599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b7Fe5799',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x56407eD099',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b095A599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x444FD3A599',
          balance: 19.112,
          token: 6
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.v-data-table td {
  max-width: 100px;
  overflow: hidden;
}
</style>
<style lang="scss">
.ledger-address-table {
  .v-data-table td,
  .v-data-table th {
    padding: 0px 5px !important;
  }
}
</style>

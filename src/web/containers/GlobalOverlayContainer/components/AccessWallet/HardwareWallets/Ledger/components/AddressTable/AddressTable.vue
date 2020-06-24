<template>
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
      { text: 'ETH BALANCE', value: 'balance' },
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
          address: '0x4b0959AE0b7F0a5642345235239649F4FD3A599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b0959AE0b7F0a56445645D3A599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b0959AE0b7F0a56407eD056756757D3A599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b0959AE0b7F0a56407eD0a47533456345599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b0959AE0b7F0a56407e575376649F4FD3A599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b0959AE0b7F0a56407eD0a4753346363D3A599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b0959AE0b7F0a56407eD0a4755675675673A599',
          balance: 19.112,
          token: 6
        },
        {
          address: '0x4b0959AE0b7F34634634607eD0a47539649F4FD3A599',
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
